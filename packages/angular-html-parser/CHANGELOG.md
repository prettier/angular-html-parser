# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
