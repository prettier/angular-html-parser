/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {getSystemPath, normalize, virtualFs} from '@angular-devkit/core';
import {TempScopedNodeJsSyncHost} from '@angular-devkit/core/node/testing';
import {HostTree} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {runfiles} from '@bazel/runfiles';
import shx from 'shelljs';

describe('standalone migration', () => {
  let runner: SchematicTestRunner;
  let host: TempScopedNodeJsSyncHost;
  let tree: UnitTestTree;
  let tmpDirPath: string;
  let previousWorkingDir: string;

  function writeFile(filePath: string, contents: string) {
    host.sync.write(normalize(filePath), virtualFs.stringToFileBuffer(contents));
  }

  function runMigration(mode: string, path = './') {
    return runner.runSchematic('standalone-migration', {mode, path}, tree);
  }

  function stripWhitespace(content: string) {
    return content.replace(/\s+/g, '');
  }

  beforeEach(() => {
    runner = new SchematicTestRunner('test', runfiles.resolvePackageRelative('../collection.json'));
    host = new TempScopedNodeJsSyncHost();
    tree = new UnitTestTree(new HostTree(host));

    writeFile('/tsconfig.json', JSON.stringify({
      compilerOptions: {
        lib: ['es2015'],
        strictNullChecks: true,
      },
    }));

    writeFile('/angular.json', JSON.stringify({
      version: 1,
      projects: {t: {root: '', architect: {build: {options: {tsConfig: './tsconfig.json'}}}}}
    }));

    // We need to declare the Angular symbols we're testing for, otherwise type checking won't work.
    writeFile('/node_modules/@angular/core/index.d.ts', `
      export declare class PlatformRef {
        bootstrapModule(module: any): any;
      }

      export declare function forwardRef<T>(fn: () => T): T;
    `);

    writeFile('/node_modules/@angular/platform-browser/index.d.ts', `
      import {PlatformRef} from '@angular/core';

      export const platformBrowser: () => PlatformRef;
    `);

    writeFile('/node_modules/@angular/platform-browser/animations/index.d.ts', `
      import {ModuleWithProviders} from '@angular/core';

      export declare class BrowserAnimationsModule {
        static withConfig(config: any): ModuleWithProviders<BrowserAnimationsModule>;
      }

      export declare class NoopAnimationsModule {}
    `);

    writeFile('/node_modules/@angular/platform-browser-dynamic/index.d.ts', `
      import {PlatformRef} from '@angular/core';

      export const platformBrowserDynamic: () => PlatformRef;
    `);

    writeFile('/node_modules/@angular/common/index.d.ts', `
      import {ɵɵDirectiveDeclaration, ɵɵNgModuleDeclaration} from '@angular/core';

      export declare class NgIf {
        ngIf: any;
        ngIfThen: TemplateRef<any>|null;
        ngIfElse: TemplateRef<any>|null;
        static ɵdir: ɵɵDirectiveDeclaration<NgIf, '[ngIf]', never, {
          'ngIf': 'ngIf';
          'ngIfThen': 'ngIfThen';
          'ngIfElse': 'ngIfElse';
        }, {}, never, never, true>;
      }

      export declare class NgForOf {
        ngForOf: any;

        static ɵdir: ɵɵDirectiveDeclaration<NgForOf, '[ngFor][ngForOf]', never, {
          'ngForOf': 'ngForOf';
        }, {}, never, never, true>;
      }

      export declare class CommonModule {
        static ɵmod: ɵɵNgModuleDeclaration<CommonModule, never,
          [typeof NgIf, typeof NgForOf], [typeof NgIf, typeof NgForOf]>;
      }
    `);

    writeFile('/node_modules/@angular/router/index.d.ts', `
      import {ModuleWithProviders} from '@angular/core';

      export declare class RouterModule {
        static forRoot(routes: any[]): ModuleWithProviders<RouterModule>;
      }
    `);

    writeFile('/node_modules/@angular/core/testing/index.d.ts', `
      export declare class TestBed {
        static configureTestingModule(config: any): any;
      }
    `);

    writeFile('/node_modules/some_internal_path/angular/testing/catalyst/index.d.ts', `
      export declare function setupModule(config: any);
    `);

    previousWorkingDir = shx.pwd();
    tmpDirPath = getSystemPath(host.root);

    // Switch into the temporary directory path. This allows us to run
    // the schematic against our custom unit test tree.
    shx.cd(tmpDirPath);
  });

  afterEach(() => {
    shx.cd(previousWorkingDir);
    shx.rm('-r', tmpDirPath);
  });

  it('should throw an error if no files match the passed-in path', async () => {
    let error: string|null = null;

    writeFile('dir.ts', `
      import {Directive} from '@angular/core';

      @Directive({selector: '[dir]'})
      export class MyDir {}
    `);

    try {
      await runMigration('convert-to-standalone', './foo');
    } catch (e: any) {
      error = e.message;
    }

    expect(error).toMatch(
        /Could not find any files to migrate under the path .*\/foo\. Cannot run the standalone migration/);
  });

  it('should throw an error if a path outside of the project is passed in', async () => {
    let error: string|null = null;

    writeFile('dir.ts', `
      import {Directive} from '@angular/core';

      @Directive({selector: '[dir]'})
      export class MyDir {}
    `);

    try {
      await runMigration('convert-to-standalone', '../foo');
    } catch (e: any) {
      error = e.message;
    }

    expect(error).toBe('Cannot run standalone migration outside of the current project.');
  });

  it('should throw an error if the passed in path is a file', async () => {
    let error: string|null = null;

    writeFile('dir.ts', '');

    try {
      await runMigration('convert-to-standalone', './dir.ts');
    } catch (e: any) {
      error = e.message;
    }

    expect(error).toMatch(
        /Migration path .*\/dir\.ts has to be a directory\. Cannot run the standalone migration/);
  });

  it('should create an `imports` array if the module does not have one already', async () => {
    writeFile('module.ts', `
      import {NgModule, Directive} from '@angular/core';

      @Directive({selector: '[dir]'})
      export class MyDir {}

      @NgModule({declarations: [MyDir]})
      export class Mod {}
    `);

    await runMigration('convert-to-standalone');

    expect(stripWhitespace(tree.readContent('module.ts')))
        .toContain(stripWhitespace(`@NgModule({imports: [MyDir]})`));
  });

  it('should combine the `declarations` array with a static `imports` array', async () => {
    writeFile('module.ts', `
      import {NgModule, Directive} from '@angular/core';
      import {CommonModule} from '@angular/common';

      @Directive({selector: '[dir]'})
      export class MyDir {}

      @NgModule({declarations: [MyDir], imports: [CommonModule]})
      export class Mod {}
    `);

    await runMigration('convert-to-standalone');

    expect(stripWhitespace(tree.readContent('module.ts')))
        .toContain(stripWhitespace(`@NgModule({imports: [CommonModule, MyDir]})`));
  });

  it('should combine a `declarations` array with a spread expression into the `imports`',
     async () => {
       writeFile('module.ts', `
        import {NgModule, Directive} from '@angular/core';
        import {CommonModule} from '@angular/common';

        @Directive({selector: '[dir]'})
        export class MyDir {}

        @Directive({selector: '[dir]'})
        export class MyOtherDir {}

        const extraDeclarations = [MyOtherDir];

        @NgModule({declarations: [MyDir, ...extraDeclarations], imports: [CommonModule]})
        export class Mod {}
      `);

       await runMigration('convert-to-standalone');

       expect(stripWhitespace(tree.readContent('module.ts')))
           .toContain(stripWhitespace(
               `@NgModule({imports: [CommonModule, MyDir, ...extraDeclarations]})`));
     });

  it('should combine a `declarations` array with an `imports` array that has a spread expression',
     async () => {
       writeFile('module.ts', `
        import {NgModule, Directive} from '@angular/core';
        import {CommonModule} from '@angular/common';

        @Directive({selector: '[dir]'})
        export class MyDir {}

        @Directive({selector: '[dir]', standalone: true})
        export class MyOtherDir {}

        const extraImports = [MyOtherDir];

        @NgModule({declarations: [MyDir], imports: [CommonModule, ...extraImports]})
        export class Mod {}
      `);

       await runMigration('convert-to-standalone');

       expect(stripWhitespace(tree.readContent('module.ts')))
           .toContain(
               stripWhitespace(`@NgModule({imports: [CommonModule, ...extraImports, MyDir]})`));
     });

  it('should use a spread expression if the `declarations` is an expression when combining with the `imports`',
     async () => {
       writeFile('module.ts', `
        import {NgModule, Directive} from '@angular/core';
        import {CommonModule} from '@angular/common';

        @Directive({selector: '[dir]'})
        export class MyDir {}

        const DECLARATIONS = [MyDir];

        @NgModule({declarations: DECLARATIONS, imports: [CommonModule]})
        export class Mod {}
      `);

       await runMigration('convert-to-standalone');

       expect(stripWhitespace(tree.readContent('module.ts')))
           .toContain(stripWhitespace(`@NgModule({imports: [CommonModule, ...DECLARATIONS]})`));
     });

  it('should use a spread expression if the `imports` is an expression when combining with the `declarations`',
     async () => {
       writeFile('module.ts', `
        import {NgModule, Directive} from '@angular/core';
        import {CommonModule} from '@angular/common';

        @Directive({selector: '[dir]'})
        export class MyDir {}

        const IMPORTS = [CommonModule];

        @NgModule({declarations: [MyDir], imports: IMPORTS})
        export class Mod {}
      `);

       await runMigration('convert-to-standalone');

       expect(stripWhitespace(tree.readContent('module.ts')))
           .toContain(stripWhitespace(`@NgModule({imports: [...IMPORTS, MyDir]})`));
     });

  it('should use a spread expression if both the `declarations` and the `imports` are not static arrays',
     async () => {
       writeFile('module.ts', `
        import {NgModule, Directive} from '@angular/core';
        import {CommonModule} from '@angular/common';

        @Directive({selector: '[dir]'})
        export class MyDir {}

        const IMPORTS = [CommonModule];
        const DECLARATIONS = [MyDir];

        @NgModule({declarations: DECLARATIONS, imports: IMPORTS})
        export class Mod {}
      `);

       await runMigration('convert-to-standalone');

       expect(stripWhitespace(tree.readContent('module.ts')))
           .toContain(stripWhitespace(`@NgModule({imports: [...IMPORTS, ...DECLARATIONS]})`));
     });

  it('should convert a directive in the same file as its module to standalone', async () => {
    writeFile('module.ts', `
      import {NgModule, Directive} from '@angular/core';

      @Directive({selector: '[dir]'})
      export class MyDir {}

      @NgModule({declarations: [MyDir], exports: [MyDir]})
      export class Mod {}
    `);

    await runMigration('convert-to-standalone');

    const result = tree.readContent('module.ts');

    expect(stripWhitespace(result))
        .toContain(stripWhitespace(`@Directive({selector: '[dir]', standalone: true})`));
    expect(stripWhitespace(result))
        .toContain(stripWhitespace(`@NgModule({imports: [MyDir], exports: [MyDir]})`));
  });

  it('should convert a pipe in the same file as its module to standalone', async () => {
    writeFile('module.ts', `
      import {NgModule, Pipe} from '@angular/core';

      @Pipe({name: 'myPipe'})
      export class MyPipe {}

      @NgModule({declarations: [MyPipe], exports: [MyPipe]})
      export class Mod {}
    `);

    await runMigration('convert-to-standalone');

    const result = tree.readContent('module.ts');

    expect(stripWhitespace(result))
        .toContain(stripWhitespace(`@Pipe({name: 'myPipe', standalone: true})`));
    expect(stripWhitespace(result))
        .toContain(stripWhitespace(`@NgModule({imports: [MyPipe], exports: [MyPipe]})`));
  });

  it('should only migrate declarations under a specific path', async () => {
    const content = `
      import {NgModule, Directive} from '@angular/core';

      @Directive({selector: '[dir]'})
      export class MyDir {}

      @NgModule({declarations: [MyDir], exports: [MyDir]})
      export class Mod {}
    `;

    writeFile('./apps/app-1/module.ts', content);
    writeFile('./apps/app-2/module.ts', content);

    await runMigration('convert-to-standalone', './apps/app-2');

    expect(tree.readContent('./apps/app-1/module.ts')).not.toContain('standalone');
    expect(tree.readContent('./apps/app-2/module.ts')).toContain('standalone: true');
  });

  it('should convert a directive in a different file from its module to standalone', async () => {
    writeFile('module.ts', `
      import {NgModule} from '@angular/core';
      import {MyDir} from './dir';

      @NgModule({declarations: [MyDir], exports: [MyDir]})
      export class Mod {}
    `);

    writeFile('dir.ts', `
      import {Directive} from '@angular/core';

      @Directive({selector: '[dir]'})
      export class MyDir {}
    `);

    await runMigration('convert-to-standalone');

    expect(stripWhitespace(tree.readContent('module.ts')))
        .toContain(stripWhitespace(`@NgModule({imports: [MyDir], exports: [MyDir]})`));
    expect(stripWhitespace(tree.readContent('dir.ts')))
        .toContain(stripWhitespace(`@Directive({selector: '[dir]', standalone: true})`));
  });

  it('should convert a component with no template dependencies to standalone', async () => {
    writeFile('module.ts', `
      import {NgModule} from '@angular/core';
      import {MyComp} from './comp';

      @NgModule({declarations: [MyComp], exports: [MyComp]})
      export class Mod {}
    `);

    writeFile('comp.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-comp', template: '<h1>Hello</h1>'})
      export class MyComp {}
    `);

    await runMigration('convert-to-standalone');

    expect(stripWhitespace(tree.readContent('module.ts')))
        .toContain(stripWhitespace(`@NgModule({imports: [MyComp], exports: [MyComp]})`));
    expect(stripWhitespace(tree.readContent('comp.ts'))).toContain(stripWhitespace(`
        @Component({
          selector: 'my-comp',
          template: '<h1>Hello</h1>',
          standalone: true
        })
      `));
  });

  it('should add imports to dependencies within the same module', async () => {
    writeFile('module.ts', `
      import {NgModule} from '@angular/core';
      import {MyComp} from './comp';
      import {MyButton} from './button';
      import {MyTooltip} from './tooltip';

      @NgModule({declarations: [MyComp, MyButton, MyTooltip], exports: [MyComp]})
      export class Mod {}
    `);

    writeFile('comp.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-comp', template: '<my-button tooltip="Click me">Hello</my-button>'})
      export class MyComp {}
    `);

    writeFile('button.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-button', template: '<ng-content></ng-content>'})
      export class MyButton {}
    `);

    writeFile('tooltip.ts', `
      import {Directive} from '@angular/core';

      @Directive({selector: '[tooltip]'})
      export class MyTooltip {}
    `);

    await runMigration('convert-to-standalone');

    const myCompContent = tree.readContent('comp.ts');

    expect(myCompContent).toContain(`import { MyButton } from "./button";`);
    expect(myCompContent).toContain(`import { MyTooltip } from "./tooltip";`);
    expect(stripWhitespace(myCompContent)).toContain(stripWhitespace(`
      @Component({
        selector: 'my-comp',
        template: '<my-button tooltip="Click me">Hello</my-button>',
        standalone: true,
        imports: [MyButton, MyTooltip]
      })
    `));
    expect(stripWhitespace(tree.readContent('module.ts')))
        .toContain(stripWhitespace(
            `@NgModule({imports: [MyComp, MyButton, MyTooltip], exports: [MyComp]})`));
    expect(stripWhitespace(tree.readContent('button.ts')))
        .toContain(stripWhitespace(
            `@Component({selector: 'my-button', template: '<ng-content></ng-content>', standalone: true})`));
    expect(stripWhitespace(tree.readContent('tooltip.ts')))
        .toContain(stripWhitespace(`@Directive({selector: '[tooltip]', standalone: true})`));
  });

  it('should reuse existing import statements when adding imports to a component', async () => {
    writeFile('module.ts', `
      import {NgModule} from '@angular/core';
      import {MyComp} from './comp';
      import {MyButton} from './button';

      @NgModule({declarations: [MyComp, MyButton], exports: [MyComp]})
      export class Mod {}
    `);

    writeFile('comp.ts', `
      import {Component} from '@angular/core';
      import {helper} from './button';

      helper();

      @Component({selector: 'my-comp', template: '<my-button>Hello</my-button>'})
      export class MyComp {}
    `);

    writeFile('button.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-button', template: '<ng-content></ng-content>'})
      export class MyButton {}

      export function helper() {}
    `);

    await runMigration('convert-to-standalone');

    const myCompContent = tree.readContent('comp.ts');

    expect(myCompContent).toContain(`import { helper, MyButton } from './button';`);
    expect(stripWhitespace(myCompContent)).toContain(stripWhitespace(`
      @Component({
        selector: 'my-comp',
        template: '<my-button>Hello</my-button>',
        standalone: true,
        imports: [MyButton]
      })
    `));
  });

  it('should refer to pre-existing standalone dependencies directly when adding to the `imports`',
     async () => {
       writeFile('module.ts', `
        import {NgModule} from '@angular/core';
        import {MyComp} from './comp';
        import {MyButton} from './button';

        @NgModule({imports: [MyButton], declarations: [MyComp], exports: [MyComp]})
        export class Mod {}
      `);

       writeFile('comp.ts', `
        import {Component} from '@angular/core';

        @Component({selector: 'my-comp', template: '<my-button>Hello</my-button>'})
        export class MyComp {}
      `);

       writeFile('button.ts', `
        import {Component} from '@angular/core';
        import {MyComp} from './comp';

        @Component({selector: 'my-button', template: '<ng-content></ng-content>', standalone: true})
        export class MyButton {}
      `);

       await runMigration('convert-to-standalone');
       const myCompContent = tree.readContent('comp.ts');

       expect(myCompContent).toContain(`import { MyButton } from "./button";`);
       expect(stripWhitespace(myCompContent)).toContain(stripWhitespace(`
         @Component({
           selector: 'my-comp',
           template: '<my-button>Hello</my-button>',
           standalone: true,
           imports: [MyButton]
         })
       `));
       expect(stripWhitespace(tree.readContent('module.ts')))
           .toContain(
               stripWhitespace('@NgModule({imports: [MyButton, MyComp], exports: [MyComp]})'));
     });

  it('should refer to dependencies being handled in the same migration directly', async () => {
    writeFile('module.ts', `
      import {NgModule} from '@angular/core';
      import {MyComp} from './comp';
      import {ButtonModule} from './button.module';

      @NgModule({imports: [ButtonModule], declarations: [MyComp], exports: [MyComp]})
      export class Mod {}
    `);

    writeFile('button.module.ts', `
      import {NgModule} from '@angular/core';
      import {MyButton} from './button';

      @NgModule({declarations: [MyButton], exports: [MyButton]})
      export class ButtonModule {}
    `);

    writeFile('comp.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-comp', template: '<my-button>Hello</my-button>'})
      export class MyComp {}
    `);

    writeFile('button.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-button', template: '<ng-content></ng-content>'})
      export class MyButton {}
    `);

    await runMigration('convert-to-standalone');

    const myCompContent = tree.readContent('comp.ts');

    expect(myCompContent).toContain(`import { MyButton } from "./button";`);
    expect(stripWhitespace(myCompContent)).toContain(stripWhitespace(`
      @Component({
        selector: 'my-comp',
        template: '<my-button>Hello</my-button>',
        standalone: true,
        imports: [MyButton]
      })
    `));
    expect(stripWhitespace(tree.readContent('button.ts'))).toContain(stripWhitespace(`
      @Component({
        selector: 'my-button',
        template: '<ng-content></ng-content>',
        standalone: true
      })
    `));
    expect(stripWhitespace(tree.readContent('module.ts'))).toContain(stripWhitespace(`
      @NgModule({imports: [ButtonModule, MyComp], exports: [MyComp]})
    `));
    expect(stripWhitespace(tree.readContent('button.module.ts'))).toContain(stripWhitespace(`
      @NgModule({imports: [MyButton], exports: [MyButton]})
    `));
  });

  it('should refer to dependencies by their module if they have been excluded from the migration',
     async () => {
       writeFile('./should-migrate/module.ts', `
        import {NgModule} from '@angular/core';
        import {MyComp} from './comp';
        import {ButtonModule} from '../do-not-migrate/button.module';

        @NgModule({imports: [ButtonModule], declarations: [MyComp], exports: [MyComp]})
        export class Mod {}
      `);

       writeFile('./do-not-migrate/button.module.ts', `
        import {NgModule} from '@angular/core';
        import {MyButton} from './button';

        @NgModule({declarations: [MyButton], exports: [MyButton]})
        export class ButtonModule {}
      `);

       writeFile('./should-migrate/comp.ts', `
        import {Component} from '@angular/core';

        @Component({selector: 'my-comp', template: '<my-button>Hello</my-button>'})
        export class MyComp {}
      `);

       writeFile('./do-not-migrate/button.ts', `
        import {Component} from '@angular/core';

        @Component({selector: 'my-button', template: '<ng-content></ng-content>'})
        export class MyButton {}
      `);

       await runMigration('convert-to-standalone', './should-migrate');

       const myCompContent = tree.readContent('./should-migrate/comp.ts');

       expect(myCompContent)
           .toContain(`import { ButtonModule } from "../do-not-migrate/button.module";`);
       expect(stripWhitespace(myCompContent)).toContain(stripWhitespace(`
        @Component({
          selector: 'my-comp',
          template: '<my-button>Hello</my-button>',
          standalone: true,
          imports: [ButtonModule]
        })
      `));
       expect(stripWhitespace(tree.readContent('./should-migrate/module.ts')))
           .toContain(
               stripWhitespace(`@NgModule({imports: [ButtonModule, MyComp], exports: [MyComp]})`));
       expect(tree.readContent('./do-not-migrate/button.ts')).not.toContain('standalone');
       expect(stripWhitespace(tree.readContent('./do-not-migrate/button.module.ts')))
           .toContain(
               stripWhitespace(`@NgModule({declarations: [MyButton], exports: [MyButton]})`));
     });

  it('should add imports to dependencies within the same module', async () => {
    writeFile('module.ts', `
        import {NgModule} from '@angular/core';
        import {MyComp} from './comp';
        import {MyButton} from './button';
        import {MyTooltip} from './tooltip';

        @NgModule({declarations: [MyComp, MyButton, MyTooltip], exports: [MyComp]})
        export class Mod {}
      `);

    writeFile('comp.ts', `
        import {Component} from '@angular/core';

        @Component({selector: 'my-comp', template: '<my-button tooltip="Click me">Hello</my-button>'})
        export class MyComp {}
      `);

    writeFile('button.ts', `
        import {Component} from '@angular/core';

        @Component({selector: 'my-button', template: '<ng-content></ng-content>'})
        export class MyButton {}
      `);

    writeFile('tooltip.ts', `
        import {Directive} from '@angular/core';

        @Directive({selector: '[tooltip]'})
        export class MyTooltip {}
      `);

    await runMigration('convert-to-standalone');

    const myCompContent = tree.readContent('comp.ts');

    expect(myCompContent).toContain(`import { MyButton } from "./button";`);
    expect(myCompContent).toContain(`import { MyTooltip } from "./tooltip";`);
    expect(stripWhitespace(myCompContent)).toContain(stripWhitespace(`
        @Component({
          selector: 'my-comp',
          template: '<my-button tooltip="Click me">Hello</my-button>',
          standalone: true,
          imports: [MyButton, MyTooltip]
        })
      `));
    expect(stripWhitespace(tree.readContent('module.ts')))
        .toContain(stripWhitespace(
            `@NgModule({imports: [MyComp, MyButton, MyTooltip], exports: [MyComp]})`));
    expect(stripWhitespace(tree.readContent('button.ts')))
        .toContain(stripWhitespace(
            `@Component({selector: 'my-button', template: '<ng-content></ng-content>', standalone: true})`));
    expect(stripWhitespace(tree.readContent('tooltip.ts')))
        .toContain(stripWhitespace(`@Directive({selector: '[tooltip]', standalone: true})`));
  });

  it('should add imports to external dependencies', async () => {
    writeFile('module.ts', `
      import {NgModule} from '@angular/core';
      import {CommonModule} from '@angular/common';
      import {MyComp, MyOtherComp} from './comp';

      @NgModule({imports: [CommonModule], declarations: [MyComp, MyOtherComp], exports: [MyComp]})
      export class Mod {}
    `);

    writeFile('comp.ts', `
      import {Component} from '@angular/core';

      @Component({
        selector: 'my-comp',
        template: \`
          <div *ngFor="let message of messages">
            <span *ngIf="message">{{message}}</span>
          </div>
        \`
      })
      export class MyComp {
        messages = ['hello', 'hi'];
      }

      @Component({
        selector: 'my-other-comp',
        template: '<div *ngIf="isShown"></div>'
      })
      export class MyOtherComp {
        isShown = true;
      }
    `);

    await runMigration('convert-to-standalone');

    const myCompContent = tree.readContent('comp.ts');

    expect(myCompContent).toContain(`import { NgForOf, NgIf } from "@angular/common";`);
    expect(stripWhitespace(myCompContent)).toContain(stripWhitespace(`
      @Component({
        selector: 'my-comp',
        template: \`
          <div *ngFor="let message of messages">
            <span *ngIf="message">{{message}}</span>
          </div>
        \`,
        standalone: true,
        imports: [NgForOf, NgIf]
      })
    `));
    expect(stripWhitespace(myCompContent)).toContain(stripWhitespace(`
      @Component({
        selector: 'my-other-comp',
        template: '<div *ngIf="isShown"></div>',
        standalone: true,
        imports: [NgIf]
      })
    `));
    expect(stripWhitespace(tree.readContent('module.ts')))
        .toContain(stripWhitespace(
            `@NgModule({imports: [CommonModule, MyComp, MyOtherComp], exports: [MyComp]})`));
  });

  it('should add imports to pipes that are used in the template', async () => {
    writeFile('module.ts', `
      import {NgModule} from '@angular/core';
      import {MyComp} from './comp';
      import {MyPipe} from './pipe';

      @NgModule({declarations: [MyComp, MyPipe], exports: [MyComp]})
      export class Mod {}
    `);

    writeFile('comp.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-comp', template: '{{"hello" | myPipe}}'})
      export class MyComp {}
    `);

    writeFile('pipe.ts', `
      import {Pipe} from '@angular/core';

      @Pipe({name: 'myPipe'})
      export class MyPipe {
        transform() {}
      }
    `);

    await runMigration('convert-to-standalone');

    const myCompContent = tree.readContent('comp.ts');

    expect(myCompContent).toContain(`import { MyPipe } from "./pipe";`);
    expect(stripWhitespace(myCompContent)).toContain(stripWhitespace(`
      @Component({
        selector: 'my-comp',
        template: '{{"hello" | myPipe}}',
        standalone: true,
        imports: [MyPipe]
      })
    `));
    expect(stripWhitespace(tree.readContent('module.ts')))
        .toContain(stripWhitespace(`@NgModule({imports: [MyComp, MyPipe], exports: [MyComp]})`));
    expect(stripWhitespace(tree.readContent('pipe.ts')))
        .toContain(stripWhitespace(`@Pipe({name: 'myPipe', standalone: true})`));
  });

  it('should migrate tests with an inline NgModule', async () => {
    writeFile('app.spec.ts', `
      import {NgModule, Component} from '@angular/core';
      import {TestBed} from '@angular/core/testing';

      describe('bootrstrapping an app', () => {
        it('should work', () => {
          @Component({selector: 'hello', template: 'Hello'})
          class Hello {}

          @Component({template: '<hello></hello>'})
          class App {}

          @NgModule({declarations: [App, Hello], exports: [App, Hello]})
          class Mod {}

          TestBed.configureTestingModule({imports: [Mod]});
          const fixture = TestBed.createComponent(App);
          expect(fixture.nativeElement.innerHTML).toBe('<hello>Hello</hello>');
        });
      });
    `);

    await runMigration('convert-to-standalone');

    const content = stripWhitespace(tree.readContent('app.spec.ts'));

    expect(content).toContain(stripWhitespace(`
      @Component({selector: 'hello', template: 'Hello', standalone: true})
      class Hello {}
    `));

    expect(content).toContain(stripWhitespace(`
      @Component({template: '<hello></hello>', standalone: true, imports: [Hello]})
      class App {}
    `));

    expect(content).toContain(stripWhitespace(`
      @NgModule({imports: [App, Hello], exports: [App, Hello]})
      class Mod {}
    `));
  });

  it('should import the module that declares a template dependency', async () => {
    writeFile('./should-migrate/module.ts', `
      import {NgModule} from '@angular/core';
      import {MyComp} from './comp';
      import {ButtonModule} from '../do-not-migrate/button.module';

      @NgModule({imports: [ButtonModule], declarations: [MyComp]})
      export class Mod {}
    `);

    writeFile('./should-migrate/comp.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-comp', template: '<my-button>Hello</my-button>'})
      export class MyComp {}
    `);

    writeFile('./do-not-migrate/button.module.ts', `
      import {NgModule, forwardRef} from '@angular/core';
      import {MyButton} from './button';

      @NgModule({
        imports: [forwardRef(() => ButtonModule)],
        exports: [forwardRef(() => ButtonModule)]
      })
      export class ExporterModule {}

      @NgModule({declarations: [MyButton], exports: [MyButton]})
      export class ButtonModule {}
    `);

    writeFile('./do-not-migrate/button.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-button', template: '<ng-content></ng-content>'})
      export class MyButton {}
    `);

    await runMigration('convert-to-standalone', './should-migrate');

    const myCompContent = tree.readContent('./should-migrate/comp.ts');
    expect(myCompContent)
        .toContain(`import { ButtonModule } from "../do-not-migrate/button.module";`);
    expect(myCompContent).toContain('imports: [ButtonModule]');
  });

  it('should migrate tests with a component declared through TestBed', async () => {
    writeFile('app.spec.ts', `
      import {NgModule, Component} from '@angular/core';
      import {TestBed} from '@angular/core/testing';
      import {ButtonModule} from './button.module';
      import {MatCardModule} from '@angular/material/card';

      describe('bootrstrapping an app', () => {
        it('should work', () => {
          TestBed.configureTestingModule({
            declarations: [App, Hello],
            imports: [ButtonModule, MatCardModule]
          });
          const fixture = TestBed.createComponent(App);
          expect(fixture.nativeElement.innerHTML).toBe('<hello>Hello</hello>');
        });

        it('should work in a different way', () => {
          TestBed.configureTestingModule({declarations: [App, Hello], imports: [MatCardModule]});
          const fixture = TestBed.createComponent(App);
          expect(fixture.nativeElement.innerHTML).toBe('<hello>Hello</hello>');
        });
      });

      @Component({selector: 'hello', template: 'Hello'})
      class Hello {}

      @Component({template: '<hello></hello>'})
      class App {}
    `);

    await runMigration('convert-to-standalone');

    const content = stripWhitespace(tree.readContent('app.spec.ts'));

    expect(content).toContain(stripWhitespace(`
      @Component({
        selector: 'hello',
        template: 'Hello',
        standalone: true,
        imports: [ButtonModule, MatCardModule]
      })
      class Hello {}
    `));

    expect(content).toContain(stripWhitespace(`
      @Component({
        template: '<hello></hello>',
        standalone: true,
        imports: [ButtonModule, MatCardModule]
      })
      class App {}
    `));

    expect(content).toContain(stripWhitespace(`
      it('should work', () => {
        TestBed.configureTestingModule({
          imports: [ButtonModule, MatCardModule, App, Hello]
        });
        const fixture = TestBed.createComponent(App);
        expect(fixture.nativeElement.innerHTML).toBe('<hello>Hello</hello>');
      });
    `));

    expect(content).toContain(stripWhitespace(`
      it('should work in a different way', () => {
        TestBed.configureTestingModule({imports: [MatCardModule, App, Hello]});
        const fixture = TestBed.createComponent(App);
        expect(fixture.nativeElement.innerHTML).toBe('<hello>Hello</hello>');
      });
    `));
  });

  it('should migrate tests with a component declared through Catalyst', async () => {
    writeFile('app.spec.ts', `
      import {NgModule, Component} from '@angular/core';
      import {bootstrap, setupModule} from 'some_internal_path/angular/testing/catalyst';
      import {ButtonModule} from './button.module';
      import {MatCardModule} from '@angular/material/card';

      describe('bootrstrapping an app', () => {
        it('should work', () => {
          setupModule({
            declarations: [App, Hello],
            imports: [ButtonModule, MatCardModule]
          });
          const fixture = bootstrap(App);
          expect(fixture.nativeElement.innerHTML).toBe('<hello>Hello</hello>');
        });

        it('should work in a different way', () => {
          setupModule({declarations: [App, Hello], imports: [MatCardModule]});
          const fixture = bootstrap(App);
          expect(fixture.nativeElement.innerHTML).toBe('<hello>Hello</hello>');
        });
      });

      @Component({selector: 'hello', template: 'Hello'})
      class Hello {}

      @Component({template: '<hello></hello>'})
      class App {}
    `);

    await runMigration('convert-to-standalone');

    const content = stripWhitespace(tree.readContent('app.spec.ts'));

    expect(content).toContain(stripWhitespace(`
      @Component({
        selector: 'hello',
        template: 'Hello',
        standalone: true,
        imports: [ButtonModule, MatCardModule]
      })
      class Hello {}
    `));

    expect(content).toContain(stripWhitespace(`
      @Component({
        template: '<hello></hello>',
        standalone: true,
        imports: [ButtonModule, MatCardModule]
      })
      class App {}
    `));

    expect(content).toContain(stripWhitespace(`
      it('should work', () => {
        setupModule({
          imports: [ButtonModule, MatCardModule, App, Hello]
        });
        const fixture = bootstrap(App);
        expect(fixture.nativeElement.innerHTML).toBe('<hello>Hello</hello>');
      });
    `));

    expect(content).toContain(stripWhitespace(`
      it('should work in a different way', () => {
        setupModule({imports: [MatCardModule, App, Hello]});
        const fixture = bootstrap(App);
        expect(fixture.nativeElement.innerHTML).toBe('<hello>Hello</hello>');
      });
    `));
  });

  it('should not migrate modules with a `bootstrap` array', async () => {
    const initialModule = `
      import {NgModule, Component} from '@angular/core';

      @Component({selector: 'root-comp', template: 'hello'})
      export class RootComp {}

      @NgModule({declarations: [RootComp], bootstrap: [RootComp]})
      export class Mod {}
    `;

    writeFile('module.ts', initialModule);

    await runMigration('convert-to-standalone');

    expect(tree.readContent('module.ts')).toBe(initialModule);
  });

  it('should migrate a module with an empty `bootstrap` array', async () => {
    writeFile('module.ts', `
      import {NgModule, Component} from '@angular/core';

      @Component({selector: 'root-comp', template: 'hello'})
      export class RootComp {}

      @NgModule({declarations: [RootComp], bootstrap: []})
      export class Mod {}
    `);

    await runMigration('convert-to-standalone');

    expect(stripWhitespace(tree.readContent('module.ts'))).toBe(stripWhitespace(`
      import {NgModule, Component} from '@angular/core';

      @Component({selector: 'root-comp', template: 'hello', standalone: true})
      export class RootComp {}

      @NgModule({imports: [RootComp], bootstrap: []})
      export class Mod {}
    `));
  });

  it('should remove a module that only has imports and exports', async () => {
    writeFile('app.module.ts', `
      import {NgModule} from '@angular/core';
      import {MyComp} from './comp';
      import {ButtonModule} from './button.module';

      @NgModule({imports: [ButtonModule], declarations: [MyComp], exports: [ButtonModule, MyComp]})
      export class AppModule {}
    `);

    writeFile('button.module.ts', `
      import {NgModule} from '@angular/core';
      import {MyButton} from './button';

      @NgModule({imports: [MyButton], exports: [MyButton]})
      export class ButtonModule {}
    `);

    writeFile('comp.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-comp', template: '<my-button>Hello</my-button>'})
      export class MyComp {}
    `);

    writeFile('button.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-button', template: '<ng-content></ng-content>', standalone: true})
      export class MyButton {}
    `);

    await runMigration('prune-ng-modules');

    const appModule = tree.readContent('app.module.ts');

    expect(tree.exists('button.module.ts')).toBe(false);
    expect(appModule).not.toContain('ButtonModule');
    expect(stripWhitespace(appModule)).toContain(stripWhitespace(`
      @NgModule({imports: [], declarations: [MyComp], exports: [MyComp]})
      export class AppModule {}
    `));
  });

  it('should not remove a module that has declarations', async () => {
    const initialAppModule = `
      import {NgModule} from '@angular/core';
      import {MyComp} from './comp';
      import {ButtonModule} from './button.module';

      @NgModule({declarations: [MyComp]})
      export class AppModule {}
    `;

    writeFile('app.module.ts', initialAppModule);
    writeFile('comp.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-comp', template: 'Hello'})
      export class MyComp {}
    `);

    await runMigration('prune-ng-modules');

    expect(tree.readContent('app.module.ts')).toBe(initialAppModule);
  });

  it('should not remove a module that bootstraps a component', async () => {
    const initialAppModule = `
      import {NgModule} from '@angular/core';
      import {MyComp} from './comp';
      import {ButtonModule} from './button.module';

      @NgModule({bootstrap: [MyComp]})
      export class AppModule {}
    `;

    writeFile('app.module.ts', initialAppModule);
    writeFile('comp.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-comp', template: 'Hello'})
      export class MyComp {}
    `);

    await runMigration('prune-ng-modules');

    expect(tree.readContent('app.module.ts')).toBe(initialAppModule);
  });

  it('should not remove a module that has providers', async () => {
    const initialAppModule = `
      import {NgModule, InjectionToken} from '@angular/core';

      const token = new InjectionToken('token');

      @NgModule({providers: [{provide: token, useValue: 123}]})
      export class AppModule {}
    `;

    writeFile('app.module.ts', initialAppModule);

    await runMigration('prune-ng-modules');

    expect(tree.readContent('app.module.ts')).toBe(initialAppModule);
  });

  it('should not remove a module that imports a ModuleWithProviders', async () => {
    const initialAppModule = `
      import {NgModule} from '@angular/core';
      import {RouterModule} from '@angular/router';

      @NgModule({imports: [RouterModule.forRoot([])]})
      export class RoutingModule {}
    `;

    writeFile('app.module.ts', initialAppModule);

    await runMigration('prune-ng-modules');

    expect(tree.readContent('app.module.ts')).toBe(initialAppModule);
  });

  it('should not remove a module that has class members', async () => {
    const initialAppModule = `
      import {NgModule} from '@angular/core';
      import {ButtonModule} from './button.module';

      @NgModule()
      export class AppModule {
        sum(a: number, b: number) {
          return a + b;
        }
      }
    `;

    writeFile('app.module.ts', initialAppModule);
    await runMigration('prune-ng-modules');

    expect(tree.readContent('app.module.ts')).toBe(initialAppModule);
  });

  it('should remove a module that only has an empty constructor', async () => {
    writeFile('app.module.ts', `
      import {NgModule} from '@angular/core';
      import {ButtonModule} from './button.module';

      @NgModule()
      export class AppModule {
        constructor() {
        }
      }
    `);
    await runMigration('prune-ng-modules');

    expect(tree.exists('app.module.ts')).toBe(false);
  });

  it('should remove a module with no arguments passed into NgModule', async () => {
    writeFile('app.module.ts', `
      import {NgModule} from '@angular/core';

      @NgModule()
      export class AppModule {}
    `);
    await runMigration('prune-ng-modules');

    expect(tree.exists('app.module.ts')).toBe(false);
  });

  it('should remove a module file where there is unexported code', async () => {
    writeFile('app.module.ts', `
      import {NgModule} from '@angular/core';

      const ONE = 1;
      const TWO = 2;

      console.log(ONE + TWO);

      @NgModule()
      export class AppModule {}
    `);
    await runMigration('prune-ng-modules');

    expect(tree.exists('app.module.ts')).toBe(false);
  });

  it('should remove a module that passes empty arrays into `declarations`, `providers` and `bootstrap`',
     async () => {
       writeFile('app.module.ts', `
          import {NgModule} from '@angular/core';
          import {ButtonModule} from './button.module';

          @NgModule({declarations: [], providers: [], bootstrap: []})
          export class AppModule {}
        `);
       await runMigration('prune-ng-modules');

       expect(tree.exists('app.module.ts')).toBe(false);
     });

  it('should remove a chain of modules that all depend on each other', async () => {
    writeFile('a.module.ts', `
      import {NgModule} from '@angular/core';

      @NgModule({})
      export class ModuleA {}
    `);

    writeFile('b.module.ts', `
      import {NgModule} from '@angular/core';
      import {ModuleA} from './a.module';

      @NgModule({imports: [ModuleA]})
      export class ModuleB {}
    `);

    writeFile('c.module.ts', `
      import {NgModule} from '@angular/core';
      import {ModuleB} from './b.module';

      @NgModule({imports: [ModuleB]})
      export class ModuleC {}
    `);

    writeFile('app.module.ts', `
      import {NgModule} from '@angular/core';
      import {MyDir} from './dir';
      import {ModuleC} from './c.module';

      @NgModule({imports: [ModuleC], declarations: [MyDir]})
      export class AppModule {}
    `);

    writeFile('dir.ts', `
      import {Directive} from '@angular/core';

      @Directive({selector: '[myDir]'})
      export class MyDir {}
    `);

    await runMigration('prune-ng-modules');

    const appModule = tree.readContent('app.module.ts');

    expect(tree.exists('a.module.ts')).toBe(false);
    expect(tree.exists('b.module.ts')).toBe(false);
    expect(tree.exists('c.module.ts')).toBe(false);
    expect(appModule).not.toContain('ModuleC');
    expect(stripWhitespace(appModule)).toContain(stripWhitespace(`
      @NgModule({imports: [], declarations: [MyDir]})
      export class AppModule {}
    `));
  });

  it('should not remove a chain of modules if a module in the chain cannot be removed because it has providers',
     async () => {
       const moduleAContent = `
          import {NgModule, InjectionToken} from '@angular/core';

          export const token = new InjectionToken<any>('token');

          @NgModule({providers: [{provide: token, useValue: 123}]})
          export class ModuleA {}
        `;

       const moduleBContent = `
          import {NgModule} from '@angular/core';
          import {ModuleA} from './a.module';

          @NgModule({imports: [ModuleA]})
          export class ModuleB {}
        `;

       const moduleCContent = `
          import {NgModule} from '@angular/core';
          import {ModuleB} from './b.module';

          @NgModule({imports: [ModuleB]})
          export class ModuleC {}
        `;

       const appModuleContent = `
          import {NgModule} from '@angular/core';
          import {MyDir} from './dir';
          import {ModuleC} from './c.module';

          @NgModule({imports: [ModuleC], declarations: [MyDir]})
          export class AppModule {}
        `;

       writeFile('a.module.ts', moduleAContent);
       writeFile('b.module.ts', moduleBContent);
       writeFile('c.module.ts', moduleCContent);
       writeFile('app.module.ts', appModuleContent);
       writeFile('dir.ts', `
          import {Directive} from '@angular/core';

          @Directive({selector: '[myDir]'})
          export class MyDir {}
        `);

       await runMigration('prune-ng-modules');

       expect(tree.readContent('a.module.ts')).toBe(moduleAContent);
       expect(tree.readContent('b.module.ts')).toBe(moduleBContent);
       expect(tree.readContent('c.module.ts')).toBe(moduleCContent);
       expect(tree.readContent('app.module.ts')).toBe(appModuleContent);
     });

  it('should not remove a chain of modules if a module in the chain cannot be removed because it is importing a ModuleWithProviders',
     async () => {
       const moduleAContent = `
          import {NgModule} from '@angular/core';

          @NgModule({imports: [RouterModule.forRoot([{path: '/foo'}])]})
          export class ModuleA {}
        `;

       const moduleBContent = `
          import {NgModule} from '@angular/core';
          import {ModuleA} from './a.module';

          @NgModule({imports: [ModuleA]})
          export class ModuleB {}
        `;

       const moduleCContent = `
          import {NgModule} from '@angular/core';
          import {ModuleB} from './b.module';

          @NgModule({imports: [ModuleB]})
          export class ModuleC {}
        `;

       const appModuleContent = `
          import {NgModule} from '@angular/core';
          import {MyDir} from './dir';
          import {ModuleC} from './c.module';

          @NgModule({imports: [ModuleC], declarations: [MyDir]})
          export class AppModule {}
        `;

       writeFile('a.module.ts', moduleAContent);
       writeFile('b.module.ts', moduleBContent);
       writeFile('c.module.ts', moduleCContent);
       writeFile('app.module.ts', appModuleContent);
       writeFile('dir.ts', `
          import {Directive} from '@angular/core';

          @Directive({selector: '[myDir]'})
          export class MyDir {}
        `);

       await runMigration('prune-ng-modules');

       expect(tree.readContent('a.module.ts')).toBe(moduleAContent);
       expect(tree.readContent('b.module.ts')).toBe(moduleBContent);
       expect(tree.readContent('c.module.ts')).toBe(moduleCContent);
       expect(tree.readContent('app.module.ts')).toBe(appModuleContent);
     });

  it('should not remove the module file if it contains other exported code', async () => {
    writeFile('app.module.ts', `
      import {NgModule} from '@angular/core';
      import {MyComp} from './comp';
      import {sum, ButtonModule, multiply} from './button.module';

      @NgModule({imports: [ButtonModule], declarations: [MyComp], exports: [ButtonModule, MyComp]})
      export class AppModule {}

      console.log(sum(1, 2), multiply(3, 4));
    `);

    writeFile('button.module.ts', `
      import {NgModule} from '@angular/core';
      import {MyButton} from './button';

      export function sum(a: number, b: number) {
        return a + b;
      }

      @NgModule({imports: [MyButton], exports: [MyButton]})
      export class ButtonModule {}

      export function multiply(a: number, b: number) {
        return a * b;
      }
    `);

    writeFile('comp.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-comp', template: '<my-button>Hello</my-button>'})
      export class MyComp {}
    `);

    writeFile('button.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-button', template: '<ng-content></ng-content>', standalone: true})
      export class MyButton {}
    `);

    await runMigration('prune-ng-modules');

    expect(stripWhitespace(tree.readContent('button.module.ts'))).toBe(stripWhitespace(`
      import {NgModule} from '@angular/core';
      import {MyButton} from './button';

      export function sum(a: number, b: number) {
        return a + b;
      }

      export function multiply(a: number, b: number) {
        return a * b;
      }
    `));
    expect(stripWhitespace(tree.readContent('app.module.ts'))).toBe(stripWhitespace(`
      import {NgModule} from '@angular/core';
      import {MyComp} from './comp';
      import {sum, multiply} from './button.module';

      @NgModule({imports: [], declarations: [MyComp], exports: [MyComp]})
      export class AppModule {}

      console.log(sum(1, 2), multiply(3, 4));
    `));
  });

  it('should delete a file that contains multiple modules that are being deleted', async () => {
    writeFile('app.module.ts', `
      import {NgModule} from '@angular/core';
      import {MyComp} from './comp';
      import {ButtonModule, TooltipModule} from './shared-modules';

      @NgModule({
        imports: [ButtonModule, TooltipModule],
        declarations: [MyComp],
        exports: [ButtonModule, MyComp, TooltipModule]
      })
      export class AppModule {}
    `);

    writeFile('comp.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-comp', template: ''})
      export class MyComp {}
    `);

    writeFile('shared-modules.ts', `
      import {NgModule} from '@angular/core';
      import {MyButton} from './button';
      import {MyTooltip} from './tooltip';

      @NgModule({imports: [MyButton], exports: [MyButton]})
      export class ButtonModule {}

      @NgModule({imports: [MyTooltip], exports: [MyTooltip]})
      export class TooltipModule {}
    `);

    writeFile('button.ts', `
      import {Directive} from '@angular/core';

      @Directive({selector: '[my-button]' standalone: true})
      export class MyButton {}
    `);

    writeFile('tooltip.ts', `
      import {Directive} from '@angular/core';

      @Directive({selector: '[my-tooltip]' standalone: true})
      export class MyTooltip {}
    `);

    await runMigration('prune-ng-modules');

    const appModule = tree.readContent('app.module.ts');

    expect(tree.exists('shared-modules.ts')).toBe(false);
    expect(appModule).not.toContain('ButtonModule');
    expect(appModule).not.toContain('TooltipModule');
    expect(stripWhitespace(appModule)).toContain(stripWhitespace(`
      @NgModule({
        imports: [],
        declarations: [MyComp],
        exports: [MyComp]
      })
      export class AppModule {}
    `));
  });

  it('should preserve an import that has one NgModule that is being deleted, in addition to a named import',
     async () => {
       writeFile('app.module.ts', `
          import {NgModule} from '@angular/core';
          import {MyComp} from './comp';
          import Foo, {ButtonModule} from './button.module';

          @NgModule({imports: [ButtonModule], declarations: [MyComp], exports: [ButtonModule, MyComp]})
          export class AppModule {}
        `);

       writeFile('button.module.ts', `
          import {NgModule} from '@angular/core';
          import {MyButton} from './button';

          @NgModule({imports: [MyButton], exports: [MyButton]})
          export class ButtonModule {}
        `);

       writeFile('comp.ts', `
          import {Component} from '@angular/core';

          @Component({selector: 'my-comp', template: '<my-button>Hello</my-button>'})
          export class MyComp {}
        `);

       writeFile('button.ts', `
          import {Component} from '@angular/core';

          @Component({selector: 'my-button', template: '<ng-content></ng-content>', standalone: true})
          export class MyButton {}
        `);

       await runMigration('prune-ng-modules');

       expect(tree.exists('button.module.ts')).toBe(false);
       expect(tree.readContent('app.module.ts')).toContain(`import Foo from './button.module';`);
     });

  it('should remove module references from export expressions', async () => {
    writeFile('app.module.ts', `
      import {NgModule} from '@angular/core';
      import {MyComp} from './comp';

      @NgModule({imports: [MyComp]})
      export class AppModule {}
    `);

    writeFile('button.module.ts', `
      import {NgModule} from '@angular/core';
      import {MyButton} from './button';

      @NgModule({imports: [MyButton], exports: [MyButton]})
      export class ButtonModule {}
    `);

    writeFile('comp.ts', `
      import {Component} from '@angular/core';
      import {MyButton} from './button';

      @Component({
        selector: 'my-comp',
        template: '<my-button>Hello</my-button>',
        standalone: true,
        imports: [MyButton]
      })
      export class MyComp {}
    `);

    writeFile('button.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-button', template: '<ng-content></ng-content>', standalone: true})
      export class MyButton {}
    `);

    writeFile('index.ts', `
      export {AppModule} from './app.module';
      export {MyComp} from './comp';
      export {ButtonModule} from './button.module';
      export {MyButton} from './button';
    `);

    await runMigration('prune-ng-modules');

    expect(tree.exists('app.module.ts')).toBe(false);
    expect(tree.exists('button.module.ts')).toBe(false);
    expect(stripWhitespace(tree.readContent('index.ts'))).toBe(stripWhitespace(`
      export {MyComp} from './comp';
      export {MyButton} from './button';
    `));
  });

  it('should add a comment to locations that cannot be removed automatically', async () => {
    writeFile('app.module.ts', `
      import {NgModule} from '@angular/core';
      import {MyComp} from './comp';
      import {ButtonModule} from './button.module';

      console.log(ButtonModule);

      if (typeof ButtonModule !== 'undefined') {
        console.log('Exists!');
      }

      export const FOO = ButtonModule;

      @NgModule({imports: [ButtonModule], declarations: [MyComp], exports: [ButtonModule, MyComp]})
      export class AppModule {}
    `);

    writeFile('button.module.ts', `
      import {NgModule} from '@angular/core';

      @NgModule()
      export class ButtonModule {}
    `);

    writeFile('comp.ts', `
      import {Component} from '@angular/core';

      @Component({selector: 'my-comp', template: 'Hello'})
      export class MyComp {}
    `);

    await runMigration('prune-ng-modules');

    expect(tree.exists('button.module.ts')).toBe(false);
    expect(stripWhitespace(tree.readContent('app.module.ts'))).toBe(stripWhitespace(`
      import {NgModule} from '@angular/core';
      import {MyComp} from './comp';

      console.log( /* TODO(standalone-migration): clean up removed NgModule reference manually. */ ButtonModule);

      if (typeof  /* TODO(standalone-migration): clean up removed NgModule reference manually. */ ButtonModule !== 'undefined') {
        console.log('Exists!');
      }

      export const FOO =  /* TODO(standalone-migration): clean up removed NgModule reference manually. */ ButtonModule;

      @NgModule({imports: [], declarations: [MyComp], exports: [MyComp]})
      export class AppModule {}
    `));
  });

  it('should switch a platformBrowser().bootstrapModule call to bootstrapApplication', async () => {
    writeFile('main.ts', `
      import {AppModule} from './app/app.module';
      import {platformBrowser} from '@angular/platform-browser';

      platformBrowser().bootstrapModule(AppModule).catch(e => console.error(e));
    `);

    writeFile('./app/app.module.ts', `
      import {NgModule, Component} from '@angular/core';

      @Component({template: 'hello'})
      export class AppComponent {}

      @NgModule({declarations: [AppComponent], bootstrap: [AppComponent]})
      export class AppModule {}
    `);

    await runMigration('standalone-bootstrap');

    expect(stripWhitespace(tree.readContent('main.ts'))).toBe(stripWhitespace(`
      import {AppModule, AppComponent} from './app/app.module';
      import {platformBrowser, bootstrapApplication} from '@angular/platform-browser';

      bootstrapApplication(AppComponent).catch(e => console.error(e));
    `));
  });

  it('should switch a platformBrowserDynamic().bootstrapModule call to bootstrapApplication',
     async () => {
       writeFile('main.ts', `
          import {AppModule} from './app/app.module';
          import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

          platformBrowserDynamic().bootstrapModule(AppModule).catch(e => console.error(e));
        `);

       writeFile('./app/app.module.ts', `
          import {NgModule, Component} from '@angular/core';

          @Component({template: 'hello'})
          export class AppComponent {}

          @NgModule({declarations: [AppComponent], bootstrap: [AppComponent]})
          export class AppModule {}
        `);

       await runMigration('standalone-bootstrap');

       expect(stripWhitespace(tree.readContent('main.ts'))).toBe(stripWhitespace(`
          import {AppModule, AppComponent} from './app/app.module';
          import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
          import {bootstrapApplication} from "@angular/platform-browser";

          bootstrapApplication(AppComponent).catch(e => console.error(e));
        `));
     });

  it('should switch a PlatformRef.bootstrapModule call to bootstrapApplication', async () => {
    writeFile('main.ts', `
      import {AppModule} from './app/app.module';
      import {PlatformRef} from '@angular/core';

      const foo: PlatformRef = null!;

      foo.bootstrapModule(AppModule).catch(e => console.error(e));
    `);

    writeFile('./app/app.module.ts', `
      import {NgModule, Component} from '@angular/core';

      @Component({template: 'hello'})
      export class AppComponent {}

      @NgModule({declarations: [AppComponent], bootstrap: [AppComponent]})
      export class AppModule {}
    `);

    await runMigration('standalone-bootstrap');

    expect(stripWhitespace(tree.readContent('main.ts'))).toBe(stripWhitespace(`
      import {AppModule, AppComponent} from './app/app.module';
      import {PlatformRef} from '@angular/core';
      import {bootstrapApplication} from "@angular/platform-browser";

      const foo: PlatformRef = null!;

      bootstrapApplication(AppComponent).catch(e => console.error(e));
    `));
  });

  it('should convert the root module declarations to standalone', async () => {
    writeFile('main.ts', `
      import {AppModule} from './app/app.module';
      import {platformBrowser} from '@angular/platform-browser';

      platformBrowser().bootstrapModule(AppModule).catch(e => console.error(e));
    `);

    writeFile('./app/app.component.ts', `
      import {Component} from '@angular/core';

      @Component({template: '<div *ngIf="show" dir>hello</div>'})
      export class AppComponent {
        show = true;
      }
    `);

    writeFile('./app/dir.ts', `
      import {Directive} from '@angular/core';

      @Directive({selector: '[dir]'})
      export class Dir {}
    `);

    writeFile('./app/app.module.ts', `
      import {NgModule} from '@angular/core';
      import {CommonModule} from '@angular/common';
      import {AppComponent} from './app.component';
      import {Dir} from './dir';

      @NgModule({
        imports: [CommonModule],
        declarations: [AppComponent, Dir],
        bootstrap: [AppComponent]
      })
      export class AppModule {}
    `);

    await runMigration('standalone-bootstrap');

    expect(stripWhitespace(tree.readContent('main.ts'))).toBe(stripWhitespace(`
      import {AppModule} from './app/app.module';
      import {platformBrowser, bootstrapApplication} from '@angular/platform-browser';
      import {importProvidersFrom} from "@angular/core";
      import {AppComponent} from "./app/app.component";
      import {CommonModule} from "@angular/common";

      bootstrapApplication(AppComponent, {
        providers: [importProvidersFrom(CommonModule)]
      }).catch(e => console.error(e));
    `));

    expect(stripWhitespace(tree.readContent('./app/app.module.ts'))).toBe(stripWhitespace(`
      import {NgModule} from '@angular/core';
      import {CommonModule} from '@angular/common';
      import {AppComponent} from './app.component';
      import {Dir} from './dir';

      @NgModule(/*
        TODO(standalone-migration): clean up removed NgModule class manually or run the "Remove unnecessary NgModule classes" step of the migration again.
        {
          imports: [CommonModule],
          declarations: [AppComponent, Dir],
          bootstrap: [AppComponent]
        } */)
        export class AppModule {}
    `));

    expect(stripWhitespace(tree.readContent('./app/app.component.ts'))).toBe(stripWhitespace(`
      import {Component} from '@angular/core';
      import {Dir} from "./dir";
      import {NgIf} from "@angular/common";

      @Component({
        template: '<div *ngIf="show" dir>hello</div>',
        standalone: true,
        imports: [NgIf, Dir]
      })
      export class AppComponent {
        show = true;
      }
    `));

    expect(stripWhitespace(tree.readContent('./app/dir.ts'))).toBe(stripWhitespace(`
      import {Directive} from '@angular/core';

      @Directive({selector: '[dir]', standalone: true})
      export class Dir {}
    `));
  });

  it('should copy providers and the symbols they depend on to the main file', async () => {
    writeFile('main.ts', `
      import {AppModule} from './app/app.module';
      import {platformBrowser} from '@angular/platform-browser';

      platformBrowser().bootstrapModule(AppModule).catch(e => console.error(e));
    `);

    writeFile('./app/app.module.ts', `
      import {NgModule, Component, InjectionToken} from '@angular/core';
      import {externalToken} from './externals/token';
      import {externalToken as aliasedExternalToken} from './externals/other-token';
      import {ExternalInterface} from '@external/interfaces';
      import {InternalInterface} from './interfaces/internal-interface';

      const internalToken = new InjectionToken<string>('internalToken');
      export const exportedToken = new InjectionToken<InternalInterface>('exportedToken');

      export class ExportedClass {}

      export function exportedFactory(value: InternalInterface) {
        return value.foo;
      }

      const unexportedExtraProviders = [
        {provide: aliasedExternalToken, useFactory: (value: ExternalInterface) => value.foo}
      ];

      export const exportedExtraProviders = [
        {provide: exportedToken, useClass: ExportedClass}
      ];

      @Component({template: 'hello'})
      export class AppComponent {}

      @NgModule({
        declarations: [AppComponent],
        bootstrap: [AppComponent],
        providers: [
          {provide: internalToken, useValue: 'hello'},
          {provide: externalToken, useValue: 123, multi: true},
          {provide: externalToken, useFactory: exportedFactory, multi: true},
          ...unexportedExtraProviders,
          ...exportedExtraProviders
        ]
      })
      export class AppModule {}
    `);

    await runMigration('standalone-bootstrap');

    // Note that this leaves a couple of unused imports from `app.module`.
    // The schematic optimizes for safety, rather than avoiding unused imports.
    expect(stripWhitespace(tree.readContent('main.ts'))).toBe(stripWhitespace(`
      import { AppModule, exportedToken, exportedExtraProviders, ExportedClass, exportedFactory, AppComponent } from './app/app.module';
      import { platformBrowser, bootstrapApplication } from '@angular/platform-browser';
      import { ExternalInterface } from "@external/interfaces";
      import { externalToken as aliasedExternalToken } from "./app/externals/other-token";
      import { externalToken } from "./app/externals/token";
      import { InternalInterface } from "./app/interfaces/internal-interface";
      import { InjectionToken } from "@angular/core";

      const internalToken = new InjectionToken<string>('internalToken');
      const unexportedExtraProviders = [
        {provide: aliasedExternalToken, useFactory: (value: ExternalInterface) => value.foo}
      ];

      bootstrapApplication(AppComponent, {
        providers: [
            { provide: internalToken, useValue: 'hello' },
            { provide: externalToken, useValue: 123, multi: true },
            { provide: externalToken, useFactory: exportedFactory, multi: true },
            ...unexportedExtraProviders,
            ...exportedExtraProviders
        ]
      }).catch(e => console.error(e));
    `));
  });

  it('should not copy over non-declaration references to the main file', async () => {
    writeFile('main.ts', `
      import {AppModule} from './app/app.module';
      import {platformBrowser} from '@angular/platform-browser';

      platformBrowser().bootstrapModule(AppModule).catch(e => console.error(e));
    `);

    writeFile('./app/app.module.ts', `
      import {NgModule, Component, InjectionToken} from '@angular/core';

      export const token = new InjectionToken<string>('token');

      console.log(token);

      @Component({template: 'hello'})
      export class AppComponent {}

      @NgModule({
        declarations: [AppComponent],
        bootstrap: [AppComponent],
        providers: [{provide: token, useValue: 'hello'}]
      })
      export class AppModule {}
    `);

    await runMigration('standalone-bootstrap');

    expect(stripWhitespace(tree.readContent('main.ts'))).toBe(stripWhitespace(`
      import {AppModule, token, AppComponent} from './app/app.module';
      import {platformBrowser, bootstrapApplication} from '@angular/platform-browser';
      import {InjectionToken} from "@angular/core";

      bootstrapApplication(AppComponent, {
        providers: [{ provide: token, useValue: 'hello' }]
      }).catch(e => console.error(e));
    `));
  });

  it('should update dynamic imports from the `providers` that are copied to the main file',
     async () => {
       writeFile('main.ts', `
          import {AppModule} from './app/app.module';
          import {platformBrowser} from '@angular/platform-browser';

          platformBrowser().bootstrapModule(AppModule).catch(e => console.error(e));
        `);

       writeFile('./app/app.module.ts', `
          import {NgModule, Component} from '@angular/core';
          import {ROUTES} from '@angular/router';

          @Component({template: 'hello'})
          export class AppComponent {}

          @NgModule({
            declarations: [AppComponent],
            bootstrap: [AppComponent],
            providers: [{
              provide: ROUTES,
              useValue: [
                {path: 'internal-comp', loadComponent: () => import('../routes/internal-comp').then(c => c.InternalComp)},
                {path: 'external-comp', loadComponent: () => import('@external/external-comp').then(c => c.ExternalComp)}
              ]
            }]
          })
          export class AppModule {}
        `);

       await runMigration('standalone-bootstrap');

       expect(stripWhitespace(tree.readContent('main.ts'))).toBe(stripWhitespace(`
          import {AppModule, AppComponent} from './app/app.module';
          import {platformBrowser, bootstrapApplication} from '@angular/platform-browser';
          import {ROUTES} from "@angular/router";

          bootstrapApplication(AppComponent, {
            providers: [{
              provide: ROUTES,
              useValue: [
                {path: 'internal-comp', loadComponent: () => import("./routes/internal-comp").then(c => c.InternalComp)},
                {path: 'external-comp', loadComponent: () => import('@external/external-comp').then(c => c.ExternalComp)}
              ]
            }]
          }).catch(e => console.error(e));
        `));
     });

  it('should copy modules from the `imports` array to the `providers` and wrap them in `imporProvidersFrom`',
     async () => {
       writeFile('main.ts', `
        import {AppModule} from './app/app.module';
        import {platformBrowser} from '@angular/platform-browser';

        platformBrowser().bootstrapModule(AppModule).catch(e => console.error(e));
      `);

       writeFile('./modules/internal.module.ts', `
        import {NgModule} from '@angular/core';

        @NgModule()
        export class InternalModule {}
      `);

       writeFile('./app/app.module.ts', `
        import {NgModule, Component} from '@angular/core';
        import {CommonModule} from '@angular/common';
        import {InternalModule} from '../modules/internal.module';

        @Component({template: 'hello'})
        export class AppComponent {}

        @NgModule()
        export class SameFileModule {}

        @NgModule({
          imports: [CommonModule, InternalModule, SameFileModule],
          declarations: [AppComponent],
          bootstrap: [AppComponent]
        })
        export class AppModule {}
      `);

       await runMigration('standalone-bootstrap');

       expect(stripWhitespace(tree.readContent('main.ts'))).toBe(stripWhitespace(`
        import {AppModule, SameFileModule, AppComponent} from './app/app.module';
        import {platformBrowser, bootstrapApplication} from '@angular/platform-browser';
        import {NgModule, importProvidersFrom} from "@angular/core";
        import {InternalModule} from "./modules/internal.module";
        import {CommonModule} from "@angular/common";

        bootstrapApplication(AppComponent, {
          providers: [importProvidersFrom(CommonModule, InternalModule, SameFileModule)]
        }).catch(e => console.error(e));
      `));
     });

  it('should switch RouterModule.forRoot calls with one argument to provideRouter', async () => {
    writeFile('main.ts', `
      import {AppModule} from './app/app.module';
      import {platformBrowser} from '@angular/platform-browser';

      platformBrowser().bootstrapModule(AppModule).catch(e => console.error(e));
    `);

    writeFile('./app/app.module.ts', `
      import {NgModule, Component} from '@angular/core';
      import {RouterModule} from '@angular/router';

      @Component({template: 'hello'})
      export class AppComponent {}

      @NgModule({
        declarations: [AppComponent],
        bootstrap: [AppComponent],
        imports: [
          RouterModule.forRoot([
            {path: 'internal-comp', loadComponent: () => import("./routes/internal-comp").then(c => c.InternalComp) },
            {path: 'external-comp', loadComponent: () => import('@external/external-comp').then(c => c.ExternalComp) }
          ])
        ]
      })
      export class AppModule {}
    `);

    await runMigration('standalone-bootstrap');

    expect(stripWhitespace(tree.readContent('main.ts'))).toBe(stripWhitespace(`
      import {AppModule, AppComponent} from './app/app.module';
      import {platformBrowser, bootstrapApplication} from '@angular/platform-browser';
      import {provideRouter} from "@angular/router";

      bootstrapApplication(AppComponent, {
        providers: [provideRouter([
          {path: 'internal-comp', loadComponent: () => import("./app/routes/internal-comp").then(c => c.InternalComp)},
          {path: 'external-comp', loadComponent: () => import('@external/external-comp').then(c => c.ExternalComp)}
        ])]
      }).catch(e => console.error(e));
    `));
  });

  it('should preserve RouterModule.forRoot calls with multiple arguments', async () => {
    writeFile('main.ts', `
      import {AppModule} from './app/app.module';
      import {platformBrowser} from '@angular/platform-browser';

      platformBrowser().bootstrapModule(AppModule).catch(e => console.error(e));
    `);

    writeFile('./app/app.module.ts', `
      import {NgModule, Component} from '@angular/core';
      import {RouterModule} from '@angular/router';
      import {APP_ROUTES} from './routes';

      @Component({template: 'hello'})
      export class AppComponent {}

      @NgModule({
        declarations: [AppComponent],
        bootstrap: [AppComponent],
        imports: [RouterModule.forRoot(APP_ROUTES, {})]
      })
      export class AppModule {}
    `);

    await runMigration('standalone-bootstrap');

    expect(stripWhitespace(tree.readContent('main.ts'))).toBe(stripWhitespace(`
      import {AppModule, AppComponent} from './app/app.module';
      import {platformBrowser, bootstrapApplication} from '@angular/platform-browser';
      import {importProvidersFrom} from "@angular/core";
      import {APP_ROUTES} from "./app/routes";
      import {RouterModule} from "@angular/router";

      bootstrapApplication(AppComponent, {
        providers: [importProvidersFrom(RouterModule.forRoot(APP_ROUTES, {}))]
      }).catch(e => console.error(e));
    `));
  });

  it('should convert BrowserAnimationsModule references to provideAnimations', async () => {
    writeFile('main.ts', `
      import {AppModule} from './app/app.module';
      import {platformBrowser} from '@angular/platform-browser';

      platformBrowser().bootstrapModule(AppModule).catch(e => console.error(e));
    `);

    writeFile('./app/app.module.ts', `
      import {NgModule, Component} from '@angular/core';
      import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

      @Component({template: 'hello'})
      export class AppComponent {}

      @NgModule({
        declarations: [AppComponent],
        bootstrap: [AppComponent],
        imports: [BrowserAnimationsModule]
      })
      export class AppModule {}
    `);

    await runMigration('standalone-bootstrap');

    expect(stripWhitespace(tree.readContent('main.ts'))).toBe(stripWhitespace(`
      import {AppModule, AppComponent} from './app/app.module';
      import {platformBrowser, bootstrapApplication} from '@angular/platform-browser';
      import {provideAnimations} from "@angular/platform-browser/animations";

      bootstrapApplication(AppComponent, {
        providers: [provideAnimations()]
      }).catch(e => console.error(e));
    `));
  });

  it('should preserve BrowserAnimationsModule.withConfig calls', async () => {
    writeFile('main.ts', `
      import {AppModule} from './app/app.module';
      import {platformBrowser} from '@angular/platform-browser';

      platformBrowser().bootstrapModule(AppModule).catch(e => console.error(e));
    `);

    writeFile('./app/app.module.ts', `
      import {NgModule, Component} from '@angular/core';
      import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

      @Component({template: 'hello'})
      export class AppComponent {}

      @NgModule({
        declarations: [AppComponent],
        bootstrap: [AppComponent],
        imports: [BrowserAnimationsModule.withConfig({disableAnimations: true})]
      })
      export class AppModule {}
    `);

    await runMigration('standalone-bootstrap');

    expect(stripWhitespace(tree.readContent('main.ts'))).toBe(stripWhitespace(`
      import {AppModule, AppComponent} from './app/app.module';
      import {platformBrowser, bootstrapApplication} from '@angular/platform-browser';
      import {importProvidersFrom} from "@angular/core";
      import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

      bootstrapApplication(AppComponent, {
        providers: [importProvidersFrom(BrowserAnimationsModule.withConfig({disableAnimations: true}))]
      }).catch(e => console.error(e));
    `));
  });

  it('should convert NoopAnimationsModule references to provideNoopAnimations', async () => {
    writeFile('main.ts', `
      import {AppModule} from './app/app.module';
      import {platformBrowser} from '@angular/platform-browser';

      platformBrowser().bootstrapModule(AppModule).catch(e => console.error(e));
    `);

    writeFile('./app/app.module.ts', `
      import {NgModule, Component} from '@angular/core';
      import {NoopAnimationsModule} from '@angular/platform-browser/animations';

      @Component({template: 'hello'})
      export class AppComponent {}

      @NgModule({
        declarations: [AppComponent],
        bootstrap: [AppComponent],
        imports: [NoopAnimationsModule]
      })
      export class AppModule {}
    `);

    await runMigration('standalone-bootstrap');

    expect(stripWhitespace(tree.readContent('main.ts'))).toBe(stripWhitespace(`
      import {AppModule, AppComponent} from './app/app.module';
      import {platformBrowser, bootstrapApplication} from '@angular/platform-browser';
      import {provideNoopAnimations} from "@angular/platform-browser/animations";

      bootstrapApplication(AppComponent, {
        providers: [provideNoopAnimations()]
      }).catch(e => console.error(e));
    `));
  });

  it('should omit standalone directives from the imports array from the importProvidersFrom call',
     async () => {
       writeFile('main.ts', `
        import {AppModule} from './app/app.module';
        import {platformBrowser} from '@angular/platform-browser';

        platformBrowser().bootstrapModule(AppModule).catch(e => console.error(e));
      `);

       writeFile('./app/app.module.ts', `
        import {NgModule, Component, Directive} from '@angular/core';
        import {CommonModule} from '@angular/common';

        @Directive({selector: '[dir]', standalone: true})
        export class Dir {}

        @Component({template: '<span dir></span>'})
        export class AppComponent {}

        @NgModule({imports: [Dir, CommonModule], declarations: [AppComponent], bootstrap: [AppComponent]})
        export class AppModule {}
      `);

       await runMigration('standalone-bootstrap');

       expect(stripWhitespace(tree.readContent('main.ts'))).toBe(stripWhitespace(`
        import {AppModule, AppComponent} from './app/app.module';
        import {platformBrowser, bootstrapApplication} from '@angular/platform-browser';
        import {importProvidersFrom} from "@angular/core";
        import {CommonModule} from "@angular/common";

        bootstrapApplication(AppComponent, {
          providers: [importProvidersFrom(CommonModule)]
        }).catch(e => console.error(e));
      `));

       expect(stripWhitespace(tree.readContent('./app/app.module.ts'))).toContain(stripWhitespace(`
        @Component({template: '<span dir></span>', standalone: true, imports: [Dir]})
        export class AppComponent {}
      `));
     });
});
