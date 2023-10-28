/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import MagicString from 'magic-string';
import ts from 'typescript';

import {PathManipulation} from '../../../src/ngtsc/file_system';
import {Reexport} from '../../../src/ngtsc/imports';
import {Import, ImportManager} from '../../../src/ngtsc/translator';
import {ExportInfo} from '../analysis/private_declarations_analyzer';
import {UmdReflectionHost} from '../host/umd_host';

import {Esm5RenderingFormatter} from './esm5_rendering_formatter';
import {stripExtension} from './utils';

/**
 * A RenderingFormatter that works with UMD files, instead of `import` and `export` statements
 * the module is an IIFE with a factory function call with dependencies, which are defined in a
 * wrapper function for AMD, CommonJS and global module formats.
 */
export class UmdRenderingFormatter extends Esm5RenderingFormatter {
  constructor(fs: PathManipulation, protected umdHost: UmdReflectionHost, isCore: boolean) {
    super(fs, umdHost, isCore);
  }

  /**
   * Add the imports to the UMD module IIFE.
   *
   * Note that imports at "prepended" to the start of the parameter list of the factory function,
   * and so also to the arguments passed to it when it is called.
   * This is because there are scenarios where the factory function does not accept as many
   * parameters as are passed as argument in the call. For example:
   *
   * ```
   * (function (global, factory) {
   *     typeof exports === 'object' && typeof module !== 'undefined' ?
   *         factory(exports,require('x'),require('z')) :
   *     typeof define === 'function' && define.amd ?
   *         define(['exports', 'x', 'z'], factory) :
   *     (global = global || self, factory(global.myBundle = {}, global.x));
   * }(this, (function (exports, x) { ... }
   * ```
   *
   * (See that the `z` import is not being used by the factory function.)
   */
  override addImports(output: MagicString, imports: Import[], file: ts.SourceFile): void {
    if (imports.length === 0) {
      return;
    }

    // Assume there is only one UMD module in the file
    const umdModule = this.umdHost.getUmdModule(file);
    if (!umdModule) {
      return;
    }

    const {factoryFn, factoryCalls} = umdModule;

    // We need to add new `require()` calls for each import in the CommonJS initializer
    renderCommonJsDependencies(output, factoryCalls.commonJs, imports);
    renderCommonJsDependencies(output, factoryCalls.commonJs2, imports);
    renderAmdDependencies(output, factoryCalls.amdDefine, imports);
    renderGlobalDependencies(output, factoryCalls.global, imports);
    renderFactoryParameters(output, factoryFn, imports);
  }

  /**
   * Add the exports to the bottom of the UMD module factory function.
   */
  override addExports(
      output: MagicString, entryPointBasePath: string, exports: ExportInfo[],
      importManager: ImportManager, file: ts.SourceFile): void {
    const umdModule = this.umdHost.getUmdModule(file);
    if (!umdModule) {
      return;
    }
    const factoryFunction = umdModule.factoryFn;
    const lastStatement =
        factoryFunction.body.statements[factoryFunction.body.statements.length - 1];
    const insertionPoint =
        lastStatement ? lastStatement.getEnd() : factoryFunction.body.getEnd() - 1;
    exports.forEach(e => {
      const basePath = stripExtension(e.from);
      const relativePath = './' + this.fs.relative(this.fs.dirname(entryPointBasePath), basePath);
      const namedImport = entryPointBasePath !== basePath ?
          importManager.generateNamedImport(relativePath, e.identifier) :
          {symbol: e.identifier, moduleImport: null};
      const importNamespace = namedImport.moduleImport ? `${namedImport.moduleImport.text}.` : '';
      const exportStr = `\nexports.${e.identifier} = ${importNamespace}${namedImport.symbol};`;
      output.appendRight(insertionPoint, exportStr);
    });
  }

  override addDirectExports(
      output: MagicString, exports: Reexport[], importManager: ImportManager,
      file: ts.SourceFile): void {
    const umdModule = this.umdHost.getUmdModule(file);
    if (!umdModule) {
      return;
    }
    const factoryFunction = umdModule.factoryFn;
    const lastStatement =
        factoryFunction.body.statements[factoryFunction.body.statements.length - 1];
    const insertionPoint =
        lastStatement ? lastStatement.getEnd() : factoryFunction.body.getEnd() - 1;
    for (const e of exports) {
      const namedImport = importManager.generateNamedImport(e.fromModule, e.symbolName);
      const importNamespace = namedImport.moduleImport ? `${namedImport.moduleImport.text}.` : '';
      const exportStr = `\nexports.${e.asAlias} = ${importNamespace}${namedImport.symbol};`;
      output.appendRight(insertionPoint, exportStr);
    }
  }

  /**
   * Add the constants to the top of the UMD factory function.
   */
  override addConstants(output: MagicString, constants: string, file: ts.SourceFile): void {
    if (constants === '') {
      return;
    }
    const umdModule = this.umdHost.getUmdModule(file);
    if (!umdModule) {
      return;
    }
    const factoryFunction = umdModule.factoryFn;
    const firstStatement = factoryFunction.body.statements[0];
    const insertionPoint =
        firstStatement ? firstStatement.getStart() : factoryFunction.body.getStart() + 1;
    output.appendLeft(insertionPoint, '\n' + constants + '\n');
  }
}

/**
 * Add dependencies to the CommonJS/CommonJS2 part of the UMD wrapper function.
 */
function renderCommonJsDependencies(
    output: MagicString, factoryCall: ts.CallExpression|null, imports: Import[]) {
  if (factoryCall === null) {
    return;
  }

  const injectionPoint = factoryCall.arguments.length > 0 ?
      // Add extra dependencies before the first argument
      factoryCall.arguments[0].getFullStart() :
      // Backup one char to account for the closing parenthesis on the call
      factoryCall.getEnd() - 1;
  const importString = imports.map(i => `require('${i.specifier}')`).join(',');
  output.appendLeft(injectionPoint, importString + (factoryCall.arguments.length > 0 ? ',' : ''));
}

/**
 * Add dependencies to the AMD part of the UMD wrapper function.
 */
function renderAmdDependencies(
    output: MagicString, amdDefineCall: ts.CallExpression|null, imports: Import[]) {
  if (amdDefineCall === null) {
    return;
  }

  const importString = imports.map(i => `'${i.specifier}'`).join(',');
  // The dependency array (if it exists) is the second to last argument
  // `define(id?, dependencies?, factory);`
  const factoryIndex = amdDefineCall.arguments.length - 1;
  const dependencyArray = amdDefineCall.arguments[factoryIndex - 1];
  if (dependencyArray === undefined || !ts.isArrayLiteralExpression(dependencyArray)) {
    // No array provided: `define(factory)` or `define(id, factory)`.
    // Insert a new array in front the `factory` call.
    const injectionPoint = amdDefineCall.arguments[factoryIndex].getFullStart();
    output.appendLeft(injectionPoint, `[${importString}],`);
  } else {
    // Already an array
    const injectionPoint = dependencyArray.elements.length > 0 ?
        // Add imports before the first item.
        dependencyArray.elements[0].getFullStart() :
        // Backup one char to account for the closing square bracket on the array
        dependencyArray.getEnd() - 1;
    output.appendLeft(
        injectionPoint, importString + (dependencyArray.elements.length > 0 ? ',' : ''));
  }
}

/**
 * Add dependencies to the global part of the UMD wrapper function.
 */
function renderGlobalDependencies(
    output: MagicString, factoryCall: ts.CallExpression|null, imports: Import[]) {
  if (factoryCall === null) {
    return;
  }

  const injectionPoint = factoryCall.arguments.length > 0 ?
      // Add extra dependencies before the first argument
      factoryCall.arguments[0].getFullStart() :
      // Backup one char to account for the closing parenthesis on the call
      factoryCall.getEnd() - 1;
  const importString = imports.map(i => `global.${getGlobalIdentifier(i)}`).join(',');
  output.appendLeft(injectionPoint, importString + (factoryCall.arguments.length > 0 ? ',' : ''));
}

/**
 * Add dependency parameters to the UMD factory function.
 */
function renderFactoryParameters(
    output: MagicString, factoryFunction: ts.FunctionExpression, imports: Import[]) {
  const parameters = factoryFunction.parameters;
  const parameterString = imports.map(i => i.qualifier.text).join(',');
  if (parameters.length > 0) {
    const injectionPoint = parameters[0].getFullStart();
    output.appendLeft(injectionPoint, parameterString + ',');
  } else {
    // If there are no parameters then the factory function will look like:
    // function () { ... }
    // The AST does not give us a way to find the insertion point - between the two parentheses.
    // So we must use a regular expression on the text of the function.
    const injectionPoint = factoryFunction.getStart() + factoryFunction.getText().indexOf('()') + 1;
    output.appendLeft(injectionPoint, parameterString);
  }
}

/**
 * Compute a global identifier for the given import (`i`).
 *
 * The identifier used to access a package when using the "global" form of a UMD bundle usually
 * follows a special format where snake-case is converted to camelCase and path separators are
 * converted to dots. In addition there are special cases such as `@angular` is mapped to `ng`.
 *
 * For example
 *
 * * `@ns/package/entry-point` => `ns.package.entryPoint`
 * * `@angular/common/testing` => `ng.common.testing`
 * * `@angular/platform-browser-dynamic` => `ng.platformBrowserDynamic`
 *
 * It is possible for packages to specify completely different identifiers for attaching the package
 * to the global, and so there is no guaranteed way to compute this.
 * Currently, this approach appears to work for the known scenarios; also it is not known how common
 * it is to use globals for importing packages.
 *
 * If it turns out that there are packages that are being used via globals, where this approach
 * fails, we should consider implementing a configuration based solution, similar to what would go
 * in a rollup configuration for mapping import paths to global identifiers.
 */
function getGlobalIdentifier(i: Import): string {
  return i.specifier.replace(/^@angular\//, 'ng.')
      .replace(/^@/, '')
      .replace(/\//g, '.')
      .replace(/[-_]+(.?)/g, (_, c) => c.toUpperCase())
      .replace(/^./, c => c.toLowerCase());
}
