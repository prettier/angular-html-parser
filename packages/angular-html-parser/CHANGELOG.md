# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [7.0.0](https://github.com/prettier/angular-html-parser/compare/v6.0.2...v7.0.0) (2024-09-29)


### ⚠ BREAKING CHANGES

* **core:** `ExperimentalPendingTasks` has been renamed to
`PendingTasks`.
* **core:** Generally this PR has two implications:

* effects which are triggered outside of change detection run as part of
  the change detection process instead of as a microtask. Depending on the
  specifics of application/test setup, this can result in them executing
  earlier or later (or requiring additional test steps to trigger; see below
  examples).

* effects which are triggered during change detection (e.g. by input
  signals) run _earlier_, before the component's template.

We've seen a few common failure cases:

* Tests which used to rely on the `Promise` timing of effects now need to
  `await whenStable()` or call `.detectChanges()` in order for effects to
  run.

* Tests which use faked clocks may need to fast-forward/flush the clock to
  cause effects to run.

* `effect()`s triggered during CD could rely on the application being fully
  rendered (for example, they could easily read computed styles, etc). With
  the change, they run before the component's updates and can get incorrect
  answers. The recent `afterRenderEffect()` API is a natural replacement for
  this style of effect.

* `effect()`s which synchronize with the forms system are particularly
  timing-sensitive and might need to adjust their initialization timing.
* **core:** * TypeScript versions less than 5.5 are no longer supported.
* **core:** The timers that are used for zone coalescing and hybrid
mode scheduling (which schedules an application state synchronization
when changes happen outside the Angular zone) will now run in the zone
above Angular rather than the root zone. This will mostly affect tests
which use `fakeAsync`: these timers will now be visible to `fakeAsync`
and can be affected by `tick` or `flush`.
* **core:** Render default fallback with empty `projectableNodes`.

When passing an empty array to `projectableNodes` in the `createComponent` API, the default fallback content of the `ng-content` will be rendered if present. To prevent rendering the default content, pass `document.createTextNode('')` as a `projectableNode`.

For example:

```ts
// The first ng-content will render the default fallback content if present
createComponent(MyComponent. { projectableNodes: [[], [secondNode]] });

// To prevent projecting the default fallback content:
createComponent(MyComponent. { projectableNodes: [[document.createTextNode('')], [secondNode]] });

```
* **elements:** as part of switching away from custom CD behavior to the
hybrid scheduler, timing of change detection around custom elements has
changed subtly. These changes make elements more efficient, but can cause
tests which encoded assumptions about how or when elements would be checked
to require updating.
* **core:** The `autoDetect` feature of `ComponentFixture` will now
attach the fixture to the `ApplicationRef`. As a result, errors during
automatic change detection of the fixture be reported to the `ErrorHandler`.
This change may cause custom error handlers to observe new failures that were previously unreported.
* **core:** Errors that are thrown during `ApplicationRef.tick`
will now be rethrown when using `TestBed`. These errors should be
resolved by ensuring the test environment is set up correctly to
complete change detection successfully. There are two alternatives to
catch the errors:

* Instead of waiting for automatic change detection to happen, trigger
  it synchronously and expect the error. For example, a jasmine test
  could write `expect(() => TestBed.inject(ApplicationRef).tick()).toThrow()`
* `TestBed` will reject any outstanding `ComponentFixture.whenStable` promises. A jasmine test,
for example, could write `expectAsync(fixture.whenStable()).toBeRejected()`.

As a last resort, you can configure errors to _not_ be rethrown by
setting `rethrowApplicationErrors` to `false` in `TestBed.configureTestingModule`.
* **router:** The `Router.errorHandler` property has been removed.
Adding an error handler should be configured in either
`withNavigationErrorHandler` with `provideRouter` or the `errorHandler`
property in the extra options of `RouterModule.forRoot`. In addition,
the error handler cannot be used to change the return value of the
router navigation promise or prevent it from rejecting. Instead, if you
want to prevent the promise from rejecting, use `resolveNavigationPromiseOnError`.
* **router:** The return type of the `Resolve` interface now includes
`RedirectCommand`.
* **zone.js:** `fakeAsync` will now flush pending timers at the end of
the given function by default. To opt-out of this, you can use `{flush:
false}` in options parameter of `fakeAsync`

### Features

* **bazel:** remove unused ESM2022 from APF ([#57559](https://github.com/prettier/angular-html-parser/issues/57559)) ([d5cc9d5](https://github.com/prettier/angular-html-parser/commit/d5cc9d5d7110a2a1176fc317015b30448a79648a))
* **common:** automatically use sizes auto in NgOptimizedImage ([#57479](https://github.com/prettier/angular-html-parser/issues/57479)) ([50f08e6](https://github.com/prettier/angular-html-parser/commit/50f08e6c4bf1caeeb08d3505ce7fabd466b9c76b))
* **compiler-cli:** 'strictStandalone' flag enforces standalone ([#57935](https://github.com/prettier/angular-html-parser/issues/57935)) ([d9687f4](https://github.com/prettier/angular-html-parser/commit/d9687f43dd2ccfcf7dd3ee4f9066ce727f3224c6))
* **compiler-cli:** ensure template style elements are preprocessed as inline styles ([#57429](https://github.com/prettier/angular-html-parser/issues/57429)) ([9e87593](https://github.com/prettier/angular-html-parser/commit/9e87593055a5314a67090bd15d5552c23b538050))
* **compiler:** add diagnostic for unused standalone imports ([#57605](https://github.com/prettier/angular-html-parser/issues/57605)) ([a2e4ee0](https://github.com/prettier/angular-html-parser/commit/a2e4ee0cb3d40cadc05e28d58b06853973944456)), closes [#46766](https://github.com/prettier/angular-html-parser/issues/46766)
* **core:** Add 'flush' parameter option to fakeAsync to flush after the test ([#57239](https://github.com/prettier/angular-html-parser/issues/57239)) ([f7918f5](https://github.com/prettier/angular-html-parser/commit/f7918f52720d3e903281154725cb257a952e8896))
* **core:** Add a schematics to migrate to `standalone: false`. ([#57643](https://github.com/prettier/angular-html-parser/issues/57643)) ([6ea8e1e](https://github.com/prettier/angular-html-parser/commit/6ea8e1e9aae028572873cf97aa1949c8153f458f))
* **core:** Add async `run` method on `ExperimentalPendingTasks` ([#56546](https://github.com/prettier/angular-html-parser/issues/56546)) ([3ebe6b4](https://github.com/prettier/angular-html-parser/commit/3ebe6b4ad401337e18619edc34477ae98226fa3e))
* **core:** add ng generate schematic to convert to inject ([#57056](https://github.com/prettier/angular-html-parser/issues/57056)) ([fab673a](https://github.com/prettier/angular-html-parser/commit/fab673a1ddbca19ff9734f92a5ef0cc16be5708c))
* **core:** Add whenStable helper on ApplicationRef ([#57190](https://github.com/prettier/angular-html-parser/issues/57190)) ([7919982](https://github.com/prettier/angular-html-parser/commit/7919982063e7638ffabe2127d4803bb930c791bc))
* **core:** allow passing `undefined` without needing to include it in the type argument of `input` ([#57621](https://github.com/prettier/angular-html-parser/issues/57621)) ([c93b510](https://github.com/prettier/angular-html-parser/commit/c93b510f9b2e23aa7a3848a04c05249fde14a9b1)), closes [#53909](https://github.com/prettier/angular-html-parser/issues/53909)
* **core:** bootstrapModule can configure NgZone in providers ([#57060](https://github.com/prettier/angular-html-parser/issues/57060)) ([3459289](https://github.com/prettier/angular-html-parser/commit/3459289ef079a80e84bb92e20c25fb6cae18aaf8))
* **core:** change effect() execution timing & no-op `allowSignalWrites` ([#57874](https://github.com/prettier/angular-html-parser/issues/57874)) ([fc59e2a](https://github.com/prettier/angular-html-parser/commit/fc59e2a7b7afa491a5ea740284a742574805eb36)), closes [#55311](https://github.com/prettier/angular-html-parser/issues/55311) [#55808](https://github.com/prettier/angular-html-parser/issues/55808) [#55644](https://github.com/prettier/angular-html-parser/issues/55644) [#56863](https://github.com/prettier/angular-html-parser/issues/56863)
* **core:** drop support for TypeScript 5.4 ([#57577](https://github.com/prettier/angular-html-parser/issues/57577)) ([8bcc663](https://github.com/prettier/angular-html-parser/commit/8bcc663a53888717cdf4ce0c23404caa00abb1b2))
* **core:** initial version of the output migration ([#57604](https://github.com/prettier/angular-html-parser/issues/57604)) ([e6e5d29](https://github.com/prettier/angular-html-parser/commit/e6e5d29e830a0a74d7677d5f2345f29391064853))
* **core:** introduce `afterRenderEffect` ([#57549](https://github.com/prettier/angular-html-parser/issues/57549)) ([be2e496](https://github.com/prettier/angular-html-parser/commit/be2e49639bda831831ad62d49253db942a83fd46))
* **core:** mark input, output and model APIs as stable ([#57804](https://github.com/prettier/angular-html-parser/issues/57804)) ([1b15192](https://github.com/prettier/angular-html-parser/commit/1b1519224d10c1cd25d05d7b958772b9adee1e1a))
* **core:** mark signal-based query APIs as stable ([#57921](https://github.com/prettier/angular-html-parser/issues/57921)) ([a7eff3f](https://github.com/prettier/angular-html-parser/commit/a7eff3ffaaecbcb3034130d475ff7b4e41a1e1cc))
* **core:** migrate ExperimentalPendingTasks to PendingTasks ([#57533](https://github.com/prettier/angular-html-parser/issues/57533)) ([a1f2298](https://github.com/prettier/angular-html-parser/commit/a1f229850ad36da009f772faa831da173a60268c))
* **core:** stabilize `[@let](https://github.com/let)` syntax ([#57813](https://github.com/prettier/angular-html-parser/issues/57813)) ([e5adf92](https://github.com/prettier/angular-html-parser/commit/e5adf9296595644e415d5c147df08890be01ba77))
* **core:** support TypeScript 5.6 ([#57424](https://github.com/prettier/angular-html-parser/issues/57424)) ([b063468](https://github.com/prettier/angular-html-parser/commit/b0634680272569501146bb7a9cdfe53033e25971))
* **language-service:** add code fix for unused standalone imports ([#57605](https://github.com/prettier/angular-html-parser/issues/57605)) ([8da9fb4](https://github.com/prettier/angular-html-parser/commit/8da9fb49b54e50de2d028691f73fb773def62ecd))
* **language-service:** add code reactoring action to migrate `@Input` to signal-input ([#57214](https://github.com/prettier/angular-html-parser/issues/57214)) ([1f067f4](https://github.com/prettier/angular-html-parser/commit/1f067f4507b6e908fe991d5de0dc4d3a627ab2f9))
* **language-service:** allow code refactorings to compute edits asynchronously ([#57214](https://github.com/prettier/angular-html-parser/issues/57214)) ([56ee47f](https://github.com/prettier/angular-html-parser/commit/56ee47f2ec6e983e2ffdf59476ab29a92590811e))
* **language-service:** support writing code refactorings ([#56895](https://github.com/prettier/angular-html-parser/issues/56895)) ([4bb558a](https://github.com/prettier/angular-html-parser/commit/4bb558ab0cbf2e5e34816377e977128a177a977a))
* **migrations:** add migration to convert standalone component routes to be lazy loaded ([#56428](https://github.com/prettier/angular-html-parser/issues/56428)) ([147eee4](https://github.com/prettier/angular-html-parser/commit/147eee42530b8e7d6a99f37c8eba7a38cbe29522))
* **migrations:** introduce signal input migration as `ng generate` schematic ([#57805](https://github.com/prettier/angular-html-parser/issues/57805)) ([59fe9bc](https://github.com/prettier/angular-html-parser/commit/59fe9bc77236f1374427a851e55b0fa5216d9cf9))
* **migrations:** migrate .pipe calls in outputs used in tests ([#57691](https://github.com/prettier/angular-html-parser/issues/57691)) ([cbec46a](https://github.com/prettier/angular-html-parser/commit/cbec46a51d22a1238cc8bf1ebdf343d031b8f0ba))
* **migrations:** remove complete calls for migrated outputs ([#57671](https://github.com/prettier/angular-html-parser/issues/57671)) ([68e5370](https://github.com/prettier/angular-html-parser/commit/68e5370a66633f4b069d6adffa95c2ea94291820))
* **migrations:** replace .next usage on outputs ([#57654](https://github.com/prettier/angular-html-parser/issues/57654)) ([9da21f7](https://github.com/prettier/angular-html-parser/commit/9da21f798de2033af9d39a8a9b255ef2fe74f948))
* **router:** Add `routerOutletData` input to `RouterOutlet` directive ([#57051](https://github.com/prettier/angular-html-parser/issues/57051)) ([f271021](https://github.com/prettier/angular-html-parser/commit/f271021e190ede70bfd181d46f0a468a8e7fa144)), closes [#46283](https://github.com/prettier/angular-html-parser/issues/46283)
* **router:** Add defaultQueryParamsHandling to router configuration ([#57198](https://github.com/prettier/angular-html-parser/issues/57198)) ([6c76c91](https://github.com/prettier/angular-html-parser/commit/6c76c91e151b53dfaccb4be43d43a8d857715dd7)), closes [#12664](https://github.com/prettier/angular-html-parser/issues/12664)
* **zone.js:** Add 'flush' parameter option to fakeAsync to flush after the test ([#57137](https://github.com/prettier/angular-html-parser/issues/57137)) ([99d679d](https://github.com/prettier/angular-html-parser/commit/99d679d6061d731a04930824e92f247bb94f21e7))


### Bug Fixes

* **common:** Don't run preconnect assertion on the server. ([#56213](https://github.com/prettier/angular-html-parser/issues/56213)) ([2c4613a](https://github.com/prettier/angular-html-parser/commit/2c4613a002d7670f8377cb53eaa9aca4bfc9521f)), closes [#56207](https://github.com/prettier/angular-html-parser/issues/56207)
* **common:** execute checks and remove placeholder when image is already loaded ([#55444](https://github.com/prettier/angular-html-parser/issues/55444)) ([c3115b8](https://github.com/prettier/angular-html-parser/commit/c3115b882ebbe4f971e1f06bb1ce2cdf43327bb0))
* **compiler-cli:** add warning for unused let declarations ([#57033](https://github.com/prettier/angular-html-parser/issues/57033)) ([d4ff6bc](https://github.com/prettier/angular-html-parser/commit/d4ff6bc0b200f0a6bb095ea4a13e52b79e254cca))
* **compiler-cli:** add warning for unused let declarations ([#57033](https://github.com/prettier/angular-html-parser/issues/57033)) ([c76b440](https://github.com/prettier/angular-html-parser/commit/c76b440ac007128c53699797811bc586220ccbe9))
* **compiler-cli:** avoid emitting references to typecheck files in TS 5.4 ([#56961](https://github.com/prettier/angular-html-parser/issues/56961)) ([f0d6d06](https://github.com/prettier/angular-html-parser/commit/f0d6d0688d984970e03d747405a9b11635ecdcf9)), closes [#56358](https://github.com/prettier/angular-html-parser/issues/56358) [#56945](https://github.com/prettier/angular-html-parser/issues/56945)
* **compiler-cli:** correctly get the type of nested function call expressions ([#57010](https://github.com/prettier/angular-html-parser/issues/57010)) ([39ccaf4](https://github.com/prettier/angular-html-parser/commit/39ccaf4cc457894a3cf0455349e1c016a858751a))
* **compiler-cli:** emitting references to ngtypecheck files ([#57138](https://github.com/prettier/angular-html-parser/issues/57138)) ([0f0a1f2](https://github.com/prettier/angular-html-parser/commit/0f0a1f28365cdb2dc6abed5ec75d4f6ba7ff1578)), closes [#56961](https://github.com/prettier/angular-html-parser/issues/56961) [#57135](https://github.com/prettier/angular-html-parser/issues/57135)
* **compiler-cli:** extended diagnostic visitor not visiting template attributes ([#57033](https://github.com/prettier/angular-html-parser/issues/57033)) ([6c2fbda](https://github.com/prettier/angular-html-parser/commit/6c2fbda6942adbc7b21f3dfc1db0a42638223a1a))
* **compiler-cli:** extended diagnostics not validating ICUs ([#57845](https://github.com/prettier/angular-html-parser/issues/57845)) ([f611faa](https://github.com/prettier/angular-html-parser/commit/f611faadfedd8dc2c3291da98e2c2c60fe3984bd)), closes [#57838](https://github.com/prettier/angular-html-parser/issues/57838)
* **compiler-cli:** generate valid TS 5.6 type checking code ([#57303](https://github.com/prettier/angular-html-parser/issues/57303)) ([ca55b3d](https://github.com/prettier/angular-html-parser/commit/ca55b3d4547296d722596bb196045c814cf5fec0))
* **compiler-cli:** run JIT transforms on `@NgModule` classes with `jit: true` ([#57212](https://github.com/prettier/angular-html-parser/issues/57212)) ([e11c0c4](https://github.com/prettier/angular-html-parser/commit/e11c0c42d2cbcdf8a5d75a4e24a6a5dbed33943e))
* **compiler-cli:** support JIT transforms before other transforms modifying classes ([#57262](https://github.com/prettier/angular-html-parser/issues/57262)) ([e2259c7](https://github.com/prettier/angular-html-parser/commit/e2259c7b093decc9255c8afe084ec574e029d7d2))
* **compiler:** JIT mode incorrectly interpreting host directive configuration in partial compilation ([#57002](https://github.com/prettier/angular-html-parser/issues/57002)) ([9167fc8](https://github.com/prettier/angular-html-parser/commit/9167fc815c5bac5f39352dd13e381c5be84282c5)), closes [#54096](https://github.com/prettier/angular-html-parser/issues/54096)
* **compiler:** limit the number of chained instructions ([#57069](https://github.com/prettier/angular-html-parser/issues/57069)) ([08c5977](https://github.com/prettier/angular-html-parser/commit/08c5977bd53caf7911e48f39fa4f60e5afd813de)), closes [#57066](https://github.com/prettier/angular-html-parser/issues/57066)
* **compiler:** produce less noisy errors when parsing control flow ([#57711](https://github.com/prettier/angular-html-parser/issues/57711)) ([40ff18f](https://github.com/prettier/angular-html-parser/commit/40ff18f87a04fd1c00dea9fee1568bfe52acf25c))
* **compiler:** reduce chance of conflicts between generated factory and local variables ([#57181](https://github.com/prettier/angular-html-parser/issues/57181)) ([d9d68e7](https://github.com/prettier/angular-html-parser/commit/d9d68e73d2b59b598d1f7de03ad5faa2b6d31ee2)), closes [#57168](https://github.com/prettier/angular-html-parser/issues/57168)
* **compiler:** reduce chance of conflicts between generated factory and local variables ([#57181](https://github.com/prettier/angular-html-parser/issues/57181)) ([67e0940](https://github.com/prettier/angular-html-parser/commit/67e09404db4a8a3a09bff005503a76f49d4fe055)), closes [#57168](https://github.com/prettier/angular-html-parser/issues/57168)
* **compiler:** use strict equality for 'code' comparison ([#56944](https://github.com/prettier/angular-html-parser/issues/56944)) ([107173c](https://github.com/prettier/angular-html-parser/commit/107173c14d1a0d95b78fbcac53a46bce5f8a6848))
* **core:** `afterNextRender` hooks return that callback value. ([#57031](https://github.com/prettier/angular-html-parser/issues/57031)) ([7d4b2d2](https://github.com/prettier/angular-html-parser/commit/7d4b2d2413935ca0869e659fc67dd88e00228593))
* **core:** Account for addEventListener to be passed a Window or Document. ([#57282](https://github.com/prettier/angular-html-parser/issues/57282)) ([3439cc2](https://github.com/prettier/angular-html-parser/commit/3439cc2049a92c9a68fedd4354940429b2aa3ff1))
* **core:** Account for addEventListener to be passed a Window or Document. ([#57354](https://github.com/prettier/angular-html-parser/issues/57354)) ([8e945c7](https://github.com/prettier/angular-html-parser/commit/8e945c7cc99039decba8f8a9296242f5d413004d))
* **core:** Allow hybrid CD scheduling to support multiple "Angular zones" ([#57267](https://github.com/prettier/angular-html-parser/issues/57267)) ([769b6e1](https://github.com/prettier/angular-html-parser/commit/769b6e197356817c05db144d7c3587ef17dc9575)), closes [#57261](https://github.com/prettier/angular-html-parser/issues/57261)
* **core:** Allow zoneless scheduler to run inside `fakeAsync` ([#56932](https://github.com/prettier/angular-html-parser/issues/56932)) ([3b0dca7](https://github.com/prettier/angular-html-parser/commit/3b0dca75d6dab6039253edd00c436715775bd0dd)), closes [#56767](https://github.com/prettier/angular-html-parser/issues/56767)
* **core:** avoid leaking memory if component throws during creation ([#57546](https://github.com/prettier/angular-html-parser/issues/57546)) ([a3cdbfe](https://github.com/prettier/angular-html-parser/commit/a3cdbfe87f5a8daef11a154ef3edb5a3a5c12f77))
* **core:** complete post-hydration cleanup in components that use ViewContainerRef ([#57300](https://github.com/prettier/angular-html-parser/issues/57300)) ([26ddbdb](https://github.com/prettier/angular-html-parser/commit/26ddbdb89cd07d9f6a4153bce5c7a0741ae9ce68)), closes [#56989](https://github.com/prettier/angular-html-parser/issues/56989)
* **core:** ComponentFixture autoDetect feature works like production ([#55228](https://github.com/prettier/angular-html-parser/issues/55228)) ([f03d274](https://github.com/prettier/angular-html-parser/commit/f03d274e87c919514a70d02c0699523957de7386))
* **core:** Deprecate ignoreChangesOutsideZone option ([#57029](https://github.com/prettier/angular-html-parser/issues/57029)) ([8718abc](https://github.com/prettier/angular-html-parser/commit/8718abce900617275d80ca56141d4e4436481b69))
* **core:** Do not bubble capture events. ([#57476](https://github.com/prettier/angular-html-parser/issues/57476)) ([7a99815](https://github.com/prettier/angular-html-parser/commit/7a99815146eb78074aa3ed6db73c6e87042df692))
* **core:** Do not run image performance warning checks on server ([#57234](https://github.com/prettier/angular-html-parser/issues/57234)) ([827070e](https://github.com/prettier/angular-html-parser/commit/827070e3314d4c3acee77920dc0d5375398917ab))
* **core:** Ensure the `ViewContext` is retained after closure minification ([#57903](https://github.com/prettier/angular-html-parser/issues/57903)) ([950a554](https://github.com/prettier/angular-html-parser/commit/950a5540f15118e7360506ad82ec9dab5a11f789))
* **core:** errors during ApplicationRef.tick should be rethrown for zoneless tests ([#56993](https://github.com/prettier/angular-html-parser/issues/56993)) ([3a63c9e](https://github.com/prettier/angular-html-parser/commit/3a63c9ebbec86ec13ba2c978dd3c497cd1f4ab46)), closes [#56977](https://github.com/prettier/angular-html-parser/issues/56977)
* **core:** fallback to default ng-content with empty projectable nodes. ([#57480](https://github.com/prettier/angular-html-parser/issues/57480)) ([7b1e5be](https://github.com/prettier/angular-html-parser/commit/7b1e5be20b99c88246c6be78a4dcd64eb55cee1a)), closes [#57471](https://github.com/prettier/angular-html-parser/issues/57471)
* **core:** Fix fixture.detectChanges with autoDetect disabled and zoneless ([#57416](https://github.com/prettier/angular-html-parser/issues/57416)) ([0300dd2](https://github.com/prettier/angular-html-parser/commit/0300dd2e18f064f2f57f7371e0dc5c01218b5019))
* **core:** Handle [@let](https://github.com/let) declaration with array when `preparingForHydration` ([#57816](https://github.com/prettier/angular-html-parser/issues/57816)) ([4231e8f](https://github.com/prettier/angular-html-parser/commit/4231e8f28ffe8f55dddc2af0647b5b04fa8445d7))
* **core:** handle hydration of components that project content conditionally ([#57383](https://github.com/prettier/angular-html-parser/issues/57383)) ([d4449fc](https://github.com/prettier/angular-html-parser/commit/d4449fce21bebbb18f9e1341f1675cdbec7e83ac)), closes [#56750](https://github.com/prettier/angular-html-parser/issues/56750)
* **core:** handle shorthand assignment in the inject migration ([#57134](https://github.com/prettier/angular-html-parser/issues/57134)) ([ca89ef9](https://github.com/prettier/angular-html-parser/commit/ca89ef9141191d56415bdf62354f5125800a4039))
* **core:** hydration error in some let declaration setups ([#57173](https://github.com/prettier/angular-html-parser/issues/57173)) ([a752178](https://github.com/prettier/angular-html-parser/commit/a752178f28b836acfc55c4dfa7cd4d18e99ca7c4)), closes [#57160](https://github.com/prettier/angular-html-parser/issues/57160)
* **core:** not all callbacks running when registered at the same time ([#56981](https://github.com/prettier/angular-html-parser/issues/56981)) ([e504ad9](https://github.com/prettier/angular-html-parser/commit/e504ad97d44159cf632ec987fce94f66bfddef37)), closes [#56979](https://github.com/prettier/angular-html-parser/issues/56979)
* **core:** provide flag to opt into manual cleanup for after render hooks ([#57917](https://github.com/prettier/angular-html-parser/issues/57917)) ([3240598](https://github.com/prettier/angular-html-parser/commit/32405981582030d7eb5d307f44b9c00fb384c480))
* **core:** rethrow errors during ApplicationRef.tick in TestBed ([#57200](https://github.com/prettier/angular-html-parser/issues/57200)) ([468d3fb](https://github.com/prettier/angular-html-parser/commit/468d3fb9b1c3dd6dff86afcb6d8f89cc4c29b24b))
* **core:** Schedulers run in zone above Angular rather than root ([#57553](https://github.com/prettier/angular-html-parser/issues/57553)) ([226a67d](https://github.com/prettier/angular-html-parser/commit/226a67dabba90a488ad09ce7bb026b8883c90d4a)), closes [#56767](https://github.com/prettier/angular-html-parser/issues/56767)
* **core:** skip hydration for i18n nodes that were not projected ([#57356](https://github.com/prettier/angular-html-parser/issues/57356)) ([84827d5](https://github.com/prettier/angular-html-parser/commit/84827d5958b21d164670d5286ef11509c56f23ad)), closes [#57301](https://github.com/prettier/angular-html-parser/issues/57301)
* **core:** take skip hydration flag into account while hydrating i18n blocks ([#57299](https://github.com/prettier/angular-html-parser/issues/57299)) ([45212c7](https://github.com/prettier/angular-html-parser/commit/45212c7fd9024a05d01d071710fae1f03d1443f1)), closes [#57105](https://github.com/prettier/angular-html-parser/issues/57105)
* **core:** tree shake dev mode error message ([#57035](https://github.com/prettier/angular-html-parser/issues/57035)) ([fe41b11](https://github.com/prettier/angular-html-parser/commit/fe41b11434ad7bdff1c308fc31a6671e67c5ee29)), closes [#57034](https://github.com/prettier/angular-html-parser/issues/57034)
* **core:** warnings for oversized images and lazy-lcp present with bootstrapModule ([#57060](https://github.com/prettier/angular-html-parser/issues/57060)) ([2a4f488](https://github.com/prettier/angular-html-parser/commit/2a4f488a6cb8bdadece70c8aa076c02fae801688))
* **devtools:** catch invalidated extension error to prevent devtools from spamming console ([#55697](https://github.com/prettier/angular-html-parser/issues/55697)) ([bfda774](https://github.com/prettier/angular-html-parser/commit/bfda774995235d0d05990de56a975be99dd259d4))
* **devtools:** correctly set environment injector path in the case where there are no element injectors ([#57442](https://github.com/prettier/angular-html-parser/issues/57442)) ([774d983](https://github.com/prettier/angular-html-parser/commit/774d9832abee79ea5d5ea055c84b35ee1525ce7e))
* **devtools:** ignore DOM Nodes from other frames when performing render tree detection ([#57518](https://github.com/prettier/angular-html-parser/issues/57518)) ([99e4057](https://github.com/prettier/angular-html-parser/commit/99e40574cb9729a64b8dde3ebc1dbe32b79f52f5))
* **devtools:** remove existing highlight before highlighting another element ([#57746](https://github.com/prettier/angular-html-parser/issues/57746)) ([8602729](https://github.com/prettier/angular-html-parser/commit/860272980128104e8e89f06b33807bfef576e797))
* **docs-infra:** extend the timeout for jasmine tests of mermaid ([#57948](https://github.com/prettier/angular-html-parser/issues/57948)) ([af66e24](https://github.com/prettier/angular-html-parser/commit/af66e2475dd6a2a15c9b35c2aa2db7937883f8ec))
* **docs-infra:** Fix scrolling in application ([#57554](https://github.com/prettier/angular-html-parser/issues/57554)) ([90b5fef](https://github.com/prettier/angular-html-parser/commit/90b5fef9dc8a3ca69882bf3e5d57ef96cf9fa427)), closes [#57552](https://github.com/prettier/angular-html-parser/issues/57552)
* **docs-infra:** leverage http_server rule from @angular/build-tooling for adev local serving ([#57427](https://github.com/prettier/angular-html-parser/issues/57427)) ([7ee9e7f](https://github.com/prettier/angular-html-parser/commit/7ee9e7f386685513571b78d236f1cc667dafed18))
* **docs-infra:** only run matchMedia on client ([#57121](https://github.com/prettier/angular-html-parser/issues/57121)) ([be45346](https://github.com/prettier/angular-html-parser/commit/be45346f2dd5195ab341de32e5018a200c0b8b95))
* **docs-infra:** replace the uses of replaceAll with replace using regex with g flag ([#57232](https://github.com/prettier/angular-html-parser/issues/57232)) ([f125cd8](https://github.com/prettier/angular-html-parser/commit/f125cd82b4aa78ac518d7e25ba1137a628415a36))
* **docs-infra:** resolve Mermaid from Bazel root path ([#57924](https://github.com/prettier/angular-html-parser/issues/57924)) ([eb5651f](https://github.com/prettier/angular-html-parser/commit/eb5651fe981e54bceb9b870f1540da97911e0630)), closes [#57920](https://github.com/prettier/angular-html-parser/issues/57920)
* **docs-infra:** skip navigation to card if user clicks on anchor ([#57081](https://github.com/prettier/angular-html-parser/issues/57081)) ([12eb005](https://github.com/prettier/angular-html-parser/commit/12eb0053d908a6d540e36c3a0269568f96a1554f))
* **docs-infra:** update `getAnswerFiles` to ensure compatibility with non-POSIX file systems ([#57970](https://github.com/prettier/angular-html-parser/issues/57970)) ([8f73199](https://github.com/prettier/angular-html-parser/commit/8f73199e9f03918bbb5d22f09306033de331f5c9))
* **elements:** support `output()`-shaped outputs ([#57535](https://github.com/prettier/angular-html-parser/issues/57535)) ([fe5c4e0](https://github.com/prettier/angular-html-parser/commit/fe5c4e086add655bf53315d71b0736ff758c7199))
* **elements:** switch to `ComponentRef.setInput` & remove custom scheduler ([#56728](https://github.com/prettier/angular-html-parser/issues/56728)) ([0cebfd7](https://github.com/prettier/angular-html-parser/commit/0cebfd7462c6a7c6c3b0d66720c436a4b0eea19d)), closes [#53981](https://github.com/prettier/angular-html-parser/issues/53981)
* **http:** Dynamicaly call the global fetch implementation ([#57531](https://github.com/prettier/angular-html-parser/issues/57531)) ([c2892fe](https://github.com/prettier/angular-html-parser/commit/c2892fee58d28ffec0dfeaad6a5d6822c040cf03)), closes [#57527](https://github.com/prettier/angular-html-parser/issues/57527)
* **http:** Dynamicaly call the global fetch implementation ([#57531](https://github.com/prettier/angular-html-parser/issues/57531)) ([21445a2](https://github.com/prettier/angular-html-parser/commit/21445a29322d12fadfb2decaea56f14e95878886)), closes [#57527](https://github.com/prettier/angular-html-parser/issues/57527)
* **language-service:** avoid generating TS suggestion diagnostics for templates ([#56241](https://github.com/prettier/angular-html-parser/issues/56241)) ([4bb9d0f](https://github.com/prettier/angular-html-parser/commit/4bb9d0f9235c644ba3ec7f1840ffa81457c5622e))
* **language-service:** The suppress diagnostics option should work for external templates ([#57873](https://github.com/prettier/angular-html-parser/issues/57873)) ([7ecfd89](https://github.com/prettier/angular-html-parser/commit/7ecfd8959219b6e2ec19e1244a6694711daf1782))
* **migrations:** account for explicit standalone: false in migration ([#57803](https://github.com/prettier/angular-html-parser/issues/57803)) ([6144612](https://github.com/prettier/angular-html-parser/commit/614461294041d7a2331bf7528907f37353205115))
* **migrations:** account for members with doc strings and no modifiers ([#57389](https://github.com/prettier/angular-html-parser/issues/57389)) ([4ae66f2](https://github.com/prettier/angular-html-parser/commit/4ae66f25d01ffd603872b3df3faf5c5c555b6446))
* **migrations:** account for parameters with union types ([#57127](https://github.com/prettier/angular-html-parser/issues/57127)) ([cb442a0](https://github.com/prettier/angular-html-parser/commit/cb442a0ce7183c7d0e315a58ade75aa09bdaf6dd))
* **migrations:** add alias to inject migration ([#57127](https://github.com/prettier/angular-html-parser/issues/57127)) ([166166d](https://github.com/prettier/angular-html-parser/commit/166166d79ebe2405989b869f96a04e1dee182666))
* **migrations:** avoid duplicating comments when generating properties ([#57367](https://github.com/prettier/angular-html-parser/issues/57367)) ([e4a6198](https://github.com/prettier/angular-html-parser/commit/e4a61985c3495d29123dfe52591369c08caa4838))
* **migrations:** avoid migrating route component in tests ([#57317](https://github.com/prettier/angular-html-parser/issues/57317)) ([ac93839](https://github.com/prettier/angular-html-parser/commit/ac93839d694929fdf16c610994a369d4efb2823a))
* **migrations:** change imports to be G3 compatible ([#57654](https://github.com/prettier/angular-html-parser/issues/57654)) ([71f5ef2](https://github.com/prettier/angular-html-parser/commit/71f5ef2aa53a74bab7d0543f98870d81c44c4978))
* **migrations:** fix common module removal ([#56968](https://github.com/prettier/angular-html-parser/issues/56968)) ([0ea6a4a](https://github.com/prettier/angular-html-parser/commit/0ea6a4a36128dc7a3792f4e164f024e91f429705))
* **migrations:** preserve optional parameters ([#57367](https://github.com/prettier/angular-html-parser/issues/57367)) ([d6b2483](https://github.com/prettier/angular-html-parser/commit/d6b24833cac55d85109d4b18935793923f348cc4))
* **migrations:** preserve type when using inject decorator ([#57389](https://github.com/prettier/angular-html-parser/issues/57389)) ([58a79b6](https://github.com/prettier/angular-html-parser/commit/58a79b6e435f2a46a7ab17ff5538083e05340b6f))
* **migrations:** properly handle comments in output migration ([#57691](https://github.com/prettier/angular-html-parser/issues/57691)) ([3a264db](https://github.com/prettier/angular-html-parser/commit/3a264db86611cba9b69780d7f01ee25787278320))
* **migrations:** remove generic arguments from the injected type reference ([#57127](https://github.com/prettier/angular-html-parser/issues/57127)) ([1cf616f](https://github.com/prettier/angular-html-parser/commit/1cf616f6710d1324e24bc3421a1edc84c8bb1a02))
* **migrations:** remove unused imports in inject migration ([#57179](https://github.com/prettier/angular-html-parser/issues/57179)) ([ba0df30](https://github.com/prettier/angular-html-parser/commit/ba0df30ef617df0a8b6b7286f0147f7d1509330e))
* **migrations:** replace leftover modules with their exports during pruning ([#57684](https://github.com/prettier/angular-html-parser/issues/57684)) ([fc95a9a](https://github.com/prettier/angular-html-parser/commit/fc95a9adff42da53dfeee5df8c42be25e8559708)), closes [#51420](https://github.com/prettier/angular-html-parser/issues/51420)
* **migrations:** unwrap injected forwardRef ([#57127](https://github.com/prettier/angular-html-parser/issues/57127)) ([aae9646](https://github.com/prettier/angular-html-parser/commit/aae9646a1b5a5ce114e624d9c1452d9f4c71b969))
* **router:** Align RouterModule.forRoot errorHandler with provider error handler ([#57050](https://github.com/prettier/angular-html-parser/issues/57050)) ([b279081](https://github.com/prettier/angular-html-parser/commit/b2790813a62e4dfdd77e27d1bb82201788476d06))
* **router:** Do not unnecessarily run matcher twice on route matching ([#57530](https://github.com/prettier/angular-html-parser/issues/57530)) ([8f63084](https://github.com/prettier/angular-html-parser/commit/8f6308457f0f03e9bbd09f4bc10d1c61fd41d22c)), closes [#57511](https://github.com/prettier/angular-html-parser/issues/57511)
* **router:** Update Resolve interface to include RedirectCommand like ResolveFn ([#57309](https://github.com/prettier/angular-html-parser/issues/57309)) ([7436d31](https://github.com/prettier/angular-html-parser/commit/7436d3180ea5ad2c0b58d920bd45f8641a14cc8d)), closes [#57131](https://github.com/prettier/angular-html-parser/issues/57131)
* **upgrade:** Address Trusted Types violations in @angular/upgrade ([#57454](https://github.com/prettier/angular-html-parser/issues/57454)) ([c9d9078](https://github.com/prettier/angular-html-parser/commit/c9d90786d0a6421bbb21b9d1649d031b34e3fa5d))
* **upgrade:** support input signal bindings ([#57020](https://github.com/prettier/angular-html-parser/issues/57020)) ([5f56a65](https://github.com/prettier/angular-html-parser/commit/5f56a6583753f5aaff8a43e1e5f9a376433d0c0c)), closes [#56860](https://github.com/prettier/angular-html-parser/issues/56860)
* **zone.js:** Add support for addition jest functions. ([#57280](https://github.com/prettier/angular-html-parser/issues/57280)) ([e1240c6](https://github.com/prettier/angular-html-parser/commit/e1240c6f5d9a3d68ccef7ffbf0a0646ad1164cd8)), closes [#57277](https://github.com/prettier/angular-html-parser/issues/57277)
* **zone.js:** more robust check for promise-like objects ([#57388](https://github.com/prettier/angular-html-parser/issues/57388)) ([e608e6c](https://github.com/prettier/angular-html-parser/commit/e608e6cfbbc9fba7c74bfef72f102a502e951e6c)), closes [#57385](https://github.com/prettier/angular-html-parser/issues/57385)
* **zone.js:** support `Timeout.refresh` in Node.js ([#56852](https://github.com/prettier/angular-html-parser/issues/56852)) ([982f1b1](https://github.com/prettier/angular-html-parser/commit/982f1b125147e4292716f9524bef75423b70c71c)), closes [/github.com/nodejs/undici/blob/1dff4fd9b1b2cee97c5f8cf44041521a62d3f133/lib/util/timers.js#L45](https://github.com/prettier//github.com/nodejs/undici/blob/1dff4fd9b1b2cee97c5f8cf44041521a62d3f133/lib/util/timers.js/issues/L45) [#56586](https://github.com/prettier/angular-html-parser/issues/56586)
* **zone.js:** Update the default behavior of fakeAsync to flush after the test ([#57240](https://github.com/prettier/angular-html-parser/issues/57240)) ([70e8b40](https://github.com/prettier/angular-html-parser/commit/70e8b40750e894bc1439713cd508d8bd9fafb7a4))

### [6.0.2](https://github.com/prettier/angular-html-parser/compare/v6.0.1...v6.0.2) (2024-07-11)

### [6.0.1](https://github.com/prettier/angular-html-parser/compare/v6.0.0...v6.0.1) (2024-07-11)

Support `LetDeclaration`

## [6.0.0](https://github.com/prettier/angular-html-parser/compare/v5.2.0...v6.0.0) (2024-07-11)

Sync with upstream.

## [5.2.0](https://github.com/prettier/angular-html-parser/compare/v5.1.0...v5.2.0) (2023-12-10)

## [5.1.0](https://github.com/prettier/angular-html-parser/compare/v5.0.1...v5.1.0) (2023-12-10)


* remove support for Node.js v16 ([#51755](https://github.com/prettier/angular-html-parser/issues/51755)) ([59aa063](https://github.com/prettier/angular-html-parser/commit/59aa0634f4d4694203f2a69c40017fe5a3962514))


* **animations:** remove [#9100](https://github.com/prettier/angular-html-parser/issues/9100) todos. ([#49407](https://github.com/prettier/angular-html-parser/issues/49407)) ([40ed152](https://github.com/prettier/angular-html-parser/commit/40ed152d21ff5921841b80d993e20dd2152d3d3d))
* **common:** remove deprecated `XhrFactory` export from `http` entrypoint ([#49251](https://github.com/prettier/angular-html-parser/issues/49251)) ([c41a216](https://github.com/prettier/angular-html-parser/commit/c41a21658c9a56044b5d7f62cab4fcad5a5732c7))
* **core:** change `RendererType2.styles` to accept a only a flat array ([#49072](https://github.com/prettier/angular-html-parser/issues/49072)) ([9b9c818](https://github.com/prettier/angular-html-parser/commit/9b9c818f99c44473e915bedd157146c88e44989a)), closes [#48317](https://github.com/prettier/angular-html-parser/issues/48317)
* **core:** generate a static application ID ([#49422](https://github.com/prettier/angular-html-parser/issues/49422)) ([82d6fbb](https://github.com/prettier/angular-html-parser/commit/82d6fbb109491607bd2e4feaa35c3dace79e4576))
* **core:** Remove `ReflectiveInjector` symbol ([#48103](https://github.com/prettier/angular-html-parser/issues/48103)) ([3b863dd](https://github.com/prettier/angular-html-parser/commit/3b863ddc1e67a2fa7627ad78e172c839781e81b6))
* **core:** remove Node.js v14 support ([#49255](https://github.com/prettier/angular-html-parser/issues/49255)) ([f594725](https://github.com/prettier/angular-html-parser/commit/f594725951fafde475ee99ffccf1175c13c48288))
* **platform-browser:** remove `withNoDomReuse` function ([#52057](https://github.com/prettier/angular-html-parser/issues/52057)) ([dbc14eb](https://github.com/prettier/angular-html-parser/commit/dbc14eb41d540ab3f7509e41cdf64ac6fe33e13a))
* **platform-browser:** remove deprecated `BrowserTransferStateModule` symbol ([#49718](https://github.com/prettier/angular-html-parser/issues/49718)) ([9bd9a11](https://github.com/prettier/angular-html-parser/commit/9bd9a11f4e21e5a7cc9da18f150f6dd520e7cd1e))
* **platform-server:** remove `renderApplication` overload that accepts a component ([#49463](https://github.com/prettier/angular-html-parser/issues/49463)) ([41f27ad](https://github.com/prettier/angular-html-parser/commit/41f27ad08643839d09daf4588069a3f8fe627070))
* **platform-server:** remove deprecated `renderModuleFactory` ([#49247](https://github.com/prettier/angular-html-parser/issues/49247)) ([17abe6d](https://github.com/prettier/angular-html-parser/commit/17abe6dc96a443de0c2f9575bb160042a031fed1))
* remove Angular Compatibility Compiler (ngcc) ([#49101](https://github.com/prettier/angular-html-parser/issues/49101)) ([48aa96e](https://github.com/prettier/angular-html-parser/commit/48aa96ea13ebfadf2f6b13516c7702dae740a7be))
* remove deprecated `EventManager` method `addGlobalEventListener` ([#49645](https://github.com/prettier/angular-html-parser/issues/49645)) ([2703fd6](https://github.com/prettier/angular-html-parser/commit/2703fd626040c5e65401ebd776404a3b9e284724)
## [5.0.0](https://github.com/prettier/angular-html-parser/compare/v4.0.0...v5.0.0) (2023-10-29)

Sync with upstream.


<a name="4.0.0"></a>
## [4.0.0](https://github.com/prettier/angular-html-parser/compare/v3.0.0...v4.0.0) (2023-01-05)

Sync with upstream.

<a name="3.0.0"></a>
## [3.0.0](https://github.com/prettier/angular-html-parser/compare/v2.1.0...v3.0.0) (2022-11-20)

Sync with upstream.

<a name="2.1.0"></a>
## [2.1.0](https://github.com/prettier/angular-html-parser/compare/v2.0.0...v2.1.0) (2022-10-18)


### Features

* expose utils and classes ([#26](https://github.com/prettier/angular-html-parser/issues/26)) ([aacfa00](https://github.com/prettier/angular-html-parser/commit/aacfa00bd92006bb4abb26adda1fabb69fca3800))

<a name="2.0.0"></a>
## [2.0.0](https://github.com/prettier/angular-html-parser/compare/v1.8.0...v2.0.0) (2022-10-02)


### ⚠ BREAKING CHANGES

* switch to ESM



<a name="1.8.0"></a>
## [1.8.0](https://github.com/ikatyang/angular-html-parser/compare/v1.7.1...v1.8.0) (2021-04-05)


### Features

* add `type` field to nodes and use enumerable node type ([#21](https://github.com/ikatyang/angular-html-parser/issues/21)) ([5823440](https://github.com/ikatyang/angular-html-parser/commit/5823440))



<a name="1.7.1"></a>
## [1.7.1](https://github.com/ikatyang/angular-html-parser/compare/v1.7.0...v1.7.1) (2020-06-26)


### Bug Fixes

* add missing endSourceSpan for element with void element as its last child ([#20](https://github.com/ikatyang/angular-html-parser/issues/20)) ([f7e8c18](https://github.com/ikatyang/angular-html-parser/commit/f7e8c18))



<a name="1.7.0"></a>
## [1.7.0](https://github.com/ikatyang/angular-html-parser/compare/v1.6.0...v1.7.0) (2020-05-09)


### Features

* **getTagContentType:** add `attrs` parameter ([#17](https://github.com/ikatyang/angular-html-parser/issues/17)) ([6443800](https://github.com/ikatyang/angular-html-parser/commit/6443800))



<a name="1.6.0"></a>
## [1.6.0](https://github.com/ikatyang/angular-html-parser/compare/v1.5.0...v1.6.0) (2020-05-03)


### Features

* **getTagContentType:** add `prefix` and `hasParent` parameters ([#13](https://github.com/ikatyang/angular-html-parser/issues/13)) ([aae23df](https://github.com/ikatyang/angular-html-parser/commit/aae23df))



<a name="1.5.0"></a>
## [1.5.0](https://github.com/ikatyang/angular-html-parser/compare/v1.4.0...v1.5.0) (2020-04-21)


### Features

* add an option to customize tag content type ([#12](https://github.com/ikatyang/angular-html-parser/issues/12)) ([b327e1a](https://github.com/ikatyang/angular-html-parser/commit/b327e1a))



<a name="1.4.0"></a>
## [1.4.0](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/compare/v1.3.0...v1.4.0) (2020-01-28)


### Bug Fixes

* do not wrap `<tr>` into pseudo `<tbody>` ([b63f8a1](https://github.com/ikatyang/angular-html-parser/commit/b63f8a1))



<a name="1.3.0"></a>
## [1.3.0](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/compare/v1.2.0...v1.3.0) (2019-11-02)


### Features

* support full named entities ([#9](https://github.com/ikatyang/angular-html-parser/issues/9)) ([7eaec57](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/commit/7eaec57))



<a name="1.2.0"></a>
## [1.2.0](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/compare/v1.1.0...v1.2.0) (2018-12-07)


### Features

* add an option to specify case-sensitivity for tag names ([#7](https://github.com/ikatyang/angular-html-parser/issues/7)) ([a76b450](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/commit/a76b450))



<a name="1.1.0"></a>
## [1.1.0](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/compare/v1.0.0...v1.1.0) (2018-11-27)


### Features

* add an option to allow `htm` component closing tags ([#6](https://github.com/ikatyang/angular-html-parser/issues/6)) ([b505c16](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/commit/b505c16))
* support bogus comments ([#5](https://github.com/ikatyang/angular-html-parser/issues/5)) ([75042e9](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/commit/75042e9))



<a name="1.0.0"></a>
## 1.0.0 (2018-10-24)

### Features

* initial implementation ([#1](https://github.com/ikatyang/angular-html-parser/issues/1)) ([0e8b9a5](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/commit/0e8b9a5))
