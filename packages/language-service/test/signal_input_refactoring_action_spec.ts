/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {initMockFileSystem} from '@angular/compiler-cli/src/ngtsc/file_system/testing';

import {createModuleAndProjectWithDeclarations, LanguageServiceTestEnv} from '../testing';

describe('Signal input refactoring action', () => {
  let env: LanguageServiceTestEnv;
  beforeEach(() => {
    initMockFileSystem('Native');
    env = LanguageServiceTestEnv.setup();
  });

  it('should support refactoring an `@Input` property', () => {
    const files = {
      'app.ts': `
        import {Directive, Input} from '@angular/core';

        @Directive({})
        export class AppComponent {
          @Input() bla = true;
        }
     `,
    };

    const project = createModuleAndProjectWithDeclarations(env, 'test', files);
    const appFile = project.openFile('app.ts');
    appFile.moveCursorToText('bl¦a');
    const refactorings = project.getRefactoringsAtPosition('app.ts', appFile.cursor);

    expect(refactorings.length).toBe(2);
    expect(refactorings[0].name).toBe('convert-to-signal-input-safe-mode');
    expect(refactorings[1].name).toBe('convert-to-signal-input-best-effort-mode');
  });

  it('should not support refactoring a non-Angular property', () => {
    const files = {
      'app.ts': `
        import {Directive, Input} from '@angular/core';

        @Directive({})
        export class AppComponent {
          bla = true;
        }
     `,
    };

    const project = createModuleAndProjectWithDeclarations(env, 'test', files);
    const appFile = project.openFile('app.ts');
    appFile.moveCursorToText('bl¦a');
    const refactorings = project.getRefactoringsAtPosition('app.ts', appFile.cursor);

    expect(refactorings.length).toBe(0);
  });

  it('should not support refactoring a signal input property', () => {
    const files = {
      'app.ts': `
        import {Directive, input} from '@angular/core';

        @Directive({})
        export class AppComponent {
          bla = input(true);
        }
     `,
    };

    const project = createModuleAndProjectWithDeclarations(env, 'test', files);
    const appFile = project.openFile('app.ts');
    appFile.moveCursorToText('bl¦a');
    const refactorings = project.getRefactoringsAtPosition('app.ts', appFile.cursor);

    expect(refactorings.length).toBe(0);
  });

  it('should compute edits for migration', async () => {
    const files = {
      'app.ts': `
        import {Directive, Input} from '@angular/core';

        @Directive({})
        export class AppComponent {
          @Input() bla = true;
        }
     `,
    };

    const project = createModuleAndProjectWithDeclarations(env, 'test', files);
    const appFile = project.openFile('app.ts');
    appFile.moveCursorToText('bl¦a');

    const refactorings = project.getRefactoringsAtPosition('app.ts', appFile.cursor);
    expect(refactorings.length).toBe(2);
    expect(refactorings[0].name).toBe('convert-to-signal-input-safe-mode');
    expect(refactorings[1].name).toBe('convert-to-signal-input-best-effort-mode');

    const edits = await project.applyRefactoring(
      'app.ts',
      appFile.cursor,
      refactorings[0].name,
      () => {},
    );
    expect(edits?.notApplicableReason).toBeUndefined();
    expect(edits?.edits).toEqual([
      {
        fileName: '/test/app.ts',
        textChanges: [
          // Input declaration.
          {
            newText: 'readonly bla = input(true);',
            span: {start: 127, length: '@Input() bla = true;'.length},
          },
          // Import (since there is just a single input).
          {newText: '{Directive, input}', span: {start: 16, length: 18}},
        ],
      },
    ]);
  });
});
