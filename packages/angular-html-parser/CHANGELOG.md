# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [6.0.0](https://github.com/prettier/angular-html-parser/compare/v5.2.0...v6.0.0) (2024-07-11)


### ⚠ BREAKING CHANGES

* **core:** `async` has been removed, use `waitForAsync` instead.
* **animations:** Deprecated `matchesElement` method has been removed from `AnimationDriver` as it is unused.
* **platform-browser:** Deprecated `StateKey`, `TransferState` and `makeStateKey` have been removed from `@angular/platform-browser`, use the same APIs from `@angular/core`.
* **http:** By default we now prevent caching of HTTP requests that require authorization . To opt-out from this behaviour use the `includeRequestsWithAuthHeaders` option in `withHttpTransferCache`.

Example:
```ts
withHttpTransferCache({
  includeRequestsWithAuthHeaders: true,
})
```
* **common:** The deprecated `isPlatformWorkerUi` and `isPlatformWorkerApp` have been removed without replacement, as they serve no purpose since the removal of the WebWorker platform.
* **core:** Angular will ensure change detection runs, even when the state update originates from
outside the zone, tests may observe additional rounds of change
detection compared to the previous behavior.

This change will be more likely to impact existing unit tests.
This should usually be seen as more correct and the test should be updated,
but in cases where it is too much effort to debug, the test can revert to the old behavior by adding
`provideZoneChangeDetection({schedulingMode: NgZoneSchedulingMode.NgZoneOnly})`
to the `TestBed` providers.

Similarly, applications which may want to update state outside the zone
and _not_ trigger change detection can add
`provideZoneChangeDetection({schedulingMode: NgZoneSchedulingMode.NgZoneOnly})`
to the providers in `bootstrapApplication` or add
`schedulingMode: NgZoneSchedulingMode.NgZoneOnly` to the
`BootstrapOptions` of `bootstrapModule`.
* **compiler:** Angular only supports writable expressions inside of two-way bindings.
* **core:** Testability methods `increasePendingRequestCount`,
`decreasePendingRequestCount` and `getPendingRequestCount` have been
removed. This information is tracked with zones.
* **router:** Providers available to the routed components always
come from the injector heirarchy of the routes and never inherit from
the `RouterOutlet`. This means that providers available only to the
component that defines the `RouterOutlet` will no longer be available to
route components in any circumstances. This was already the case
whenever routes defined providers, either through lazy loading an
`NgModule` or through explicit `providers` on the route config.
* **core:** `ComponentFixture.whenStable` now matches the
`ApplicationRef.isStable` observable. Prior to this change, stability
of the fixture did not include everything that was considered in
`ApplicationRef`. `whenStable` of the fixture will now include unfinished
router navigations and unfinished `HttpClient` requests. This will cause
tests that `await` the `whenStable` promise to time out when there are
incomplete requests. To fix this, remove the `whenStable`,
instead wait for another condition, or ensure `HttpTestingController`
mocks responses for all requests. Try adding `HttpTestingController.verify()`
before your `await fixture.whenStable` to identify the open requests.
Also, make sure your tests wait for the stability promise. We found many
examples of tests that did not, meaning the expectations did not execute
within the test body.

In addition, `ComponentFixture.isStable` would synchronously switch to
true in some scenarios but will now always be asynchronous.
* **router:** When a a guard returns a `UrlTree` as a redirect, the
redirecting navigation will now use `replaceUrl` if the initial
navigation was also using the `replaceUrl` option. If this is not
desirable, the redirect can configure new `NavigationBehaviorOptions` by
returning a `RedirectCommand` with the desired options instead of `UrlTree`.
* **compiler-cli:** * Angular no longer supports TypeScript versions older than 5.4.
* **platform-browser-dynamic:** No longer used `RESOURCE_CACHE_PROVIDER` APIs have been removed.
* **platform-server:** Legacy handling or Node.js URL parsing has been removed from `ServerPlatformLocation`.

The main differences are;
  - `pathname` is always suffixed with a `/`.
  - `port` is empty when `http:` protocol and port in url is `80`
 - `port` is empty when `https:` protocol and port in url is `443`
* **platform-server:** deprecated `useAbsoluteUrl` and `baseUrl` been removed from `PlatformConfig`. Provide and absolute `url` instead.
* **platform-server:** deprecated `platformDynamicServer` has been removed. Add an `import @angular/compiler` and replace the usage with `platformServer`
* **platform-server:** deprecated `ServerTransferStateModule` has been removed. `TransferState` can be use without providing this module.
* **router:** Providers available to the routed components always
come from the injector heirarchy of the routes and never inherit from
the `RouterOutlet`. This means that providers available only to the
component that defines the `RouterOutlet` will no longer be available to
route components in any circumstances. This was already the case
whenever routes defined providers, either through lazy loading an
`NgModule` or through explicit `providers` on the route config.
* **router:** This change allows `Route.redirectTo` to be a function
in addition to the previous string. Code which expects `redirectTo` to
only be a string on `Route` objects will need to be adjusted.
* **core:** The exact timing of change detection execution when
using event or run coalescing with `NgZone` is now the first of either
`setTimeout` or `requestAnimationFrame`. Code which relies on this
timing (usually by accident) will need to be adjusted. If a callback
needs to execute after change detection, we recommend `afterNextRender`
instead of something like `setTimeout`.
* **core:** The `ComponentFixture` `autoDetect` feature will no
longer refresh the component's host view when the component is `OnPush`
and not marked dirty. This exposes existing issues in components which
claim to be `OnPush` but do not correctly call `markForCheck` when they
need to be refreshed. If this change causes test failures, the easiest
fix is to change the component to `ChangeDetectionStrategy.Default`.
* **router:** Guards can now return `RedirectCommand` for redirects
in addition to `UrlTree`. Code which expects only `boolean` or `UrlTree`
values in `Route` types will need to be adjusted.
* **core:** `OnPush` views at the root of the application need to
be marked dirty for their host bindings to refresh. Previously, the host
bindings were refreshed for all root views without respecting the
`OnPush` change detection strategy.
* **core:** `OnPush` views at the root of the application need to
be marked dirty for their host bindings to refresh. Previously, the host
bindings were refreshed for all root views without respecting the
`OnPush` change detection strategy.
* **core:** Newly created and views marked for check and reattached
during change detection are now guaranteed to be refreshed in that same
change detection cycle. Previously, if they were attached at a location
in the view tree that was already checked, they would either throw
`ExpressionChangedAfterItHasBeenCheckedError` or not be refreshed until
some future round of change detection. In rare circumstances, this
correction can cause issues. We identified one instance that relied on
the previous behavior by reading a value on initialization which was
queued to be updated in a microtask instead of being available in the
current change detection round. The component only read this value during
initialization and did not read it again after the microtask updated it.
* **core:** When Angular runs change detection, it will continue to
refresh any views attached to `ApplicationRef` that are still marked for
check after one round completes. In rare cases, this can result in infinite
loops when certain patterns continue to mark views for check using
`ChangeDetectorRef.detectChanges`. This will be surfaced as a runtime
error with the `NG0103` code.
* **core:** The `ComponentFixture.autoDetect` feature now executes
change detection for the fixture within `ApplicationRef.tick`. This more
closely matches the behavior of how a component would refresh in
production. The order of component refresh in tests may be slightly
affected as a result, especially when dealing with additional components
attached to the application, such as dialogs. Tests sensitive to this
type of change (such as screenshot tests) may need to be updated.
Concretely, this change means that the component will refresh _before_
additional views attached to `ApplicationRef` (i.e. dialog components).
Prior to this change, the fixture component would refresh _after_ other
views attached to the application.

### Features

* **common:** add Netlify image loader ([#54311](https://github.com/prettier/angular-html-parser/issues/54311)) ([03c3b3e](https://github.com/prettier/angular-html-parser/commit/03c3b3eb79ec061b0031d6ad7ba386d185c87d8d)), closes [#54303](https://github.com/prettier/angular-html-parser/issues/54303)
* **common:** add placeholder to NgOptimizedImage ([#53783](https://github.com/prettier/angular-html-parser/issues/53783)) ([f5c520b](https://github.com/prettier/angular-html-parser/commit/f5c520b836c4545c7043649f28b3a0369c168747))
* **compiler-cli:** add partial compilation support for deferred blocks ([#54908](https://github.com/prettier/angular-html-parser/issues/54908)) ([5bd188a](https://github.com/prettier/angular-html-parser/commit/5bd188a394d30053099e2c83fe79136d590e5399))
* **compiler-cli:** drop support for TypeScript older than 5.4 ([#54961](https://github.com/prettier/angular-html-parser/issues/54961)) ([b02b31a](https://github.com/prettier/angular-html-parser/commit/b02b31a915333e680cf96de5d0f965a6e2639028))
* **compiler-cli:** generate extra imports for component local dependencies in local mode ([#53543](https://github.com/prettier/angular-html-parser/issues/53543)) ([7e861c6](https://github.com/prettier/angular-html-parser/commit/7e861c640edf90c5f8d4f7e091861d3d98cd49c0))
* **compiler-cli:** generate global imports in local compilation mode ([#53543](https://github.com/prettier/angular-html-parser/issues/53543)) ([3263df2](https://github.com/prettier/angular-html-parser/commit/3263df23f2f4da722ef2c1a1dacfb0866498dd60))
* **compiler-cli:** make it configurable to generate alias reexports ([#53937](https://github.com/prettier/angular-html-parser/issues/53937)) ([b774e22](https://github.com/prettier/angular-html-parser/commit/b774e22d8e384f43e9cd8f5c55475d06e7f66988))
* **compiler-cli:** run JIT transform on classes with `jit: true` opt-out ([#56892](https://github.com/prettier/angular-html-parser/issues/56892)) ([98ed5b6](https://github.com/prettier/angular-html-parser/commit/98ed5b609e76d3d2b464abfe49d70413c54d3eee))
* **compiler-cli:** support host directives for local compilation mode ([#53877](https://github.com/prettier/angular-html-parser/issues/53877)) ([3e13840](https://github.com/prettier/angular-html-parser/commit/3e1384048eb76c92532ae19aa2883318121c00e8))
* **compiler-cli:** support type-checking for generic signal inputs ([#53521](https://github.com/prettier/angular-html-parser/issues/53521)) ([abdc7e4](https://github.com/prettier/angular-html-parser/commit/abdc7e45786667e4283912024a641975f1917d97))
* **compiler:** Add a TSConfig option `useTemplatePipeline` ([#54057](https://github.com/prettier/angular-html-parser/issues/54057)) ([47e6e84](https://github.com/prettier/angular-html-parser/commit/47e6e841016abfca0c1aa84051d82a04b3027617))
* **compiler:** Add extended diagnostic to warn when there are uncalled functions in event bindings ([#56295](https://github.com/prettier/angular-html-parser/issues/56295)) ([fd6cd04](https://github.com/prettier/angular-html-parser/commit/fd6cd0422d2d761d2c6cc0cd41838fbba8a3f010))
* **compiler:** Add extended diagnostic to warn when there are uncalled functions in event bindings ([#56295](https://github.com/prettier/angular-html-parser/issues/56295)) ([#56295](https://github.com/prettier/angular-html-parser/issues/56295)) ([c8e2885](https://github.com/prettier/angular-html-parser/commit/c8e2885136b08981333a336b7b2ba553266eba63))
* **compiler:** Enable template pipeline by default. ([#54571](https://github.com/prettier/angular-html-parser/issues/54571)) ([1a6beae](https://github.com/prettier/angular-html-parser/commit/1a6beae8a2bdcff27d4c1e402f98246a52247906))
* **compiler:** scope selectors in [@starting-style](https://github.com/starting-style) ([#53943](https://github.com/prettier/angular-html-parser/issues/53943)) ([66e940a](https://github.com/prettier/angular-html-parser/commit/66e940aebfd5a93944860a4e0dbd14e1072f80f2))
* **core:** Add a public API to establish events to be replayed and an attribute to mark an element with an event handler. ([#55356](https://github.com/prettier/angular-html-parser/issues/55356)) ([a730f09](https://github.com/prettier/angular-html-parser/commit/a730f09ae9e729da79a3e0951e15e0139ef67713))
* **core:** Add a schematic to migrate afterRender phase flag ([#55648](https://github.com/prettier/angular-html-parser/issues/55648)) ([ea3c802](https://github.com/prettier/angular-html-parser/commit/ea3c80205653af109c688a4d4808143b34591d54))
* **core:** Add ability to configure zone change detection to use zoneless scheduler ([#55252](https://github.com/prettier/angular-html-parser/issues/55252)) ([fdd560e](https://github.com/prettier/angular-html-parser/commit/fdd560ea14f2f35608e26102c7fac0471a634b3e))
* **core:** add API to inject attributes on the host node ([#54604](https://github.com/prettier/angular-html-parser/issues/54604)) ([331b16e](https://github.com/prettier/angular-html-parser/commit/331b16efd2f5af876e6dc0ad2474ee7a87b00de5))
* **core:** Add build target for jsaction contract binary. ([#55319](https://github.com/prettier/angular-html-parser/issues/55319)) ([bce5e23](https://github.com/prettier/angular-html-parser/commit/bce5e2344f312dc3a8a30d54e412958bd07180c1))
* **core:** add equality function to rxjs-interop `toSignal` ([#56447](https://github.com/prettier/angular-html-parser/issues/56447)) ([5df3e78](https://github.com/prettier/angular-html-parser/commit/5df3e78c9907f522f2f96c087b10ca12d57f7028)), closes [#55573](https://github.com/prettier/angular-html-parser/issues/55573)
* **core:** Add event delegation library to queue up events and replay them when the application is ready ([#55121](https://github.com/prettier/angular-html-parser/issues/55121)) ([666d646](https://github.com/prettier/angular-html-parser/commit/666d646575800e9326eebd513776f8e92b0357e9))
* **core:** add HOST_TAG_NAME token ([#54751](https://github.com/prettier/angular-html-parser/issues/54751)) ([5f06ca8](https://github.com/prettier/angular-html-parser/commit/5f06ca8f5539ed208bae0b110887b5538ac4041f))
* **core:** add migration for invalid two-way bindings ([#54630](https://github.com/prettier/angular-html-parser/issues/54630)) ([fb540e1](https://github.com/prettier/angular-html-parser/commit/fb540e169a78a61f38d611f538eea8fdb0971f1d)), closes [#54154](https://github.com/prettier/angular-html-parser/issues/54154)
* **core:** add support for fallback content in ng-content ([#54854](https://github.com/prettier/angular-html-parser/issues/54854)) ([a600a39](https://github.com/prettier/angular-html-parser/commit/a600a39d0cf9bb8fc2b6786e6f31acb78b7acc6e)), closes [#12530](https://github.com/prettier/angular-html-parser/issues/12530)
* **core:** add support for i18n hydration ([#54823](https://github.com/prettier/angular-html-parser/issues/54823)) ([146306a](https://github.com/prettier/angular-html-parser/commit/146306a1417c378920d80a6d91fd847f22e407ab))
* **core:** add support for let syntax ([#56715](https://github.com/prettier/angular-html-parser/issues/56715)) ([0a48d58](https://github.com/prettier/angular-html-parser/commit/0a48d584f2ffeebb9402032182d4fc13a260c5cf)), closes [#15280](https://github.com/prettier/angular-html-parser/issues/15280)
* **core:** add support for model inputs ([#54252](https://github.com/prettier/angular-html-parser/issues/54252)) ([702ab28](https://github.com/prettier/angular-html-parser/commit/702ab28b4c07a903c403a20af2ca287348b6afd0))
* **core:** Add zoneless change detection provider as experimental ([#55329](https://github.com/prettier/angular-html-parser/issues/55329)) ([f09c5a7](https://github.com/prettier/angular-html-parser/commit/f09c5a7bc455a59aea133264cbf9fd9ef7509a7f))
* **core:** expose new `input` API for signal-based inputs ([#53872](https://github.com/prettier/angular-html-parser/issues/53872)) ([863be4b](https://github.com/prettier/angular-html-parser/commit/863be4b6981dc60ca0610b0e61d2ba1f5759e2a3))
* **core:** expose new `output()` API ([#54650](https://github.com/prettier/angular-html-parser/issues/54650)) ([c687b8f](https://github.com/prettier/angular-html-parser/commit/c687b8f4531252cd1c3dfbb9a7bd42bdbe666a36))
* **core:** expose queries as signals ([#54283](https://github.com/prettier/angular-html-parser/issues/54283)) ([e95ef2c](https://github.com/prettier/angular-html-parser/commit/e95ef2cbc6f850d8fe96218b74cff76cea947674))
* **core:** expose signal input metadata in `ComponentMirror` ([#56402](https://github.com/prettier/angular-html-parser/issues/56402)) ([352e078](https://github.com/prettier/angular-html-parser/commit/352e0782ec37d2adcc662cfc69c83d38058a34bf))
* **core:** introduce `outputFromObservable()` interop function ([#54650](https://github.com/prettier/angular-html-parser/issues/54650)) ([c809069](https://github.com/prettier/angular-html-parser/commit/c809069f213244afd0e2d803a6a43510b218e6f5))
* **core:** introduce `outputToObservable` interop helper ([#54650](https://github.com/prettier/angular-html-parser/issues/54650)) ([aff65fd](https://github.com/prettier/angular-html-parser/commit/aff65fd1f4a61ed76a6f9b623852f197eb3500e4))
* **core:** Modify EventType from an enum to an object. ([#55323](https://github.com/prettier/angular-html-parser/issues/55323)) ([d28614b](https://github.com/prettier/angular-html-parser/commit/d28614b90eff835639747e8961fe61e874c44666))
* **core:** provide ExperimentalPendingTasks API ([#55487](https://github.com/prettier/angular-html-parser/issues/55487)) ([ac863de](https://github.com/prettier/angular-html-parser/commit/ac863ded4818af3426ef5888c706a2bd8c79c0be)), closes [#53381](https://github.com/prettier/angular-html-parser/issues/53381)
* **core:** Redesign the `afterRender` & `afterNextRender` phases API ([#55648](https://github.com/prettier/angular-html-parser/issues/55648)) ([a655e46](https://github.com/prettier/angular-html-parser/commit/a655e46447962bf56bf0184e3104328b9f7c1531))
* **core:** support TypeScript 5.3 ([#52572](https://github.com/prettier/angular-html-parser/issues/52572)) ([94096c6](https://github.com/prettier/angular-html-parser/commit/94096c6ede67436a349ae07901f2bb418bf9f461))
* **core:** support TypeScript 5.4 ([#54414](https://github.com/prettier/angular-html-parser/issues/54414)) ([9749589](https://github.com/prettier/angular-html-parser/commit/974958913ca632971f878a045537472f2c99c665))
* **core:** support TypeScript 5.5 ([#56096](https://github.com/prettier/angular-html-parser/issues/56096)) ([e5a6f91](https://github.com/prettier/angular-html-parser/commit/e5a6f917225aafa7c5c860f280d2aafe3615727e))
* **core:** Synchronize changes from internal JSAction codebase. ([#55182](https://github.com/prettier/angular-html-parser/issues/55182)) ([1ee9f32](https://github.com/prettier/angular-html-parser/commit/1ee9f32621f6d72e8038a08f5ad4a0cfe8bd6a13))
* **devtools:** implement zoom and pan in injector graph visualizer ([#52489](https://github.com/prettier/angular-html-parser/issues/52489)) ([f4b915b](https://github.com/prettier/angular-html-parser/commit/f4b915b77b18a92381849e211b8cf92bb66421f1))
* **devtools:** squash multi providers into 1 and allow them to be logged to the console ([#52489](https://github.com/prettier/angular-html-parser/issues/52489)) ([ef12570](https://github.com/prettier/angular-html-parser/commit/ef12570e29dc7d22df862f343f433d727ea4c524))
* **docs-infra:** put the editor back in angular/angular ([#53540](https://github.com/prettier/angular-html-parser/issues/53540)) ([d9348be](https://github.com/prettier/angular-html-parser/commit/d9348be79f61eca32dbb3643507135d5238a2bbd))
* **docs-infra:** show overloads of methods in API overview ([#54053](https://github.com/prettier/angular-html-parser/issues/54053)) ([fcea8c1](https://github.com/prettier/angular-html-parser/commit/fcea8c1c5d98075e251421339c45543a1a68fbf6))
* **forms:** Unified Control State Change Events ([#54579](https://github.com/prettier/angular-html-parser/issues/54579)) ([1c736dc](https://github.com/prettier/angular-html-parser/commit/1c736dc3b258a502360cda40b3a00c07102ccbf5)), closes [#10887](https://github.com/prettier/angular-html-parser/issues/10887)
* **http:** allow caching requests with different origins between server and client ([#55274](https://github.com/prettier/angular-html-parser/issues/55274)) ([6f88d80](https://github.com/prettier/angular-html-parser/commit/6f88d8075895bd80592b1b7e0fba8202a58a5417)), closes [#53702](https://github.com/prettier/angular-html-parser/issues/53702)
* **http:** exclude caching for authenticated HTTP requests ([#55034](https://github.com/prettier/angular-html-parser/issues/55034)) ([8eacb6e](https://github.com/prettier/angular-html-parser/commit/8eacb6e4b982a5aa23cfbf9078dc4e19d9466d73)), closes [#54745](https://github.com/prettier/angular-html-parser/issues/54745)
* **language-service:** autocompletion for the component not imported ([#55595](https://github.com/prettier/angular-html-parser/issues/55595)) ([b400e2e](https://github.com/prettier/angular-html-parser/commit/b400e2e4d4c27a9c8d8e91b52852ef7b64f7591a))
* **migrations:** Migration schematics for `HttpClientModule` ([#54020](https://github.com/prettier/angular-html-parser/issues/54020)) ([f914f6a](https://github.com/prettier/angular-html-parser/commit/f914f6a3628847c06cbdde9c90cd417fb2f4c61f))
* **platform-browser:** add withI18nSupport() in developer preview ([#55130](https://github.com/prettier/angular-html-parser/issues/55130)) ([45ae7a6](https://github.com/prettier/angular-html-parser/commit/45ae7a6b60019bd49b8a58122a0d5bcbda7e245b))
* **router:** `withNavigationErrorHandler` can convert errors to redirects ([#55370](https://github.com/prettier/angular-html-parser/issues/55370)) ([4a42961](https://github.com/prettier/angular-html-parser/commit/4a42961393b3abf40f34374df059d3959dadecc0)), closes [#42915](https://github.com/prettier/angular-html-parser/issues/42915)
* **router:** Add ability to return `UrlTree` with `NavigationBehaviorOptions` from guards ([#45023](https://github.com/prettier/angular-html-parser/issues/45023)) ([8735af0](https://github.com/prettier/angular-html-parser/commit/8735af08b976b30cf236a83f9e8b64b5ff62e9f3)), closes [#17004](https://github.com/prettier/angular-html-parser/issues/17004) [#27148](https://github.com/prettier/angular-html-parser/issues/27148)
* **router:** Add info property to `NavigationExtras` ([#53303](https://github.com/prettier/angular-html-parser/issues/53303)) ([5c1d441](https://github.com/prettier/angular-html-parser/commit/5c1d4410298e20cb03d7a1ddf7931538b6a181b4))
* **router:** Add reusable types for router guards ([#54580](https://github.com/prettier/angular-html-parser/issues/54580)) ([c1c7384](https://github.com/prettier/angular-html-parser/commit/c1c7384e02becc623c6a42985f7178ca98137264))
* **router:** Add router configuration to resolve navigation promise on error ([#48910](https://github.com/prettier/angular-html-parser/issues/48910)) ([50d7916](https://github.com/prettier/angular-html-parser/commit/50d79162785bb8d3e158a7a4a3733f4c75d3b127)), closes [#48902](https://github.com/prettier/angular-html-parser/issues/48902)
* **router:** Add transient info to RouterLink input ([#53784](https://github.com/prettier/angular-html-parser/issues/53784)) ([a5a9b40](https://github.com/prettier/angular-html-parser/commit/a5a9b408e2eb64dcf1d3ca16da4897649dd2fc34))
* **router:** Allow `onSameUrlNavigation: 'ignore'` in `navigateByUrl` ([#52265](https://github.com/prettier/angular-html-parser/issues/52265)) ([726530a](https://github.com/prettier/angular-html-parser/commit/726530a9af9c8daf7295cc3548f24e70f380d70e))
* **router:** Allow `UrlTree` as an input to `routerLink` ([#56265](https://github.com/prettier/angular-html-parser/issues/56265)) ([a13f5da](https://github.com/prettier/angular-html-parser/commit/a13f5da77303f4ab2f1543df1de1f416216b5a9c)), closes [#34468](https://github.com/prettier/angular-html-parser/issues/34468)
* **router:** Allow resolvers to return `RedirectCommand` ([#54556](https://github.com/prettier/angular-html-parser/issues/54556)) ([87f3f27](https://github.com/prettier/angular-html-parser/commit/87f3f27f9087d757e18e8e2a0f2fca6f2a2c7edf)), closes [#29089](https://github.com/prettier/angular-html-parser/issues/29089)
* **router:** Allow Route.redirectTo to be a function which returns a string or UrlTree ([#52606](https://github.com/prettier/angular-html-parser/issues/52606)) ([2b80258](https://github.com/prettier/angular-html-parser/commit/2b802587f27186baa493c1dd01f42d568b652f38)), closes [/github.com/angular/angular/blob/897f014785578d87bc655ea6ae9e113653960f50/packages/router/src/router_state.ts#L236-L278](https://github.com/prettier//github.com/angular/angular/blob/897f014785578d87bc655ea6ae9e113653960f50/packages/router/src/router_state.ts/issues/L236-L278) [#13373](https://github.com/prettier/angular-html-parser/issues/13373) [#28661](https://github.com/prettier/angular-html-parser/issues/28661)
* **router:** Set a different browser URL from the one for route matching ([#53318](https://github.com/prettier/angular-html-parser/issues/53318)) ([1d3a752](https://github.com/prettier/angular-html-parser/commit/1d3a7529b4fa3617a5d6a97e742cb13818253a14)), closes [#17004](https://github.com/prettier/angular-html-parser/issues/17004)
* **zone.js:** implement Promise.withResolvers() ([#53514](https://github.com/prettier/angular-html-parser/issues/53514)) ([7a28f50](https://github.com/prettier/angular-html-parser/commit/7a28f50711535fcc285c7ee9021e8e7dc34a655d))


### Bug Fixes

* **animations:** cleanup DOM elements when root view is removed with async animations ([#53033](https://github.com/prettier/angular-html-parser/issues/53033)) ([75aeae4](https://github.com/prettier/angular-html-parser/commit/75aeae42b7f512553262d515966f43d11e34d228))
* **animations:** prevent the AsyncAnimationRenderer from calling the delegate when there is no element. ([#52570](https://github.com/prettier/angular-html-parser/issues/52570)) ([5ee11a7](https://github.com/prettier/angular-html-parser/commit/5ee11a74ec5a301aae81b14fe36ba1432a68bf19)), closes [#52538](https://github.com/prettier/angular-html-parser/issues/52538)
* **animations:** remove `finish` listener once player is destroyed ([#51136](https://github.com/prettier/angular-html-parser/issues/51136)) ([a02a745](https://github.com/prettier/angular-html-parser/commit/a02a745a4ada46a084235f94b68d5defd224ddcf))
* **benchpress:** adjust supported browser names for headless chrome ([#56360](https://github.com/prettier/angular-html-parser/issues/56360)) ([31d9fa4](https://github.com/prettier/angular-html-parser/commit/31d9fa40bdbd1b815a819527312994b6ab1b532f))
* **common:** apply fixed_srcset_width value only to fixed srcsets ([#52459](https://github.com/prettier/angular-html-parser/issues/52459)) ([f86fb8e](https://github.com/prettier/angular-html-parser/commit/f86fb8eb036d62426a6eb4fb3e264c4a1f42d19c))
* **common:** Don't run preconnect assertion on the server. ([#56213](https://github.com/prettier/angular-html-parser/issues/56213)) ([39e48ce](https://github.com/prettier/angular-html-parser/commit/39e48ce6757ac2dc4157ab69acade0ff1cd2208e)), closes [#56207](https://github.com/prettier/angular-html-parser/issues/56207)
* **common:** image placeholder not removed in OnPush component ([#54515](https://github.com/prettier/angular-html-parser/issues/54515)) ([219445c](https://github.com/prettier/angular-html-parser/commit/219445cda497901f75f927e9ea4abdbc9207f337)), closes [#54478](https://github.com/prettier/angular-html-parser/issues/54478)
* **common:** invalid ImageKit quality parameter ([#55193](https://github.com/prettier/angular-html-parser/issues/55193)) ([2a6f809](https://github.com/prettier/angular-html-parser/commit/2a6f80950756530d5fb1147addabcb31025b0a78))
* **common:** remove `load` on image once it fails to load ([#52990](https://github.com/prettier/angular-html-parser/issues/52990)) ([29c5416](https://github.com/prettier/angular-html-parser/commit/29c5416d14638a05a894269aa5dbe67e98754418))
* **common:** remove unused parameters from the ngClass constructor ([#53831](https://github.com/prettier/angular-html-parser/issues/53831)) ([1be6b0a](https://github.com/prettier/angular-html-parser/commit/1be6b0a58a9e96f9f0bda8acb63c701f792e469b))
* **common:** scan images once page is loaded ([#52991](https://github.com/prettier/angular-html-parser/issues/52991)) ([7affa57](https://github.com/prettier/angular-html-parser/commit/7affa5775427e92ef6e949c879765b7c8aa172da))
* **common:** server-side rendering error when using in-memory scrolling ([#53683](https://github.com/prettier/angular-html-parser/issues/53683)) ([dd052dc](https://github.com/prettier/angular-html-parser/commit/dd052dc0d6116b0a42b33d6456efaf9c234239dc)), closes [#53682](https://github.com/prettier/angular-html-parser/issues/53682)
* **common:** skip transfer cache on client ([#55012](https://github.com/prettier/angular-html-parser/issues/55012)) ([11705f5](https://github.com/prettier/angular-html-parser/commit/11705f58a77e9390163b0bc99439fb4c8928e531))
* **common:** The date pipe should return ISO format for week and week-year as intended in the unit test. ([#53879](https://github.com/prettier/angular-html-parser/issues/53879)) ([122213d](https://github.com/prettier/angular-html-parser/commit/122213d37d3e73fc0dcfd5a10a2c388dc573b6cf))
* **common:** typo in NgOptimizedImage warning ([#56756](https://github.com/prettier/angular-html-parser/issues/56756)) ([f25653e](https://github.com/prettier/angular-html-parser/commit/f25653e2311152d30b14d25acb0dccb4e2b5ea56))
* **common:** typo in warning for NgOptimizedDirective ([#56817](https://github.com/prettier/angular-html-parser/issues/56817)) ([229dd83](https://github.com/prettier/angular-html-parser/commit/229dd8355e91388f97523fc085197cf06d2fda65))
* **compiler-cli:** account for as expression in docs extraction ([#54414](https://github.com/prettier/angular-html-parser/issues/54414)) ([12dc4d0](https://github.com/prettier/angular-html-parser/commit/12dc4d074e63edaff626003ad6136a8d122b2ba6))
* **compiler-cli:** add compiler option to disable control flow content projection diagnostic ([#53311](https://github.com/prettier/angular-html-parser/issues/53311)) ([e620b3a](https://github.com/prettier/angular-html-parser/commit/e620b3a724cb615af24b7779c0ab492d24efb8cc)), closes [#53190](https://github.com/prettier/angular-html-parser/issues/53190)
* **compiler-cli:** add diagnostic for control flow that prevents content projection ([#52726](https://github.com/prettier/angular-html-parser/issues/52726)) ([b4d022e](https://github.com/prettier/angular-html-parser/commit/b4d022e230ca141b12437949d11dc384bfe5c082)), closes [#52414](https://github.com/prettier/angular-html-parser/issues/52414)
* **compiler-cli:** add diagnostic for control flow that prevents content projection ([#53190](https://github.com/prettier/angular-html-parser/issues/53190)) ([4c1d69e](https://github.com/prettier/angular-html-parser/commit/4c1d69e2880f22745c820eee630d10071e4fa86b)), closes [#52414](https://github.com/prettier/angular-html-parser/issues/52414)
* **compiler-cli:** add diagnostic if initializer API is used outside of an initializer ([#54993](https://github.com/prettier/angular-html-parser/issues/54993)) ([78188e8](https://github.com/prettier/angular-html-parser/commit/78188e877a4db8655bdd3dc5012b70b12a7234de)), closes [#54381](https://github.com/prettier/angular-html-parser/issues/54381)
* **compiler-cli:** add interpolatedSignalNotInvoked to diagnostics ([#52687](https://github.com/prettier/angular-html-parser/issues/52687)) ([8a87e62](https://github.com/prettier/angular-html-parser/commit/8a87e62e19b469746dc705451bb7066fe675ee7d))
* **compiler-cli:** allow custom/duplicate decorators for @Injectable classes in local compilation mode ([#54139](https://github.com/prettier/angular-html-parser/issues/54139)) ([a592904](https://github.com/prettier/angular-html-parser/commit/a592904c691844d2c1aed00bd914edabef49f9b1))
* **compiler-cli:** avoid conflicts with built-in global variables in for loop blocks ([#53319](https://github.com/prettier/angular-html-parser/issues/53319)) ([d7a83f9](https://github.com/prettier/angular-html-parser/commit/d7a83f95213cdd5d3ceefbc95fa1190856b0198c)), closes [#53293](https://github.com/prettier/angular-html-parser/issues/53293)
* **compiler-cli:** avoid duplicate diagnostics for let declarations read before definition ([#56843](https://github.com/prettier/angular-html-parser/issues/56843)) ([4bcec1c](https://github.com/prettier/angular-html-parser/commit/4bcec1ca95ad8557747baf5aefd7a1748cd35624))
* **compiler-cli:** catch function instance properties in interpolated signal diagnostic ([#54325](https://github.com/prettier/angular-html-parser/issues/54325)) ([f578889](https://github.com/prettier/angular-html-parser/commit/f578889ca2dbb22f2e050d4c4af6aa2d597bf70d))
* **compiler-cli:** consider the case of duplicate Angular decorators in local compilation diagnostics ([#54139](https://github.com/prettier/angular-html-parser/issues/54139)) ([4b1d948](https://github.com/prettier/angular-html-parser/commit/4b1d948b36285ec6d80dbe93e0b92133f9d4be94))
* **compiler-cli:** correctly detect deferred dependencies across scoped nodes ([#54499](https://github.com/prettier/angular-html-parser/issues/54499)) ([badda0c](https://github.com/prettier/angular-html-parser/commit/badda0c389a392b4c6ec5858614de9ec34c5ad80))
* **compiler-cli:** detect when the linker is working in unpublished angular and widen supported versions ([#54439](https://github.com/prettier/angular-html-parser/issues/54439)) ([da7fbb4](https://github.com/prettier/angular-html-parser/commit/da7fbb40f06e6e37504f69e7b335f8219f424de2))
* **compiler-cli:** do not error due to multiple components named equally ([#54273](https://github.com/prettier/angular-html-parser/issues/54273)) ([bfbb306](https://github.com/prettier/angular-html-parser/commit/bfbb30618b3204dc62f9fc36b82b98f307f1a6a2))
* **compiler-cli:** do not throw fatal error if extended type check fails ([#53896](https://github.com/prettier/angular-html-parser/issues/53896)) ([760b1f3](https://github.com/prettier/angular-html-parser/commit/760b1f3d0b857288980f2d9929147f331d657f7d))
* **compiler-cli:** do not throw when retrieving TCB symbol for signal input with restricted access ([#55774](https://github.com/prettier/angular-html-parser/issues/55774)) ([400911e](https://github.com/prettier/angular-html-parser/commit/400911e3b8d3c36ff788495bd7ecfd75b197c549)), closes [#54324](https://github.com/prettier/angular-html-parser/issues/54324)
* **compiler-cli:** dom property binding check in signal extended diagnostic ([#54324](https://github.com/prettier/angular-html-parser/issues/54324)) ([237eaca](https://github.com/prettier/angular-html-parser/commit/237eacae610764aa82114b3313c1587421a2d982))
* **compiler-cli:** don't type check the bodies of control flow nodes in basic mode ([#55360](https://github.com/prettier/angular-html-parser/issues/55360)) ([7a16d7e](https://github.com/prettier/angular-html-parser/commit/7a16d7e969eaf5a9475ffdd21a4bf637ce523856)), closes [#52969](https://github.com/prettier/angular-html-parser/issues/52969)
* **compiler-cli:** fix broken version detection condition ([#54443](https://github.com/prettier/angular-html-parser/issues/54443)) ([9ca8c68](https://github.com/prettier/angular-html-parser/commit/9ca8c6852896a21d8edfeb78dfb99a500e2dd281))
* **compiler-cli:** fix type narrowing of `[@if](https://github.com/if)` with aliases ([#55835](https://github.com/prettier/angular-html-parser/issues/55835)) ([9884875](https://github.com/prettier/angular-html-parser/commit/9884875c9698028c5788ad150239e4c52109b87d)), closes [#52855](https://github.com/prettier/angular-html-parser/issues/52855)
* **compiler-cli:** flag all conflicts between let declarations and local symbols ([#56752](https://github.com/prettier/angular-html-parser/issues/56752)) ([4d18c5b](https://github.com/prettier/angular-html-parser/commit/4d18c5bfd54c53655955c8cd90472081ade40b34))
* **compiler-cli:** flag two-way bindings to non-signal values in templates ([#54714](https://github.com/prettier/angular-html-parser/issues/54714)) ([ffb9b44](https://github.com/prettier/angular-html-parser/commit/ffb9b4433332e9e4f3f693001ef4541f022b85bc)), closes [#54154](https://github.com/prettier/angular-html-parser/issues/54154)
* **compiler-cli:** forbid custom/duplicate decorator when option `forbidOrphanComponents` is set ([#54139](https://github.com/prettier/angular-html-parser/issues/54139)) ([96bcf4f](https://github.com/prettier/angular-html-parser/commit/96bcf4fb1208d1f073784a2cde4a03553e905807))
* **compiler-cli:** generate less type checking code in for loops ([#53515](https://github.com/prettier/angular-html-parser/issues/53515)) ([9e54569](https://github.com/prettier/angular-html-parser/commit/9e5456912a699315f1f5e8458d35df946c01dc12))
* **compiler-cli:** generating extra imports in local compilation mode when cycle is introduced ([#53543](https://github.com/prettier/angular-html-parser/issues/53543)) ([64fa571](https://github.com/prettier/angular-html-parser/commit/64fa5715c696101fba0b4f8623eaec0eadc5b159))
* **compiler-cli:** handle default imports in defer blocks ([#53695](https://github.com/prettier/angular-html-parser/issues/53695)) ([95dcf5f](https://github.com/prettier/angular-html-parser/commit/95dcf5fafa1c48875b985968ad42edec3062fb6e))
* **compiler-cli:** highlight the unresolved element in the @Component.styles array for the error LOCAL_COMPILATION_UNRESOLVED_CONST ([#54230](https://github.com/prettier/angular-html-parser/issues/54230)) ([6c8b094](https://github.com/prettier/angular-html-parser/commit/6c8b09468a05a80cba3960861f0ab8d3bae80415))
* **compiler-cli:** identify aliased initializer functions ([#54480](https://github.com/prettier/angular-html-parser/issues/54480)) ([f04ecc0](https://github.com/prettier/angular-html-parser/commit/f04ecc0cdaeb3a292a748b1ccc94ce70a573fc79))
* **compiler-cli:** identify aliased initializer functions ([#54609](https://github.com/prettier/angular-html-parser/issues/54609)) ([f5c566c](https://github.com/prettier/angular-html-parser/commit/f5c566c0793eacf9ca146c8a6b8da15b0e8f4c4d))
* **compiler-cli:** incorrect inferred type of for loop implicit variables ([#52732](https://github.com/prettier/angular-html-parser/issues/52732)) ([645447d](https://github.com/prettier/angular-html-parser/commit/645447daff46526307fdcc0fb8271c0584503fa5)), closes [#52730](https://github.com/prettier/angular-html-parser/issues/52730)
* **compiler-cli:** input transform in local compilation mode ([#53645](https://github.com/prettier/angular-html-parser/issues/53645)) ([1a6eaa0](https://github.com/prettier/angular-html-parser/commit/1a6eaa0fea1024b919e17ac9d2e8c07df7916de8))
* **compiler-cli:** insert constant statements after the first group of imports ([#56431](https://github.com/prettier/angular-html-parser/issues/56431)) ([0b867e8](https://github.com/prettier/angular-html-parser/commit/0b867e83b624cbfe449ed3b7daf87642337824f0)), closes [#56403](https://github.com/prettier/angular-html-parser/issues/56403)
* **compiler-cli:** interpolatedSignalNotInvoked diagnostic ([#53585](https://github.com/prettier/angular-html-parser/issues/53585)) ([33b5707](https://github.com/prettier/angular-html-parser/commit/33b5707ee9e4539668398640f3fa8d2b5e20eb8b))
* **compiler-cli:** interpolatedSignalNotInvoked diagnostic for class, style, attribute and animation bindings ([#55969](https://github.com/prettier/angular-html-parser/issues/55969)) ([4ffa736](https://github.com/prettier/angular-html-parser/commit/4ffa73651c9fbfce1cc147e9f255106c12748576))
* **compiler-cli:** interpolatedSignalNotInvoked diagnostic for model signals ([#54338](https://github.com/prettier/angular-html-parser/issues/54338)) ([38b01a3](https://github.com/prettier/angular-html-parser/commit/38b01a3554a4833f5324cc21fc3a7ddb2099dff3))
* **compiler-cli:** preserve original reference to non-deferrable dependency ([#54759](https://github.com/prettier/angular-html-parser/issues/54759)) ([9b424d7](https://github.com/prettier/angular-html-parser/commit/9b424d7224db46edb16c81979c7e231d5e3db5e9))
* **compiler-cli:** properly catch fatal diagnostics in type checking ([#54309](https://github.com/prettier/angular-html-parser/issues/54309)) ([8e237a0](https://github.com/prettier/angular-html-parser/commit/8e237a016134bfbfd4f8a312531ff1376f4f4a36))
* **compiler-cli:** properly emit literal types in input coercion function arguments ([#52437](https://github.com/prettier/angular-html-parser/issues/52437)) ([0c7accf](https://github.com/prettier/angular-html-parser/commit/0c7accf92dd552abe90827f986a5e3c4ae08d85d)), closes [#51672](https://github.com/prettier/angular-html-parser/issues/51672)
* **compiler-cli:** report cases where initializer APIs are used in a non-directive class ([#54993](https://github.com/prettier/angular-html-parser/issues/54993)) ([694ba79](https://github.com/prettier/angular-html-parser/commit/694ba79cbf7aaed1079b1fabf53ea446162fc933))
* **compiler-cli:** report errors when initializer APIs are used on private fields ([#54981](https://github.com/prettier/angular-html-parser/issues/54981)) ([6219341](https://github.com/prettier/angular-html-parser/commit/6219341d267ae7689299835b90f0afa0fe61e213)), closes [#54863](https://github.com/prettier/angular-html-parser/issues/54863)
* **compiler-cli:** show proper error for custom decorators in local compilation mode ([#53983](https://github.com/prettier/angular-html-parser/issues/53983)) ([0970129](https://github.com/prettier/angular-html-parser/commit/0970129e20f77dc309f2b4f76f961b310124778c))
* **compiler-cli:** show specific error for unresolved @Directive.exportAs in local compilation mode ([#54230](https://github.com/prettier/angular-html-parser/issues/54230)) ([f39cb06](https://github.com/prettier/angular-html-parser/commit/f39cb064183d984254bdf4e41b61d3dc9379738a))
* **compiler-cli:** show specific error for unresolved @HostBinding's argument in local compilation mode ([#54230](https://github.com/prettier/angular-html-parser/issues/54230)) ([f3851b5](https://github.com/prettier/angular-html-parser/commit/f3851b59459a1d9c214ace3db5a716d51c1f93c7))
* **compiler-cli:** show specific error for unresolved @HostListener's event name in local compilation mode ([#54230](https://github.com/prettier/angular-html-parser/issues/54230)) ([39ddd88](https://github.com/prettier/angular-html-parser/commit/39ddd884e826cc0be63fd0f7d7de20d642877ef9))
* **compiler-cli:** Show template syntax errors in local compilation modified ([#55855](https://github.com/prettier/angular-html-parser/issues/55855)) ([9e21582](https://github.com/prettier/angular-html-parser/commit/9e215824565f0d30da7edb20087c4460069a6660))
* **compiler-cli:** show the correct message for the error LOCAL_COMPILATION_UNRESOLVED_CONST when an unresolved symbol used for @Component.styles ([#54230](https://github.com/prettier/angular-html-parser/issues/54230)) ([5d63324](https://github.com/prettier/angular-html-parser/commit/5d633240fd5927c4318a9240e60c3a30b2333cee))
* **compiler-cli:** support `ModuleWithProviders` literal detection with `typeof` ([#54650](https://github.com/prettier/angular-html-parser/issues/54650)) ([5afa4f0](https://github.com/prettier/angular-html-parser/commit/5afa4f0ec1b64b88ef875d48bd143e0f36e0a955))
* **compiler-cli:** support jumping to definitions of signal-based inputs ([#54053](https://github.com/prettier/angular-html-parser/issues/54053)) ([58b8a23](https://github.com/prettier/angular-html-parser/commit/58b8a232d64f5fe3207c90c8145cab36e7e192c2))
* **compiler-cli:** symbol feature detection for the compiler ([#54711](https://github.com/prettier/angular-html-parser/issues/54711)) ([6aff144](https://github.com/prettier/angular-html-parser/commit/6aff14423238f8995da8104e60c0baca26df2020))
* **compiler-cli:** type check let declarations nested inside nodes ([#56752](https://github.com/prettier/angular-html-parser/issues/56752)) ([5996502](https://github.com/prettier/angular-html-parser/commit/599650292107f8856c7cd41791bd0856f9d14eb1))
* **compiler-cli:** unwrap expressions with type parameters in query read property ([#54647](https://github.com/prettier/angular-html-parser/issues/54647)) ([ae7dbe4](https://github.com/prettier/angular-html-parser/commit/ae7dbe42de5779e578fb636938699b8ba85b33f6)), closes [#54645](https://github.com/prettier/angular-html-parser/issues/54645)
* **compiler-cli:** use correct symbol name for default imported symbols in defer blocks ([#54495](https://github.com/prettier/angular-html-parser/issues/54495)) ([0c8744c](https://github.com/prettier/angular-html-parser/commit/0c8744c73e3d8d68463f726c41b134223dc324b1)), closes [#53695](https://github.com/prettier/angular-html-parser/issues/53695) [#54491](https://github.com/prettier/angular-html-parser/issues/54491)
* **compiler-cli:** use originally used module specifier for transform functions ([#52437](https://github.com/prettier/angular-html-parser/issues/52437)) ([581eff4](https://github.com/prettier/angular-html-parser/commit/581eff4ab1c5f567692a14551e5059bca5a4d6b8)), closes [#52324](https://github.com/prettier/angular-html-parser/issues/52324)
* **compiler-cli:** use switch statements to narrow Angular switch blocks ([#55168](https://github.com/prettier/angular-html-parser/issues/55168)) ([c04ffb1](https://github.com/prettier/angular-html-parser/commit/c04ffb1fa61f5164ee5eb7c05b7d76292042ff0b))
* **compiler-cli:** used before declared diagnostic not firing for control flow blocks ([#56843](https://github.com/prettier/angular-html-parser/issues/56843)) ([d7ab5c3](https://github.com/prettier/angular-html-parser/commit/d7ab5c3a7bc575741450ae15b08201cfe42b423a)), closes [#56842](https://github.com/prettier/angular-html-parser/issues/56842)
* **compiler:** add math elements to schema ([#55631](https://github.com/prettier/angular-html-parser/issues/55631)) ([2e891ad](https://github.com/prettier/angular-html-parser/commit/2e891ad72a6dd4f7f0707a51990cff63ec02f4ce)), closes [#55608](https://github.com/prettier/angular-html-parser/issues/55608)
* **compiler:** adding the inert property to the "SCHEMA" array ([#53148](https://github.com/prettier/angular-html-parser/issues/53148)) ([dba3e0b](https://github.com/prettier/angular-html-parser/commit/dba3e0b5aa73d49a6caad4ad474e0212486fe98a)), closes [#51879](https://github.com/prettier/angular-html-parser/issues/51879)
* **compiler:** allow comments between connected blocks ([#55966](https://github.com/prettier/angular-html-parser/issues/55966)) ([08523ec](https://github.com/prettier/angular-html-parser/commit/08523ec650e8b091ba6217b3928d05ce73a559a9)), closes [#55954](https://github.com/prettier/angular-html-parser/issues/55954)
* **compiler:** allow comments between switch cases ([#52449](https://github.com/prettier/angular-html-parser/issues/52449)) ([5f528bf](https://github.com/prettier/angular-html-parser/commit/5f528bfb41a113e79d30e56b696e1fb06e7391d3)), closes [#52421](https://github.com/prettier/angular-html-parser/issues/52421)
* **compiler:** allow decimals in defer block time values ([#52433](https://github.com/prettier/angular-html-parser/issues/52433)) ([d7c4f56](https://github.com/prettier/angular-html-parser/commit/d7c4f569f46ef42d6ebb33704cda0a7b314176d2))
* **compiler:** allow more characters in let declaration name ([#56764](https://github.com/prettier/angular-html-parser/issues/56764)) ([341a116](https://github.com/prettier/angular-html-parser/commit/341a116d611c095ed414c82612adb529e7be310c))
* **compiler:** allow TS jsDocParsingMode host option to be programmatically set ([#53126](https://github.com/prettier/angular-html-parser/issues/53126)) ([79ff91a](https://github.com/prettier/angular-html-parser/commit/79ff91a813e544929cb5eb5f9aab762a9f3d0435))
* **compiler:** allow TS jsDocParsingMode host option to be programmatically set again ([#53292](https://github.com/prettier/angular-html-parser/issues/53292)) ([5613051](https://github.com/prettier/angular-html-parser/commit/5613051a8bd2626ae347292807b2bf21085c4c02)), closes [#53126](https://github.com/prettier/angular-html-parser/issues/53126)
* **compiler:** capture all control flow branches for content projection in if blocks ([#54921](https://github.com/prettier/angular-html-parser/issues/54921)) ([7fc7f3f](https://github.com/prettier/angular-html-parser/commit/7fc7f3f05f0139dd773032fd5ad308f8d2a9fcf5))
* **compiler:** capture data bindings for content projection purposes in blocks ([#54876](https://github.com/prettier/angular-html-parser/issues/54876)) ([879bd80](https://github.com/prettier/angular-html-parser/commit/879bd80b571368bdc6e65c5415d98ad0f546267a)), closes [#54872](https://github.com/prettier/angular-html-parser/issues/54872)
* **compiler:** capture switch block cases for content projection ([#54921](https://github.com/prettier/angular-html-parser/issues/54921)) ([a369f43](https://github.com/prettier/angular-html-parser/commit/a369f43fbdf45456bbae1caf71ef7becd15d1e90))
* **compiler:** changed after checked error in for loops ([#52935](https://github.com/prettier/angular-html-parser/issues/52935)) ([ec2d6e7](https://github.com/prettier/angular-html-parser/commit/ec2d6e7b9c2b386247d1320ee89f8e3ac5e5a0dd)), closes [#52885](https://github.com/prettier/angular-html-parser/issues/52885)
* **compiler:** compilation error when for loop block expression contains new line ([#52447](https://github.com/prettier/angular-html-parser/issues/52447)) ([b5ef68f](https://github.com/prettier/angular-html-parser/commit/b5ef68ff0fcf3d31fe3cbe60724d836f685c5a70)), closes [#52446](https://github.com/prettier/angular-html-parser/issues/52446)
* **compiler:** correctly intercept index in loop tracking function ([#53604](https://github.com/prettier/angular-html-parser/issues/53604)) ([3a689c2](https://github.com/prettier/angular-html-parser/commit/3a689c20509ed5972b3831988fc0014d293d0cc3)), closes [#53600](https://github.com/prettier/angular-html-parser/issues/53600)
* **compiler:** declare for loop aliases in addition to new name ([#54942](https://github.com/prettier/angular-html-parser/issues/54942)) ([eb625d3](https://github.com/prettier/angular-html-parser/commit/eb625d37839c3b9f20a2ffb3af06426f9910c8ac)), closes [#52528](https://github.com/prettier/angular-html-parser/issues/52528)
* **compiler:** fix CSS animation rule scope ([#56800](https://github.com/prettier/angular-html-parser/issues/56800)) ([387e1cb](https://github.com/prettier/angular-html-parser/commit/387e1cbf89f4b893c88bf7996e60a692c1ae4615)), closes [#53038](https://github.com/prettier/angular-html-parser/issues/53038)
* **compiler:** Fix the template pipeline option ([#54148](https://github.com/prettier/angular-html-parser/issues/54148)) ([7b4d275](https://github.com/prettier/angular-html-parser/commit/7b4d275f494a64c38b61cea7045ba8b6e8447b78))
* **compiler:** For `FatalDiagnosticError`, hide the `message` field without affecting the emit ([#55160](https://github.com/prettier/angular-html-parser/issues/55160)) ([f824911](https://github.com/prettier/angular-html-parser/commit/f8249115102204dbb957a0d292ed5342ea5108e9))
* **compiler:** generate i18n instructions for blocks ([#52958](https://github.com/prettier/angular-html-parser/issues/52958)) ([406049b](https://github.com/prettier/angular-html-parser/commit/406049b95e5234f17a7a18839ac848640f53fdde)), closes [#52540](https://github.com/prettier/angular-html-parser/issues/52540) [#52767](https://github.com/prettier/angular-html-parser/issues/52767)
* **compiler:** generate less code for advance instructions ([#53845](https://github.com/prettier/angular-html-parser/issues/53845)) ([2dedc4a](https://github.com/prettier/angular-html-parser/commit/2dedc4a96968e3d5ed3541b1eac54707f7b24c87))
* **compiler:** generate proper code for nullish coalescing in styling host bindings ([#53305](https://github.com/prettier/angular-html-parser/issues/53305)) ([77ac4cd](https://github.com/prettier/angular-html-parser/commit/77ac4cd32491d0c994cb4ea50372601c955cec3d)), closes [#53295](https://github.com/prettier/angular-html-parser/issues/53295)
* **compiler:** give precedence to local let declarations over parent ones ([#56752](https://github.com/prettier/angular-html-parser/issues/56752)) ([2a1291e](https://github.com/prettier/angular-html-parser/commit/2a1291e942a3cd645ee635e72e7d83722383d39b)), closes [#56737](https://github.com/prettier/angular-html-parser/issues/56737)
* **compiler:** handle ambient types in input transform function ([#51474](https://github.com/prettier/angular-html-parser/issues/51474)) ([b98d8f7](https://github.com/prettier/angular-html-parser/commit/b98d8f79ed4979fb91661dbdfb6266a917b41474)), closes [#51424](https://github.com/prettier/angular-html-parser/issues/51424)
* **compiler:** handle two-way bindings to signal-based template variables in instruction generation ([#54714](https://github.com/prettier/angular-html-parser/issues/54714)) ([5ae2bf4](https://github.com/prettier/angular-html-parser/commit/5ae2bf480697b475c41ea136f08f4dca633c75b9)), closes [#54670](https://github.com/prettier/angular-html-parser/issues/54670)
* **compiler:** ignore empty switch blocks ([#53776](https://github.com/prettier/angular-html-parser/issues/53776)) ([e5f0205](https://github.com/prettier/angular-html-parser/commit/e5f02052cbd49ea793aedc56d622dde99f24240f)), closes [#53773](https://github.com/prettier/angular-html-parser/issues/53773)
* **compiler:** invoke method-based tracking function with context ([#54960](https://github.com/prettier/angular-html-parser/issues/54960)) ([bfd0bd5](https://github.com/prettier/angular-html-parser/commit/bfd0bd574e9a2e1489a007393caae266512c0f04)), closes [#53628](https://github.com/prettier/angular-html-parser/issues/53628)
* **compiler:** maintain multiline CSS selectors during CSS scoping ([#55509](https://github.com/prettier/angular-html-parser/issues/55509)) ([3e1d6e9](https://github.com/prettier/angular-html-parser/commit/3e1d6e9d6e10edaf54599c8291e00d0f7ec520f4)), closes [#55508](https://github.com/prettier/angular-html-parser/issues/55508)
* **compiler:** nested for loops incorrectly calculating computed variables ([#52931](https://github.com/prettier/angular-html-parser/issues/52931)) ([d9d566d](https://github.com/prettier/angular-html-parser/commit/d9d566d31540582d73201675d0b8ed901261669e)), closes [#52917](https://github.com/prettier/angular-html-parser/issues/52917)
* **compiler:** ng-template directive invoke twice at the root of control flow ([#52515](https://github.com/prettier/angular-html-parser/issues/52515)) ([9cfd35a](https://github.com/prettier/angular-html-parser/commit/9cfd35a594d45d4cd85008f664712739c51512d0)), closes [#52414](https://github.com/prettier/angular-html-parser/issues/52414)
* **compiler:** not catching for loop empty tracking expressions ([#54772](https://github.com/prettier/angular-html-parser/issues/54772)) ([81ccf5d](https://github.com/prettier/angular-html-parser/commit/81ccf5d1021df72fc03560bf6c1ec1ceb44e7dd0)), closes [#54763](https://github.com/prettier/angular-html-parser/issues/54763)
* **compiler:** optimize track function that only passes $index ([#55872](https://github.com/prettier/angular-html-parser/issues/55872)) ([6aeea69](https://github.com/prettier/angular-html-parser/commit/6aeea69d5b68f49ef18a0062044a0b240dbea966))
* **compiler:** output input flags as a literal ([#55215](https://github.com/prettier/angular-html-parser/issues/55215)) ([39624c6](https://github.com/prettier/angular-html-parser/commit/39624c6b129252af352c22c6d6f12ef153477bfc))
* **compiler:** prevent usage of reserved control flow symbol in custom interpolation context. ([#55809](https://github.com/prettier/angular-html-parser/issues/55809)) ([2bb12ac](https://github.com/prettier/angular-html-parser/commit/2bb12ac02f8a0f766f6a38d4f3704eaebe58d402))
* **compiler:** produce placeholder for blocks in i18n bundles ([#52958](https://github.com/prettier/angular-html-parser/issues/52958)) ([5fb707f](https://github.com/prettier/angular-html-parser/commit/5fb707f81aee43751e61d2ed0861afc9b85bc85a))
* **compiler:** project control flow root elements into correct slot ([#52414](https://github.com/prettier/angular-html-parser/issues/52414)) ([eb15358](https://github.com/prettier/angular-html-parser/commit/eb153584791a30a015469269a62fc9eb43dbf16a)), closes [#1](https://github.com/prettier/angular-html-parser/issues/1) [#52277](https://github.com/prettier/angular-html-parser/issues/52277)
* **compiler:** project empty block root node ([#53620](https://github.com/prettier/angular-html-parser/issues/53620)) ([df8a825](https://github.com/prettier/angular-html-parser/commit/df8a825910951bebf34a4eede42f3ce5cd3e6fb7)), closes [#52414](https://github.com/prettier/angular-html-parser/issues/52414) [#53570](https://github.com/prettier/angular-html-parser/issues/53570)
* **compiler:** project empty block root node in template pipeline ([#53620](https://github.com/prettier/angular-html-parser/issues/53620)) ([478d622](https://github.com/prettier/angular-html-parser/commit/478d6222650884478314985e3d5132587c4f670c))
* **compiler:** remove container index from conditional instruction ([#55190](https://github.com/prettier/angular-html-parser/issues/55190)) ([7d5bc1c](https://github.com/prettier/angular-html-parser/commit/7d5bc1c62870d9c68e06eddec229a9b8988e92ee))
* **compiler:** remove support for unassignable expressions in two-way bindings ([#55342](https://github.com/prettier/angular-html-parser/issues/55342)) ([4eb0165](https://github.com/prettier/angular-html-parser/commit/4eb0165750d8c65812502343a70ef4cc35c725b9)), closes [#54154](https://github.com/prettier/angular-html-parser/issues/54154)
* **compiler:** throw error if item name and context variables conflict ([#55045](https://github.com/prettier/angular-html-parser/issues/55045)) ([e1650e3](https://github.com/prettier/angular-html-parser/commit/e1650e3b13556ab09c919cfdf97913fa0291622c))
* **compiler:** Update type check block to fix control flow source mappings ([#53980](https://github.com/prettier/angular-html-parser/issues/53980)) ([eddf5da](https://github.com/prettier/angular-html-parser/commit/eddf5dae5eb9e1aa3ca4c276c2cb2b897b73a9e0))
* **core:** `afterRender` hooks now only run on `ApplicationRef.tick` ([#52455](https://github.com/prettier/angular-html-parser/issues/52455)) ([dfcf0d5](https://github.com/prettier/angular-html-parser/commit/dfcf0d5882c1ef74c6fc5038bfbd736ac887f9cc)), closes [#52429](https://github.com/prettier/angular-html-parser/issues/52429) [#53232](https://github.com/prettier/angular-html-parser/issues/53232)
* **core:** `afterRender` hooks should allow updating state ([#54074](https://github.com/prettier/angular-html-parser/issues/54074)) ([432afd1](https://github.com/prettier/angular-html-parser/commit/432afd1ef41e0bfd905e71e8b15ec7c9ab337352))
* **core:** `ApplicationRef.tick` should respect OnPush for host bindings ([#53718](https://github.com/prettier/angular-html-parser/issues/53718)) ([d888da4](https://github.com/prettier/angular-html-parser/commit/d888da460696ee74bb4c10a19ac49e3fa1948399))
* **core:** `ApplicationRef.tick` should respect OnPush for host bindings ([#53718](https://github.com/prettier/angular-html-parser/issues/53718)) ([#53718](https://github.com/prettier/angular-html-parser/issues/53718)) ([64f870c](https://github.com/prettier/angular-html-parser/commit/64f870c12bae1ad66509f0d65f8d3e051aae6eaa))
* **core:** `ComponentFixture` `autoDetect` respects `OnPush` flag of host view ([#54824](https://github.com/prettier/angular-html-parser/issues/54824)) ([8cad4e8](https://github.com/prettier/angular-html-parser/commit/8cad4e8cbe2baf20dae7b7ef1f4253a4940cbba0)), closes [#53718](https://github.com/prettier/angular-html-parser/issues/53718)
* **core:** `ComponentFixture` stability should match `ApplicationRef` ([#54949](https://github.com/prettier/angular-html-parser/issues/54949)) ([658cf8c](https://github.com/prettier/angular-html-parser/commit/658cf8c3840b637284a5bb6c9751226d24ccbf9f))
* **core:** `SignalNode` reactive node incorrectly exposing unset field ([#53571](https://github.com/prettier/angular-html-parser/issues/53571)) ([69b384c](https://github.com/prettier/angular-html-parser/commit/69b384c0d16f631741339d8757c32ef08260cfce))
* **core:** account for re-projected ng-content elements with fallback content ([#54854](https://github.com/prettier/angular-html-parser/issues/54854)) ([2fc11ea](https://github.com/prettier/angular-html-parser/commit/2fc11eae9ea65160866bf7ba46c10520ae9a141f))
* **core:** add `rejectErrors` option to `toSignal` ([#52474](https://github.com/prettier/angular-html-parser/issues/52474)) ([7bb3ffb](https://github.com/prettier/angular-html-parser/commit/7bb3ffb77f514f0ab67ebbb8b0b4ad376a0d7b38)), closes [#51949](https://github.com/prettier/angular-html-parser/issues/51949)
* **core:** Add back phase flag option as a deprecated API ([#55648](https://github.com/prettier/angular-html-parser/issues/55648)) ([38effcc](https://github.com/prettier/angular-html-parser/commit/38effcc63eea360e948dc22860add72d3aa02288))
* **core:** add toString implementation to signals ([#54002](https://github.com/prettier/angular-html-parser/issues/54002)) ([656bc28](https://github.com/prettier/angular-html-parser/commit/656bc282e345c5e37a9189a0a4daa631e02c31bf))
* **core:** add warning when using zoneless but zone.js is still loaded ([#55769](https://github.com/prettier/angular-html-parser/issues/55769)) ([ae0baa2](https://github.com/prettier/angular-html-parser/commit/ae0baa25228d679c7a4df6950676b39417ad2f1a))
* **core:** afterRender hooks registered outside change detection can mark views dirty ([#55623](https://github.com/prettier/angular-html-parser/issues/55623)) ([7c1b4a4](https://github.com/prettier/angular-html-parser/commit/7c1b4a49ae3f99b775dc786666bd14997fa43438))
* **core:** allow effect to be used inside an ErrorHandler ([#53713](https://github.com/prettier/angular-html-parser/issues/53713)) ([2b9a850](https://github.com/prettier/angular-html-parser/commit/2b9a8507896a2dd1a13187c2b10f6f535cb8c001)), closes [#52680](https://github.com/prettier/angular-html-parser/issues/52680)
* **core:** Angular should not ignore changes that happen outside the zone ([#55102](https://github.com/prettier/angular-html-parser/issues/55102)) ([de7447d](https://github.com/prettier/angular-html-parser/commit/de7447d15ed964ae26f0dace4cb3b08f5cccb1c1)), closes [#55238](https://github.com/prettier/angular-html-parser/issues/55238) [#53844](https://github.com/prettier/angular-html-parser/issues/53844) [#53841](https://github.com/prettier/angular-html-parser/issues/53841) [#52610](https://github.com/prettier/angular-html-parser/issues/52610) [#53566](https://github.com/prettier/angular-html-parser/issues/53566) [#52940](https://github.com/prettier/angular-html-parser/issues/52940) [#51970](https://github.com/prettier/angular-html-parser/issues/51970) [#51768](https://github.com/prettier/angular-html-parser/issues/51768) [#50702](https://github.com/prettier/angular-html-parser/issues/50702) [#50259](https://github.com/prettier/angular-html-parser/issues/50259) [#50266](https://github.com/prettier/angular-html-parser/issues/50266) [#50160](https://github.com/prettier/angular-html-parser/issues/50160) [#49940](https://github.com/prettier/angular-html-parser/issues/49940) [#49398](https://github.com/prettier/angular-html-parser/issues/49398) [#48890](https://github.com/prettier/angular-html-parser/issues/48890) [#48608](https://github.com/prettier/angular-html-parser/issues/48608) [#45105](https://github.com/prettier/angular-html-parser/issues/45105) [#42241](https://github.com/prettier/angular-html-parser/issues/42241) [#41553](https://github.com/prettier/angular-html-parser/issues/41553) [#37223](https://github.com/prettier/angular-html-parser/issues/37223) [#37062](https://github.com/prettier/angular-html-parser/issues/37062) [#35579](https://github.com/prettier/angular-html-parser/issues/35579) [#31695](https://github.com/prettier/angular-html-parser/issues/31695) [#24728](https://github.com/prettier/angular-html-parser/issues/24728) [#23697](https://github.com/prettier/angular-html-parser/issues/23697) [#19814](https://github.com/prettier/angular-html-parser/issues/19814) [#13957](https://github.com/prettier/angular-html-parser/issues/13957) [#11565](https://github.com/prettier/angular-html-parser/issues/11565) [#15770](https://github.com/prettier/angular-html-parser/issues/15770) [#15946](https://github.com/prettier/angular-html-parser/issues/15946) [#18254](https://github.com/prettier/angular-html-parser/issues/18254) [#19731](https://github.com/prettier/angular-html-parser/issues/19731) [#20112](https://github.com/prettier/angular-html-parser/issues/20112) [#22472](https://github.com/prettier/angular-html-parser/issues/22472) [#23697](https://github.com/prettier/angular-html-parser/issues/23697) [#24727](https://github.com/prettier/angular-html-parser/issues/24727) [#47236](https://github.com/prettier/angular-html-parser/issues/47236)
* **core:** apply TestBed provider overrides to `[@defer](https://github.com/defer)` dependencies ([#54667](https://github.com/prettier/angular-html-parser/issues/54667)) ([33a6fab](https://github.com/prettier/angular-html-parser/commit/33a6fab094205cc74aceb916e45c8afa22293cf4))
* **core:** async EventEmitter should contribute to app stability ([#56308](https://github.com/prettier/angular-html-parser/issues/56308)) ([d5c6ee4](https://github.com/prettier/angular-html-parser/commit/d5c6ee432fcd467c09b4d5d5366e731f5c91e8d4)), closes [#56290](https://github.com/prettier/angular-html-parser/issues/56290)
* **core:** Avoid refreshing a host view twice when using transplanted views ([#53021](https://github.com/prettier/angular-html-parser/issues/53021)) ([2565121](https://github.com/prettier/angular-html-parser/commit/25651218512becb3a491b1c94d643a5066a6d3cb))
* **core:** avoid repeated work when parsing version ([#53598](https://github.com/prettier/angular-html-parser/issues/53598)) ([aecb675](https://github.com/prettier/angular-html-parser/commit/aecb675fa5059e510e0223e00fa114d92e799b04))
* **core:** avoid stale provider info when TestBed.overrideProvider is used ([#52918](https://github.com/prettier/angular-html-parser/issues/52918)) ([58cf389](https://github.com/prettier/angular-html-parser/commit/58cf389d8095dd522a998b6b9a7d7b8da1656644))
* **core:** Change defer block fixture default behavior to playthrough ([#53956](https://github.com/prettier/angular-html-parser/issues/53956)) ([df6c205](https://github.com/prettier/angular-html-parser/commit/df6c2057f2b4617e3c40cea4682b41d73fcff72b)), closes [#53686](https://github.com/prettier/angular-html-parser/issues/53686)
* **core:** change defer block fixture default behavior to playthrough ([#54088](https://github.com/prettier/angular-html-parser/issues/54088)) ([037b79b](https://github.com/prettier/angular-html-parser/commit/037b79b72ea18f08b3a74f9ad541bbdca183b1aa)), closes [#53956](https://github.com/prettier/angular-html-parser/issues/53956)
* **core:** Change Detection will continue to refresh views while marked for check ([#54734](https://github.com/prettier/angular-html-parser/issues/54734)) ([ba8e465](https://github.com/prettier/angular-html-parser/commit/ba8e46597435a827670f10b971b2c58f7033b180))
* **core:** cleanup loading promise when no dependencies are defined ([#53031](https://github.com/prettier/angular-html-parser/issues/53031)) ([ed0fbd4](https://github.com/prettier/angular-html-parser/commit/ed0fbd4071339b1af22d82bac07d51c6c41790cd))
* **core:** cleanup signal consumers for all views ([#53351](https://github.com/prettier/angular-html-parser/issues/53351)) ([77939a3](https://github.com/prettier/angular-html-parser/commit/77939a3bd39073d07e24797a4632ec2d2a6b92e0))
* **core:** collect providers from NgModules while rendering `[@defer](https://github.com/defer)` block ([#52881](https://github.com/prettier/angular-html-parser/issues/52881)) ([dcb9deb](https://github.com/prettier/angular-html-parser/commit/dcb9deb3631ff4e839f738f2fb97ca6b894256ef)), closes [#52876](https://github.com/prettier/angular-html-parser/issues/52876)
* **core:** complete the removal of deprecation `async` function ([#55491](https://github.com/prettier/angular-html-parser/issues/55491)) ([5a10f40](https://github.com/prettier/angular-html-parser/commit/5a10f405d315a28b9a000c669e9b1cb3fa24a7f1))
* **core:** ComponentFixture autodetect should detect changes within ApplicationRef.tick ([#54733](https://github.com/prettier/angular-html-parser/issues/54733)) ([24bc0ed](https://github.com/prettier/angular-html-parser/commit/24bc0ed4f2de47bd998338d73cba394fb45dd497))
* **core:** correctly project single-root content inside control flow ([#54921](https://github.com/prettier/angular-html-parser/issues/54921)) ([1c0ec56](https://github.com/prettier/angular-html-parser/commit/1c0ec56c462cf18fb38aae29858165a08b5a2a82)), closes [#54840](https://github.com/prettier/angular-html-parser/issues/54840)
* **core:** DeferBlockFixture.render should not wait for stability ([#55271](https://github.com/prettier/angular-html-parser/issues/55271)) ([c175bca](https://github.com/prettier/angular-html-parser/commit/c175bca36432b26851adb4ea9d850c2d07fba864)), closes [#55235](https://github.com/prettier/angular-html-parser/issues/55235)
* **core:** do not accidentally inherit input transforms when overridden ([#53571](https://github.com/prettier/angular-html-parser/issues/53571)) ([32f908a](https://github.com/prettier/angular-html-parser/commit/32f908ab70f1b9ed3f92df1cae05ddde68932404))
* **core:** do not activate event replay when no events are registered ([#56509](https://github.com/prettier/angular-html-parser/issues/56509)) ([bf6df6f](https://github.com/prettier/angular-html-parser/commit/bf6df6f18658dd0d477271f7eb969317ce1df024)), closes [#56423](https://github.com/prettier/angular-html-parser/issues/56423)
* **core:** do not crash for signal query that does not have any matches ([#54353](https://github.com/prettier/angular-html-parser/issues/54353)) ([abf6371](https://github.com/prettier/angular-html-parser/commit/abf637165b8705b614546067c7f409dca08b2635))
* **core:** Do not migrate `HttpClientModule` imports on components. ([#56067](https://github.com/prettier/angular-html-parser/issues/56067)) ([8d75627](https://github.com/prettier/angular-html-parser/commit/8d75627dddb82380dc8b3455a13f128e88309aa6))
* **core:** do not save point-in-time `setTimeout` and `rAF` references ([#55124](https://github.com/prettier/angular-html-parser/issues/55124)) ([840c375](https://github.com/prettier/angular-html-parser/commit/840c375255dc381674bb27746d9ababd14567c33))
* **core:** don't coerce all producers to consumers on liveness change ([#56140](https://github.com/prettier/angular-html-parser/issues/56140)) ([1081c8d](https://github.com/prettier/angular-html-parser/commit/1081c8d6233ba1ff09187b95a09b0644e130cdf8))
* **core:** don't schedule timer triggers on the server ([#55605](https://github.com/prettier/angular-html-parser/issues/55605)) ([a0ec2d8](https://github.com/prettier/angular-html-parser/commit/a0ec2d8915ca408d1bb415a0da0180c34c4a9f51)), closes [#55475](https://github.com/prettier/angular-html-parser/issues/55475)
* **core:** effects wait for ngOnInit for their first run ([#52473](https://github.com/prettier/angular-html-parser/issues/52473)) ([ee9605f](https://github.com/prettier/angular-html-parser/commit/ee9605f3c858c3f3cc2268fe554e45866c3b0859))
* **core:** ensure all initializer functions run in an injection context ([#54761](https://github.com/prettier/angular-html-parser/issues/54761)) ([018f826](https://github.com/prettier/angular-html-parser/commit/018f8266b3ceece8144aeebe31454cd75f046381))
* **core:** ensure change detection runs in a reasonable timeframe with zone coalescing ([#54578](https://github.com/prettier/angular-html-parser/issues/54578)) ([10c5cdb](https://github.com/prettier/angular-html-parser/commit/10c5cdb49c51c95086febd37f4d88a9b944d7e1c)), closes [#54544](https://github.com/prettier/angular-html-parser/issues/54544) [#44314](https://github.com/prettier/angular-html-parser/issues/44314) [#39854](https://github.com/prettier/angular-html-parser/issues/39854)
* **core:** Ensure views marked for check are refreshed during change detection ([#54735](https://github.com/prettier/angular-html-parser/issues/54735)) ([ad045ef](https://github.com/prettier/angular-html-parser/commit/ad045efd4b1565e01c14399998143538ebfbfd99)), closes [#52928](https://github.com/prettier/angular-html-parser/issues/52928) [#15634](https://github.com/prettier/angular-html-parser/issues/15634)
* **core:** error about provideExperimentalCheckNoChangesForDebug uses wrong name ([#55824](https://github.com/prettier/angular-html-parser/issues/55824)) ([3d5c3d9](https://github.com/prettier/angular-html-parser/commit/3d5c3d9fffa52e39f7e8bf34eb5475d955face54))
* **core:** error code in image performance warning ([#52727](https://github.com/prettier/angular-html-parser/issues/52727)) ([cc68b0e](https://github.com/prettier/angular-html-parser/commit/cc68b0e9f5e77bb309288dc59fb907d4686c337f))
* **core:** establish proper defer injector hierarchy for components attached to ApplicationRef ([#56763](https://github.com/prettier/angular-html-parser/issues/56763)) ([00d9cd2](https://github.com/prettier/angular-html-parser/commit/00d9cd240d4eaa46eb3335b990e123a9bdd371a3)), closes [#56372](https://github.com/prettier/angular-html-parser/issues/56372)
* **core:** establish proper injector resolution order for `[@defer](https://github.com/defer)` blocks ([#55079](https://github.com/prettier/angular-html-parser/issues/55079)) ([86a359b](https://github.com/prettier/angular-html-parser/commit/86a359b399456e62335a0bcfe7c7fb48b7c2b781)), closes [#54864](https://github.com/prettier/angular-html-parser/issues/54864) [#55028](https://github.com/prettier/angular-html-parser/issues/55028) [#55036](https://github.com/prettier/angular-html-parser/issues/55036)
* **core:** exclude class attribute intended for projection matching from directive matching ([#54800](https://github.com/prettier/angular-html-parser/issues/54800)) ([e6ee6d2](https://github.com/prettier/angular-html-parser/commit/e6ee6d25f93e031db02e2ef38ab2650f0ba49936)), closes [#54798](https://github.com/prettier/angular-html-parser/issues/54798)
* **core:** exhaustive checkNoChanges should only do a single pass ([#55839](https://github.com/prettier/angular-html-parser/issues/55839)) ([cae0d31](https://github.com/prettier/angular-html-parser/commit/cae0d3167daa5a166380256d34a0d1aab5d1ac50))
* **core:** expose model signal subcribe for type checking purposes ([#54357](https://github.com/prettier/angular-html-parser/issues/54357)) ([dab5fc3](https://github.com/prettier/angular-html-parser/commit/dab5fc30ee6be4ce88a919478d07159f4ac85b81))
* **core:** Fix clearing of pending task in zoneless cleanup implementation ([#55074](https://github.com/prettier/angular-html-parser/issues/55074)) ([e02bcf8](https://github.com/prettier/angular-html-parser/commit/e02bcf89cf77c3118c649a7db68e66a78f16155c)), closes [#54952](https://github.com/prettier/angular-html-parser/issues/54952)
* **core:** Fix null dereference error `addEvent` ([#55353](https://github.com/prettier/angular-html-parser/issues/55353)) ([0cec9e4](https://github.com/prettier/angular-html-parser/commit/0cec9e4f9a90ec59f0e9838dcbd82705b1709fc0))
* **core:** Fix possible infinite loop with `markForCheck` by partially reverting [#54074](https://github.com/prettier/angular-html-parser/issues/54074) ([#54329](https://github.com/prettier/angular-html-parser/issues/54329)) ([898a532](https://github.com/prettier/angular-html-parser/commit/898a532aef4121757125e8bcb5909cbbe8142991))
* **core:** Fix shouldPreventDefaultBeforeDispatching bug ([#56188](https://github.com/prettier/angular-html-parser/issues/56188)) ([b6fb53c](https://github.com/prettier/angular-html-parser/commit/b6fb53cdc7c9f9dad5a113a68e72a2b723626bef))
* **core:** fix typo in injectors.svg file ([#54596](https://github.com/prettier/angular-html-parser/issues/54596)) ([ff40c9f](https://github.com/prettier/angular-html-parser/commit/ff40c9f762b2c14870ac2859201ece9660087e79)), closes [#54592](https://github.com/prettier/angular-html-parser/issues/54592)
* **core:** generic inference for signal inputs may break with `--strictFunctionTypes` ([#54652](https://github.com/prettier/angular-html-parser/issues/54652)) ([78e6911](https://github.com/prettier/angular-html-parser/commit/78e69117f07e8ae11aab3abe0343df815b3649be))
* **core:** guard usages of `performance.mark` ([#52505](https://github.com/prettier/angular-html-parser/issues/52505)) ([93d32a9](https://github.com/prettier/angular-html-parser/commit/93d32a9acb210c55971edad9b44df5d203aedfc2))
* **core:** handle `ChainedInjector`s in injector debug utils ([#55144](https://github.com/prettier/angular-html-parser/issues/55144)) ([231e0a3](https://github.com/prettier/angular-html-parser/commit/231e0a3528e152cb1de3a215d437f5104191445c)), closes [#55079](https://github.com/prettier/angular-html-parser/issues/55079) [#55137](https://github.com/prettier/angular-html-parser/issues/55137)
* **core:** handle aliased index with no space in control flow migration ([#52444](https://github.com/prettier/angular-html-parser/issues/52444)) ([c5980d6](https://github.com/prettier/angular-html-parser/commit/c5980d6b5f26b2a819330e1f276d349bd7948039))
* **core:** handle elements with local refs in event replay serialization logic ([#56076](https://github.com/prettier/angular-html-parser/issues/56076)) ([ae83646](https://github.com/prettier/angular-html-parser/commit/ae83646704b9f696c26537d8f545d7d8d422802f)), closes [#56073](https://github.com/prettier/angular-html-parser/issues/56073)
* **core:** handle hydration of multiple nodes projected in a single slot ([#53270](https://github.com/prettier/angular-html-parser/issues/53270)) ([899f6c4](https://github.com/prettier/angular-html-parser/commit/899f6c4a12127f87aeedf47ee128ce949ebe717c)), closes [#53246](https://github.com/prettier/angular-html-parser/issues/53246)
* **core:** handle local refs when `getDeferBlocks` is invoked in tests ([#52973](https://github.com/prettier/angular-html-parser/issues/52973)) ([1ce31d8](https://github.com/prettier/angular-html-parser/commit/1ce31d819b2e4f4425a41f07167a6edce98e77e1))
* **core:** handle missing `withI18nSupport()` call for components that use i18n blocks ([#56175](https://github.com/prettier/angular-html-parser/issues/56175)) ([31f3975](https://github.com/prettier/angular-html-parser/commit/31f3975e4b1f418c1a6b2516618f44093ba20175)), closes [#56074](https://github.com/prettier/angular-html-parser/issues/56074)
* **core:** handle non-container environment injector cases ([#52774](https://github.com/prettier/angular-html-parser/issues/52774)) ([6aef0f6](https://github.com/prettier/angular-html-parser/commit/6aef0f6fc880d6eafa65c41ae72ce41c4c83f0fa))
* **core:** hide implementation details of ExperimentalPendingTasks ([#55516](https://github.com/prettier/angular-html-parser/issues/55516)) ([90389ad](https://github.com/prettier/angular-html-parser/commit/90389add7a786a5bc0506c3cf5c3b10259fe7e83))
* **core:** improve docs on afterRender hooks ([#56522](https://github.com/prettier/angular-html-parser/issues/56522)) ([86bcfd3](https://github.com/prettier/angular-html-parser/commit/86bcfd3e498b8ec1de1a2a1ad0847fe567f7e9d4))
* **core:** improve support for i18n hydration of projected content ([#56192](https://github.com/prettier/angular-html-parser/issues/56192)) ([29ca6d1](https://github.com/prettier/angular-html-parser/commit/29ca6d10cc3cd75ebdf64658dafcb3ce579af343))
* **core:** inherit host directives ([#52992](https://github.com/prettier/angular-html-parser/issues/52992)) ([c7c7ea9](https://github.com/prettier/angular-html-parser/commit/c7c7ea9813f6dcf91c096bb37d36bfe0c715a04f)), closes [#51203](https://github.com/prettier/angular-html-parser/issues/51203)
* **core:** limit rate of markers invocations ([#52742](https://github.com/prettier/angular-html-parser/issues/52742)) ([6c8776f](https://github.com/prettier/angular-html-parser/commit/6c8776ff7102d87e00ea2c28f1517654f7386dd7)), closes [#52524](https://github.com/prettier/angular-html-parser/issues/52524)
* **core:** link errors to ADEV ([#55554](https://github.com/prettier/angular-html-parser/issues/55554)) ([dd0700f](https://github.com/prettier/angular-html-parser/commit/dd0700ff1df131692b0f9e04bb1374d88192d3d3))
* **core:** link errors to ADEV ([#55554](https://github.com/prettier/angular-html-parser/issues/55554)) ([#56038](https://github.com/prettier/angular-html-parser/issues/56038)) ([b2445a0](https://github.com/prettier/angular-html-parser/commit/b2445a095314aa66da038d3093e6a1b18fe5768b))
* **core:** make `ActivatedRoute` inject correct instance inside `[@defer](https://github.com/defer)` blocks ([#55374](https://github.com/prettier/angular-html-parser/issues/55374)) ([9894278](https://github.com/prettier/angular-html-parser/commit/9894278e712a50079af87898a63e1d19a462d015)), closes [#54864](https://github.com/prettier/angular-html-parser/issues/54864)
* **core:** Multiple subscribers to ApplicationRef.isStable should all see values ([#53541](https://github.com/prettier/angular-html-parser/issues/53541)) ([629343f](https://github.com/prettier/angular-html-parser/commit/629343f24741760e76d98ea1005debaf4775bfc7))
* **core:** mutation bug in `getDependenciesFromInjectable` ([#52450](https://github.com/prettier/angular-html-parser/issues/52450)) ([078ebea](https://github.com/prettier/angular-html-parser/commit/078ebeab00ef15742c2ce92113b8e23fcc09008c))
* **core:** Prevent `markForCheck` during change detection from causing infinite loops ([#54900](https://github.com/prettier/angular-html-parser/issues/54900)) ([314112d](https://github.com/prettier/angular-html-parser/commit/314112de99bb97475a0d8bdbddf84a3b3ce4a8fb)), closes [#18917](https://github.com/prettier/angular-html-parser/issues/18917)
* **core:** prevent calling devMode only function on `[@defer](https://github.com/defer)` error. ([#56559](https://github.com/prettier/angular-html-parser/issues/56559)) ([5be16d0](https://github.com/prettier/angular-html-parser/commit/5be16d06bd504b1a72b7fb6f8d6e0c1b93a8188b)), closes [#56558](https://github.com/prettier/angular-html-parser/issues/56558)
* **core:** prevent i18n hydration from cleaning projected nodes ([#54823](https://github.com/prettier/angular-html-parser/issues/54823)) ([a5fa279](https://github.com/prettier/angular-html-parser/commit/a5fa279b6e9f5ab4005d6d33107f0e1bb48d05de))
* **core:** prevent infinite loops in clobbered elements check ([#54425](https://github.com/prettier/angular-html-parser/issues/54425)) ([eaff724](https://github.com/prettier/angular-html-parser/commit/eaff724b7746f9df35e69ed8fa1e78c188ebc14c))
* **core:** properly execute content queries for root components ([#54457](https://github.com/prettier/angular-html-parser/issues/54457)) ([d9a1a7d](https://github.com/prettier/angular-html-parser/commit/d9a1a7dd07497768b1c70fe698b1547bd1f8488e)), closes [#54450](https://github.com/prettier/angular-html-parser/issues/54450)
* **core:** properly remove imports in the afterRender phase migration ([#56524](https://github.com/prettier/angular-html-parser/issues/56524)) ([03a2acd](https://github.com/prettier/angular-html-parser/commit/03a2acd2a3bdc87aaeb6b835a7c1016f800b31cb))
* **core:** properly update collection with repeated keys in [@for](https://github.com/for) ([#52697](https://github.com/prettier/angular-html-parser/issues/52697)) ([ea8c9b6](https://github.com/prettier/angular-html-parser/commit/ea8c9b61d25a7efc4982c4cfe785b1ec487b379d)), closes [#52524](https://github.com/prettier/angular-html-parser/issues/52524)
* **core:** Reattached views that are dirty from a signal update should refresh ([#53001](https://github.com/prettier/angular-html-parser/issues/53001)) ([b35c673](https://github.com/prettier/angular-html-parser/commit/b35c6731e51de9c33707010fc780cbaa559be6c3)), closes [#52928](https://github.com/prettier/angular-html-parser/issues/52928) [#52928](https://github.com/prettier/angular-html-parser/issues/52928)
* **core:** Remove deprecated Testability methods ([#53768](https://github.com/prettier/angular-html-parser/issues/53768)) ([6534c03](https://github.com/prettier/angular-html-parser/commit/6534c035c099b30987d6fd1346aea454b79cc79d))
* **core:** remove signal equality check short-circuit ([#53446](https://github.com/prettier/angular-html-parser/issues/53446)) ([42f4f70](https://github.com/prettier/angular-html-parser/commit/42f4f70e97b47f7ffcf15e8af2c1a3fa3f393903)), closes [#52735](https://github.com/prettier/angular-html-parser/issues/52735)
* **core:** rename the equality function option in toSignal ([#56769](https://github.com/prettier/angular-html-parser/issues/56769)) ([5dcdbfc](https://github.com/prettier/angular-html-parser/commit/5dcdbfcba934a930468aec140a7183b034466bdf))
* **core:** render hooks should not specifically run outside the Angular zone ([#55399](https://github.com/prettier/angular-html-parser/issues/55399)) ([7e89753](https://github.com/prettier/angular-html-parser/commit/7e89753eeff24f52d39fef92600293bf1700cd1b)), closes [#55299](https://github.com/prettier/angular-html-parser/issues/55299)
* **core:** reset cached scope for components that were overridden using TestBed ([#52916](https://github.com/prettier/angular-html-parser/issues/52916)) ([ee892ee](https://github.com/prettier/angular-html-parser/commit/ee892ee294b2fc5ab6186d8434ec5d79a66165e2)), closes [#52817](https://github.com/prettier/angular-html-parser/issues/52817)
* **core:** resolve error for multiple component instances that use fallback content ([#55478](https://github.com/prettier/angular-html-parser/issues/55478)) ([97eea8d](https://github.com/prettier/angular-html-parser/commit/97eea8d50ea1be55850c43df58b27a1aa5557326)), closes [#55466](https://github.com/prettier/angular-html-parser/issues/55466)
* **core:** return a readonly signal on `asReadonly`. ([#54706](https://github.com/prettier/angular-html-parser/issues/54706)) ([7243c70](https://github.com/prettier/angular-html-parser/commit/7243c704cf8a4986fae419793027458e142658f0)), closes [#54704](https://github.com/prettier/angular-html-parser/issues/54704)
* **core:** return the same children query results if there are no changes ([#54392](https://github.com/prettier/angular-html-parser/issues/54392)) ([ff62244](https://github.com/prettier/angular-html-parser/commit/ff62244c86f4e618041803902816ccb73588b540)), closes [#54376](https://github.com/prettier/angular-html-parser/issues/54376)
* **core:** show placeholder block on the server with immediate trigger ([#54394](https://github.com/prettier/angular-html-parser/issues/54394)) ([383e093](https://github.com/prettier/angular-html-parser/commit/383e093e6a161ff32926d27b850d94381f162f5b)), closes [#54385](https://github.com/prettier/angular-html-parser/issues/54385)
* **core:** signals should be tracked when embeddedViewRef.detectChanges is called ([#55719](https://github.com/prettier/angular-html-parser/issues/55719)) ([4c7d5d8](https://github.com/prettier/angular-html-parser/commit/4c7d5d8acd8a714fe89366f76dc69f91356f0a06))
* **core:** skip defer timers on the server ([#55480](https://github.com/prettier/angular-html-parser/issues/55480)) ([5948193](https://github.com/prettier/angular-html-parser/commit/5948193e1368eec86647b4c1c0b337a387b27087)), closes [#55475](https://github.com/prettier/angular-html-parser/issues/55475)
* **core:** support content projection and VCRs in i18n ([#54823](https://github.com/prettier/angular-html-parser/issues/54823)) ([f44a5e4](https://github.com/prettier/angular-html-parser/commit/f44a5e460491a29e5c0cad5577bade8347d52e11))
* **core:** support hydration for cases when content is re-projected using ng-template ([#53304](https://github.com/prettier/angular-html-parser/issues/53304)) ([4b23221](https://github.com/prettier/angular-html-parser/commit/4b23221b4e5f8be7bcffc8ace255143653550d3d)), closes [#53276](https://github.com/prettier/angular-html-parser/issues/53276)
* **core:** support injection of object with null constructor. ([#56553](https://github.com/prettier/angular-html-parser/issues/56553)) ([331b30e](https://github.com/prettier/angular-html-parser/commit/331b30ebebe7b2ada4c07a4e5df92ab14a515ecd)), closes [#56552](https://github.com/prettier/angular-html-parser/issues/56552)
* **core:** support swapping hydrated views in `[@for](https://github.com/for)` loops ([#53274](https://github.com/prettier/angular-html-parser/issues/53274)) ([82609d4](https://github.com/prettier/angular-html-parser/commit/82609d471c9802b847a5654918eca1ba3ebb29b3)), closes [#53163](https://github.com/prettier/angular-html-parser/issues/53163)
* **core:** test cleanup should not throw if Zone is not present ([#55096](https://github.com/prettier/angular-html-parser/issues/55096)) ([914e453](https://github.com/prettier/angular-html-parser/commit/914e4530b036eb20eb553dbb47f89183458066f4)), closes [#48198](https://github.com/prettier/angular-html-parser/issues/48198)
* **core:** TestBed should not override NgZone from initTestEnvironment ([#55226](https://github.com/prettier/angular-html-parser/issues/55226)) ([7330b69](https://github.com/prettier/angular-html-parser/commit/7330b6944dee51e0fcb6ecbbeba4a9c4095326fc))
* **core:** TestBed should not override NgZone from initTestEnvironment ([#55226](https://github.com/prettier/angular-html-parser/issues/55226)) ([e9a0c86](https://github.com/prettier/angular-html-parser/commit/e9a0c86766ab15c896e026120f0c63c2fb1f9e04))
* **core:** TestBed should still use the microtask queue to schedule effects ([#53843](https://github.com/prettier/angular-html-parser/issues/53843)) ([1f8c53c](https://github.com/prettier/angular-html-parser/commit/1f8c53cd0c6c54b9d017f888567b85683ab0d348))
* **core:** toSignal equal option should be passed to inner computed ([#56903](https://github.com/prettier/angular-html-parser/issues/56903)) ([5d75b1d](https://github.com/prettier/angular-html-parser/commit/5d75b1db2b954d38c0ee20df0594ef2328a9ceb5))
* **core:** tree shake version class ([#53598](https://github.com/prettier/angular-html-parser/issues/53598)) ([872e7f2](https://github.com/prettier/angular-html-parser/commit/872e7f25fea8a01f980e4e406ad382a9e187ce5c))
* **core:** typo in zoneless warning ([#55974](https://github.com/prettier/angular-html-parser/issues/55974)) ([6024d07](https://github.com/prettier/angular-html-parser/commit/6024d0755987e63e048daeea7090b8a0a3cab11d))
* **core:** untrack various core operations ([#54614](https://github.com/prettier/angular-html-parser/issues/54614)) ([ffad7b8](https://github.com/prettier/angular-html-parser/commit/ffad7b8ea9d1286ddb3ee7a2dac7dd33fd76b3aa)), closes [#54548](https://github.com/prettier/angular-html-parser/issues/54548)
* **core:** Update ApplicationRef.tick loop to only throw in dev mode ([#54848](https://github.com/prettier/angular-html-parser/issues/54848)) ([700c052](https://github.com/prettier/angular-html-parser/commit/700c0520bb638952ba41a8d8260cf12afb078c0e))
* **core:** update feature usage marker ([#53542](https://github.com/prettier/angular-html-parser/issues/53542)) ([f35adcb](https://github.com/prettier/angular-html-parser/commit/f35adcb9b255741515d54bbce694f4cd34aac249))
* **core:** update imports to be compatible with rxjs 6 ([#54193](https://github.com/prettier/angular-html-parser/issues/54193)) ([3cf612c](https://github.com/prettier/angular-html-parser/commit/3cf612c857493e1a28578b7ae8a621617f0ea5e7)), closes [#54192](https://github.com/prettier/angular-html-parser/issues/54192)
* **core:** use TNode instead of LView for mapping injector providers ([#52436](https://github.com/prettier/angular-html-parser/issues/52436)) ([3d73b0c](https://github.com/prettier/angular-html-parser/commit/3d73b0cbfb7ecf349d55a41f89c8c4e4fc6d924b))
* **core:** zoneless scheduler should check if Zone is defined before accessing it ([#55118](https://github.com/prettier/angular-html-parser/issues/55118)) ([a99cb7c](https://github.com/prettier/angular-html-parser/commit/a99cb7ce5b77a125ab660da8ebef23ecb158e2e3)), closes [#55116](https://github.com/prettier/angular-html-parser/issues/55116)
* cta clickability issue in adev homepage. ([#52905](https://github.com/prettier/angular-html-parser/issues/52905)) ([dfc6c8d](https://github.com/prettier/angular-html-parser/commit/dfc6c8d0c76380ee7beb6d904261e40857b375ed))
* **devtools:** allow DevTools to fail gracefully for unsupported versions of Angular. ([#55233](https://github.com/prettier/angular-html-parser/issues/55233)) ([efe78d5](https://github.com/prettier/angular-html-parser/commit/efe78d556502ec392cef33d49603c025970a252b))
* **devtools:** check for all new DI debug APIs before trying to determine resolution path providers ([#52791](https://github.com/prettier/angular-html-parser/issues/52791)) ([3cf18bb](https://github.com/prettier/angular-html-parser/commit/3cf18bb6f2798020cbe8633fae79f920cf98816b))
* **devtools:** fix padding in property tree view ([#54648](https://github.com/prettier/angular-html-parser/issues/54648)) ([e18a0ed](https://github.com/prettier/angular-html-parser/commit/e18a0ed1a312094369735a5a8dda8abbceebbc8d)), closes [#54622](https://github.com/prettier/angular-html-parser/issues/54622)
* **devtools:** issue where backendReady race condition causes Angular not detected error ([#54805](https://github.com/prettier/angular-html-parser/issues/54805)) ([d15dca0](https://github.com/prettier/angular-html-parser/commit/d15dca054c25c5bf9066930328c6b4d5889be017))
* **devtools:** use a shared angular detection code ([#51569](https://github.com/prettier/angular-html-parser/issues/51569)) ([a429167](https://github.com/prettier/angular-html-parser/commit/a429167994b326285326c87727f0740d57c7ff05)), closes [#51565](https://github.com/prettier/angular-html-parser/issues/51565)
* **docs-infra:** add cookie consent gtag event default state ([#54574](https://github.com/prettier/angular-html-parser/issues/54574)) ([0b53fdb](https://github.com/prettier/angular-html-parser/commit/0b53fdb3b41f2517bcfebee75295aa62769b3e04))
* **docs-infra:** calculate list of Angular Docs versions based on VERSION ([#55977](https://github.com/prettier/angular-html-parser/issues/55977)) ([756b891](https://github.com/prettier/angular-html-parser/commit/756b891f95405a35fe704b3ffafcf385c20452f1))
* **docs-infra:** do not delete `BUILD.bazel` in help directory during updates ([#54697](https://github.com/prettier/angular-html-parser/issues/54697)) ([4842eed](https://github.com/prettier/angular-html-parser/commit/4842eedd7ed9ebd35bc890502278b255d6822c10))
* **docs-infra:** don't include prerender flag based on fast/full build in adev ([#54400](https://github.com/prettier/angular-html-parser/issues/54400)) ([a33f09c](https://github.com/prettier/angular-html-parser/commit/a33f09c0266fdf776bc9d4ae07cbeb533ba872f5))
* **docs-infra:** enable font inlining for adev ([#54524](https://github.com/prettier/angular-html-parser/issues/54524)) ([7220c89](https://github.com/prettier/angular-html-parser/commit/7220c89cef39b690246a856cad7f82071d2a2906))
* **docs-infra:** fix menu icon size ([#52689](https://github.com/prettier/angular-html-parser/issues/52689)) ([9b92d7d](https://github.com/prettier/angular-html-parser/commit/9b92d7d5890691119e0e96ecb9f75e9d1ac73fc6))
* **docs-infra:** include CLI reference docs in adev ([#54591](https://github.com/prettier/angular-html-parser/issues/54591)) ([2e401c7](https://github.com/prettier/angular-html-parser/commit/2e401c74e75eb777cfcd781fb422c7bce26042a5))
* **docs-infra:** include manually defined api reference docs in adev ([#54356](https://github.com/prettier/angular-html-parser/issues/54356)) ([fbaf989](https://github.com/prettier/angular-html-parser/commit/fbaf989aa16241479172a184b517e1ca1df0f052))
* **docs-infra:** include the homepage playground content ([#53832](https://github.com/prettier/angular-html-parser/issues/53832)) ([f7c02e1](https://github.com/prettier/angular-html-parser/commit/f7c02e132100f94103908467a9f59cccc40b0423))
* **docs-infra:** process mermaid code blocks ([#54434](https://github.com/prettier/angular-html-parser/issues/54434)) ([925c86a](https://github.com/prettier/angular-html-parser/commit/925c86a76e94e9061a810a3eaa6010e6532277a6))
* **docs-infra:** process mermaid code blocks ([#54462](https://github.com/prettier/angular-html-parser/issues/54462)) ([03acdbe](https://github.com/prettier/angular-html-parser/commit/03acdbe94f3767d64ec5cf402164edff0d55441d))
* **docs-infra:** reference page restores scroll position or goes top when no anchor ([#56478](https://github.com/prettier/angular-html-parser/issues/56478)) ([f8654bd](https://github.com/prettier/angular-html-parser/commit/f8654bd3f681c67111003fa12b2c7166f026156d))
* **docs-infra:** remove config release from test scripts ([#56062](https://github.com/prettier/angular-html-parser/issues/56062)) ([c8951ab](https://github.com/prettier/angular-html-parser/commit/c8951ab57ffdd309723b2f7316f483d2d9ce52fd))
* **docs-infra:** remove part aio infra ([#54929](https://github.com/prettier/angular-html-parser/issues/54929)) ([ade0244](https://github.com/prettier/angular-html-parser/commit/ade024407dc4418d03edc01b4bde5bf44c90c6e1))
* **docs-infra:** remove the prerender directory from adev ([#54820](https://github.com/prettier/angular-html-parser/issues/54820)) ([6a07c0c](https://github.com/prettier/angular-html-parser/commit/6a07c0c2b271b688f8b86124da288f1e273c1a0a))
* **docs-infra:** scrolling experience in API Reference ([#55133](https://github.com/prettier/angular-html-parser/issues/55133)) ([8a8181a](https://github.com/prettier/angular-html-parser/commit/8a8181a54dc13ff591f5c6759740a4e44dc5f41e))
* **docs-infra:** sort api reference items ([#54116](https://github.com/prettier/angular-html-parser/issues/54116)) ([b02cf14](https://github.com/prettier/angular-html-parser/commit/b02cf1452500b9d682d5a791d3782e9e38df2d96))
* **docs-infra:** use anchors instead of button for version picker links ([#56368](https://github.com/prettier/angular-html-parser/issues/56368)) ([03957b1](https://github.com/prettier/angular-html-parser/commit/03957b1c06f27d8225d411abf814db73ae4355c5))
* **docs-infra:** use separate templates for the from and to selectors in update guide ([#55992](https://github.com/prettier/angular-html-parser/issues/55992)) ([b7a2ad2](https://github.com/prettier/angular-html-parser/commit/b7a2ad274432ec39bc8cc1561653a6244ac6678e))
* **docs-infra:** Various scroll fixes for a.dev ([#56464](https://github.com/prettier/angular-html-parser/issues/56464)) ([2a24397](https://github.com/prettier/angular-html-parser/commit/2a2439712a495c9ec741b72ac0a40cc99cc66c65)), closes [#56446](https://github.com/prettier/angular-html-parser/issues/56446) [#56446](https://github.com/prettier/angular-html-parser/issues/56446)
* **forms:** Add event for forms submitted & reset ([#55667](https://github.com/prettier/angular-html-parser/issues/55667)) ([fedeaac](https://github.com/prettier/angular-html-parser/commit/fedeaac8ba85002e34dbd6ffa682d7483d39b5fd))
* **forms:** Allow canceled async validators to emit. ([#55134](https://github.com/prettier/angular-html-parser/issues/55134)) ([53b0d6a](https://github.com/prettier/angular-html-parser/commit/53b0d6adb838705755ba7e260e7ff5c824c84d85)), closes [angular#41519](https://github.com/prettier/angular/issues/41519)
* **forms:** Make `NgControlStatus` host bindings `OnPush` compatible ([#55720](https://github.com/prettier/angular-html-parser/issues/55720)) ([00bde8b](https://github.com/prettier/angular-html-parser/commit/00bde8b1c2d1511da40526a374d4e94d31e0d575))
* **http:** Don't override the backend when using the InMemoryWebAPI ([#52425](https://github.com/prettier/angular-html-parser/issues/52425)) ([291ba38](https://github.com/prettier/angular-html-parser/commit/291ba38623cfee60d0b734c3ffbb7b5f3fae06a6))
* **http:** Don't override the backend when using the InMemoryWebAPI ([#52425](https://github.com/prettier/angular-html-parser/issues/52425)) ([49b037f](https://github.com/prettier/angular-html-parser/commit/49b037f8116d56520035a1cc0797b65f1b0e3ad9))
* **http:** exclude caching for authenticated HTTP requests ([#54746](https://github.com/prettier/angular-html-parser/issues/54746)) ([2258ac7](https://github.com/prettier/angular-html-parser/commit/2258ac7a32bf83dc3e33a7ff9526b501ea95e33d)), closes [#54745](https://github.com/prettier/angular-html-parser/issues/54745)
* **http:** include transferCache when cloning HttpRequest ([#54939](https://github.com/prettier/angular-html-parser/issues/54939)) ([cf73983](https://github.com/prettier/angular-html-parser/commit/cf73983fdc5fca955fbe729b231a207fc5cd70fd)), closes [#54924](https://github.com/prettier/angular-html-parser/issues/54924)
* **http:** Make `Content-Type` header case insensitive ([#56541](https://github.com/prettier/angular-html-parser/issues/56541)) ([cc21989](https://github.com/prettier/angular-html-parser/commit/cc21989132bc64b981df83cb6ff6e1506b42a1d0)), closes [#56539](https://github.com/prettier/angular-html-parser/issues/56539)
* **http:** manage different body types for caching POST requests ([#54980](https://github.com/prettier/angular-html-parser/issues/54980)) ([13554f9](https://github.com/prettier/angular-html-parser/commit/13554f9637c222671253e733114cfbc815c6d33d)), closes [#54956](https://github.com/prettier/angular-html-parser/issues/54956)
* **http:** resolve `withRequestsMadeViaParent` behavior with `withFetch` ([#55652](https://github.com/prettier/angular-html-parser/issues/55652)) ([9ddb003](https://github.com/prettier/angular-html-parser/commit/9ddb003b6cab080662bacaf93417bd599357700b))
* **http:** Use string body to generate transfer cache key. ([#54379](https://github.com/prettier/angular-html-parser/issues/54379)) ([74b5a51](https://github.com/prettier/angular-html-parser/commit/74b5a51226f1261260d17e48b1ae2477dcefb76d)), closes [#54377](https://github.com/prettier/angular-html-parser/issues/54377)
* **http:** Use the response `content-type` to set the blob `type`. ([#52840](https://github.com/prettier/angular-html-parser/issues/52840)) ([cf86ae5](https://github.com/prettier/angular-html-parser/commit/cf86ae5c3a734e385e8e1d01ffc913c3307436e0))
* **language-service:** allow external projects to use provided compiler options ([#55035](https://github.com/prettier/angular-html-parser/issues/55035)) ([6d1b82d](https://github.com/prettier/angular-html-parser/commit/6d1b82df32049cfaba2f6a50b9639b6e3b722170))
* **language-service:** avoid generating TS syntactic diagnostics for templates ([#55091](https://github.com/prettier/angular-html-parser/issues/55091)) ([a48afe0](https://github.com/prettier/angular-html-parser/commit/a48afe0d9478aca314e68552f4af77f4123563cd))
* **language-service:** implement getDefinitionAtPosition for Angular templates ([#55269](https://github.com/prettier/angular-html-parser/issues/55269)) ([bd236cc](https://github.com/prettier/angular-html-parser/commit/bd236cc150e1b21932612ecf91678be77a503d18))
* **language-service:** import the default exported component correctly ([#56432](https://github.com/prettier/angular-html-parser/issues/56432)) ([67b2c33](https://github.com/prettier/angular-html-parser/commit/67b2c336bc0bdce3f7ae054c094990a9831f5b20)), closes [#48689](https://github.com/prettier/angular-html-parser/issues/48689)
* **language-service:** prevent underlying TS Service from handling template files ([#55003](https://github.com/prettier/angular-html-parser/issues/55003)) ([4166dfc](https://github.com/prettier/angular-html-parser/commit/4166dfc1b62a83b60203bfe45a6d4aa7148a0b23))
* **language-service:** use type-only import in plugin factory ([#55996](https://github.com/prettier/angular-html-parser/issues/55996)) ([d17e6a5](https://github.com/prettier/angular-html-parser/commit/d17e6a5b170e8e9edc57ff118fea458a714124fe))
* **localize:** add `@angular/localize/init` as polyfill in `angular.json` ([#56300](https://github.com/prettier/angular-html-parser/issues/56300)) ([81486c2](https://github.com/prettier/angular-html-parser/commit/81486c2f4770361b4aecdc891107f70446e43bc3))
* **migrations:** account for separator characters inside strings ([#52525](https://github.com/prettier/angular-html-parser/issues/52525)) ([cc4dc52](https://github.com/prettier/angular-html-parser/commit/cc4dc52703c4be1d71e9dcd213575361826928a4))
* **migrations:** account for variables in imports initializer ([#55081](https://github.com/prettier/angular-html-parser/issues/55081)) ([6368871](https://github.com/prettier/angular-html-parser/commit/63688714aeb788a24b030f9f9cdcc55e7fb0d758)), closes [#55080](https://github.com/prettier/angular-html-parser/issues/55080)
* **migrations:** Add missing support for ngForOf ([#52903](https://github.com/prettier/angular-html-parser/issues/52903)) ([8f5124e](https://github.com/prettier/angular-html-parser/commit/8f5124ea95bb29faa4092047f128ecd5742044b7))
* **migrations:** Add ngForTemplate support to control flow migration ([#53076](https://github.com/prettier/angular-html-parser/issues/53076)) ([dbca1c9](https://github.com/prettier/angular-html-parser/commit/dbca1c9d618be4d195d779ef80606c6d22f7c977)), closes [#53068](https://github.com/prettier/angular-html-parser/issues/53068)
* **migrations:** Add support for bound versions of NgIfElse and NgIfThenElse ([#52869](https://github.com/prettier/angular-html-parser/issues/52869)) ([42805e3](https://github.com/prettier/angular-html-parser/commit/42805e32047952e79dcafcf4873129b03d1a70d5)), closes [#52842](https://github.com/prettier/angular-html-parser/issues/52842)
* **migrations:** Add support for ng-templates with i18n attributes ([#52597](https://github.com/prettier/angular-html-parser/issues/52597)) ([12f979d](https://github.com/prettier/angular-html-parser/commit/12f979d5c6ab86203e4c183ff75dfc1d3be39794)), closes [#52517](https://github.com/prettier/angular-html-parser/issues/52517)
* **migrations:** Add support for removing imports post migration ([#52763](https://github.com/prettier/angular-html-parser/issues/52763)) ([17adf0f](https://github.com/prettier/angular-html-parser/commit/17adf0f917bb30f24255a0dea1c25e40ec619bf4))
* **migrations:** allows colons in ngIf else cases to migrate ([#53076](https://github.com/prettier/angular-html-parser/issues/53076)) ([53912fd](https://github.com/prettier/angular-html-parser/commit/53912fdf74e1224f95edc3dd550c51451e613c44)), closes [#53150](https://github.com/prettier/angular-html-parser/issues/53150)
* **migrations:** avoid conflicts with some greek letters in control flow migration ([#55113](https://github.com/prettier/angular-html-parser/issues/55113)) ([0c20c40](https://github.com/prettier/angular-html-parser/commit/0c20c4075af753d8e5eaecb5f7114a48ced5ad96)), closes [#55085](https://github.com/prettier/angular-html-parser/issues/55085)
* **migrations:** cf migration - detect and error when result is invalid i18n nesting ([#53638](https://github.com/prettier/angular-html-parser/issues/53638)) ([fb7c58c](https://github.com/prettier/angular-html-parser/commit/fb7c58cda7f1f828b63bd2c3ab6ab888878d6511))
* **migrations:** cf migration - detect and error when result is invalid i18n nesting ([#53638](https://github.com/prettier/angular-html-parser/issues/53638)) ([#53639](https://github.com/prettier/angular-html-parser/issues/53639)) ([d49333e](https://github.com/prettier/angular-html-parser/commit/d49333edc3fe170c57d953aa2d8df58d0db379e0))
* **migrations:** CF Migration - ensure bound ngIfElse cases ignore line breaks ([#53435](https://github.com/prettier/angular-html-parser/issues/53435)) ([a027679](https://github.com/prettier/angular-html-parser/commit/a02767956a00e0b44b690411f01584f6660c83ea)), closes [#53428](https://github.com/prettier/angular-html-parser/issues/53428)
* **migrations:** cf migration - ensure full check runs for all imports ([#53637](https://github.com/prettier/angular-html-parser/issues/53637)) ([8e21787](https://github.com/prettier/angular-html-parser/commit/8e2178792d474e84817c27851cd6b9600deb15b5))
* **migrations:** CF migration - ensure NgIfElse attributes are properly removed ([#53298](https://github.com/prettier/angular-html-parser/issues/53298)) ([1c1e8c4](https://github.com/prettier/angular-html-parser/commit/1c1e8c477b8d5c8deecf05744bd1d5f7c86d2e14)), closes [#53288](https://github.com/prettier/angular-html-parser/issues/53288)
* **migrations:** cf migration - fix bug in attribute formatting ([#53636](https://github.com/prettier/angular-html-parser/issues/53636)) ([22b95de](https://github.com/prettier/angular-html-parser/commit/22b95de9bcb92267b8f848a1aafa71af70d5577b))
* **migrations:** CF Migration - Fix case of aliases on i18n ng-templates preventing removal ([#53299](https://github.com/prettier/angular-html-parser/issues/53299)) ([2998d48](https://github.com/prettier/angular-html-parser/commit/2998d482dd3f1f5ff7f08260c3947ded74dac126)), closes [#53289](https://github.com/prettier/angular-html-parser/issues/53289)
* **migrations:** cf migration - improve import declaration handling ([#53622](https://github.com/prettier/angular-html-parser/issues/53622)) ([b40bb22](https://github.com/prettier/angular-html-parser/commit/b40bb22a66a3c2ae478778f3ef0be0ce971a1b2c))
* **migrations:** cf migration - preserve indentation on attribute strings ([#53625](https://github.com/prettier/angular-html-parser/issues/53625)) ([8bf7525](https://github.com/prettier/angular-html-parser/commit/8bf752539f6b4b5955e3d61a76423910af55181b))
* **migrations:** cf migration - stop removing empty newlines from i18n blocks ([#53578](https://github.com/prettier/angular-html-parser/issues/53578)) ([7bb312f](https://github.com/prettier/angular-html-parser/commit/7bb312fcf612c57d6606ae14f21707f10d8ff9ce))
* **migrations:** cf migration - undo changes when html fails to parse post migration ([#53530](https://github.com/prettier/angular-html-parser/issues/53530)) ([6aa1bb7](https://github.com/prettier/angular-html-parser/commit/6aa1bb78e8b9ca866b3c2d84f4005a0e67f2b6bc))
* **migrations:** CF Migration add support for ngIf with just a then ([#53297](https://github.com/prettier/angular-html-parser/issues/53297)) ([aad5e5b](https://github.com/prettier/angular-html-parser/commit/aad5e5bd0e7f6581f51fc3a23c98a7f11219a8f8)), closes [#53287](https://github.com/prettier/angular-html-parser/issues/53287)
* **migrations:** cf migration fix migrating empty switch default ([#53237](https://github.com/prettier/angular-html-parser/issues/53237)) ([fadfee4](https://github.com/prettier/angular-html-parser/commit/fadfee43247acec7e450d5cc929a0a6780a54bd1)), closes [#53235](https://github.com/prettier/angular-html-parser/issues/53235)
* **migrations:** CF Migration fix missing alias for bound ngifs ([#53296](https://github.com/prettier/angular-html-parser/issues/53296)) ([6f75471](https://github.com/prettier/angular-html-parser/commit/6f75471307a9458d0cffd0ee2bbf4190640c3c3a)), closes [#53291](https://github.com/prettier/angular-html-parser/issues/53291)
* **migrations:** CF migration log warning when collection aliasing detected in [@for](https://github.com/for) ([#53238](https://github.com/prettier/angular-html-parser/issues/53238)) ([b2aeaf5](https://github.com/prettier/angular-html-parser/commit/b2aeaf5d97327842a5bb657e9f02bb4f1358304b)), closes [#53233](https://github.com/prettier/angular-html-parser/issues/53233)
* **migrations:** CF migration only remove newlines of changed template content ([#53508](https://github.com/prettier/angular-html-parser/issues/53508)) ([cc02852](https://github.com/prettier/angular-html-parser/commit/cc02852ac44bfea13e8b9d5768694a094fc2c4b5)), closes [#53494](https://github.com/prettier/angular-html-parser/issues/53494)
* **migrations:** cf migration removes unnecessary bound ngifelse attribute ([#53236](https://github.com/prettier/angular-html-parser/issues/53236)) ([c632628](https://github.com/prettier/angular-html-parser/commit/c6326289f87089b3415ba0f3e371206b8a396b66)), closes [#53230](https://github.com/prettier/angular-html-parser/issues/53230)
* **migrations:** cf migration validate structure of ngswitch before migrating ([#53530](https://github.com/prettier/angular-html-parser/issues/53530)) ([ce10767](https://github.com/prettier/angular-html-parser/commit/ce1076785c98ecc9660637cafa4a62a63be8d315)), closes [#53234](https://github.com/prettier/angular-html-parser/issues/53234)
* **migrations:** Change CF Migration ng-template placeholder generation and handling ([#53394](https://github.com/prettier/angular-html-parser/issues/53394)) ([2a5a8f6](https://github.com/prettier/angular-html-parser/commit/2a5a8f6f052961c010a68a05d868f50220f2fcf2)), closes [#53386](https://github.com/prettier/angular-html-parser/issues/53386) [#53385](https://github.com/prettier/angular-html-parser/issues/53385) [#53384](https://github.com/prettier/angular-html-parser/issues/53384)
* **migrations:** control flow migration fails for async pipe with unboxing of observable ([#52756](https://github.com/prettier/angular-html-parser/issues/52756)) ([#52972](https://github.com/prettier/angular-html-parser/issues/52972)) ([e33f6e0](https://github.com/prettier/angular-html-parser/commit/e33f6e0f1a483cad908fa6d7376d62332797499c))
* **migrations:** control flow migration formatting fixes ([#53076](https://github.com/prettier/angular-html-parser/issues/53076)) ([e6f10e8](https://github.com/prettier/angular-html-parser/commit/e6f10e81d2486b5cc1f468777b7e1057d3f09dc5))
* **migrations:** do not generate aliased variables with the same name ([#56154](https://github.com/prettier/angular-html-parser/issues/56154)) ([75e811c](https://github.com/prettier/angular-html-parser/commit/75e811c18b16f42c6f72ac32e44c4bc4d37fc3b1)), closes [#56152](https://github.com/prettier/angular-html-parser/issues/56152)
* **migrations:** ensure we do not overwrite prior template replacements in migration ([#53393](https://github.com/prettier/angular-html-parser/issues/53393)) ([1f5c8bf](https://github.com/prettier/angular-html-parser/commit/1f5c8bf116783c25234ab7fa301a0be842e58007)), closes [#53383](https://github.com/prettier/angular-html-parser/issues/53383)
* **migrations:** error in standalone migration when non-array value is used as declarations in TestBed ([#54122](https://github.com/prettier/angular-html-parser/issues/54122)) ([28ad6fc](https://github.com/prettier/angular-html-parser/commit/28ad6fc4ad518884bb5777fd20e9075d8969b27a))
* **migrations:** Fix cf migration bug with parsing for loop conditions properly ([#53558](https://github.com/prettier/angular-html-parser/issues/53558)) ([db6b4a6](https://github.com/prettier/angular-html-parser/commit/db6b4a6bc479b0fac0a4a99e1a202c38d1ea8944)), closes [#53555](https://github.com/prettier/angular-html-parser/issues/53555)
* **migrations:** fix cf migration import removal when errors occur ([#53502](https://github.com/prettier/angular-html-parser/issues/53502)) ([79f7915](https://github.com/prettier/angular-html-parser/commit/79f791543b607eea1bb6a28b9c744760ba4fd028))
* **migrations:** Fix cf migration let condition semicolon order ([#56913](https://github.com/prettier/angular-html-parser/issues/56913)) ([5179ce3](https://github.com/prettier/angular-html-parser/commit/5179ce3473246394c24508a7728071279968c271))
* **migrations:** Fix cf migration regular expression to include underscores ([#54533](https://github.com/prettier/angular-html-parser/issues/54533)) ([42d3ddd](https://github.com/prettier/angular-html-parser/commit/42d3ddd9ae4244d00abb45ce59fbc7dc1ea9393d)), closes [#54532](https://github.com/prettier/angular-html-parser/issues/54532)
* **migrations:** Fix empty switch case offset bug in cf migration ([#53839](https://github.com/prettier/angular-html-parser/issues/53839)) ([d0b95d5](https://github.com/prettier/angular-html-parser/commit/d0b95d5877023026a3e5c3344a6663a3c5323028)), closes [#53779](https://github.com/prettier/angular-html-parser/issues/53779)
* **migrations:** fix off by one issue with template removal in CF migration ([#53255](https://github.com/prettier/angular-html-parser/issues/53255)) ([6291c8d](https://github.com/prettier/angular-html-parser/commit/6291c8db092c0ab67f6789cc03c19dfa0bdc251d)), closes [#53248](https://github.com/prettier/angular-html-parser/issues/53248)
* **migrations:** fix regexp for else and then in cf migration ([#53257](https://github.com/prettier/angular-html-parser/issues/53257)) ([03e2f1b](https://github.com/prettier/angular-html-parser/commit/03e2f1bb25693d1a5f4e53fc4f4cd1937cf6bda1)), closes [#53252](https://github.com/prettier/angular-html-parser/issues/53252)
* **migrations:** Fixes a bug in the ngFor pre-v5 alias translation ([#52531](https://github.com/prettier/angular-html-parser/issues/52531)) ([0207801](https://github.com/prettier/angular-html-parser/commit/02078019534b93460812bce6be810a9baa379fca)), closes [#52522](https://github.com/prettier/angular-html-parser/issues/52522)
* **migrations:** fixes CF migration i18n ng-template offsets ([#53212](https://github.com/prettier/angular-html-parser/issues/53212)) ([f1b7d40](https://github.com/prettier/angular-html-parser/commit/f1b7d400575a6a02a2fc2b642c2b8c15cca9b3c4)), closes [#53149](https://github.com/prettier/angular-html-parser/issues/53149)
* **migrations:** fixes control flow migration common module removal ([#53076](https://github.com/prettier/angular-html-parser/issues/53076)) ([a738b48](https://github.com/prettier/angular-html-parser/commit/a738b48717e16613b34c3e50480cd49f2a31858f))
* **migrations:** Fixes control flow migration if then else case ([#53006](https://github.com/prettier/angular-html-parser/issues/53006)) ([5564d02](https://github.com/prettier/angular-html-parser/commit/5564d020cdcea8273b65cf69c45c3f935195af66)), closes [#52927](https://github.com/prettier/angular-html-parser/issues/52927)
* **migrations:** Fixes issue with multiple if elses with same template ([#52863](https://github.com/prettier/angular-html-parser/issues/52863)) ([0e7b1da](https://github.com/prettier/angular-html-parser/commit/0e7b1daa8d4aaacf0ef4b133bfbc2d31601ee5b0)), closes [#52854](https://github.com/prettier/angular-html-parser/issues/52854)
* **migrations:** fixes migrations of nested switches in control flow ([#53010](https://github.com/prettier/angular-html-parser/issues/53010)) ([28f6cbf](https://github.com/prettier/angular-html-parser/commit/28f6cbf9c91f957b4926fe34610387e1f1919d4f)), closes [#53009](https://github.com/prettier/angular-html-parser/issues/53009)
* **migrations:** handle aliases on bound ngIf migrations ([#53261](https://github.com/prettier/angular-html-parser/issues/53261)) ([f4a96a9](https://github.com/prettier/angular-html-parser/commit/f4a96a9160927903c38e172f6375c4bc5f8e0905)), closes [#53251](https://github.com/prettier/angular-html-parser/issues/53251)
* **migrations:** handle comma-separated syntax in ngFor ([#52525](https://github.com/prettier/angular-html-parser/issues/52525)) ([44341ca](https://github.com/prettier/angular-html-parser/commit/44341ca25d24e43e6cd8d3e778a9125786992e4a))
* **migrations:** handle empty ngSwitchCase ([#56105](https://github.com/prettier/angular-html-parser/issues/56105)) ([3b2f88c](https://github.com/prettier/angular-html-parser/commit/3b2f88cd905e5db7e6fa8982cc63ff2fd32a7599)), closes [angular#56030](https://github.com/prettier/angular/issues/56030)
* **migrations:** handle more cases in HttpClientModule migration ([#55640](https://github.com/prettier/angular-html-parser/issues/55640)) ([7a2efd4](https://github.com/prettier/angular-html-parser/commit/7a2efd442df66cfcee28105405550635f152c51d))
* **migrations:** handle nested ng-template replacement safely in CF migration ([#53368](https://github.com/prettier/angular-html-parser/issues/53368)) ([5a0ed28](https://github.com/prettier/angular-html-parser/commit/5a0ed28c9d3f1c7507feee482e37c3346d52b033)), closes [#53362](https://github.com/prettier/angular-html-parser/issues/53362)
* **migrations:** handle ngIf else condition with no whitespaces ([#52504](https://github.com/prettier/angular-html-parser/issues/52504)) ([1da4a24](https://github.com/prettier/angular-html-parser/commit/1da4a2407e27c5bffd9819972add104b6c3efe8b)), closes [#52502](https://github.com/prettier/angular-html-parser/issues/52502)
* **migrations:** handle templates outside of component in cf migration ([#53368](https://github.com/prettier/angular-html-parser/issues/53368)) ([01b18a4](https://github.com/prettier/angular-html-parser/commit/01b18a4248f068df33c0ca8a2d62ef2fc69f941c)), closes [#53361](https://github.com/prettier/angular-html-parser/issues/53361)
* **migrations:** migrate HttpClientTestingModule in test modules ([#55803](https://github.com/prettier/angular-html-parser/issues/55803)) ([65b7cb2](https://github.com/prettier/angular-html-parser/commit/65b7cb282657cd65e0a81a32e30319582c599e4f))
* **migrations:** passed in paths will be respected in nx workspaces ([#52796](https://github.com/prettier/angular-html-parser/issues/52796)) ([da97bbc](https://github.com/prettier/angular-html-parser/commit/da97bbc76245a425a918506069b0807cfa67066f)), closes [#52787](https://github.com/prettier/angular-html-parser/issues/52787)
* **migrations:** preserve existing properties in HttpClientModule migration ([#55777](https://github.com/prettier/angular-html-parser/issues/55777)) ([ccde17d](https://github.com/prettier/angular-html-parser/commit/ccde17db0c4ed2ccda52c8c94f198f1457908324))
* **migrations:** properly handle ngIfThen cases in CF migration ([#53256](https://github.com/prettier/angular-html-parser/issues/53256)) ([a359951](https://github.com/prettier/angular-html-parser/commit/a3599515bb2513fbcb2899284c7f6b4bc021ddaf)), closes [#53254](https://github.com/prettier/angular-html-parser/issues/53254)
* **migrations:** remove setting that removes comments in CF migration ([#53350](https://github.com/prettier/angular-html-parser/issues/53350)) ([9834fd2](https://github.com/prettier/angular-html-parser/commit/9834fd27387ed5edc65bed56aa003fc45d250420))
* **migrations:** resolve error in standalone migration ([#56302](https://github.com/prettier/angular-html-parser/issues/56302)) ([96aa5c8](https://github.com/prettier/angular-html-parser/commit/96aa5c8a2c9dd607dbcffa5d7923df4c21636510))
* **migrations:** resolve infinite loop for a single line element with a long tag name and angle bracket on a new line ([#54588](https://github.com/prettier/angular-html-parser/issues/54588)) ([71e0c7d](https://github.com/prettier/angular-html-parser/commit/71e0c7df695f274a54d5ffb9dfc0587d06d3a953)), closes [#54587](https://github.com/prettier/angular-html-parser/issues/54587)
* **migrations:** resolve multiple structural issues with HttpClient migration ([#55557](https://github.com/prettier/angular-html-parser/issues/55557)) ([91b1f24](https://github.com/prettier/angular-html-parser/commit/91b1f24d03dd4c15f3acd36456777143a35f7017))
* **migrations:** Switches to multiple passes to fix several reported bugs ([#52592](https://github.com/prettier/angular-html-parser/issues/52592)) ([b9e2893](https://github.com/prettier/angular-html-parser/commit/b9e2893e5c80ef7c66e86d609a519ef2e389655a)), closes [#52518](https://github.com/prettier/angular-html-parser/issues/52518) [#52516](https://github.com/prettier/angular-html-parser/issues/52516) [#52513](https://github.com/prettier/angular-html-parser/issues/52513)
* **migrations:** tweaks to formatting in control flow migration ([#53058](https://github.com/prettier/angular-html-parser/issues/53058)) ([e090b48](https://github.com/prettier/angular-html-parser/commit/e090b48bf8534761d46523be57a7889a325bcdec)), closes [#53017](https://github.com/prettier/angular-html-parser/issues/53017)
* **migrations:** Update CF migration to skip templates with duplicate ng-template names ([#53204](https://github.com/prettier/angular-html-parser/issues/53204)) ([8a52674](https://github.com/prettier/angular-html-parser/commit/8a52674faacefd4042726383fdf0aed59a04fb7e)), closes [#53169](https://github.com/prettier/angular-html-parser/issues/53169)
* **migrations:** Update regex to better match ng-templates ([#52529](https://github.com/prettier/angular-html-parser/issues/52529)) ([f2fbe86](https://github.com/prettier/angular-html-parser/commit/f2fbe869f0e254b1c87895687e56b0a61eb367a6)), closes [#52523](https://github.com/prettier/angular-html-parser/issues/52523)
* **platform-browser:** Get correct base path when using "." as base href when serving from the file:// protocol. ([#53547](https://github.com/prettier/angular-html-parser/issues/53547)) ([fdb9cb7](https://github.com/prettier/angular-html-parser/commit/fdb9cb7a5be4695abaa60efc89ecd50ddb9e9e6e)), closes [#53546](https://github.com/prettier/angular-html-parser/issues/53546)
* **platform-browser:** Use the right namespace for mathML. ([#55622](https://github.com/prettier/angular-html-parser/issues/55622)) ([e533110](https://github.com/prettier/angular-html-parser/commit/e5331107fd5d5f78ed9ba50a72903030375af050))
* **platform-server:** add `nonce` attribute to event record script ([#55495](https://github.com/prettier/angular-html-parser/issues/55495)) ([5674c64](https://github.com/prettier/angular-html-parser/commit/5674c644abf51ae8764befd3011742ff1febdf29))
* **platform-server:** Do not delete global Event ([#53659](https://github.com/prettier/angular-html-parser/issues/53659)) ([f4bd5a3](https://github.com/prettier/angular-html-parser/commit/f4bd5a33d2ccfc4e72a17e5414e20ca1e9bb1157))
* **platform-server:** remove event dispatch script from HTML when hydration is disabled ([#55681](https://github.com/prettier/angular-html-parser/issues/55681)) ([cf84acf](https://github.com/prettier/angular-html-parser/commit/cf84acf44c1b6e52fe745fd2db4807da7b7cc857))
* **router:** Clear internal transition when navigation finalizes ([#54261](https://github.com/prettier/angular-html-parser/issues/54261)) ([d3b273a](https://github.com/prettier/angular-html-parser/commit/d3b273ac335beb5c8f8e85890770b1503e66b6b7)), closes [#54241](https://github.com/prettier/angular-html-parser/issues/54241)
* **router:** Clear internal transition when navigation finalizes ([#54261](https://github.com/prettier/angular-html-parser/issues/54261)) ([6681292](https://github.com/prettier/angular-html-parser/commit/6681292823277c8b9df002b6658224287b90e954)), closes [#54241](https://github.com/prettier/angular-html-parser/issues/54241)
* **router:** Delay the view transition to ensure renders in microtasks complete ([#56494](https://github.com/prettier/angular-html-parser/issues/56494)) ([0d52c6b](https://github.com/prettier/angular-html-parser/commit/0d52c6b18275433923a5fe94f3fc24323b73d0be))
* **router:** Ensure canMatch guards run on wildcard routes ([#53239](https://github.com/prettier/angular-html-parser/issues/53239)) ([1940280](https://github.com/prettier/angular-html-parser/commit/1940280d27bb3ece585d6345dbd742d208f46912)), closes [#49949](https://github.com/prettier/angular-html-parser/issues/49949)
* **router:** Navigations triggered by cancellation events should cancel previous navigation ([#54710](https://github.com/prettier/angular-html-parser/issues/54710)) ([115ee88](https://github.com/prettier/angular-html-parser/commit/115ee88ba9f28f53c7c9c2a623409ae9c6be064b))
* **router:** preserve replaceUrl when returning a urlTree from CanActivate ([#54042](https://github.com/prettier/angular-html-parser/issues/54042)) ([60f1d68](https://github.com/prettier/angular-html-parser/commit/60f1d681e0ba66d3d94b0819f2c612f095c2d3d3)), closes [#53503](https://github.com/prettier/angular-html-parser/issues/53503)
* **router:** provide more actionable error message when route is not matched in production mode ([#53523](https://github.com/prettier/angular-html-parser/issues/53523)) ([48c5041](https://github.com/prettier/angular-html-parser/commit/48c50416872313f23d2759232c990cf8d2de6996)), closes [#53522](https://github.com/prettier/angular-html-parser/issues/53522)
* **router:** Resolvers in different parts of the route tree should be able to execute together ([#52934](https://github.com/prettier/angular-html-parser/issues/52934)) ([29e0834](https://github.com/prettier/angular-html-parser/commit/29e0834c4deecfa8bf384b5e4359796c8123afcd)), closes [#52892](https://github.com/prettier/angular-html-parser/issues/52892)
* **router:** revert commit that replaced `last` helper with native `Array.at(-1)` ([#54021](https://github.com/prettier/angular-html-parser/issues/54021)) ([bc85551](https://github.com/prettier/angular-html-parser/commit/bc85551bfce735493054489acb31426b4875e602))
* **router:** Routed components never inherit `RouterOutlet` `EnvironmentInjector` ([#54265](https://github.com/prettier/angular-html-parser/issues/54265)) ([3839cfb](https://github.com/prettier/angular-html-parser/commit/3839cfbb18fcc70cae5a6ba4ba7676b1c4acf7a0)), closes [#53369](https://github.com/prettier/angular-html-parser/issues/53369)
* **router:** Routed components never inherit `RouterOutlet` `EnvironmentInjector` ([#54265](https://github.com/prettier/angular-html-parser/issues/54265)) ([da906fd](https://github.com/prettier/angular-html-parser/commit/da906fdafcbb302fa280a162d1c1f04369be2efa)), closes [#53369](https://github.com/prettier/angular-html-parser/issues/53369)
* **router:** RouterLinkActive will always remove active classes when links are not active ([#54982](https://github.com/prettier/angular-html-parser/issues/54982)) ([eae75ff](https://github.com/prettier/angular-html-parser/commit/eae75ff3f9f564b919debe3f9fa41ed1b073a22c)), closes [#54978](https://github.com/prettier/angular-html-parser/issues/54978)
* **router:** routes should not get stale providers ([#56798](https://github.com/prettier/angular-html-parser/issues/56798)) ([4343cd2](https://github.com/prettier/angular-html-parser/commit/4343cd2ceb71044a85617e087369fa7f34501cde)), closes [#56774](https://github.com/prettier/angular-html-parser/issues/56774)
* **router:** Scroller should scroll as soon as change detection completes ([#55105](https://github.com/prettier/angular-html-parser/issues/55105)) ([66ffeca](https://github.com/prettier/angular-html-parser/commit/66ffeca2dea1eed5f88a81d8ef167da87796f3f8)), closes [#53985](https://github.com/prettier/angular-html-parser/issues/53985)
* **router:** Should not freeze original object used for route data ([#53635](https://github.com/prettier/angular-html-parser/issues/53635)) ([502f300](https://github.com/prettier/angular-html-parser/commit/502f3007575a5445c2876c92548415cb003582b1)), closes [#53632](https://github.com/prettier/angular-html-parser/issues/53632)
* **service-worker:** avoid running CDs on `controllerchange` ([#54222](https://github.com/prettier/angular-html-parser/issues/54222)) ([3bc63ea](https://github.com/prettier/angular-html-parser/commit/3bc63eaaf344712ac6de1c9618d4558d9443c848))
* **service-worker:** remove `controllerchange` listener when app is destroyed ([#55365](https://github.com/prettier/angular-html-parser/issues/55365)) ([afe4561](https://github.com/prettier/angular-html-parser/commit/afe45616ad2fc4edd5cba84a233ea3a76a2c09b7))
* **zone.js:** Add 'declare' to each interface to prevent renaming ([#54966](https://github.com/prettier/angular-html-parser/issues/54966)) ([b3d045b](https://github.com/prettier/angular-html-parser/commit/b3d045b9a4383d97ea3c5d770d9413ffed35d760))
* **zone.js:** add `__Zone_ignore_on_properties` to `ZoneGlobalConfigurations` ([#50737](https://github.com/prettier/angular-html-parser/issues/50737)) ([f87f058](https://github.com/prettier/angular-html-parser/commit/f87f058a69443d9427530c979b39e3630190a7fd))
* **zone.js:** add missing APIs to Node.js `fs` patch ([#54396](https://github.com/prettier/angular-html-parser/issues/54396)) ([9e07b62](https://github.com/prettier/angular-html-parser/commit/9e07b621ead050d27d36cde0549b01ac3f1e9e73))
* **zone.js:** allow enabling default `beforeunload` handling ([#55875](https://github.com/prettier/angular-html-parser/issues/55875)) ([b8d5882](https://github.com/prettier/angular-html-parser/commit/b8d5882127a6e9944d30a7e0c87c2e2c59b352e6)), closes [#47579](https://github.com/prettier/angular-html-parser/issues/47579)
* **zone.js:** correctly bundle `zone-patch-rxjs` ([#55826](https://github.com/prettier/angular-html-parser/issues/55826)) ([20a530a](https://github.com/prettier/angular-html-parser/commit/20a530acb6ca6efe73cb97c64e9d23a0f5d912c8)), closes [#55825](https://github.com/prettier/angular-html-parser/issues/55825)
* **zone.js:** disable wrapping unhandled promise error by default ([#52492](https://github.com/prettier/angular-html-parser/issues/52492)) ([435dd32](https://github.com/prettier/angular-html-parser/commit/435dd329128f32258ea197f686f411f56a018435))
* **zone.js:** do not mutate event listener options (may be readonly) ([#55796](https://github.com/prettier/angular-html-parser/issues/55796)) ([85c1719](https://github.com/prettier/angular-html-parser/commit/85c171920ae2b1861896fa6c2d5d7dc8f030a445)), closes [#54142](https://github.com/prettier/angular-html-parser/issues/54142)
* **zone.js:** handle fetch with AbortSignal ([#49595](https://github.com/prettier/angular-html-parser/issues/49595)) ([b06b24b](https://github.com/prettier/angular-html-parser/commit/b06b24b5049c07fbc18c76fd2a10e49fc93870be))
* **zone.js:** make sure fakeasync use the same id pool with native ([#54600](https://github.com/prettier/angular-html-parser/issues/54600)) ([ddbf6bb](https://github.com/prettier/angular-html-parser/commit/ddbf6bb038d101daf5280abbd2a0efaa0b7fd3a0)), closes [#54323](https://github.com/prettier/angular-html-parser/issues/54323)
* **zone.js:** patch `fs.realpath.native` as macrotask ([#54208](https://github.com/prettier/angular-html-parser/issues/54208)) ([19fae76](https://github.com/prettier/angular-html-parser/commit/19fae76bada7146e8993fb672b8d321fb08967f2)), closes [#45546](https://github.com/prettier/angular-html-parser/issues/45546)
* **zone.js:** patch `Response` methods returned by `fetch` ([#50653](https://github.com/prettier/angular-html-parser/issues/50653)) ([260d3ed](https://github.com/prettier/angular-html-parser/commit/260d3ed0d91648d3ba75d7d9896f38195093c7e4)), closes [#50327](https://github.com/prettier/angular-html-parser/issues/50327)
* **zone.js:** patch form-associated custom element callbacks ([#50686](https://github.com/prettier/angular-html-parser/issues/50686)) ([1c990cd](https://github.com/prettier/angular-html-parser/commit/1c990cdb2962fa879762d5e26f87f547a00e1795))
* **zone.js:** Promise.resolve(subPromise) should return subPromise ([#53423](https://github.com/prettier/angular-html-parser/issues/53423)) ([08b0c87](https://github.com/prettier/angular-html-parser/commit/08b0c87a948007e086a2c5a5c17ccca5fd7a24c4)), closes [/promisesaplus.com/#point-51](https://github.com/prettier//promisesaplus.com//issues/point-51)
* **zone.js:** remove `abort` listener on a signal when actual event is removed ([#55339](https://github.com/prettier/angular-html-parser/issues/55339)) ([a9460d0](https://github.com/prettier/angular-html-parser/commit/a9460d08a0e95dcd8fcd0ea7eca8470af921bfe2)), closes [#54739](https://github.com/prettier/angular-html-parser/issues/54739)
* **zone.js:** should not clear onhandler when remove capture listener ([#54602](https://github.com/prettier/angular-html-parser/issues/54602)) ([e44b077](https://github.com/prettier/angular-html-parser/commit/e44b077cbd4fc1ac16b3edd0fea758842ce6e29f)), closes [#54581](https://github.com/prettier/angular-html-parser/issues/54581)
* **zone.js:** store remove abort listener on the scheduled task ([#56160](https://github.com/prettier/angular-html-parser/issues/56160)) ([4a3800a](https://github.com/prettier/angular-html-parser/commit/4a3800a6a0ae9d667dd961c6e4029c01c6819988)), closes [#56148](https://github.com/prettier/angular-html-parser/issues/56148)
* **zone.js:** support addEventListener with signal option. ([#49595](https://github.com/prettier/angular-html-parser/issues/49595)) ([d4973ff](https://github.com/prettier/angular-html-parser/commit/d4973ff9b074f4db918f71163e79b7d112c309f5)), closes [#49591](https://github.com/prettier/angular-html-parser/issues/49591)


* **animations:** remove deprecated `matchesElement` from `AnimationDriver` ([#55479](https://github.com/prettier/angular-html-parser/issues/55479)) ([bcce85a](https://github.com/prettier/angular-html-parser/commit/bcce85af72a82634f60b31d66a5ef42ecd844ce8))
* **common:** remove deprecated `isPlatformWorkerApp` and `isPlatformWorkerUi` API ([#55302](https://github.com/prettier/angular-html-parser/issues/55302)) ([3b0de30](https://github.com/prettier/angular-html-parser/commit/3b0de30b37f558d4815ca9a61db1010aaf3df068))
* **platform-browser-dynamic:** unused `RESOURCE_CACHE_PROVIDER` API has been removed ([#54875](https://github.com/prettier/angular-html-parser/issues/54875)) ([eb20c1a](https://github.com/prettier/angular-html-parser/commit/eb20c1a8b18e2e080c856e3e1bf7bcd02f3bfd28))
* **platform-browser:** remove deprecated transfer state APIs ([#55474](https://github.com/prettier/angular-html-parser/issues/55474)) ([cba336d](https://github.com/prettier/angular-html-parser/commit/cba336d4f1badd601b24a58fc51bde995f45682d))
* **platform-server:** remove deprecated `platformDynamicServer` API ([#54874](https://github.com/prettier/angular-html-parser/issues/54874)) ([07ac017](https://github.com/prettier/angular-html-parser/commit/07ac017731f0e08ea3736f1f212093a28648a304))
* **platform-server:** remove deprecated `ServerTransferStateModule` API ([#54874](https://github.com/prettier/angular-html-parser/issues/54874)) ([e8b588d](https://github.com/prettier/angular-html-parser/commit/e8b588d8b7fc014aaef99d4b0c1e4567b4aa195d))
* **platform-server:** remove deprecated `useAbsoluteUrl` and `baseUrl` from `PlatformConfig` ([#54874](https://github.com/prettier/angular-html-parser/issues/54874)) ([3b1967c](https://github.com/prettier/angular-html-parser/commit/3b1967ca64479df9137b3ad7a0d04dbaff6496f4))
* **platform-server:** remove legacy URL handling logic ([#54874](https://github.com/prettier/angular-html-parser/issues/54874)) ([2357d35](https://github.com/prettier/angular-html-parser/commit/2357d3566c4d18dc40cbda6644ed459ef7703893))

## [5.2.0](https://github.com/prettier/angular-html-parser/compare/v5.1.0...v5.2.0) (2023-12-10)

## [5.1.0](https://github.com/prettier/angular-html-parser/compare/v5.0.1...v5.1.0) (2023-12-10)


### ⚠ BREAKING CHANGES

* **router:** Routes with `loadComponent` would incorrectly cause
child routes to inherit their data by default. The default
`paramsInheritanceStrategy` is `emptyOnly`. If parent data should be
inherited in child routes, this should be manually set to `always`.
* **platform-browser:** The `withNoDomReuse()` function was removed from the public API. If you need to disable hydration, you can exclude the `provideClientHydration()` call from provider list in your application (which would disable hydration features for the entire application) or use `ngSkipHydration` attribute to disable hydration for particular components. See this guide for additional information: https://angular.io/guide/hydration#how-to-skip-hydration-for-particular-components.
* **common:** the NgSwitch directive now defaults to the === equality operator,
migrating from the previously used ==. NgSwitch expressions and / or
individual condition values need adjusting to this stricter equality
check. The added warning message should help pinpointing NgSwitch
usages where adjustements are needed.
* **core:** The  `mutate` method was removed from the `WritableSignal` interface and completely
dropped from the public API surface. As an alternative please use the update method and
make immutable changes to the object.

Example before:

```typescript
items.mutate(itemsArray => itemsArray.push(newItem));
```

Example after:

```typescript
items.update(itemsArray => [itemsArray, …newItem]);
```
* **core:** The  `mutate` method was removed from the `WritableSignal` interface and completely
dropped from the public API surface. As an alternative please use the update method and
make immutable changes to the object.

Example before:

```typescript
items.mutate(itemsArray => itemsArray.push(newItem));
```

Example after:

```typescript
items.update(itemsArray => [itemsArray, …newItem]);
```
* **router:** Absolute redirects no longer prevent further redirects.
Route configurations may need to be adjusted to prevent infinite
redirects where additional redirects were previously ignored after an
absolute redirect occurred.
* **router:** The `setupTestingRouter` function has been removed. Use
`RouterModule.forRoot` or `provideRouter` to setup the `Router` for
tests instead.
* **core:** Versions of TypeScript older than 5.2 are no longer supported.
* **router:** `malformedUriErrorHandler` is no longer available in
the `RouterModule.forRoot` options. URL parsing errors should instead be
handled in the `UrlSerializer.parse` method.
* **core:** Angular now required `zone.js` version `~0.14.0`
* **common:** 
* **zone.js:** Deep and legacy `dist/` imports like `zone.js/bundles/zone-testing.js` and `zone.js/dist/zone` are no longer allowed. `zone-testing-bundle` and `zone-testing-node-bundle` are also no longer part of the package.

The proper way to import `zone.js` and `zone.js/testing` is:
```js
import 'zone.js';
import 'zone.js/testing';
```
* Node.js v16 support has been removed and the minimum support version has been bumped to 18.13.0.

Node.js v16 is planned to be End-of-Life on 2023-09-11. Angular will stop supporting Node.js v16 in Angular v17. For Node.js release schedule details, please see: https://github.com/nodejs/release#release-schedule
* **router:** `urlHandlingStrategy` has been removed from the Router public API.
This should instead be configured through the provideRouter or RouterModule.forRoot APIs.
* **core:** `OnPush` components that are created dynamically now
only have their host bindings refreshed and `ngDoCheck run` during change
detection if they are dirty.
Previously, a bug in the change detection would result in the `OnPush`
configuration of dynamically created components to be ignored when
executing host bindings and the `ngDoCheck` function. This is
rarely encountered but can happen if code has a handle on the
`ComponentRef` instance and updates values read in the `OnPush`
component template without then calling either `markForCheck` or
`detectChanges` on that component's `ChangeDetectorRef`.
* **platform-browser:** `REMOVE_STYLES_ON_COMPONENT_DESTROY` default value is now `true`. This causes CSS of components to be removed from the DOM when destroyed. You retain the previous behaviour by providing the `REMOVE_STYLES_ON_COMPONENT_DESTROY` injection token.

```ts
import {REMOVE_STYLES_ON_COMPONENT_DESTROY} from '@angular/platform-browser';
...
providers: [{
  provide: REMOVE_STYLES_ON_COMPONENT_DESTROY,
  useValue: false,
}]
```
* **router:** The following Router properties have been removed from
the public API:

- canceledNavigationResolution
- paramsInheritanceStrategy
- titleStrategy
- urlUpdateStrategy
- malformedUriErrorHandler

These should instead be configured through the `provideRouter` or
`RouterModule.forRoot` APIs.
* **platform-server:** Users that are using SSR with JIT mode will now need to add  `import to @angular/compiler` before bootstrapping the application.

**NOTE:** this does not effect users using the Angular CLI.
* **animations:** On `AnimationPlayer.setPosition` the argument is now of type `number`
* **platform-browser:** The deprecated `BrowserTransferStateModule` was removed, since it's no longer needed. The `TransferState` class can be injected without providing the module. The `BrowserTransferStateModule` was empty starting from v14 and you can just remove the reference to that module from your applications.
* **core:** The `ReflectiveInjector` and related symbols were removed. Please update the code to avoid references to the `ReflectiveInjector` symbol. Use `Injector.create` as a replacement to create an injector instead.
* **core:** QueryList.filter now supports type guard functions, which will result in type narrowing. Previously if you used type guard functions, it resulted in no changes to the return type. Now the type would be narrowed, which might require updates to the application code that relied on the old behavior.
* Deprecated `EventManager` method `addGlobalEventListener` has been removed as it is not used by Ivy.
* **core:** ComponentRef.setInput will only set the input on the
component if it is different from the previous value (based on `Object.is`
equality). If code relies on the input always being set, it should be
updated to copy objects or wrap primitives in order to ensure the input
value differs from the previous call to `setInput`.
* **common:** If the 'ngTemplateOutletContext' is different from the context, it will result in a compile-time error.

Before the change, the following template was compiling:

```typescript
interface MyContext {
  $implicit: string;
}

@Component({
  standalone: true,
  imports: [NgTemplateOutlet],
  selector: 'person',
  template: `
    <ng-container
      *ngTemplateOutlet="
        myTemplateRef;
        context: { $implicit: 'test', xxx: 'xxx' }
      "></ng-container>
  `,
})
export class PersonComponent {
  myTemplateRef!: TemplateRef<MyContext>;
}
```
However, it does not compile now because the 'xxx' property does not exist in 'MyContext', resulting in the error: 'Type '{ $implicit: string; xxx: string; }' is not assignable to type 'MyContext'.'

The solution is either:
- add the 'xxx' property to 'MyContext' with the correct type or
- add '$any(...)' inside the template to make the error disappear. However, adding '$any(...)' does not correct the error but only preserves the previous behavior of the code.
* **core:** * `entryComponents` has been deleted from the `@NgModule` and `@Component` public APIs. Any usages can be removed since they weren't doing anyting.
* `ANALYZE_FOR_ENTRY_COMPONENTS` injection token has been deleted. Any references can be removed.
* **bazel:** Several changes to the Angular Package Format (APF)
- Removal of FESM2015
- Replacing ES2020 with ES2022
- Replacing FESM2020 with FESM2022
* **bazel:** Several changes to the Angular Package Format (APF)
- Removal of FESM2015
- Replacing ES2020 with ES2022
- Replacing FESM2020 with FESM2022
* **platform-server:** `renderApplication` method no longer accepts a root component as first argument. Instead, provide a bootstrapping function that returns a `Promise<ApplicationRef>`.

Before
```ts
const output: string = await renderApplication(RootComponent, options);
```

Now
```ts
const bootstrap = () => bootstrapApplication(RootComponent, appConfig);
const output: string = await renderApplication(bootstrap, options);
```
* **core:** The `APP_ID` token value is no longer randomly generated. If you are bootstrapping multiple application on the same page you will need to set to provide the `APP_ID` yourself.

```ts
bootstrapApplication(ComponentA, {
  providers: [
   { provide: APP_ID, useValue: 'app-a' },
   // ... other providers ...
  ]
});
```
* **router:** `ComponentFactoryResolver` has been removed from Router APIs.
Component factories are not required to create an instance of a component
dynamically. Passing a factory resolver via resolver argument is no longer needed
and code can instead use `ViewContainerRef.createComponent` without the
factory resolver.
* **core:** `zone.js` versions `0.11.x` and `0.12.x` are not longer supported.
* **common:** Deprecated `XhrFactory` export from `@angular/common/http` has been removed. Use `XhrFactory` from `@angular/common` instead.
* **platform-server:** `renderModuleFactory` has been removed. Use `renderModule` instead.
* **core:** Node.js v14 support has been removed

Node.js v14 is planned to be End-of-Life on 2023-04-30. Angular will stop supporting Node.js v14 in Angular v16. Angular v16 will continue to officially support Node.js versions v16 and v18.
* **router:** Tests which mock `ActivatedRoute` instances may need to be adjusted
because Router.createUrlTree now does the right thing in more
scenarios. This means that tests with invalid/incomplete ActivatedRoute mocks
may behave differently than before. Additionally, tests may now navigate
to a real URL where before they would navigate to the root. Ensure that
tests provide expected routes to match.
There is rarely production impact, but it has been found that relative
navigations when using an `ActivatedRoute` that does not appear in the
current router state were effectively ignored in the past. By creating
the correct URLs, this sometimes resulted in different navigation
behavior in the application. Most often, this happens when attempting to
create a navigation that only updates query params using an empty
command array, for example `router.navigate([], {relativeTo: route,
queryParams: newQueryParams})`. In this case, the `relativeTo` property
should be removed.
* **compiler:** * TypeScript 4.8 is no longer supported.
* **common:** `MockPlatformLocation` is now provided by default in tests.
Existing tests may have behaviors which rely on
`BrowserPlatformLocation` instead. For example, direct access to the
`window.history` in either the test or the component rather than going
through the Angular APIs (`Location.getState()`). The quickest fix is to
update the providers in the test suite to override the provider again
`TestBed.configureTestingModule({providers: [{provide: PlatformLocation, useClass: BrowserPlatformLocation}]})`.
The ideal fix would be to update the code to instead be compatible with
`MockPlatformLocation` instead.
* **router:** The `RouterEvent` type is no longer present in the `Event` union type representing all router event types. If you have code using something like `filter((e: Event): e is RouterEvent => e instanceof RouterEvent)`, you'll need to update it to `filter((e: Event|RouterEvent): e is RouterEvent => e instanceof RouterEvent)`.
* **core:** `RendererType2.styles` no longer accepts a nested arrays.
* **router:** The `Scroll` event's `routerEvent` property may also be
a `NavigationSkipped` event. Previously, it was only a `NavigationEnd`
event.
* Angular Compatibility Compiler (ngcc) has been removed and as a result Angular View Engine libraries will no longer work

### Features

* **animations:** Add the possibility of lazy loading animations code. ([#50738](https://github.com/prettier/angular-html-parser/issues/50738)) ([e753278](https://github.com/prettier/angular-html-parser/commit/e753278faae79a53e235e0d8e03f89555a712d80))
* **bazel:** (APF) Angular Package Format updates ([#49332](https://github.com/prettier/angular-html-parser/issues/49332)) ([842d569](https://github.com/prettier/angular-html-parser/commit/842d569a9471937b89f8f20f130356c926f4697b))
* **bazel:** (APF) Angular Package Format updates ([#49559](https://github.com/prettier/angular-html-parser/issues/49559)) ([6e26af5](https://github.com/prettier/angular-html-parser/commit/6e26af52faf961533e3534ff93d59dd152fc16c4))
* **bazel:** make `forbidOrphanComponents` option configurable ([#52061](https://github.com/prettier/angular-html-parser/issues/52061)) ([59ba2a6](https://github.com/prettier/angular-html-parser/commit/59ba2a6e9f7218c78cd8b5f4c13ffb46dd0a4900))
* **bazel:** prohibit cross entry-point relative imports ([#51500](https://github.com/prettier/angular-html-parser/issues/51500)) ([9aa71cc](https://github.com/prettier/angular-html-parser/commit/9aa71cc8e0a899faaebd05d0eb4f483a99aa0a2b))
* **benchpress:** report gc and render time spent in script ([#50771](https://github.com/prettier/angular-html-parser/issues/50771)) ([2da3551](https://github.com/prettier/angular-html-parser/commit/2da3551a703ebef401d76a8e88e388437e851d85))
* **common:** add component input binding support for NgComponentOutlet ([#49735](https://github.com/prettier/angular-html-parser/issues/49735)) ([f386759](https://github.com/prettier/angular-html-parser/commit/f3867597f079794ae9c7ed8be3788c9cea5123a3))
* **common:** add component input binding support for NgComponentOutlet ([#51148](https://github.com/prettier/angular-html-parser/issues/51148)) ([29d3581](https://github.com/prettier/angular-html-parser/commit/29d358170b046f4a6773dfdfbbd1050f54deb301))
* **common:** Add loaderParams attribute to NgOptimizedImage ([#48907](https://github.com/prettier/angular-html-parser/issues/48907)) ([54b24eb](https://github.com/prettier/angular-html-parser/commit/54b24eb40fed13c926305ad475202a5608d41c6b))
* **common:** Allow ngSrc to be changed post-init ([#50683](https://github.com/prettier/angular-html-parser/issues/50683)) ([1837efb](https://github.com/prettier/angular-html-parser/commit/1837efb9daf5c8e86a99a06ecc77bb42bc60dbb0))
* **common:** make the warning for lazy-loaded lcp image an error ([#51748](https://github.com/prettier/angular-html-parser/issues/51748)) ([fe2fd7e](https://github.com/prettier/angular-html-parser/commit/fe2fd7e1a898a4525c219065a6d0908988dfd7e2)), closes [/angular.io/guide/image-directive#step-4](https://github.com/prettier//angular.io/guide/image-directive/issues/step-4)
* **common:** Provide MockPlatformLocation by default in BrowserTestingModule ([#49137](https://github.com/prettier/angular-html-parser/issues/49137)) ([5dce2a5](https://github.com/prettier/angular-html-parser/commit/5dce2a5a3a00693d835a57934b9abacce5a33dfa))
* **common:** upgrade warning to logged error for lazy-loaded LCP images using NgOptimizedImage ([#52004](https://github.com/prettier/angular-html-parser/issues/52004)) ([dde3fda](https://github.com/prettier/angular-html-parser/commit/dde3fdabbd24b48dd6afd120d23e92a3605eb04d))
* **compiler-cli:** Add an extended diagnostic for `nSkipHydration` ([#49512](https://github.com/prettier/angular-html-parser/issues/49512)) ([03d1d00](https://github.com/prettier/angular-html-parser/commit/03d1d00ad9f88a2c449cceab64c1328787576162)), closes [#49501](https://github.com/prettier/angular-html-parser/issues/49501)
* **compiler:** add docs extraction for type aliases ([#52118](https://github.com/prettier/angular-html-parser/issues/52118)) ([1934524](https://github.com/prettier/angular-html-parser/commit/1934524a0c673fb65cd927c55c712f59446f9c93))
* **compiler:** add support for compile-time required inputs ([#49304](https://github.com/prettier/angular-html-parser/issues/49304)) ([1a6ca68](https://github.com/prettier/angular-html-parser/commit/1a6ca68154dd73bac4b8d2e094d97952f60b3e30)), closes [#37706](https://github.com/prettier/angular-html-parser/issues/37706)
* **compiler:** add support for compile-time required inputs ([#49453](https://github.com/prettier/angular-html-parser/issues/49453)) ([13dd614](https://github.com/prettier/angular-html-parser/commit/13dd614cd1da65eee947fd6971b7d6e1d6def207)), closes [#37706](https://github.com/prettier/angular-html-parser/issues/37706)
* **compiler:** add support for compile-time required inputs ([#49468](https://github.com/prettier/angular-html-parser/issues/49468)) ([8f539c1](https://github.com/prettier/angular-html-parser/commit/8f539c11f40be12207ab42bdf1f87a154a5a2d04)), closes [#37706](https://github.com/prettier/angular-html-parser/issues/37706)
* **compiler:** drop support for TypeScript 4.8 ([#49155](https://github.com/prettier/angular-html-parser/issues/49155)) ([79cdfeb](https://github.com/prettier/angular-html-parser/commit/79cdfeb3921687dfbc8fea8d9f7ba4dbb14a7193))
* **compiler:** expand class api doc extraction ([#51733](https://github.com/prettier/angular-html-parser/issues/51733)) ([7f6d9a7](https://github.com/prettier/angular-html-parser/commit/7f6d9a73ab8b658d0d8148080dfefb2550bee6b4)), closes [#51682](https://github.com/prettier/angular-html-parser/issues/51682)
* **compiler:** extract api docs for interfaces ([#52006](https://github.com/prettier/angular-html-parser/issues/52006)) ([a7fa253](https://github.com/prettier/angular-html-parser/commit/a7fa25306f8ce47d8aa330531382106efec55a55))
* **compiler:** extract api for fn overloads and abtract classes ([#52040](https://github.com/prettier/angular-html-parser/issues/52040)) ([7bfe207](https://github.com/prettier/angular-html-parser/commit/7bfe20707fedff7290e12356a1545644b436d41c))
* **compiler:** extract directive docs info ([#51733](https://github.com/prettier/angular-html-parser/issues/51733)) ([c7daf7e](https://github.com/prettier/angular-html-parser/commit/c7daf7ea1692391f7cac8f794ed777887a2764af)), closes [#51685](https://github.com/prettier/angular-html-parser/issues/51685)
* **compiler:** extract doc info for JsDoc ([#51733](https://github.com/prettier/angular-html-parser/issues/51733)) ([e0b1bb3](https://github.com/prettier/angular-html-parser/commit/e0b1bb33d77babe881f77f52cb1b71e345f5696b)), closes [#51713](https://github.com/prettier/angular-html-parser/issues/51713)
* **compiler:** extract docs for accessors, rest params, and types ([#51733](https://github.com/prettier/angular-html-parser/issues/51733)) ([b9c7015](https://github.com/prettier/angular-html-parser/commit/b9c70158abecd81a5af512c8b4da685851cf159f)), closes [#51697](https://github.com/prettier/angular-html-parser/issues/51697)
* **compiler:** extract docs for top level functions and consts ([#51733](https://github.com/prettier/angular-html-parser/issues/51733)) ([a24ae99](https://github.com/prettier/angular-html-parser/commit/a24ae994a0470fdac09a69937fd0580cff6c6d68)), closes [#51700](https://github.com/prettier/angular-html-parser/issues/51700)
* **compiler:** extract docs info for enums, pipes, and NgModules ([#51733](https://github.com/prettier/angular-html-parser/issues/51733)) ([2e41488](https://github.com/prettier/angular-html-parser/commit/2e41488296879685b19dfba8d78037690347bda3)), closes [#51717](https://github.com/prettier/angular-html-parser/issues/51717)
* **compiler:** extract docs via exports ([#51828](https://github.com/prettier/angular-html-parser/issues/51828)) ([34495b3](https://github.com/prettier/angular-html-parser/commit/34495b35337892ab209d9955ff7fe2897a0c5d41))
* **compiler:** initial skeleton for API doc extraction ([#51733](https://github.com/prettier/angular-html-parser/issues/51733)) ([7e82df4](https://github.com/prettier/angular-html-parser/commit/7e82df45c5bb72ec3dafaa07dc1eaa5d463b006c)), closes [#51615](https://github.com/prettier/angular-html-parser/issues/51615)
* **compiler:** scope selectors in [@scope](https://github.com/scope) queries ([#50747](https://github.com/prettier/angular-html-parser/issues/50747)) ([c27a1e6](https://github.com/prettier/angular-html-parser/commit/c27a1e61d64a67aa169086f7db11bcfd5bb7d2fc))
* **compiler:** support multiple configuration files in `extends` ([#49125](https://github.com/prettier/angular-html-parser/issues/49125)) ([1407a9a](https://github.com/prettier/angular-html-parser/commit/1407a9aeaf5edf33dfb9b52d7b2baaebef9b80ed))
* **core:** add `assertInInjectionContext` ([#49529](https://github.com/prettier/angular-html-parser/issues/49529)) ([89d291c](https://github.com/prettier/angular-html-parser/commit/89d291c367e6b1b4618999c4044dcafcc1953109))
* **core:** add `mergeApplicationConfig` method ([#49253](https://github.com/prettier/angular-html-parser/issues/49253)) ([4e9531f](https://github.com/prettier/angular-html-parser/commit/4e9531f7773e7bf0d3034a36c62f34f914e4a451))
* **core:** Add ability to configure `NgZone` in `bootstrapApplication` ([#49557](https://github.com/prettier/angular-html-parser/issues/49557)) ([d7d6514](https://github.com/prettier/angular-html-parser/commit/d7d6514add2912a18c50f190aaa8afafa313bc9e))
* **core:** add ability to transform input values ([#50420](https://github.com/prettier/angular-html-parser/issues/50420)) ([68017d4](https://github.com/prettier/angular-html-parser/commit/68017d4e75abed78b378dce54f860cfa0d0fa42f)), closes [#8968](https://github.com/prettier/angular-html-parser/issues/8968) [#14761](https://github.com/prettier/angular-html-parser/issues/14761)
* **core:** add afterRender and afterNextRender ([#50607](https://github.com/prettier/angular-html-parser/issues/50607)) ([e53d4ec](https://github.com/prettier/angular-html-parser/commit/e53d4ecf4cfd9e64d6ba8c8b19adbb7df9cfc047))
* **core:** add Angular Signals to the public API ([#49150](https://github.com/prettier/angular-html-parser/issues/49150)) ([bc5ddab](https://github.com/prettier/angular-html-parser/commit/bc5ddabdcb39e6ebbe2da03dc8ec49bbe26c677d))
* **core:** add API to provide CSP nonce for inline stylesheets ([#49444](https://github.com/prettier/angular-html-parser/issues/49444)) ([17e9862](https://github.com/prettier/angular-html-parser/commit/17e9862653758ebdbd29771cd4ec8a59436497d6)), closes [#6361](https://github.com/prettier/angular-html-parser/issues/6361)
* **core:** add migration to remove `moduleId` references ([#49496](https://github.com/prettier/angular-html-parser/issues/49496)) ([605c536](https://github.com/prettier/angular-html-parser/commit/605c5364208d9ab60041121e2ebbcfb2a1a52c1a))
* **core:** add new list reconcilation algorithm ([#51980](https://github.com/prettier/angular-html-parser/issues/51980)) ([4f04d1c](https://github.com/prettier/angular-html-parser/commit/4f04d1cdab2fc5217566c0c01b7df10c74a93afa))
* **core:** add schematic to escape block syntax characters ([#51905](https://github.com/prettier/angular-html-parser/issues/51905)) ([c7127b9](https://github.com/prettier/angular-html-parser/commit/c7127b98b555449f99e24a81c828ab7b1c6c4a4e)), closes [#51891](https://github.com/prettier/angular-html-parser/issues/51891)
* **core:** Add schematic to migrate control flow syntax ([#52035](https://github.com/prettier/angular-html-parser/issues/52035)) ([50275e5](https://github.com/prettier/angular-html-parser/commit/50275e58b80acfc52239908a6c61523e99f6731c))
* **core:** add support for TypeScript 5.0 ([#49126](https://github.com/prettier/angular-html-parser/issues/49126)) ([99d874f](https://github.com/prettier/angular-html-parser/commit/99d874fe3b486f3669b0e8f1910e31c4fa278308))
* **core:** add support for zone.js 0.14.0 ([#51774](https://github.com/prettier/angular-html-parser/issues/51774)) ([81b67aa](https://github.com/prettier/angular-html-parser/commit/81b67aa98767078aebae22150d3441372772c28f))
* **core:** add warnings for oversized images and lazy-lcp ([#51846](https://github.com/prettier/angular-html-parser/issues/51846)) ([048f400](https://github.com/prettier/angular-html-parser/commit/048f400efc75011e888ea25d214a0211f91b96d4))
* **core:** allow removal of previously registered DestroyRef callbacks ([#49493](https://github.com/prettier/angular-html-parser/issues/49493)) ([d1617c4](https://github.com/prettier/angular-html-parser/commit/d1617c449d23c6573803cce36391134e8d0103a3))
* **core:** Allow typeguards on QueryList.filter ([#48042](https://github.com/prettier/angular-html-parser/issues/48042)) ([b2327f4](https://github.com/prettier/angular-html-parser/commit/b2327f4df12ca91d7cdbc3dc5c0f5cb3ab88a30e)), closes [#38446](https://github.com/prettier/angular-html-parser/issues/38446)
* **core:** change the URL sanitization to only block javascript: URLs ([#49659](https://github.com/prettier/angular-html-parser/issues/49659)) ([b35fa73](https://github.com/prettier/angular-html-parser/commit/b35fa739687a357108edaa0a57dcd033ecfcb9f2))
* **core:** conditional built-in control flow ([#51346](https://github.com/prettier/angular-html-parser/issues/51346)) ([93675dc](https://github.com/prettier/angular-html-parser/commit/93675dc797cb9f897c19fe298455dec52b900113))
* **core:** create function to assert not running inside reactive context ([#52049](https://github.com/prettier/angular-html-parser/issues/52049)) ([4427e1e](https://github.com/prettier/angular-html-parser/commit/4427e1ebc29f5541cfe6a404f212de4359441812))
* **core:** create injector debugging APIs ([#48639](https://github.com/prettier/angular-html-parser/issues/48639)) ([98d262f](https://github.com/prettier/angular-html-parser/commit/98d262fd27795014ee3988b08d3c48a0dfb63c40))
* **core:** Drop public `factories` property for `IterableDiffers` : Breaking change ([#49598](https://github.com/prettier/angular-html-parser/issues/49598)) ([061f3d1](https://github.com/prettier/angular-html-parser/commit/061f3d1086421b921403f7d358c02f84927b699b))
* **core:** drop support for `zone.js` versions `<=0.12.0` ([#49331](https://github.com/prettier/angular-html-parser/issues/49331)) ([fdf6197](https://github.com/prettier/angular-html-parser/commit/fdf61974d1155b771d7d53c7bbc3bd2b0f6681cb))
* **core:** drop support for older TypeScript versions ([#51792](https://github.com/prettier/angular-html-parser/issues/51792)) ([e23aaa7](https://github.com/prettier/angular-html-parser/commit/e23aaa7d75efdd52be4dd7ca9267bc60d36059c2))
* **core:** effects can optionally return a cleanup function ([#49625](https://github.com/prettier/angular-html-parser/issues/49625)) ([9c5fd50](https://github.com/prettier/angular-html-parser/commit/9c5fd50de4489d98b40668f7d9885c18d9a43c73))
* **core:** enable block syntax ([#51994](https://github.com/prettier/angular-html-parser/issues/51994)) ([43e6fb0](https://github.com/prettier/angular-html-parser/commit/43e6fb0606e15584dcb4478ad4eaa8e825dda83e)), closes [#51979](https://github.com/prettier/angular-html-parser/issues/51979)
* **core:** expose `makeStateKey`, `StateKey` and  `TransferState` ([#49563](https://github.com/prettier/angular-html-parser/issues/49563)) ([c024574](https://github.com/prettier/angular-html-parser/commit/c024574f46f18c42c1e5b02afa6c1e3e4219d25b))
* **core:** expose onDestroy on ApplicationRef ([#49677](https://github.com/prettier/angular-html-parser/issues/49677)) ([a5f1737](https://github.com/prettier/angular-html-parser/commit/a5f1737d1c2435b1476c1277bdc9a6827377465f)), closes [#49087](https://github.com/prettier/angular-html-parser/issues/49087)
* **core:** implement `takeUntilDestroyed` in rxjs-interop ([#49154](https://github.com/prettier/angular-html-parser/issues/49154)) ([e883198](https://github.com/prettier/angular-html-parser/commit/e8831984601da631afc29f9fd72d36f57696f936))
* **core:** implement deferred block interaction triggers ([#51830](https://github.com/prettier/angular-html-parser/issues/51830)) ([3cbb2a8](https://github.com/prettier/angular-html-parser/commit/3cbb2a8ecf202c814c37ab241ce9f57fb574692e))
* **core:** implement new block syntax ([#51891](https://github.com/prettier/angular-html-parser/issues/51891)) ([8be2c48](https://github.com/prettier/angular-html-parser/commit/8be2c48b7cda5e99f3d1efa9f26eb2615fea6a8b))
* **core:** implement ɵgetInjectorMetadata debug API ([#51900](https://github.com/prettier/angular-html-parser/issues/51900)) ([a54713c](https://github.com/prettier/angular-html-parser/commit/a54713c8316787eea160cfdb7f2778a087fe59ed))
* **core:** introduce `runInInjectionContext` and deprecate prior version ([#49396](https://github.com/prettier/angular-html-parser/issues/49396)) ([0814f20](https://github.com/prettier/angular-html-parser/commit/0814f2059406dff9cefdd8b210756b6fdcba15b1))
* **core:** introduce concept of DestroyRef ([#49158](https://github.com/prettier/angular-html-parser/issues/49158)) ([0f5c800](https://github.com/prettier/angular-html-parser/commit/0f5c8003ccd1a75516d6a0e31cdb752d031ec430))
* **core:** Mark components for check if they read a signal ([#49153](https://github.com/prettier/angular-html-parser/issues/49153)) ([9b65b84](https://github.com/prettier/angular-html-parser/commit/9b65b84cb9a0392d8aef5b52b34d35c7c5b9f566))
* **core:** mark core signal APIs as stable ([#51821](https://github.com/prettier/angular-html-parser/issues/51821)) ([5b88d13](https://github.com/prettier/angular-html-parser/commit/5b88d136affdaa35e7015c00281b86cae040321b))
* **core:** prototype implementation of @angular/core/rxjs-interop ([#49154](https://github.com/prettier/angular-html-parser/issues/49154)) ([8997bdc](https://github.com/prettier/angular-html-parser/commit/8997bdc03bd3ef0dc1ac68c913bf7d09340cee0d))
* **core:** Provide a diagnostic for missing Signal invocation in template interpolation. ([#49660](https://github.com/prettier/angular-html-parser/issues/49660)) ([8eef694](https://github.com/prettier/angular-html-parser/commit/8eef694def3dc660779168925a380179c7e30993))
* **core:** Remove deprecated `CompilerOptions.useJit` and`CompilerOptions.missingTranslation`. ([#49672](https://github.com/prettier/angular-html-parser/issues/49672)) ([40113f6](https://github.com/prettier/angular-html-parser/commit/40113f653c2468315e1dea64f17e545840cc5e22))
* **core:** remove entryComponents ([#49484](https://github.com/prettier/angular-html-parser/issues/49484)) ([585e34b](https://github.com/prettier/angular-html-parser/commit/585e34bf6c86f7b056b0aafaaca056baedaedae3))
* **core:** revamp the runtime error message for orphan components to include full component info ([#51919](https://github.com/prettier/angular-html-parser/issues/51919)) ([68ba798](https://github.com/prettier/angular-html-parser/commit/68ba798ae3551b789a86d46b0a3bb61d42ef3f87))
* **core:** show runtime error for orphan component rendering ([#52061](https://github.com/prettier/angular-html-parser/issues/52061)) ([1a4aee7](https://github.com/prettier/angular-html-parser/commit/1a4aee7e49074e3bc3f3099bff88eaee9b2ab255))
* **core:** support deferred hover triggers ([#51874](https://github.com/prettier/angular-html-parser/issues/51874)) ([687b961](https://github.com/prettier/angular-html-parser/commit/687b96186c7da731927e55e714061ea2de718505))
* **core:** support deferred triggers with implicit triggers ([#51922](https://github.com/prettier/angular-html-parser/issues/51922)) ([e2e3d69](https://github.com/prettier/angular-html-parser/commit/e2e3d69a277990ab79aac7aae43cbdd398e13ed9))
* **core:** support deferred viewport triggers ([#51874](https://github.com/prettier/angular-html-parser/issues/51874)) ([16f5fc4](https://github.com/prettier/angular-html-parser/commit/16f5fc40a49cee0d29711df1783f297ff30b5c6e))
* **core:** support Provider type in Injector.create ([#49587](https://github.com/prettier/angular-html-parser/issues/49587)) ([cdaa2a8](https://github.com/prettier/angular-html-parser/commit/cdaa2a8a9eab490b55bbb841ede4f54a2656df30))
* **core:** support styles and styleUrl as strings ([#51715](https://github.com/prettier/angular-html-parser/issues/51715)) ([59387ee](https://github.com/prettier/angular-html-parser/commit/59387ee476dff1a893a01fe5cbee3c95b93c0cdb))
* **core:** support TypeScript 5.1 ([#50156](https://github.com/prettier/angular-html-parser/issues/50156)) ([69dadd2](https://github.com/prettier/angular-html-parser/commit/69dadd25020ee84364466c0740f695984dd8c84d))
* **core:** support TypeScript 5.2 ([#51334](https://github.com/prettier/angular-html-parser/issues/51334)) ([9cc52b9](https://github.com/prettier/angular-html-parser/commit/9cc52b9b85ffa5cb65c6886e81b5bff10dde8d52))
* **core:** support usage of non-experimental decorators with TypeScript 5.0 ([#49492](https://github.com/prettier/angular-html-parser/issues/49492)) ([aad05eb](https://github.com/prettier/angular-html-parser/commit/aad05ebeb44afad29fd989019638590344ba61eb))
* **core:** the new list reconciliation algorithm for built-in for ([#51980](https://github.com/prettier/angular-html-parser/issues/51980)) ([7d42dc3](https://github.com/prettier/angular-html-parser/commit/7d42dc3c023391e12ea607beb227fd4426e1694d))
* **devtools:** added instances count and total time in bar chart ([#50866](https://github.com/prettier/angular-html-parser/issues/50866)) ([ee6c915](https://github.com/prettier/angular-html-parser/commit/ee6c915c82b838ee1b3a1e979ab8dc70b3986485))
* **devtools:** create demo application that uses standalone APIs and standalone components/directives/pipes ([#48533](https://github.com/prettier/angular-html-parser/issues/48533)) ([dbadfea](https://github.com/prettier/angular-html-parser/commit/dbadfea67f117f559d6387176b3076d6f055fdc6))
* **devtools:** create profiler for DI and injector events ([#48639](https://github.com/prettier/angular-html-parser/issues/48639)) ([ff4d1b4](https://github.com/prettier/angular-html-parser/commit/ff4d1b4a0e55e8cfbfd7461b002f58f48b0439ba))
* **devtools:** Display getters and setters in devtools property viewer ([#49695](https://github.com/prettier/angular-html-parser/issues/49695)) ([dc4b4aa](https://github.com/prettier/angular-html-parser/commit/dc4b4aa57e38b1c14455f4637a6e3fab83ad97cd))
* **devtools:** Implement initial DI debugging features in devtools ([#51719](https://github.com/prettier/angular-html-parser/issues/51719)) ([8bdbbf4](https://github.com/prettier/angular-html-parser/commit/8bdbbf45101654a1cc88326688701cfe722d6be0))
* **devtools:** Improve Set support in component properties. ([#49316](https://github.com/prettier/angular-html-parser/issues/49316)) ([ba3e9ea](https://github.com/prettier/angular-html-parser/commit/ba3e9eac92231bfae6c1ea9b289fe5544a3bf7e0)), closes [#49312](https://github.com/prettier/angular-html-parser/issues/49312)
* **docs-infra:** add option to filter docs with developer preview status ([#50142](https://github.com/prettier/angular-html-parser/issues/50142)) ([19913cc](https://github.com/prettier/angular-html-parser/commit/19913ccbb7f24e9509ba096fb51a422473a26e1f))
* **forms:** Improve typings form (async)Validators ([#48679](https://github.com/prettier/angular-html-parser/issues/48679)) ([07a1aa3](https://github.com/prettier/angular-html-parser/commit/07a1aa300404969155ed1eb3cd02f4a766e07963)), closes [#48676](https://github.com/prettier/angular-html-parser/issues/48676)
* **http:** allow `HttpClient` to cache requests ([#49509](https://github.com/prettier/angular-html-parser/issues/49509)) ([aff1512](https://github.com/prettier/angular-html-parser/commit/aff15129501511569bbb4ff6dfcb16ad1c01890d))
* **http:** allow customization of the HttpTransferCache. ([#52029](https://github.com/prettier/angular-html-parser/issues/52029)) ([7dde42a](https://github.com/prettier/angular-html-parser/commit/7dde42a5dfdab30e9420708722e0bef9f1467d1f)), closes [#50117](https://github.com/prettier/angular-html-parser/issues/50117)
* **http:** Introduction of the `fetch` Backend for the `HttpClient` ([#50247](https://github.com/prettier/angular-html-parser/issues/50247)) ([85c5427](https://github.com/prettier/angular-html-parser/commit/85c54275825a57fd3c7055a99e58bb211e085af9))
* **language-service:** Complete inside [@switch](https://github.com/switch) ([#52153](https://github.com/prettier/angular-html-parser/issues/52153)) ([449830f](https://github.com/prettier/angular-html-parser/commit/449830f24e78ebd977ca3210ab3541912d959245))
* **language-service:** Enable go to definition of styleUrl ([#51746](https://github.com/prettier/angular-html-parser/issues/51746)) ([e2416a2](https://github.com/prettier/angular-html-parser/commit/e2416a284ff086752c809689ef74588f02e5f0e4))
* **language-service:** Implement outlining spans for control flow blocks ([#52062](https://github.com/prettier/angular-html-parser/issues/52062)) ([023a181](https://github.com/prettier/angular-html-parser/commit/023a181ba5f489deb0a47bbc9b290621ad38304a))
* **language-service:** Support autocompletion for blocks ([#52121](https://github.com/prettier/angular-html-parser/issues/52121)) ([7c052bb](https://github.com/prettier/angular-html-parser/commit/7c052bb6efde580afc61d6c50e787353c103e3e1))
* **migrations:** Migration to remove `Router` guard and resolver interfaces ([#49337](https://github.com/prettier/angular-html-parser/issues/49337)) ([5e5dac2](https://github.com/prettier/angular-html-parser/commit/5e5dac278d57d29277f0847f025e7dfa850bec45))
* **migrations:** schematic to remove deprecated CompilerOptions properties ([#49672](https://github.com/prettier/angular-html-parser/issues/49672)) ([f0da7c2](https://github.com/prettier/angular-html-parser/commit/f0da7c2e44a29c5a71cf4880388989d129f4c6e8))
* **migrations:** Schematics for `TransferState`, `StateKey` and `makeStateKey` migration. ([#49594](https://github.com/prettier/angular-html-parser/issues/49594)) ([965ce5a](https://github.com/prettier/angular-html-parser/commit/965ce5a8c514237aa8e4c03a5e4b5527a1a19d96)), closes [#49563](https://github.com/prettier/angular-html-parser/issues/49563)
* parse ICU expressions if also parsing block syntax ([#38](https://github.com/prettier/angular-html-parser/issues/38)) ([9fade4f](https://github.com/prettier/angular-html-parser/commit/9fade4f9ba12867debd7af88943d45024e87d4be))
* **platform-browser:** add a public API function to enable non-destructive hydration ([#49666](https://github.com/prettier/angular-html-parser/issues/49666)) ([761e02d](https://github.com/prettier/angular-html-parser/commit/761e02d912e4f910f9e5e915c019dc1fef0d0839))
* **platform-browser:** deprecate `withServerTransition` call ([#49422](https://github.com/prettier/angular-html-parser/issues/49422)) ([630af63](https://github.com/prettier/angular-html-parser/commit/630af63fae2e279e88805aecf01db58be6dfbafb))
* **platform-browser:** enable HTTP request caching when using `provideClientHydration` ([#49699](https://github.com/prettier/angular-html-parser/issues/49699)) ([81e7d15](https://github.com/prettier/angular-html-parser/commit/81e7d15ef65b70c9734ebfd2c865e70d743263dc))
* **platform-browser:** enable removal of styles on component destroy by default ([#51571](https://github.com/prettier/angular-html-parser/issues/51571)) ([c340d6e](https://github.com/prettier/angular-html-parser/commit/c340d6e0440bd982dff6f9f4f4229931c62d2c08))
* **platform-browser:** expose `EventManagerPlugin` in the public API. ([#49969](https://github.com/prettier/angular-html-parser/issues/49969)) ([c5daa6c](https://github.com/prettier/angular-html-parser/commit/c5daa6ce776724d44c02cc97f1a349a85cb2a819))
* **platform-server:** `renderApplication` now accepts a bootstrapping method ([#49248](https://github.com/prettier/angular-html-parser/issues/49248)) ([b5278cc](https://github.com/prettier/angular-html-parser/commit/b5278cc115ee6383a20783967b9e7da3f6184dcd))
* **platform-server:** add `provideServerSupport` function to provide server capabilities to an application ([#49380](https://github.com/prettier/angular-html-parser/issues/49380)) ([056d680](https://github.com/prettier/angular-html-parser/commit/056d68002fbe6024b486bb7220bc77f8f9a07707))
* **platform-server:** rename `provideServerSupport` to `provideServerRendering` ([#49678](https://github.com/prettier/angular-html-parser/issues/49678)) ([7870fb0](https://github.com/prettier/angular-html-parser/commit/7870fb07fe6b25f5ebb22497bff3a03b7b5fc646))
* **router:** Add callback to execute when a view transition is created ([#52002](https://github.com/prettier/angular-html-parser/issues/52002)) ([1da28f4](https://github.com/prettier/angular-html-parser/commit/1da28f482517ea53a18e4eb526c7c9708e6fcb55)), closes [#51827](https://github.com/prettier/angular-html-parser/issues/51827)
* **router:** Add feature to support the View Transitions API ([#51314](https://github.com/prettier/angular-html-parser/issues/51314)) ([73e4bf2](https://github.com/prettier/angular-html-parser/commit/73e4bf2ed2471faf44a49b591e19a390d5867449)), closes [#49401](https://github.com/prettier/angular-html-parser/issues/49401)
* **router:** Add option to skip the first view transition ([#51825](https://github.com/prettier/angular-html-parser/issues/51825)) ([86e9146](https://github.com/prettier/angular-html-parser/commit/86e91463afc1f3d3d71a669fb2919f2b8bc5a1ca)), closes [#51815](https://github.com/prettier/angular-html-parser/issues/51815)
* **router:** Expose information about the last successful `Navigation` ([#49235](https://github.com/prettier/angular-html-parser/issues/49235)) ([ea32c32](https://github.com/prettier/angular-html-parser/commit/ea32c3289ad773a821b3432fb8d4c36d0d9fbd9d)), closes [#45685](https://github.com/prettier/angular-html-parser/issues/45685)
* **router:** exposes the `fixture` of the `RouterTestingHarness` ([#50280](https://github.com/prettier/angular-html-parser/issues/50280)) ([0b14e4e](https://github.com/prettier/angular-html-parser/commit/0b14e4ef742b1c0f73d873e2c337683b60f46845)), closes [#48855](https://github.com/prettier/angular-html-parser/issues/48855)
* **router:** helper functions to convert class guards to functional ([#48709](https://github.com/prettier/angular-html-parser/issues/48709)) ([455c728](https://github.com/prettier/angular-html-parser/commit/455c7285257a8def53ae6c9d14e9848d72ae2613))
* **router:** Opt-in for binding `Router` information to component inputs ([#49633](https://github.com/prettier/angular-html-parser/issues/49633)) ([f982a3f](https://github.com/prettier/angular-html-parser/commit/f982a3f965995c4883780b0d48cb5d1411ebad0f)), closes [#18967](https://github.com/prettier/angular-html-parser/issues/18967)
* **service-worker:** add function to provide service worker ([#48247](https://github.com/prettier/angular-html-parser/issues/48247)) ([5e7fc25](https://github.com/prettier/angular-html-parser/commit/5e7fc259ead62ee9b4f8a9a77a455065b6a8e2d8))
* **zone.js:** jest 29 should ignore uncaught error console log ([#49325](https://github.com/prettier/angular-html-parser/issues/49325)) ([bc412fd](https://github.com/prettier/angular-html-parser/commit/bc412fd537f965b20dce69232ef66f152962dc06)), closes [#49110](https://github.com/prettier/angular-html-parser/issues/49110)
* **zone.js:** remove legacy files and access to deep imports ([#51752](https://github.com/prettier/angular-html-parser/issues/51752)) ([a8efc60](https://github.com/prettier/angular-html-parser/commit/a8efc605ea9c3cf03d85b5c567218202e304fef9))


### Bug Fixes

* **animations:** Ensure elements are removed from the cache after leave animation. ([#50929](https://github.com/prettier/angular-html-parser/issues/50929)) ([a14bdfe](https://github.com/prettier/angular-html-parser/commit/a14bdfe8591a33d359bf4940f4efa828499a6373)), closes [#24197](https://github.com/prettier/angular-html-parser/issues/24197) [#50533](https://github.com/prettier/angular-html-parser/issues/50533)
* **animations:** remove code duplication between entry-points ([#51500](https://github.com/prettier/angular-html-parser/issues/51500)) ([698c058](https://github.com/prettier/angular-html-parser/commit/698c058e1c975c573722407f4843a4a774ceb92a))
* **animations:** remove unnecessary escaping in regex expressions ([#51554](https://github.com/prettier/angular-html-parser/issues/51554)) ([18be804](https://github.com/prettier/angular-html-parser/commit/18be804c038e8d81a60c9a72521cfa640c8a1d5a))
* **animations:** Trigger leave animation when ViewContainerRef is injected ([#48705](https://github.com/prettier/angular-html-parser/issues/48705)) ([bada919](https://github.com/prettier/angular-html-parser/commit/bada9199f53cb631d065a961427a3a1a8d9762f1)), closes [angular#48667](https://github.com/prettier/angular/issues/48667)
* **bazel:** allow setting `_enabledBlockTypes` angular compiler option ([#51862](https://github.com/prettier/angular-html-parser/issues/51862)) ([cb54580](https://github.com/prettier/angular-html-parser/commit/cb545807bc62cd6c11e047383a843d5836d627ec))
* **bazel:** dedupe es2022 javascript files properly ([#51500](https://github.com/prettier/angular-html-parser/issues/51500)) ([a6b7dbc](https://github.com/prettier/angular-html-parser/commit/a6b7dbc1dbd97777b1f28a103dd542fed7ff8963))
* **bazel:** stop publishing @angular/bazel package to npm ([#49093](https://github.com/prettier/angular-html-parser/issues/49093)) ([3a6aebf](https://github.com/prettier/angular-html-parser/commit/3a6aebf349850de7944870fbc8512350ea334c7a))
* **benchpress:** correctly report GC memory amounts ([#50760](https://github.com/prettier/angular-html-parser/issues/50760)) ([dd850b2](https://github.com/prettier/angular-html-parser/commit/dd850b2ab781f24065550f8a948ced498e0f1e99))
* **common:** add missing types field for @angular/common/locales of exports in package.json ([#52080](https://github.com/prettier/angular-html-parser/issues/52080)) ([da056a1](https://github.com/prettier/angular-html-parser/commit/da056a1fe2816299319fb3f87416316be2029479)), closes [#52011](https://github.com/prettier/angular-html-parser/issues/52011)
* **common:** Allow safeUrl for ngSrc in NgOptimizedImage ([#51351](https://github.com/prettier/angular-html-parser/issues/51351)) ([d910bf8](https://github.com/prettier/angular-html-parser/commit/d910bf8a843c07a096969d5e47b49f60981b00e9))
* **common:** allow to specify only some properties of `DatePipeConfig` ([#51287](https://github.com/prettier/angular-html-parser/issues/51287)) ([85843e8](https://github.com/prettier/angular-html-parser/commit/85843e8212e99deb8b70f3d3f8dfe002b978cbb1))
* **common:** fix incorrectly reported distortion for padded images ([#49889](https://github.com/prettier/angular-html-parser/issues/49889)) ([5a37928](https://github.com/prettier/angular-html-parser/commit/5a37928babc1eecaf66bf67f9678f64ed388c98a))
* **common:** invalid ImageKit transformation ([#49201](https://github.com/prettier/angular-html-parser/issues/49201)) ([6499f5a](https://github.com/prettier/angular-html-parser/commit/6499f5ae28fbd02147e8fe4bc7f4487bad1f0198))
* **common:** make Location.normalize() return the correct path when the base path contains characters that interfere with regex syntax. ([#49181](https://github.com/prettier/angular-html-parser/issues/49181)) ([3c9d49a](https://github.com/prettier/angular-html-parser/commit/3c9d49a4d7304202d60eeed97b2bb00686c079d0)), closes [#49179](https://github.com/prettier/angular-html-parser/issues/49179)
* **common:** missing space in ngSwitch equality warning ([#52180](https://github.com/prettier/angular-html-parser/issues/52180)) ([b1cb0b3](https://github.com/prettier/angular-html-parser/commit/b1cb0b395b6fadd487a72dc186965fcaf120ac0f))
* **common:** remove code duplication between entry-points ([#51500](https://github.com/prettier/angular-html-parser/issues/51500)) ([86c5e34](https://github.com/prettier/angular-html-parser/commit/86c5e34601d7901a11688124aa902646524177eb))
* **common:** strict type checking for ngtemplateoutlet ([#48374](https://github.com/prettier/angular-html-parser/issues/48374)) ([d47fef7](https://github.com/prettier/angular-html-parser/commit/d47fef72cb497db555e67db50997b3b1cc3ee590)), closes [#43510](https://github.com/prettier/angular-html-parser/issues/43510)
* **common:** untrack subscription and unsubscription in async pipe ([#50522](https://github.com/prettier/angular-html-parser/issues/50522)) ([72b4ff4](https://github.com/prettier/angular-html-parser/commit/72b4ff4b9ea8bd77ab74f9834727390c82acb28d)), closes [#50382](https://github.com/prettier/angular-html-parser/issues/50382)
* **common:** use === operator to match NgSwitch cases ([#51504](https://github.com/prettier/angular-html-parser/issues/51504)) ([28a5925](https://github.com/prettier/angular-html-parser/commit/28a5925f53790067d45f1f68d204a36088dbf5e3)), closes [#33873](https://github.com/prettier/angular-html-parser/issues/33873)
* **compiler-cli:** allow non-array imports for standalone component in local compilation mode ([#51819](https://github.com/prettier/angular-html-parser/issues/51819)) ([5b66330](https://github.com/prettier/angular-html-parser/commit/5b66330329fd066a7c347f040a330b4c7f2a0a2b))
* **compiler-cli:** bypass static resolving of the component's changeDetection field in local compilation mode ([#51848](https://github.com/prettier/angular-html-parser/issues/51848)) ([377a7ab](https://github.com/prettier/angular-html-parser/commit/377a7abfda60a6ddd55a41531e3653bcad78b0a2))
* **compiler-cli:** catch fatal diagnostic when getting diagnostics for components ([#50046](https://github.com/prettier/angular-html-parser/issues/50046)) ([ce00738](https://github.com/prettier/angular-html-parser/commit/ce00738f9898527a6da2cd577a469e2683c42eff))
* **compiler-cli:** Catch FatalDiagnosticError during template type checking ([#49527](https://github.com/prettier/angular-html-parser/issues/49527)) ([8a75a8a](https://github.com/prettier/angular-html-parser/commit/8a75a8ad26cf24eda0a4b49d7ba97cca99aaaefa))
* **compiler-cli:** correct incomplete escaping ([#51557](https://github.com/prettier/angular-html-parser/issues/51557)) ([de2550d](https://github.com/prettier/angular-html-parser/commit/de2550d9886394e1ecde586d72bf2bab5b65cb39))
* **compiler-cli:** do not persist component analysis if template/styles are missing ([#49184](https://github.com/prettier/angular-html-parser/issues/49184)) ([b6c6dfd](https://github.com/prettier/angular-html-parser/commit/b6c6dfd2781864de51bdf4bc45636aae68ea8828))
* **compiler-cli:** enforce a minimum version to be used when a library uses input transform ([#51413](https://github.com/prettier/angular-html-parser/issues/51413)) ([5bd9fbd](https://github.com/prettier/angular-html-parser/commit/5bd9fbd2c3ab4467074fac5e4d689b3c85bf08cd)), closes [#51411](https://github.com/prettier/angular-html-parser/issues/51411)
* **compiler-cli:** fix NgModule injector def in local compilation mode when imports/exports are non-array expressions ([#51819](https://github.com/prettier/angular-html-parser/issues/51819)) ([19c3dc1](https://github.com/prettier/angular-html-parser/commit/19c3dc18d3c0cfd83efec2c8f81b40860d570346))
* **compiler-cli:** handle nested qualified names in ctor injection in local compilation mode ([#51947](https://github.com/prettier/angular-html-parser/issues/51947)) ([11bb19c](https://github.com/prettier/angular-html-parser/commit/11bb19cafcf447b7ce6ade146d431a43c3e2c682))
* **compiler-cli:** incorrectly detecting forward refs when symbol already exists in file ([#48988](https://github.com/prettier/angular-html-parser/issues/48988)) ([0cf1116](https://github.com/prettier/angular-html-parser/commit/0cf11167f13108992ec781e88ab2a7d1fc7f5a0d)), closes [#48898](https://github.com/prettier/angular-html-parser/issues/48898)
* **compiler-cli:** libraries compiled with v16.1+ breaking with Angular framework v16.0.x ([#50714](https://github.com/prettier/angular-html-parser/issues/50714)) ([12bad65](https://github.com/prettier/angular-html-parser/commit/12bad6576d2ffe4667118b214d9c7598ed3d8edb))
* **compiler-cli:** modify `getConstructorDependencies` helper to work with reflection host after the previous change ([#52215](https://github.com/prettier/angular-html-parser/issues/52215)) ([56a76d7](https://github.com/prettier/angular-html-parser/commit/56a76d73e037aeea1975808d5c51608fd23d4fa6))
* **compiler-cli:** remove unnecessary escaping in regex expressions ([#51554](https://github.com/prettier/angular-html-parser/issues/51554)) ([3bca9db](https://github.com/prettier/angular-html-parser/commit/3bca9db4a56d61ac22b4ce87591d8862606177c8))
* **compiler-cli:** resolve component encapsulation enum in local compilation mode ([#51848](https://github.com/prettier/angular-html-parser/issues/51848)) ([f91f222](https://github.com/prettier/angular-html-parser/commit/f91f222b55f249089d267c72a9c0ab5b09d7c932))
* **compiler:** account for type-only imports in defer blocks ([#52343](https://github.com/prettier/angular-html-parser/issues/52343)) ([b6b5adc](https://github.com/prettier/angular-html-parser/commit/b6b5adca384ec95cc06e3c665dd512714c852781))
* **compiler:** add diagnostic for inaccessible deferred trigger ([#51922](https://github.com/prettier/angular-html-parser/issues/51922)) ([23bfa10](https://github.com/prettier/angular-html-parser/commit/23bfa10ac809f6b27d32647210c52329f0e4262e))
* **compiler:** allocating unnecessary slots in conditional instruction ([#51913](https://github.com/prettier/angular-html-parser/issues/51913)) ([31295a3](https://github.com/prettier/angular-html-parser/commit/31295a3cf907a61e7115d9039a83a232b263a676))
* **compiler:** allow newlines in track and let expressions ([#52137](https://github.com/prettier/angular-html-parser/issues/52137)) ([7dbd47f](https://github.com/prettier/angular-html-parser/commit/7dbd47fb3015117c420f984181bfcb48e533525a)), closes [#52132](https://github.com/prettier/angular-html-parser/issues/52132)
* **compiler:** allow nullable values in for loop block ([#51997](https://github.com/prettier/angular-html-parser/issues/51997)) ([0eae992](https://github.com/prettier/angular-html-parser/commit/0eae992c4e03b7c9039476e03b72e92d662293df)), closes [#51993](https://github.com/prettier/angular-html-parser/issues/51993)
* **compiler:** apply style on :host attributes in prod builds. ([#49118](https://github.com/prettier/angular-html-parser/issues/49118)) ([0198d21](https://github.com/prettier/angular-html-parser/commit/0198d21231565f5eeaa27a871b9bb9e950b4a869)), closes [#49100](https://github.com/prettier/angular-html-parser/issues/49100)
* **compiler:** avoid error in template parser for tag names that can occur in object prototype ([#52225](https://github.com/prettier/angular-html-parser/issues/52225)) ([302ab34](https://github.com/prettier/angular-html-parser/commit/302ab340e07a4a7d5639b6fc9997a101af39cb57)), closes [#52224](https://github.com/prettier/angular-html-parser/issues/52224)
* **compiler:** do not remove comments in component styles ([#50346](https://github.com/prettier/angular-html-parser/issues/50346)) ([540e643](https://github.com/prettier/angular-html-parser/commit/540e643347b9cb889b4ef8acb81bf39b31a778c9)), closes [#50308](https://github.com/prettier/angular-html-parser/issues/50308)
* **compiler:** do not unquote CSS values ([#49460](https://github.com/prettier/angular-html-parser/issues/49460)) ([1829542](https://github.com/prettier/angular-html-parser/commit/1829542aeabd0e4d5dfb1790872a00d248cd52fd))
* **compiler:** don't allocate variable to for loop expression ([#52158](https://github.com/prettier/angular-html-parser/issues/52158)) ([9d19c8e](https://github.com/prettier/angular-html-parser/commit/9d19c8e31752d211f575246282358b83afe90969))
* **compiler:** enable block syntax in the linker ([#51979](https://github.com/prettier/angular-html-parser/issues/51979)) ([9acd2ac](https://github.com/prettier/angular-html-parser/commit/9acd2ac98bc3b6ffc5a8d6c19f7290d05fe1f896))
* **compiler:** error when reading compiled input transforms metadata in JIT mode ([#50600](https://github.com/prettier/angular-html-parser/issues/50600)) ([4e66329](https://github.com/prettier/angular-html-parser/commit/4e663297c564078c8185c6a73e2baa844406a315)), closes [#50580](https://github.com/prettier/angular-html-parser/issues/50580)
* **compiler:** forward referenced dependencies not identified as deferrable ([#52017](https://github.com/prettier/angular-html-parser/issues/52017)) ([1d871c0](https://github.com/prettier/angular-html-parser/commit/1d871c03a523e10bb838cb0f9550595cfbd9d14d)), closes [#52014](https://github.com/prettier/angular-html-parser/issues/52014)
* **compiler:** handle trailing comma in object literal ([#49535](https://github.com/prettier/angular-html-parser/issues/49535)) ([73d2f3c](https://github.com/prettier/angular-html-parser/commit/73d2f3c8666f6456c7db9735e1e20af8c4ed328c)), closes [#49534](https://github.com/prettier/angular-html-parser/issues/49534)
* **compiler:** incorrectly matching directives on attribute bindings ([#49713](https://github.com/prettier/angular-html-parser/issues/49713)) ([8020347](https://github.com/prettier/angular-html-parser/commit/8020347f266116feedeb3ea584ba3f12e921f7b3))
* **compiler:** narrow the type of expressions in event listeners inside if blocks ([#52069](https://github.com/prettier/angular-html-parser/issues/52069)) ([16ff08e](https://github.com/prettier/angular-html-parser/commit/16ff08ec70bfa192041ba050e550676e8d505a05)), closes [#52052](https://github.com/prettier/angular-html-parser/issues/52052)
* **compiler:** narrow the type of expressions in event listeners inside switch blocks ([#52069](https://github.com/prettier/angular-html-parser/issues/52069)) ([ac0d5dc](https://github.com/prettier/angular-html-parser/commit/ac0d5dcfd6015ec4283ed1a5cf241f130f4c5cf5)), closes [#52052](https://github.com/prettier/angular-html-parser/issues/52052)
* **compiler:** narrow the type of the aliased if block expression ([#51952](https://github.com/prettier/angular-html-parser/issues/51952)) ([02edb43](https://github.com/prettier/angular-html-parser/commit/02edb4306736e6f12e87a4164c17eca6cbdfe151))
* **compiler:** pipes used inside defer triggers not being picked up ([#52071](https://github.com/prettier/angular-html-parser/issues/52071)) ([17078a3](https://github.com/prettier/angular-html-parser/commit/17078a3fe1e9b90e48952b6c12b6e6b774b97810)), closes [#52068](https://github.com/prettier/angular-html-parser/issues/52068)
* **compiler:** pipes using DI not working in blocks ([#52112](https://github.com/prettier/angular-html-parser/issues/52112)) ([861ce3a](https://github.com/prettier/angular-html-parser/commit/861ce3a7c574340a6164ad0de13f49bda3e172da)), closes [#52102](https://github.com/prettier/angular-html-parser/issues/52102)
* **compiler:** Produce diagnositc if directive used in host binding is not exported ([#49527](https://github.com/prettier/angular-html-parser/issues/49527)) ([e949548](https://github.com/prettier/angular-html-parser/commit/e9495485617ec0bb05543ba1edfb08425b455ad4))
* **compiler:** resolve deprecation warning with TypeScript 5.1 ([#50460](https://github.com/prettier/angular-html-parser/issues/50460)) ([721bc72](https://github.com/prettier/angular-html-parser/commit/721bc72649b7d73f730298e04a4606a8bfd53011))
* **compiler:** return full spans for Comment nodes ([#50855](https://github.com/prettier/angular-html-parser/issues/50855)) ([6755f53](https://github.com/prettier/angular-html-parser/commit/6755f5354c7657ecb6f2643450dd2572b114a895))
* **compiler:** template type checking not reporting diagnostics for incompatible type comparisons ([#52322](https://github.com/prettier/angular-html-parser/issues/52322)) ([dc3f7cb](https://github.com/prettier/angular-html-parser/commit/dc3f7cb3bfc4f22c1e34abeb5a5311ce1e756c90)), closes [#52110](https://github.com/prettier/angular-html-parser/issues/52110) [#52315](https://github.com/prettier/angular-html-parser/issues/52315)
* **compiler:** update the minVersion if component uses block syntax ([#51979](https://github.com/prettier/angular-html-parser/issues/51979)) ([1beef49](https://github.com/prettier/angular-html-parser/commit/1beef49d80809fbb0e7c8e95f17096c39ac8940a))
* **compiler:** work around TypeScript bug when narrowing switch statements ([#52110](https://github.com/prettier/angular-html-parser/issues/52110)) ([386e1e9](https://github.com/prettier/angular-html-parser/commit/386e1e950033ad98661e5077a4f119df0e7b3008)), closes [#52077](https://github.com/prettier/angular-html-parser/issues/52077)
* **core:** add additional component metadata to component ID generation ([#50203](https://github.com/prettier/angular-html-parser/issues/50203)) ([6636e83](https://github.com/prettier/angular-html-parser/commit/6636e8321b81aca26925472e5359df9cc3dc3c0c)), closes [/github.com/angular/angular/issues/50158#issuecomment-1537061939](https://github.com/prettier//github.com/angular/angular/issues/50158/issues/issuecomment-1537061939)
* **core:** add additional component metadata to component ID generation ([#50336](https://github.com/prettier/angular-html-parser/issues/50336)) ([c0ebe34](https://github.com/prettier/angular-html-parser/commit/c0ebe34cbd235dc0b5e56fbe37429b77c0d91170))
* **core:** add newline to hydration mismatch error ([#49965](https://github.com/prettier/angular-html-parser/issues/49965)) ([be104ec](https://github.com/prettier/angular-html-parser/commit/be104ec6edc28d912d9dc4435e689a25a9af547e))
* **core:** adjust toSignal types to handle more common cases ([#51991](https://github.com/prettier/angular-html-parser/issues/51991)) ([5411864](https://github.com/prettier/angular-html-parser/commit/5411864c2e74b52e7df8022719f0fd792b50a849)), closes [#50687](https://github.com/prettier/angular-html-parser/issues/50687) [#50591](https://github.com/prettier/angular-html-parser/issues/50591)
* **core:** Allow `TestBed.configureTestingModule` to work with recursive cycle of standalone components. ([#49473](https://github.com/prettier/angular-html-parser/issues/49473)) ([2303458](https://github.com/prettier/angular-html-parser/commit/230345876c2a2ff6289ca44c5a00fc6421c8d8eb)), closes [#49469](https://github.com/prettier/angular-html-parser/issues/49469)
* **core:** allow async functions in effects ([#49783](https://github.com/prettier/angular-html-parser/issues/49783)) ([ce38be0](https://github.com/prettier/angular-html-parser/commit/ce38be03cef540e5f0b406aad6a9a98ff040f0a7))
* **core:** allow onDestroy unregistration while destroying ([#50237](https://github.com/prettier/angular-html-parser/issues/50237)) ([03f1e24](https://github.com/prettier/angular-html-parser/commit/03f1e240b368c4c87fd8412605bf0eff9adc153d)), closes [#50221](https://github.com/prettier/angular-html-parser/issues/50221)
* **core:** allow passing value of any type to `isSignal` function ([#50035](https://github.com/prettier/angular-html-parser/issues/50035)) ([165b8b6](https://github.com/prettier/angular-html-parser/commit/165b8b647c39503b9fefd00188948cdc522c2c10))
* **core:** allow toSignal calls in reactive context ([#51831](https://github.com/prettier/angular-html-parser/issues/51831)) ([dcf18dc](https://github.com/prettier/angular-html-parser/commit/dcf18dc74c260253bbf394626beb712a831824f3)), closes [#51027](https://github.com/prettier/angular-html-parser/issues/51027)
* **core:** avoid duplicated code between entry-points (primary, testing, rxjs-interop) ([#51500](https://github.com/prettier/angular-html-parser/issues/51500)) ([dbffdc0](https://github.com/prettier/angular-html-parser/commit/dbffdc09c25c93868aa13ae368c9fd21a4c359fb))
* **core:** avoid duplicated content during hydration while processing a component with i18n ([#50644](https://github.com/prettier/angular-html-parser/issues/50644)) ([307f8ee](https://github.com/prettier/angular-html-parser/commit/307f8eee2c6a3d2d6ccdeca0882106164f49a1d1)), closes [#50627](https://github.com/prettier/angular-html-parser/issues/50627)
* **core:** bootstrapApplication call not rejected when error is thrown in importProvidersFrom module ([#50120](https://github.com/prettier/angular-html-parser/issues/50120)) ([cd90e4c](https://github.com/prettier/angular-html-parser/commit/cd90e4ca08ecb1567805a6b549e1a8d5d87e189c)), closes [#49923](https://github.com/prettier/angular-html-parser/issues/49923)
* **core:** catch errors from source signals outside of .next ([#49769](https://github.com/prettier/angular-html-parser/issues/49769)) ([53d019a](https://github.com/prettier/angular-html-parser/commit/53d019ab7da4992f9cca25c65ed25e009749b736))
* **core:** ComponentRef.setInput only sets input when not equal to previous ([#49607](https://github.com/prettier/angular-html-parser/issues/49607)) ([be23b7c](https://github.com/prettier/angular-html-parser/commit/be23b7ce650634c95f6709a879c89bbad45c4701))
* **core:** correct incomplete escaping ([#51557](https://github.com/prettier/angular-html-parser/issues/51557)) ([45d2ded](https://github.com/prettier/angular-html-parser/commit/45d2ded0ea9ef414948256099f8dc9c4598fdc2b))
* **core:** deferred blocks not removing content immediately when animations are enabled ([#51971](https://github.com/prettier/angular-html-parser/issues/51971)) ([4f69d62](https://github.com/prettier/angular-html-parser/commit/4f69d620d94663592780b2875acbc2b1918775f9)), closes [#51970](https://github.com/prettier/angular-html-parser/issues/51970)
* **core:** deprecate `moduleId` `@Component` property ([#49496](https://github.com/prettier/angular-html-parser/issues/49496)) ([316c91b](https://github.com/prettier/angular-html-parser/commit/316c91b1a47f1fb574045553288acca5fcb6e354))
* **core:** disallow `afterRender` in reactive contexts ([#52138](https://github.com/prettier/angular-html-parser/issues/52138)) ([df58c0b](https://github.com/prettier/angular-html-parser/commit/df58c0b714e37152ddf81855ee31f93f9fa71e30))
* **core:** disallow using `effect` inside reactive contexts ([#52138](https://github.com/prettier/angular-html-parser/issues/52138)) ([5d61221](https://github.com/prettier/angular-html-parser/commit/5d61221ed7b4a5d1ef005183045d45238b19a446))
* **core:** do not remove used ng-template nodes in control flow migration ([#52186](https://github.com/prettier/angular-html-parser/issues/52186)) ([20e7e21](https://github.com/prettier/angular-html-parser/commit/20e7e21679f43cba74d4eaaa801c1d2e935517c6))
* **core:** drop mutate function from the signals public API ([#51821](https://github.com/prettier/angular-html-parser/issues/51821)) ([c7ff9df](https://github.com/prettier/angular-html-parser/commit/c7ff9dff2c14aba70e92b9e216a2d4d97d6ef71e))
* **core:** drop mutate function from the signals public API ([#51821](https://github.com/prettier/angular-html-parser/issues/51821)) ([#51986](https://github.com/prettier/angular-html-parser/issues/51986)) ([00128e3](https://github.com/prettier/angular-html-parser/commit/00128e38538f12fe9bc72ede9b55149e0be5ead0))
* **core:** emit provider configured event when a service is configured with `providedIn` ([#52365](https://github.com/prettier/angular-html-parser/issues/52365)) ([31b8870](https://github.com/prettier/angular-html-parser/commit/31b887048a0c42e4fe1e0152489a824302e85a40))
* **core:** ensure a consumer drops all its stale producers ([#51722](https://github.com/prettier/angular-html-parser/issues/51722)) ([5ead7d4](https://github.com/prettier/angular-html-parser/commit/5ead7d412d847c85176a321e58d12dcdfc0dab67))
* **core:** Ensure backwards-referenced transplanted views are refreshed ([#51854](https://github.com/prettier/angular-html-parser/issues/51854)) ([76152a5](https://github.com/prettier/angular-html-parser/commit/76152a5fc66e16342045cfd038b53913c32b38da)), closes [angular#49801](https://github.com/prettier/angular/issues/49801)
* **core:** Ensure effects can be created when Zone is not defined ([#49890](https://github.com/prettier/angular-html-parser/issues/49890)) ([a49279d](https://github.com/prettier/angular-html-parser/commit/a49279d0f2a4f58e59e25cbfdaee973c5abd2581)), closes [#49798](https://github.com/prettier/angular-html-parser/issues/49798)
* **core:** ensure takeUntilDestroyed unregisters onDestroy listener on unsubscribe ([#49901](https://github.com/prettier/angular-html-parser/issues/49901)) ([c029c67](https://github.com/prettier/angular-html-parser/commit/c029c678d9587d3bbeeb60720b226c83ec52bedf))
* **core:** ensure that standalone components get correct injector instances ([#50954](https://github.com/prettier/angular-html-parser/issues/50954)) ([031b599](https://github.com/prettier/angular-html-parser/commit/031b599a5528e1df5779695eb75b738a5a3076fe)), closes [#50724](https://github.com/prettier/angular-html-parser/issues/50724)
* **core:** error if document body is null ([#49818](https://github.com/prettier/angular-html-parser/issues/49818)) ([5ac8ca4](https://github.com/prettier/angular-html-parser/commit/5ac8ca4f55b4d2901238f49ffff7a7970f6fe7f0))
* **core:** execute input setters in non-reactive context ([#49906](https://github.com/prettier/angular-html-parser/issues/49906)) ([4031802](https://github.com/prettier/angular-html-parser/commit/40318021ee8f748a874211976beb729196ceb81a))
* **core:** execute query setters in non-reactive context ([#49906](https://github.com/prettier/angular-html-parser/issues/49906)) ([1dc919a](https://github.com/prettier/angular-html-parser/commit/1dc919a3df0275b2531b703e20723bf010534410))
* **core:** execute template creation in non-reactive context ([#49883](https://github.com/prettier/angular-html-parser/issues/49883)) ([b7392f9](https://github.com/prettier/angular-html-parser/commit/b7392f90647366e4d75ffb454872c8dc5322a2f1)), closes [#49871](https://github.com/prettier/angular-html-parser/issues/49871)
* **core:** expose input transform function on ComponentFactory and ComponentMirror ([#50713](https://github.com/prettier/angular-html-parser/issues/50713)) ([29340a0](https://github.com/prettier/angular-html-parser/commit/29340a06789652e359e61b32f1814dcd20d9bd26))
* **core:** extend toSignal to accept any Subscribable ([#50162](https://github.com/prettier/angular-html-parser/issues/50162)) ([1ad4d55](https://github.com/prettier/angular-html-parser/commit/1ad4d55d9116898f2da3307b1c99c26c0faa05a5))
* **core:** fix `Self` flag inside embedded views with custom injectors ([#50270](https://github.com/prettier/angular-html-parser/issues/50270)) ([75fdbcb](https://github.com/prettier/angular-html-parser/commit/75fdbcb8f285ef17b5a73fb820b983137e40cab7)), closes [#49959](https://github.com/prettier/angular-html-parser/issues/49959)
* **core:** Fix capitalization of toObservableOptions ([#49832](https://github.com/prettier/angular-html-parser/issues/49832)) ([90166be](https://github.com/prettier/angular-html-parser/commit/90166bed25cd165767612554c7f9288a010f70f5))
* **core:** framework debug APIs getDependenciesForTokenInInjector and getInjectorMetadata ([#51719](https://github.com/prettier/angular-html-parser/issues/51719)) ([50ad074](https://github.com/prettier/angular-html-parser/commit/50ad074505c15d09fe5d85fb443d9a2775125f87))
* **core:** generate consistent component IDs ([#48253](https://github.com/prettier/angular-html-parser/issues/48253)) ([0e5f9ba](https://github.com/prettier/angular-html-parser/commit/0e5f9ba6f427a79a0b741c1780cd2ff72cc3100a))
* **core:** get root and platform injector providers in special cases ([#52365](https://github.com/prettier/angular-html-parser/issues/52365)) ([d5dedf4](https://github.com/prettier/angular-html-parser/commit/d5dedf49fa4af607e0ca66054f263f614a0de45b))
* **core:** guard the jasmine hooks ([#51394](https://github.com/prettier/angular-html-parser/issues/51394)) ([a9b3c00](https://github.com/prettier/angular-html-parser/commit/a9b3c006f8593e0187298df21418644070312a40)), closes [#50063](https://github.com/prettier/angular-html-parser/issues/50063) [#51382](https://github.com/prettier/angular-html-parser/issues/51382)
* **core:** handle `deref` returning `null` on `RefactiveNode`. ([#50992](https://github.com/prettier/angular-html-parser/issues/50992)) ([5d6ec03](https://github.com/prettier/angular-html-parser/commit/5d6ec0336bdea22735d0ca2bbd7cfad958efbdda)), closes [#50989](https://github.com/prettier/angular-html-parser/issues/50989)
* **core:** handle for alias with as in control flow migration ([#52183](https://github.com/prettier/angular-html-parser/issues/52183)) ([37c8fd7](https://github.com/prettier/angular-html-parser/commit/37c8fd79acdaffcf26956ee409043075bfb09920))
* **core:** handle hydration of root components with injected ViewContainerRef ([#50136](https://github.com/prettier/angular-html-parser/issues/50136)) ([d5d7600](https://github.com/prettier/angular-html-parser/commit/d5d760045ef6f125b5365468224331e505db5d85)), closes [#50133](https://github.com/prettier/angular-html-parser/issues/50133)
* **core:** handle hydration of view containers for root components ([#51247](https://github.com/prettier/angular-html-parser/issues/51247)) ([55965cb](https://github.com/prettier/angular-html-parser/commit/55965cbf8c1caa78aad767bb291b5c603c6e3dc9)), closes [#51157](https://github.com/prettier/angular-html-parser/issues/51157)
* **core:** handle hydration of view containers that use component hosts as anchors ([#51456](https://github.com/prettier/angular-html-parser/issues/51456)) ([006577f](https://github.com/prettier/angular-html-parser/commit/006577f39c0e46e37491e44687142521fe7fab54)), closes [#51247](https://github.com/prettier/angular-html-parser/issues/51247) [#51318](https://github.com/prettier/angular-html-parser/issues/51318)
* **core:** handle if alias in control flow migration ([#52181](https://github.com/prettier/angular-html-parser/issues/52181)) ([2003caf](https://github.com/prettier/angular-html-parser/commit/2003caf4b74bfc023252960daec5212bdfd696a0))
* **core:** handle invalid classes in class array bindings ([#49924](https://github.com/prettier/angular-html-parser/issues/49924)) ([9165942](https://github.com/prettier/angular-html-parser/commit/9165942629220a87bd5e3b000bc34d55fd05d532)), closes [#48473](https://github.com/prettier/angular-html-parser/issues/48473)
* **core:** handle projection of hydrated containters into components that skip hydration ([#50199](https://github.com/prettier/angular-html-parser/issues/50199)) ([822b307](https://github.com/prettier/angular-html-parser/commit/822b3079ae9b62c5ae7f6bdff1cb334c1c3f8b5c)), closes [#50175](https://github.com/prettier/angular-html-parser/issues/50175)
* **core:** handle trackBy and aliased index in control flow migration ([#52423](https://github.com/prettier/angular-html-parser/issues/52423)) ([6070c9d](https://github.com/prettier/angular-html-parser/commit/6070c9ddcff88d4ad4bcf73a2dd1874920661d93))
* **core:** host directive validation not picking up duplicate directives on component node ([#52073](https://github.com/prettier/angular-html-parser/issues/52073)) ([7368b8a](https://github.com/prettier/angular-html-parser/commit/7368b8aaeba2ef0972a8bb261208c7281e050bb9)), closes [#52072](https://github.com/prettier/angular-html-parser/issues/52072)
* **core:** host directives incorrectly validating aliased bindings ([#50364](https://github.com/prettier/angular-html-parser/issues/50364)) ([8b44ba3](https://github.com/prettier/angular-html-parser/commit/8b44ba31701a1c1cf1ec92d2a26f9cf657f5408b)), closes [#48951](https://github.com/prettier/angular-html-parser/issues/48951)
* **core:** include inner ViewContainerRef anchor nodes into ViewRef.rootNodes output ([#49867](https://github.com/prettier/angular-html-parser/issues/49867)) ([d994f85](https://github.com/prettier/angular-html-parser/commit/d994f8520c7ace27f7c713614c64a24ea993c152)), closes [#49849](https://github.com/prettier/angular-html-parser/issues/49849)
* **core:** incorrectly throwing error for self-referencing component ([#50559](https://github.com/prettier/angular-html-parser/issues/50559)) ([79a706c](https://github.com/prettier/angular-html-parser/commit/79a706c8476003ce506e61fbd0b14587a99e9257)), closes [#50525](https://github.com/prettier/angular-html-parser/issues/50525)
* **core:** load global utils before creating platform injector in the standalone case ([#52365](https://github.com/prettier/angular-html-parser/issues/52365)) ([8ee0f27](https://github.com/prettier/angular-html-parser/commit/8ee0f27c9ecda99dff2e0bfc5fbc9347e647219f))
* **core:** make sure that lifecycle hooks are not tracked ([#49701](https://github.com/prettier/angular-html-parser/issues/49701)) ([df1dfc4](https://github.com/prettier/angular-html-parser/commit/df1dfc4c17abc6799f2e8f3f5f8604a7bf3d173a))
* **core:** more accurate matching of classes during content projection ([#48888](https://github.com/prettier/angular-html-parser/issues/48888)) ([e655e8a](https://github.com/prettier/angular-html-parser/commit/e655e8a603d923de3a6ff27edab8bae1796a71a0))
* **core:** onDestroy should be registered only on valid DestroyRef ([#49804](https://github.com/prettier/angular-html-parser/issues/49804)) ([2c22e6f](https://github.com/prettier/angular-html-parser/commit/2c22e6fb5f13943d35476f2a99e75d1d857083bc)), closes [#49658](https://github.com/prettier/angular-html-parser/issues/49658)
* **core:** only try to retrieve transferred state on the browser ([#50144](https://github.com/prettier/angular-html-parser/issues/50144)) ([a684888](https://github.com/prettier/angular-html-parser/commit/a684888af7e1fbcf53aec8619382ee6c6d16927d)), closes [#50138](https://github.com/prettier/angular-html-parser/issues/50138)
* **core:** Remove no longer needed build rule related to removed migration ([#52143](https://github.com/prettier/angular-html-parser/issues/52143)) ([d487014](https://github.com/prettier/angular-html-parser/commit/d48701478518d97a1fd5b4744963530494f93958))
* **core:** remove unnecessary escaping in regex expressions ([#51554](https://github.com/prettier/angular-html-parser/issues/51554)) ([1423bfb](https://github.com/prettier/angular-html-parser/commit/1423bfbf8ffa3b43d0dea41054c8f950e669a697))
* **core:** remove unnecessary migration ([#52141](https://github.com/prettier/angular-html-parser/issues/52141)) ([4da08dc](https://github.com/prettier/angular-html-parser/commit/4da08dc2ef439d3eced7199afb9a104cfd7b54cc)), closes [#49672](https://github.com/prettier/angular-html-parser/issues/49672)
* **core:** replace assertion with more intentional error ([#52234](https://github.com/prettier/angular-html-parser/issues/52234)) ([bdd61c7](https://github.com/prettier/angular-html-parser/commit/bdd61c768a28b56c68634b99c036986499829f45)), closes [#50320](https://github.com/prettier/angular-html-parser/issues/50320)
* **core:** resolve `InitialRenderPendingTasks` promise on complete ([#49784](https://github.com/prettier/angular-html-parser/issues/49784)) ([1026552](https://github.com/prettier/angular-html-parser/commit/1026552c01d3a535883c321fe6806152787fa175))
* **core:** Respect OnPush change detection strategy for dynamically created components ([#51356](https://github.com/prettier/angular-html-parser/issues/51356)) ([40bb45f](https://github.com/prettier/angular-html-parser/commit/40bb45f3297359866cab39044dba06b3e809b096))
* **core:** run afterRender callbacks outside of the Angular zone ([#51385](https://github.com/prettier/angular-html-parser/issues/51385)) ([3a19d6b](https://github.com/prettier/angular-html-parser/commit/3a19d6b7437e1812ae70b3784fd6a8a185b330b1))
* **core:** set style property value to empty string instead of an invalid value ([#49460](https://github.com/prettier/angular-html-parser/issues/49460)) ([fdafdb7](https://github.com/prettier/angular-html-parser/commit/fdafdb78dce89d550426fbdbccad1dd1320cad01))
* **core:** toObservable should allow writes to signals in the effect ([#49769](https://github.com/prettier/angular-html-parser/issues/49769)) ([1dddb78](https://github.com/prettier/angular-html-parser/commit/1dddb7878688e413ddbc7c1fd767bea44d675b69))
* **core:** typing of TestBed Common token. ([#49997](https://github.com/prettier/angular-html-parser/issues/49997)) ([5607e0f](https://github.com/prettier/angular-html-parser/commit/5607e0f529db7ee723ee8bb9862deeb5ee785d06))
* **core:** update `ApplicationRef.isStable` to account for rendering pending tasks ([#50425](https://github.com/prettier/angular-html-parser/issues/50425)) ([28c68f7](https://github.com/prettier/angular-html-parser/commit/28c68f709cdc930e12bac51a266e7bf790656034))
* **core:** update zone.js peerDependencies ranges ([#49244](https://github.com/prettier/angular-html-parser/issues/49244)) ([e9edea3](https://github.com/prettier/angular-html-parser/commit/e9edea363cd2da6560c3c3ec2522d1048084461b))
* **core:** use `setTimeout` when coalescing tasks in Node.js ([#50820](https://github.com/prettier/angular-html-parser/issues/50820)) ([b66a16e](https://github.com/prettier/angular-html-parser/commit/b66a16ec4cf42f47efeafa711ec301efeda272be))
* **core:** viewport trigger deregistering callbacks multiple times ([#52115](https://github.com/prettier/angular-html-parser/issues/52115)) ([d5dad3e](https://github.com/prettier/angular-html-parser/commit/d5dad3eb4cd837032da72899f0796c6d431cb2c9)), closes [#52113](https://github.com/prettier/angular-html-parser/issues/52113)
* **core:** wait for HTTP in `ngOnInit` correctly before server render ([#50573](https://github.com/prettier/angular-html-parser/issues/50573)) ([edceb48](https://github.com/prettier/angular-html-parser/commit/edceb486dd09c2d7335a149c6384e78479ab93b0)), closes [#50562](https://github.com/prettier/angular-html-parser/issues/50562)
* **core:** When using setInput, mark view dirty in same was as `markForCheck` ([#49711](https://github.com/prettier/angular-html-parser/issues/49711)) ([a4e749f](https://github.com/prettier/angular-html-parser/commit/a4e749ffca5b1f726c365cecaf0f5c4f13eec8d9)), closes [/github.com/angular/angular/blob/f071224720f8affb97fd32fb5aeaa13155b13693/packages/core/src/render3/instructions/shared.ts#L1018-L1024](https://github.com/prettier//github.com/angular/angular/blob/f071224720f8affb97fd32fb5aeaa13155b13693/packages/core/src/render3/instructions/shared.ts/issues/L1018-L1024)
* **dev-infra:** Fix code ownership for animations package ([#48975](https://github.com/prettier/angular-html-parser/issues/48975)) ([67422f5](https://github.com/prettier/angular-html-parser/commit/67422f5d71e59c5975eb2c1fc3f086febff844d9))
* **devtools:** ensure that inspected component label is always in the viewport ([#50656](https://github.com/prettier/angular-html-parser/issues/50656)) ([3a59de6](https://github.com/prettier/angular-html-parser/commit/3a59de681fd9899a40c49b3bce6f101d3d1b95cd)), closes [#48479](https://github.com/prettier/angular-html-parser/issues/48479)
* **devtools:** remove unnecessary escaping in regex expressions ([#51554](https://github.com/prettier/angular-html-parser/issues/51554)) ([1baeca8](https://github.com/prettier/angular-html-parser/commit/1baeca87e36f387db93ffb7b411dd037c0c5f48a))
* **devtools:** Specify when an app is considered in dev mode. ([#48970](https://github.com/prettier/angular-html-parser/issues/48970)) ([6daa454](https://github.com/prettier/angular-html-parser/commit/6daa454e40b614af2f7b3a333c9b79bdd39d21ae))
* **devtools:** use the __ignore_ng_zone__ flag in devtools message bus' to prevent CD loop ([#51339](https://github.com/prettier/angular-html-parser/issues/51339)) ([4b54947](https://github.com/prettier/angular-html-parser/commit/4b54947c97568352decf4b54938d5a1eb5ae26f5))
* **docs-infra:** add `work-break` to `a` tags in `.cli-option` ([#50012](https://github.com/prettier/angular-html-parser/issues/50012)) ([8a324c5](https://github.com/prettier/angular-html-parser/commit/8a324c54b9896544e8531aca73cb96ea61f7d48a))
* **docs-infra:** Ensure experimental tag shows up on docs ([#51712](https://github.com/prettier/angular-html-parser/issues/51712)) ([2d5b6fa](https://github.com/prettier/angular-html-parser/commit/2d5b6fad4e17bc18c804faf0bf1fede0e8f4d199))
* **docs-infra:** escape the `.` character in regex ([#51555](https://github.com/prettier/angular-html-parser/issues/51555)) ([1f7e7df](https://github.com/prettier/angular-html-parser/commit/1f7e7dff50693729a3a84da77c742c0666e43d80))
* **docs-infra:** fix incomplete escaping ([#51604](https://github.com/prettier/angular-html-parser/issues/51604)) ([8a3479b](https://github.com/prettier/angular-html-parser/commit/8a3479b9e4421b5d286b31cc0dc0591308a46657))
* **docs-infra:** labels with links should have the same font weight ([#50258](https://github.com/prettier/angular-html-parser/issues/50258)) ([b50203c](https://github.com/prettier/angular-html-parser/commit/b50203cfec58f52a90269c6972f3a6df8b3abb89))
* **docs-infra:** remove extra slash from JSON-LD data ([#50140](https://github.com/prettier/angular-html-parser/issues/50140)) ([3152c4d](https://github.com/prettier/angular-html-parser/commit/3152c4de92b3ad4878cb70aa100bf6fc897d7847))
* **docs-infra:** replace use of turbo on StackBlitz with npm ([#50576](https://github.com/prettier/angular-html-parser/issues/50576)) ([34989fd](https://github.com/prettier/angular-html-parser/commit/34989fda7a1d1946f7c9051b364fceafec9c5868))
* **elements:** support input transform functions ([#50713](https://github.com/prettier/angular-html-parser/issues/50713)) ([d64864e](https://github.com/prettier/angular-html-parser/commit/d64864e95e193e46180aeaf0d634152327650871)), closes [#50708](https://github.com/prettier/angular-html-parser/issues/50708)
* **forms:** Make radio buttons respect `[attr.disabled]` ([#48864](https://github.com/prettier/angular-html-parser/issues/48864)) ([5968561](https://github.com/prettier/angular-html-parser/commit/59685614f82bee3f001b42398db88516407b34b1))
* **forms:** reset() call with null values on nested group ([#48830](https://github.com/prettier/angular-html-parser/issues/48830)) ([ddd7212](https://github.com/prettier/angular-html-parser/commit/ddd7212ee2067112cdf54d5528c8480a0e505c76)), closes [#20509](https://github.com/prettier/angular-html-parser/issues/20509)
* **http:** check whether `Zone` is defined ([#51119](https://github.com/prettier/angular-html-parser/issues/51119)) ([57e8412](https://github.com/prettier/angular-html-parser/commit/57e8412e53229b0671df02c55be52e88b66a6865))
* **http:** create macrotask during request handling instead of load start ([#50406](https://github.com/prettier/angular-html-parser/issues/50406)) ([2cdb4c5](https://github.com/prettier/angular-html-parser/commit/2cdb4c5911965aa273f11432e04502e52b5e1b9b)), closes [#50405](https://github.com/prettier/angular-html-parser/issues/50405)
* **http:** delay accessing `pendingTasks.whenAllTasksComplete` ([#49784](https://github.com/prettier/angular-html-parser/issues/49784)) ([f9b821f](https://github.com/prettier/angular-html-parser/commit/f9b821f07d8dba57a6a7e5fc127dc096247424aa))
* **http:** ensure new cache state is returned on each request ([#49749](https://github.com/prettier/angular-html-parser/issues/49749)) ([0b3677e](https://github.com/prettier/angular-html-parser/commit/0b3677e1498bcc86120b72afb229fcebf85b42c1))
* **http:** force macro task creation during HTTP request ([#49546](https://github.com/prettier/angular-html-parser/issues/49546)) ([45a6ac0](https://github.com/prettier/angular-html-parser/commit/45a6ac09fdd2228fa4bbf5188ba8e67298754e7e)), closes [#49425](https://github.com/prettier/angular-html-parser/issues/49425)
* **http:** HTTP cache was being disabled prematurely ([#49826](https://github.com/prettier/angular-html-parser/issues/49826)) ([ddf0d4e](https://github.com/prettier/angular-html-parser/commit/ddf0d4eabe7b0414a47c30bf9ed5b3adeb6ba419))
* **http:** prevent headers from throwing an error when initializing numerical values ([#49379](https://github.com/prettier/angular-html-parser/issues/49379)) ([ab5e2d9](https://github.com/prettier/angular-html-parser/commit/ab5e2d938758dc486f8c65fff4e458d4e560fe4e)), closes [#49353](https://github.com/prettier/angular-html-parser/issues/49353)
* **http:** Run fetch request out the angular zone ([#50981](https://github.com/prettier/angular-html-parser/issues/50981)) ([c5608e5](https://github.com/prettier/angular-html-parser/commit/c5608e5ca99805af1a3a7caf4ce28a35f3a13ebf)), closes [#50979](https://github.com/prettier/angular-html-parser/issues/50979)
* **http:** Send query params on fetch request ([#50740](https://github.com/prettier/angular-html-parser/issues/50740)) ([135167f](https://github.com/prettier/angular-html-parser/commit/135167fe8e3e132b2d37e4f7c338a46782e20311)), closes [#50728](https://github.com/prettier/angular-html-parser/issues/50728)
* **http:** use serializeBody to support JSON payload in FetchBackend ([#50776](https://github.com/prettier/angular-html-parser/issues/50776)) ([a126cbc](https://github.com/prettier/angular-html-parser/commit/a126cbcf22d0341377e67bcabe01ad97d44bc8b7)), closes [#50775](https://github.com/prettier/angular-html-parser/issues/50775)
* **http:** wait for all XHR requests to finish before stabilizing application ([#49776](https://github.com/prettier/angular-html-parser/issues/49776)) ([079f4bc](https://github.com/prettier/angular-html-parser/commit/079f4bc1efc3bad10ac61d3819a923d1e971284d)), closes [#49730](https://github.com/prettier/angular-html-parser/issues/49730)
* **language-service:** Autocomplete block keywords in more cases ([#52198](https://github.com/prettier/angular-html-parser/issues/52198)) ([e6affef](https://github.com/prettier/angular-html-parser/commit/e6affeff6127e1ef8ff41f7a23051fd2ea7a8d8d))
* **language-service:** correct incomplete escaping ([#51557](https://github.com/prettier/angular-html-parser/issues/51557)) ([88b1575](https://github.com/prettier/angular-html-parser/commit/88b157527172d70ed3e5aa11aa8b7963a8612e49))
* **language-service:** generate forwardRef for same file imports ([#48898](https://github.com/prettier/angular-html-parser/issues/48898)) ([d014503](https://github.com/prettier/angular-html-parser/commit/d0145033bd11eccd16fa8b61ba9170037d0c62b3))
* **language-service:** Retain correct language service when `ts.Project` reloads ([#51912](https://github.com/prettier/angular-html-parser/issues/51912)) ([08482f2](https://github.com/prettier/angular-html-parser/commit/08482f2c7dcbcd100981dfb266a6e63f64432328))
* **localize:** ng-add schematics for application builder ([#51777](https://github.com/prettier/angular-html-parser/issues/51777)) ([5a20a44](https://github.com/prettier/angular-html-parser/commit/5a20a44c64066e47894ca3cbe26327766ca89a42))
* **migrations:** add protractor support if protractor imports are detected ([#49274](https://github.com/prettier/angular-html-parser/issues/49274)) ([2fbaee3](https://github.com/prettier/angular-html-parser/commit/2fbaee3cbe0dd24fc9c03a4c3d0e0117c26acb53))
* **migrations:** Add support for nested structures inside a switch statement ([#52358](https://github.com/prettier/angular-html-parser/issues/52358)) ([9692aeb](https://github.com/prettier/angular-html-parser/commit/9692aeb1a54303164bea2de9f4b16416eeccb330))
* **migrations:** automatically prune root module after bootstrap step ([#49030](https://github.com/prettier/angular-html-parser/issues/49030)) ([816e76a](https://github.com/prettier/angular-html-parser/commit/816e76a5789b041fee78ddd278c0e0d19b9a617a))
* **migrations:** avoid generating imports with forward slashes ([#48993](https://github.com/prettier/angular-html-parser/issues/48993)) ([bdbf21d](https://github.com/prettier/angular-html-parser/commit/bdbf21d04ba74a6f73469242076d6ce697c57edf))
* **migrations:** avoid internal modules when generating imports ([#48958](https://github.com/prettier/angular-html-parser/issues/48958)) ([32cf4e5](https://github.com/prettier/angular-html-parser/commit/32cf4e5cb989f365296d519dddf72fb38ca47c40)), closes [#48942](https://github.com/prettier/angular-html-parser/issues/48942)
* **migrations:** avoid interrupting the migration if language service lookup fails ([#49010](https://github.com/prettier/angular-html-parser/issues/49010)) ([521ccfb](https://github.com/prettier/angular-html-parser/commit/521ccfbe6ce9af1a7ddd6ab5e70151b7198f82ef))
* **migrations:** avoid migrating the same class multiple times in standalone migration ([#49245](https://github.com/prettier/angular-html-parser/issues/49245)) ([87affad](https://github.com/prettier/angular-html-parser/commit/87affadb8710bbe0f23314115065fe9cc58306da))
* **migrations:** avoid modifying testing modules without declarations ([#48921](https://github.com/prettier/angular-html-parser/issues/48921)) ([a40cd47](https://github.com/prettier/angular-html-parser/commit/a40cd47aa7ebccfbeeb26e397e03f1372aa10a55))
* **migrations:** delete barrel exports in standalone migration ([#49176](https://github.com/prettier/angular-html-parser/issues/49176)) ([7dd1957](https://github.com/prettier/angular-html-parser/commit/7dd19570e8452fbdafe50636dcd18809ccea97ae))
* **migrations:** don't add ModuleWithProviders to standalone test components ([#48987](https://github.com/prettier/angular-html-parser/issues/48987)) ([1afa6ed](https://github.com/prettier/angular-html-parser/commit/1afa6ed3227e784e3fe2b4b31443961589cb6332)), closes [#48971](https://github.com/prettier/angular-html-parser/issues/48971)
* **migrations:** don't copy animations modules into the imports of test components ([#49147](https://github.com/prettier/angular-html-parser/issues/49147)) ([2268278](https://github.com/prettier/angular-html-parser/commit/2268278ce99ee70c496d331c71a32eb45f96ba2f))
* **migrations:** don't copy unmigrated declarations into imports array ([#48882](https://github.com/prettier/angular-html-parser/issues/48882)) ([8389557](https://github.com/prettier/angular-html-parser/commit/83895578488bd35c7e47609f092907eb0f53f435))
* **migrations:** duplicated comments on migrated classes ([#48966](https://github.com/prettier/angular-html-parser/issues/48966)) ([759db12](https://github.com/prettier/angular-html-parser/commit/759db12e0b618fcb51f4cb141adeb49bfa495a60)), closes [#48943](https://github.com/prettier/angular-html-parser/issues/48943)
* **migrations:** Ensure control flow migration ignores new block syntax ([#52402](https://github.com/prettier/angular-html-parser/issues/52402)) ([fa03f0a](https://github.com/prettier/angular-html-parser/commit/fa03f0a3c5e1e4562b53a3d86e98783ddd4f84cf))
* **migrations:** fix broken migration when no control flow is present ([#52399](https://github.com/prettier/angular-html-parser/issues/52399)) ([f1a020b](https://github.com/prettier/angular-html-parser/commit/f1a020b511d14b59e20eef8c1bbb13ce97ba478d))
* **migrations:** Fixes the root level template offset in control flow migration ([#52355](https://github.com/prettier/angular-html-parser/issues/52355)) ([90eb879](https://github.com/prettier/angular-html-parser/commit/90eb879779c2d271fd505b4c10868b85c869a882))
* **migrations:** generate forwardRef for same file imports ([#48898](https://github.com/prettier/angular-html-parser/issues/48898)) ([ba38178](https://github.com/prettier/angular-html-parser/commit/ba38178d1918d413f9c2260c40eb6542eadfddba))
* **migrations:** handle nested classes in block entities migration ([#52309](https://github.com/prettier/angular-html-parser/issues/52309)) ([9e76468](https://github.com/prettier/angular-html-parser/commit/9e76468905202a5a76c8b7304b6d42f31e722e39))
* **migrations:** handle nested classes in control flow migration ([#52309](https://github.com/prettier/angular-html-parser/issues/52309)) ([c993e9a](https://github.com/prettier/angular-html-parser/commit/c993e9a40ee92a568b2e314773c5df02ebb2147a))
* **migrations:** migrate HttpClientModule to provideHttpClient() ([#48949](https://github.com/prettier/angular-html-parser/issues/48949)) ([660fbf5](https://github.com/prettier/angular-html-parser/commit/660fbf5d2755739b010bfaa23a73406046df69bf)), closes [#48948](https://github.com/prettier/angular-html-parser/issues/48948)
* **migrations:** migrate RouterModule.forRoot with a config object to use features ([#48935](https://github.com/prettier/angular-html-parser/issues/48935)) ([2de6dae](https://github.com/prettier/angular-html-parser/commit/2de6dae16d4b0b83f0517a3033cda44ba44154ed))
* **migrations:** migrate tests when switching to standalone bootstrap API ([#48987](https://github.com/prettier/angular-html-parser/issues/48987)) ([770191c](https://github.com/prettier/angular-html-parser/commit/770191cf1f1254546625dfa7a882b716c3f0aab3)), closes [#48944](https://github.com/prettier/angular-html-parser/issues/48944)
* **migrations:** move standalone migrations into imports ([#48987](https://github.com/prettier/angular-html-parser/issues/48987)) ([c7926b5](https://github.com/prettier/angular-html-parser/commit/c7926b57730c23f765a00d3dd9f92079c95e87e0))
* **migrations:** only exclude bootstrapped declarations from initial standalone migration ([#48987](https://github.com/prettier/angular-html-parser/issues/48987)) ([6377487](https://github.com/prettier/angular-html-parser/commit/6377487b1ab7679cef9a44f88440fe5e8eb97480)), closes [#48944](https://github.com/prettier/angular-html-parser/issues/48944)
* **migrations:** preserve trailing commas in code generated by standalone migration ([#49533](https://github.com/prettier/angular-html-parser/issues/49533)) ([546b285](https://github.com/prettier/angular-html-parser/commit/546b285ec1fb6c5af210549825c0ee6d9a99261e))
* **migrations:** preserve tsconfig in standalone migration ([#48987](https://github.com/prettier/angular-html-parser/issues/48987)) ([e9e4449](https://github.com/prettier/angular-html-parser/commit/e9e4449a43430e026e61b0f05ebd32dd830fa916))
* **migrations:** Prevent a component from importing itself. ([#50554](https://github.com/prettier/angular-html-parser/issues/50554)) ([8468df1](https://github.com/prettier/angular-html-parser/commit/8468df19c9267051d1b16c25f99e425229cd2649)), closes [#50525](https://github.com/prettier/angular-html-parser/issues/50525)
* **migrations:** reduce number of files that need to be checked ([#48987](https://github.com/prettier/angular-html-parser/issues/48987)) ([ffad1b4](https://github.com/prettier/angular-html-parser/commit/ffad1b49d95ab90637e7184f92cb5136d490d865))
* **migrations:** Remove unhelpful parsing errors from the log ([#52401](https://github.com/prettier/angular-html-parser/issues/52401)) ([6c58034](https://github.com/prettier/angular-html-parser/commit/6c580348326ba80c11bce6bcc4de0b81a96e57c8))
* **migrations:** return correct alias when conflicting import exists ([#49139](https://github.com/prettier/angular-html-parser/issues/49139)) ([36b9ff7](https://github.com/prettier/angular-html-parser/commit/36b9ff7ff9e4b86778a25c0c773e36020b435dfa))
* **migrations:** standalone migration incorrectly throwing path error for multi app projects ([#48958](https://github.com/prettier/angular-html-parser/issues/48958)) ([49a7c9f](https://github.com/prettier/angular-html-parser/commit/49a7c9f94ae8f89907da8b3620242e62f87ec5a4))
* **migrations:** support --defaults in standalone migration ([#48921](https://github.com/prettier/angular-html-parser/issues/48921)) ([584976e](https://github.com/prettier/angular-html-parser/commit/584976e6c8a783d40578ab191132673300394a52)), closes [#48845](https://github.com/prettier/angular-html-parser/issues/48845)
* **migrations:** use consistent quotes in generated imports ([#48876](https://github.com/prettier/angular-html-parser/issues/48876)) ([03f47ac](https://github.com/prettier/angular-html-parser/commit/03f47ac9019eddbcb373b50c41bc6f523293ece1))
* **migrations:** use import remapper in root component ([#49046](https://github.com/prettier/angular-html-parser/issues/49046)) ([ebae506](https://github.com/prettier/angular-html-parser/commit/ebae506d894a90c38e0f2dd1e948acabdb0fdf2e)), closes [#49022](https://github.com/prettier/angular-html-parser/issues/49022)
* **migrations:** use NgForOf instead of NgFor ([#49022](https://github.com/prettier/angular-html-parser/issues/49022)) ([40c976c](https://github.com/prettier/angular-html-parser/commit/40c976c90975878852a87b7722076eb78944098b)), closes [#49006](https://github.com/prettier/angular-html-parser/issues/49006)
* **platform-browser:** export deprecated `TransferState` as type ([#50015](https://github.com/prettier/angular-html-parser/issues/50015)) ([74194de](https://github.com/prettier/angular-html-parser/commit/74194de6f94bcd5f1dc1c0b88d49d847e7c5497c)), closes [#50014](https://github.com/prettier/angular-html-parser/issues/50014)
* **platform-browser:** Fire Animations events when using async animations. ([#52087](https://github.com/prettier/angular-html-parser/issues/52087)) ([5b375d1](https://github.com/prettier/angular-html-parser/commit/5b375d106f2e02afadad8f5a60c37558318ea091)), closes [#52076](https://github.com/prettier/angular-html-parser/issues/52076)
* **platform-browser:** KeyEventsPlugin should keep the same behavior ([#49330](https://github.com/prettier/angular-html-parser/issues/49330)) ([2312eb5](https://github.com/prettier/angular-html-parser/commit/2312eb53ef5862e0866c29d11dec2a9b7b6a064c)), closes [#45698](https://github.com/prettier/angular-html-parser/issues/45698)
* **platform-browser:** only add `ng-app-id` to style on server side ([#49465](https://github.com/prettier/angular-html-parser/issues/49465)) ([c934a8e](https://github.com/prettier/angular-html-parser/commit/c934a8e72bec9f96ccf1a1de1a3384d40dfd2731))
* **platform-browser:** prevent duplicate stylesheets from being created ([#52019](https://github.com/prettier/angular-html-parser/issues/52019)) ([65786b2](https://github.com/prettier/angular-html-parser/commit/65786b2b96ba198034ff23bb14571a659a491b50))
* **platform-browser:** remove styles from DOM of destroyed components ([#48298](https://github.com/prettier/angular-html-parser/issues/48298)) ([02d5e8d](https://github.com/prettier/angular-html-parser/commit/02d5e8d79dc1f5dd70f9d997d6ecb1632d93b86e)), closes [#16670](https://github.com/prettier/angular-html-parser/issues/16670)
* **platform-browser:** reuse server generated component styles ([#48253](https://github.com/prettier/angular-html-parser/issues/48253)) ([9165ff2](https://github.com/prettier/angular-html-parser/commit/9165ff2517448b43bb910001816108702088e93e))
* **platform-browser:** set animation properties when using async animations. ([#52087](https://github.com/prettier/angular-html-parser/issues/52087)) ([75d610d](https://github.com/prettier/angular-html-parser/commit/75d610d420ce3a1ec6429d79c72ec6ef6c2c9a10))
* **platform-browser:** set nonce attribute in a platform compatible way ([#49624](https://github.com/prettier/angular-html-parser/issues/49624)) ([e8e3681](https://github.com/prettier/angular-html-parser/commit/e8e36811d5700d23a6d853c78e6314b19d937e5e))
* **platform-browser:** wait until animation completion before destroying renderer ([#50677](https://github.com/prettier/angular-html-parser/issues/50677)) ([2b55103](https://github.com/prettier/angular-html-parser/commit/2b55103e94578ab1cb765147077e82e1228b0dbb)), closes [/b/271251353#comment12](https://github.com/prettier//b/271251353/issues/comment12) [/b/282004950#comment5](https://github.com/prettier//b/282004950/issues/comment5)
* **platform-browser:** wait until animation completion before destroying renderer ([#50860](https://github.com/prettier/angular-html-parser/issues/50860)) ([0380564](https://github.com/prettier/angular-html-parser/commit/0380564f8562f5971cff671319439ad0f2b40a7e)), closes [/b/271251353#comment12](https://github.com/prettier//b/271251353/issues/comment12) [/b/282004950#comment5](https://github.com/prettier//b/282004950/issues/comment5)
* **platform-server:** avoid duplicate TransferState info after renderApplication call ([#49094](https://github.com/prettier/angular-html-parser/issues/49094)) ([9105c41](https://github.com/prettier/angular-html-parser/commit/9105c41f4423fcb820930d6c994ecd16f3a2cef6))
* **platform-server:** bundle @angular/domino in via esbuild ([#49229](https://github.com/prettier/angular-html-parser/issues/49229)) ([a08a8ff](https://github.com/prettier/angular-html-parser/commit/a08a8ff108bba88ba4bd7f30a6a8c1bcadb13db7))
* **platform-server:** insert transfer state `script` before other `script` tags ([#48868](https://github.com/prettier/angular-html-parser/issues/48868)) ([2fc5b70](https://github.com/prettier/angular-html-parser/commit/2fc5b70fcedb8ac35b825b245c0ae394dc125244))
* **platform-server:** remove dependency on `@angular/platform-browser-dynamic` ([#50064](https://github.com/prettier/angular-html-parser/issues/50064)) ([06452af](https://github.com/prettier/angular-html-parser/commit/06452af31fb741c3d2ba8e653e1ca830f27960a8))
* **platform-server:** resolve relative requests URL ([#52326](https://github.com/prettier/angular-html-parser/issues/52326)) ([405ec8c](https://github.com/prettier/angular-html-parser/commit/405ec8c796a571a9fe0ed1258171856faae2eedb)), closes [#51626](https://github.com/prettier/angular-html-parser/issues/51626)
* **platform-server:** surface errors during rendering ([#50587](https://github.com/prettier/angular-html-parser/issues/50587)) ([0875b51](https://github.com/prettier/angular-html-parser/commit/0875b519b9dcf15703039b20ef7398b0c964ba0c))
* **router:** `RouterTestingHarness` should throw if a component is expected but navigation fails ([#52357](https://github.com/prettier/angular-html-parser/issues/52357)) ([0037c21](https://github.com/prettier/angular-html-parser/commit/0037c213a36c85182ee4301856d380ccb0a13b44)), closes [#52344](https://github.com/prettier/angular-html-parser/issues/52344)
* **router:** add error message when using loadComponent with a NgModule ([#49164](https://github.com/prettier/angular-html-parser/issues/49164)) ([7e35a91](https://github.com/prettier/angular-html-parser/commit/7e35a917c56e746cadfcd115c559853d3e632a1e))
* **router:** Allow redirects after an absolute redirect ([#51731](https://github.com/prettier/angular-html-parser/issues/51731)) ([ce1b915](https://github.com/prettier/angular-html-parser/commit/ce1b915868e654cdb679e9381db9d3bd3d68d5c4)), closes [#13373](https://github.com/prettier/angular-html-parser/issues/13373) [#39770](https://github.com/prettier/angular-html-parser/issues/39770)
* **router:** Apply named outlets to children empty paths not appearing in the URL ([#51292](https://github.com/prettier/angular-html-parser/issues/51292)) ([4e22a39](https://github.com/prettier/angular-html-parser/commit/4e22a39e7748f77d3016654faf99d44792cf235b)), closes [#50356](https://github.com/prettier/angular-html-parser/issues/50356)
* **router:** canceledNavigationResolution: 'computed' with redirects to the current URL ([#49793](https://github.com/prettier/angular-html-parser/issues/49793)) ([cbca581](https://github.com/prettier/angular-html-parser/commit/cbca5817d8ff1fb2ff12b9f734041f915c7859d6))
* **router:** children of routes with loadComponent should not inherit parent data by default ([#52114](https://github.com/prettier/angular-html-parser/issues/52114)) ([37df395](https://github.com/prettier/angular-html-parser/commit/37df395be070a11b8cd84c0ff3af9290d15c4e9d)), closes [#52106](https://github.com/prettier/angular-html-parser/issues/52106)
* **router:** create correct URL relative to path with empty child ([#49691](https://github.com/prettier/angular-html-parser/issues/49691)) ([b203e4c](https://github.com/prettier/angular-html-parser/commit/b203e4c19d4ccec09b9d1910dbc6f314070c1428))
* **router:** Ensure `canceledNavigationResolution: 'computed'` works on first page ([#51441](https://github.com/prettier/angular-html-parser/issues/51441)) ([96d94ad](https://github.com/prettier/angular-html-parser/commit/96d94ad13072032326446e8a20658c9f38fd1b8e)), closes [#50983](https://github.com/prettier/angular-html-parser/issues/50983)
* **router:** Ensure anchor scrolling happens on ignored same URL navigations ([#48025](https://github.com/prettier/angular-html-parser/issues/48025)) ([1f055b9](https://github.com/prettier/angular-html-parser/commit/1f055b90b65cce2d0d063ed44cb0f8fbecb9b1f6)), closes [#29099](https://github.com/prettier/angular-html-parser/issues/29099)
* **router:** Ensure initial navigation clears current navigation when blocking ([#49572](https://github.com/prettier/angular-html-parser/issues/49572)) ([fa3909e](https://github.com/prettier/angular-html-parser/commit/fa3909e8b4b982423357a6e3d6c1d719ea6fa378)), closes [#49567](https://github.com/prettier/angular-html-parser/issues/49567)
* **router:** Ensure newly resolved data is inherited by child routes ([#52167](https://github.com/prettier/angular-html-parser/issues/52167)) ([3278966](https://github.com/prettier/angular-html-parser/commit/327896606832bf6fbfc8f23989755123028136a8)), closes [#51934](https://github.com/prettier/angular-html-parser/issues/51934)
* **router:** Ensure Router preloading works with lazy component and static children ([#49571](https://github.com/prettier/angular-html-parser/issues/49571)) ([2dbf3e0](https://github.com/prettier/angular-html-parser/commit/2dbf3e0023304b0e80c274c3fb79b70a45b7b317)), closes [#49558](https://github.com/prettier/angular-html-parser/issues/49558)
* **router:** Ensure title observable gets latest values ([#51561](https://github.com/prettier/angular-html-parser/issues/51561)) ([f464e39](https://github.com/prettier/angular-html-parser/commit/f464e39364da6436fc4b5a703f66fe7dee70818c)), closes [#51401](https://github.com/prettier/angular-html-parser/issues/51401)
* **router:** fix [#49457](https://github.com/prettier/angular-html-parser/issues/49457) outlet activating with old info ([#49459](https://github.com/prettier/angular-html-parser/issues/49459)) ([d3018c0](https://github.com/prettier/angular-html-parser/commit/d3018c0ee71eab2ab35aff20d95e9fa882944d14))
* **router:** fix = not parsed in router segment name ([#47332](https://github.com/prettier/angular-html-parser/issues/47332)) ([748c33c](https://github.com/prettier/angular-html-parser/commit/748c33ca6b9754909c156362bc33dda79c5d46f5)), closes [#21381](https://github.com/prettier/angular-html-parser/issues/21381)
* **router:** Handle routerLink directive on svg anchors. ([#48857](https://github.com/prettier/angular-html-parser/issues/48857)) ([16ef770](https://github.com/prettier/angular-html-parser/commit/16ef770db803ce4037a90c72477da412642dfb33)), closes [#48854](https://github.com/prettier/angular-html-parser/issues/48854)
* **router:** Remove `urlHandlingStrategy` from public Router properties ([#51631](https://github.com/prettier/angular-html-parser/issues/51631)) ([b2aff43](https://github.com/prettier/angular-html-parser/commit/b2aff4362129feb746856fc3d0f8e73b1927a037))
* **router:** Remove deprecated ComponentFactoryResolver from APIs ([#49239](https://github.com/prettier/angular-html-parser/issues/49239)) ([c0b1b7b](https://github.com/prettier/angular-html-parser/commit/c0b1b7becf65d5f21018a1794aafe9bbfbd5ce05))
* **router:** Remove deprecated Router properties ([#51502](https://github.com/prettier/angular-html-parser/issues/51502)) ([c62e680](https://github.com/prettier/angular-html-parser/commit/c62e680098a8c26fb2234336613185f7ab273483))
* **router:** Remove deprecated setupTestingRouter function ([#51826](https://github.com/prettier/angular-html-parser/issues/51826)) ([3c6258c](https://github.com/prettier/angular-html-parser/commit/3c6258c85b37535c1178e84509b7c9ed3a1359e4))
* **router:** Remove malformedUriErrorHandler from `ExtraOptions` ([#51745](https://github.com/prettier/angular-html-parser/issues/51745)) ([0b3e6a4](https://github.com/prettier/angular-html-parser/commit/0b3e6a41d025997d2947125d875ac26ecd1b86d9))
* **router:** remove RouterEvent from Event union type ([#46061](https://github.com/prettier/angular-html-parser/issues/46061)) ([1e32709](https://github.com/prettier/angular-html-parser/commit/1e32709e0e16f553ed3e7778705c9a0c5641d0af))
* **router:** Route matching should only happen once when navigating ([#49163](https://github.com/prettier/angular-html-parser/issues/49163)) ([3c7e637](https://github.com/prettier/angular-html-parser/commit/3c7e63737407287986c65136efd1f53d1215a53e)), closes [#26081](https://github.com/prettier/angular-html-parser/issues/26081)
* **router:** Route matching should only happen once when navigating ([#49163](https://github.com/prettier/angular-html-parser/issues/49163)) ([1600687](https://github.com/prettier/angular-html-parser/commit/1600687fe518e67adcc629c78857720a5118d489)), closes [#26081](https://github.com/prettier/angular-html-parser/issues/26081)
* **router:** Router.createUrlTree should work with any ActivatedRoute ([#48508](https://github.com/prettier/angular-html-parser/issues/48508)) ([31f210b](https://github.com/prettier/angular-html-parser/commit/31f210bf2cd8a5cc8245c05a30ae3b8f8b9d826a)), closes [#45877](https://github.com/prettier/angular-html-parser/issues/45877) [#42191](https://github.com/prettier/angular-html-parser/issues/42191) [#38276](https://github.com/prettier/angular-html-parser/issues/38276) [#22763](https://github.com/prettier/angular-html-parser/issues/22763) [#48472](https://github.com/prettier/angular-html-parser/issues/48472)
* **router:** use DOCUMENT token instead of document directly in view transitions ([#51814](https://github.com/prettier/angular-html-parser/issues/51814)) ([c03baed](https://github.com/prettier/angular-html-parser/commit/c03baed8547c2c1da576307c708d2682dfdf3742))
* **service-worker:** throw a critical error when `handleFetch` fails ([#51885](https://github.com/prettier/angular-html-parser/issues/51885)) ([dcaad16](https://github.com/prettier/angular-html-parser/commit/dcaad169ec8bf0a61d032ae1ae68fb90d1face09)), closes [#50378](https://github.com/prettier/angular-html-parser/issues/50378)
* **service-worker:** throw a critical error when handleFetch fails ([#51960](https://github.com/prettier/angular-html-parser/issues/51960)) ([cc7973f](https://github.com/prettier/angular-html-parser/commit/cc7973f5a5cddbc5288db7d572757819327a40c3)), closes [#51885](https://github.com/prettier/angular-html-parser/issues/51885) [#51885](https://github.com/prettier/angular-html-parser/issues/51885) [#50378](https://github.com/prettier/angular-html-parser/issues/50378)
* **upgrade:** allow for downgraded components to work with component-router ([#50871](https://github.com/prettier/angular-html-parser/issues/50871)) ([a19a87d](https://github.com/prettier/angular-html-parser/commit/a19a87df6c30a60ca997083b979a8e1e185e5b43))
* **upgrade:** Use `takeUntil` on leaky subscription. ([#50901](https://github.com/prettier/angular-html-parser/issues/50901)) ([253d756](https://github.com/prettier/angular-html-parser/commit/253d7564647607804d45404152d1253993177aea)), closes [#48032](https://github.com/prettier/angular-html-parser/issues/48032)
* **zone.js:** add conditional exports to zone.js package ([#51652](https://github.com/prettier/angular-html-parser/issues/51652)) ([4798ec4](https://github.com/prettier/angular-html-parser/commit/4798ec41668d47fd5e1504c61d96d5e56dcff345))
* **zone.js:** enable monkey patching of the `queueMicrotask()` API in node.js ([#50467](https://github.com/prettier/angular-html-parser/issues/50467)) ([381cb98](https://github.com/prettier/angular-html-parser/commit/381cb982264d30e8c79e77e9186acd6da006e718))
* **zone.js:** enable monkey patching of the `queueMicrotask()` API in node.js ([#50530](https://github.com/prettier/angular-html-parser/issues/50530)) ([7837f71](https://github.com/prettier/angular-html-parser/commit/7837f7119f8cdfb0ae95551f48608f156985113a))
* **zone.js:** patch entire promise in node ([#50552](https://github.com/prettier/angular-html-parser/issues/50552)) ([cb31dbc](https://github.com/prettier/angular-html-parser/commit/cb31dbc75ca4141d61cec3ba6e60505198208a0a)), closes [#50513](https://github.com/prettier/angular-html-parser/issues/50513) [#50457](https://github.com/prettier/angular-html-parser/issues/50457) [#50414](https://github.com/prettier/angular-html-parser/issues/50414) [#49930](https://github.com/prettier/angular-html-parser/issues/49930)
* **zone.js:** rename `typings` conditional export to `types` ([#51737](https://github.com/prettier/angular-html-parser/issues/51737)) ([74755c4](https://github.com/prettier/angular-html-parser/commit/74755c4b5e6d4d62d2c81f35e6152bb8649fbb5c))
* **zone.js:** revert Mocha it.skip, describe.skip method patch ([#49329](https://github.com/prettier/angular-html-parser/issues/49329)) ([5a2b622](https://github.com/prettier/angular-html-parser/commit/5a2b6227b30a4d3f2090077e8881c753db00798c))
* **zone.js:** temporary allow deep imports ([#51737](https://github.com/prettier/angular-html-parser/issues/51737)) ([e86d6db](https://github.com/prettier/angular-html-parser/commit/e86d6dba27997cb2cad13c43ac5e94eeb7a67725))
* **zone.js:** use `globalThis` instead of `global` and `window` ([#52367](https://github.com/prettier/angular-html-parser/issues/52367)) ([def719e](https://github.com/prettier/angular-html-parser/commit/def719e2cac50bbf1cda4a2c4bf96de2d4ba4bfd))
* **zone.js:** zone-node only patch Promise.prototype.then ([#49144](https://github.com/prettier/angular-html-parser/issues/49144)) ([d1ac3aa](https://github.com/prettier/angular-html-parser/commit/d1ac3aa14e5d3c5415937199a6fb63437ddee0b8)), closes [#47872](https://github.com/prettier/angular-html-parser/issues/47872)


### build

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
* remove deprecated `EventManager` method `addGlobalEventListener` ([#49645](https://github.com/prettier/angular-html-parser/issues/49645)) ([2703fd6](https://github.com/prettier/angular-html-parser/commit/2703fd626040c5e65401ebd776404a3b9e284724))

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
