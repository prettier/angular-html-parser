/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {of, Observable} from 'rxjs';
import {TestBed} from '@angular/core/testing';
import {ApplicationRef, Injector, signal} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';

describe('rxResource()', () => {
  it('should fetch data using an observable loader', async () => {
    const injector = TestBed.inject(Injector);
    const appRef = TestBed.inject(ApplicationRef);
    const res = rxResource({
      loader: () => of(1),
      injector,
    });
    await appRef.whenStable();
    expect(res.value()).toBe(1);
  });

  it('should cancel the fetch when a new request comes in', async () => {
    const injector = TestBed.inject(Injector);
    const appRef = TestBed.inject(ApplicationRef);
    let unsub = false;
    const request = signal(1);
    const res = rxResource({
      request,
      loader: ({request}) =>
        new Observable((sub) => {
          if (request === 2) {
            sub.next(true);
          }
          return () => {
            if (request === 1) {
              unsub = true;
            }
          };
        }),
      injector,
    });

    // Wait for the resource to reach loading state.
    await waitFor(() => res.isLoading());

    // Setting request = 2 should cancel request = 1
    request.set(2);
    await appRef.whenStable();
    expect(unsub).toBe(true);
  });
});

async function waitFor(fn: () => boolean): Promise<void> {
  while (!fn()) {
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
}