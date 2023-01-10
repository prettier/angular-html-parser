# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.0.0](https://github.com/prettier/angular-html-parser/compare/v2.1.0...v4.0.0) (2023-01-05)

Sync with upstream.

* **animations:** fix incorrect handling of camel-case css properties ([#48436](https://github.com/prettier/angular-html-parser/issues/48436)) ([c864845](https://github.com/prettier/angular-html-parser/commit/c86484507fdc0a44b3d20ea8b988b23f25ad9ac2)), closes [#48246](https://github.com/prettier/angular-html-parser/issues/48246)
* **bazel:** remove duplicate license banners from FESM bundles ([#48560](https://github.com/prettier/angular-html-parser/issues/48560)) ([82d0998](https://github.com/prettier/angular-html-parser/commit/82d0998968cb620ad6fd2eb10855452f31f012ac))
* **common:** Add data attribtue to NgOptimizedImage ([#48497](https://github.com/prettier/angular-html-parser/issues/48497)) ([2f4f063](https://github.com/prettier/angular-html-parser/commit/2f4f0638c74dccfc2d0522f67ab226d3227c0566))
* **common:** Add fetchpriority to ngOptimizedImage preloads ([#48010](https://github.com/prettier/angular-html-parser/issues/48010)) ([1d1e33e](https://github.com/prettier/angular-html-parser/commit/1d1e33e8d0b416c6be06b53e4fdbe673b30b1cc6))
* **common:** don't generate srcset if noopImageLoader is used ([#47804](https://github.com/prettier/angular-html-parser/issues/47804)) ([38ec156](https://github.com/prettier/angular-html-parser/commit/38ec1565adb46c95f9118f9f9801f6d54baf2609))
* **common:** Don't generate srcsets with very large sources ([#47997](https://github.com/prettier/angular-html-parser/issues/47997)) ([8e52ca2](https://github.com/prettier/angular-html-parser/commit/8e52ca271496b0feebf66b2dc7c8f396b73d61a0))
* **common:** Don't warn about image distortion is fill mode is enabled ([#47824](https://github.com/prettier/angular-html-parser/issues/47824)) ([6b9b472](https://github.com/prettier/angular-html-parser/commit/6b9b472f6a22aa9eba75e2c12ebf5654438e2cd9))
* **common:** export the IMAGE_CONFIG token ([#48051](https://github.com/prettier/angular-html-parser/issues/48051)) ([804b855](https://github.com/prettier/angular-html-parser/commit/804b85554cb98d34038fb59d0b40fa8fc1d9b5b8))
* **common:** Fix MockPlatformLocation events and missing onPopState implementation ([#48113](https://github.com/prettier/angular-html-parser/issues/48113)) ([b0a62be](https://github.com/prettier/angular-html-parser/commit/b0a62bea475480768f2cffeb134960dc1165181c))
* **common:** Fix TestBed.overrideProvider type to include multi ([#48424](https://github.com/prettier/angular-html-parser/issues/48424)) ([e362214](https://github.com/prettier/angular-html-parser/commit/e362214924dbb784e5bd0efd96530134f8c91d32))
* **common:** Update `Location` to get a normalized URL valid in case a represented URL starts with the substring equals `APP_BASE_HREF` ([#48394](https://github.com/prettier/angular-html-parser/issues/48394)) ([d87285c](https://github.com/prettier/angular-html-parser/commit/d87285c363b3f892a5afe625f39f4713d350d2f8)), closes [#45744](https://github.com/prettier/angular-html-parser/issues/45744)
* **common:** Update `Location` to support base href containing `origin` ([#48327](https://github.com/prettier/angular-html-parser/issues/48327)) ([f8ecc19](https://github.com/prettier/angular-html-parser/commit/f8ecc194e93bf9f80af0cb0e77032341bf2f9886)), closes [#48175](https://github.com/prettier/angular-html-parser/issues/48175)
* **common:** update size error to mention 'fill' mode ([#47797](https://github.com/prettier/angular-html-parser/issues/47797)) ([1ebc0fa](https://github.com/prettier/angular-html-parser/commit/1ebc0fad0e42adebbb763bf88f54af11f0a16b23))
* **common:** warn if using supported CDN but not built-in loader ([#47330](https://github.com/prettier/angular-html-parser/issues/47330)) ([ce5880f](https://github.com/prettier/angular-html-parser/commit/ce5880f93f141648d18d86ca4e9434d9bb4d5825))
* **common:** Warn on fill ngOptimizedImage without height ([#48036](https://github.com/prettier/angular-html-parser/issues/48036)) ([8b39c38](https://github.com/prettier/angular-html-parser/commit/8b39c38940ba985257998df9885bda871937cf56))
* **compiler-cli:** accept inheriting the constructor from a class in a library ([#48156](https://github.com/prettier/angular-html-parser/issues/48156)) ([7d88700](https://github.com/prettier/angular-html-parser/commit/7d8870093313575d89c8abe584c43d6fa8105fc8)), closes [#48152](https://github.com/prettier/angular-html-parser/issues/48152)
* **compiler-cli:** add missing period to error message ([#47744](https://github.com/prettier/angular-html-parser/issues/47744)) ([38078e7](https://github.com/prettier/angular-html-parser/commit/38078e7adb79c058d2cb1dfe2e8d11f7304d4e5d))
* **compiler-cli:** evaluate const tuple types statically ([#48091](https://github.com/prettier/angular-html-parser/issues/48091)) ([a6849f2](https://github.com/prettier/angular-html-parser/commit/a6849f27af129588091f635c6ae7a326241344fc)), closes [#48089](https://github.com/prettier/angular-html-parser/issues/48089)
* **compiler-cli:** exclude abstract classes from `strictInjectionParameters` requirement ([#44615](https://github.com/prettier/angular-html-parser/issues/44615)) ([bc54687](https://github.com/prettier/angular-html-parser/commit/bc54687c7b91efe451aa744d2d3a15ca3524231e)), closes [#37914](https://github.com/prettier/angular-html-parser/issues/37914)
* **compiler-cli:** implement more host directive validations as diagnostics ([#47768](https://github.com/prettier/angular-html-parser/issues/47768)) ([f97bebf](https://github.com/prettier/angular-html-parser/commit/f97bebf17af2b4768f895aaac1014c693a3c6c85))
* **compiler-cli:** Produce diagnostic rather than crash when using invalid hostDirective ([#48314](https://github.com/prettier/angular-html-parser/issues/48314)) ([27eaded](https://github.com/prettier/angular-html-parser/commit/27eaded62dbe059fc9ac02cfa7f53ccf8aebccbf))
* **compiler-cli:** support hasInvalidatedResolutions. ([#47585](https://github.com/prettier/angular-html-parser/issues/47585)) ([2e1ddde](https://github.com/prettier/angular-html-parser/commit/2e1dddec45fef8291b1f3abce2a937e28bb75a87))
* **compiler-cli:** update `@babel/core` dependency and lock version ([#48634](https://github.com/prettier/angular-html-parser/issues/48634)) ([caedef0](https://github.com/prettier/angular-html-parser/commit/caedef0f5b37ac6530885223b26879c39c36c1bd))
* **compiler-cli:** use [@ts-ignore](https://github.com/ts-ignore). ([#47636](https://github.com/prettier/angular-html-parser/issues/47636)) ([19ad498](https://github.com/prettier/angular-html-parser/commit/19ad4987f9070222bb2fb8bd07a43ed7995f602a))
* **compiler:** make sure selectors inside container queries are correctly scoped ([#48353](https://github.com/prettier/angular-html-parser/issues/48353)) ([4c02395](https://github.com/prettier/angular-html-parser/commit/4c023956d8dd05d8455612dff185a7e7918c9fed)), closes [#48264](https://github.com/prettier/angular-html-parser/issues/48264)
* **compiler:** scope css keyframes in emulated view encapsulation ([#42608](https://github.com/prettier/angular-html-parser/issues/42608)) ([051f756](https://github.com/prettier/angular-html-parser/commit/051f75648d6065949796ac1c7ea67e71e31b011e)), closes [#33885](https://github.com/prettier/angular-html-parser/issues/33885)
* **compiler:** type-only symbols incorrectly retained when downlevelling custom decorators ([#48638](https://github.com/prettier/angular-html-parser/issues/48638)) ([33f35b0](https://github.com/prettier/angular-html-parser/commit/33f35b04ef0f32f25624a6be59f8635675e3e131)), closes [#47167](https://github.com/prettier/angular-html-parser/issues/47167) [#48448](https://github.com/prettier/angular-html-parser/issues/48448)
* **compiler:** update element schema ([#47552](https://github.com/prettier/angular-html-parser/issues/47552)) ([39b72e2](https://github.com/prettier/angular-html-parser/commit/39b72e208b46d80f1d9a802cebf043c2ccf3c5f2)), closes [#47545](https://github.com/prettier/angular-html-parser/issues/47545)
* **compiler:** update element schema ([#47552](https://github.com/prettier/angular-html-parser/issues/47552)) ([48b354a](https://github.com/prettier/angular-html-parser/commit/48b354a83e6d94735a03eebb3a52c5698e7a0f44)), closes [#47545](https://github.com/prettier/angular-html-parser/issues/47545)
* **core:** add` zone.js` version `0.12.x` as a valid peer dependency ([#48002](https://github.com/prettier/angular-html-parser/issues/48002)) ([046ce43](https://github.com/prettier/angular-html-parser/commit/046ce43388be7b60c443c33194b3add2e2763eec))
* **core:** allow readonly arrays for standalone imports ([#47851](https://github.com/prettier/angular-html-parser/issues/47851)) ([2d085dc](https://github.com/prettier/angular-html-parser/commit/2d085dc037658d8e723cfad4e7877d08f866c5d4)), closes [#47643](https://github.com/prettier/angular-html-parser/issues/47643)
* **core:** hardening attribute and property binding rules for <iframe> elements ([#47964](https://github.com/prettier/angular-html-parser/issues/47964)) ([2d8d562](https://github.com/prettier/angular-html-parser/commit/2d8d562604ebb5ae563222830301cad78b2265ba))
* **core:** hardening rules related to the attribute order on iframe elements ([#47935](https://github.com/prettier/angular-html-parser/issues/47935)) ([2d08965](https://github.com/prettier/angular-html-parser/commit/2d08965b1a772609cea7f1fb2a11bce9c6337ea6))
* **core:** unable to inject ChangeDetectorRef inside host directives ([#48355](https://github.com/prettier/angular-html-parser/issues/48355)) ([5f9c7ce](https://github.com/prettier/angular-html-parser/commit/5f9c7ceb907be47dff3e203dd837fd6ee9133fcb)), closes [#48249](https://github.com/prettier/angular-html-parser/issues/48249)
* **devtools:** prevent devTools to load when not text/html document ([#48021](https://github.com/prettier/angular-html-parser/issues/48021)) ([f8f8928](https://github.com/prettier/angular-html-parser/commit/f8f8928210eb8f8c554666e5c0b4cb415c00c416)), closes [#48017](https://github.com/prettier/angular-html-parser/issues/48017)
* **devtools:** Replace material imports and styles ([#48420](https://github.com/prettier/angular-html-parser/issues/48420)) ([2e65a2b](https://github.com/prettier/angular-html-parser/commit/2e65a2bd8433bf5656968d78a55b96ad878f9561)), closes [#48216](https://github.com/prettier/angular-html-parser/issues/48216)
* **docs-infra:** add punctuation to dr iq ([#47525](https://github.com/prettier/angular-html-parser/issues/47525)) ([89006b1](https://github.com/prettier/angular-html-parser/commit/89006b10253ac448c50ac813439974a237cf4753)), closes [#46011](https://github.com/prettier/angular-html-parser/issues/46011)
* **docs-infra:** display "developer preview" label on class members ([#47814](https://github.com/prettier/angular-html-parser/issues/47814)) ([fc07efd](https://github.com/prettier/angular-html-parser/commit/fc07efdd2b3a3294d7a9222825ac69d250a83de4))
* **forms:** call `setDisabledState` on `ControlValueAcessor` when control is enabled ([#47576](https://github.com/prettier/angular-html-parser/issues/47576)) ([96b7fe9](https://github.com/prettier/angular-html-parser/commit/96b7fe93af361a1cf2ea5477970f64ba6f3d8cd5)), closes [#35309](https://github.com/prettier/angular-html-parser/issues/35309)
* **forms:** don't mutate validators array ([#47830](https://github.com/prettier/angular-html-parser/issues/47830)) ([779a76f](https://github.com/prettier/angular-html-parser/commit/779a76fa5a00ff6961f0fb8541dac61c915ea258)), closes [#47827](https://github.com/prettier/angular-html-parser/issues/47827)
* **forms:** don't mutate validators array ([#47830](https://github.com/prettier/angular-html-parser/issues/47830)) ([0329c13](https://github.com/prettier/angular-html-parser/commit/0329c13e95127fd6f0044b6809b9bccb27f3cb91)), closes [#47827](https://github.com/prettier/angular-html-parser/issues/47827)
* **forms:** FormBuilder.group return right type with shorthand parameters. ([#48084](https://github.com/prettier/angular-html-parser/issues/48084)) ([d321880](https://github.com/prettier/angular-html-parser/commit/d3218804401fb35d8da1de91960bbdf9ab0aa823))
* **forms:** Improve a very commonly viewed error message by adding a guide. ([#47969](https://github.com/prettier/angular-html-parser/issues/47969)) ([604cdb7](https://github.com/prettier/angular-html-parser/commit/604cdb730706ec2a0ae0118e14a65f22c5e3d74a))
* **forms:** Runtime error pages must begin with leading zero ([#47991](https://github.com/prettier/angular-html-parser/issues/47991)) ([8e6ec72](https://github.com/prettier/angular-html-parser/commit/8e6ec72bebb9da0d1c733b703c58800d52644e88))
* **http:** better handle unexpected `undefined` XSRF tokens ([#47683](https://github.com/prettier/angular-html-parser/issues/47683)) ([ea16a98](https://github.com/prettier/angular-html-parser/commit/ea16a98dfef0de33c192e328f151cca39749a488))
* **http:** rename `withLegacyInterceptors` to `withInterceptorsFromDi` ([#47901](https://github.com/prettier/angular-html-parser/issues/47901)) ([febf29d](https://github.com/prettier/angular-html-parser/commit/febf29dd5197f8943e6377a8fc66a14b3a1c5973)), closes [#47764](https://github.com/prettier/angular-html-parser/issues/47764)
* **language-service:** correctly handle host directive inputs/outputs ([#48147](https://github.com/prettier/angular-html-parser/issues/48147)) ([fd2eea5](https://github.com/prettier/angular-html-parser/commit/fd2eea59613ab3cdde871046b6086216d77a386e)), closes [#48102](https://github.com/prettier/angular-html-parser/issues/48102)
* **language-service:** Prevent crashes on unemitable references ([#47938](https://github.com/prettier/angular-html-parser/issues/47938)) ([ce8160e](https://github.com/prettier/angular-html-parser/commit/ce8160ecb28d6765d438eb65035835984eb956ec))
* **language-service:** update packages/language-service/build.sh script to work with vscode-ng-language-service's new Bazel build ([#48120](https://github.com/prettier/angular-html-parser/issues/48120)) ([764fa3d](https://github.com/prettier/angular-html-parser/commit/764fa3d9c37eb70acd21879296ec039de07173ea)), closes [angular/vscode-ng-language-service#1815](https://github.com/angular/vscode-ng-language-service/issues/1815)
* **localize:** add polyfill in polyfills array instead of polyfills.ts ([#47569](https://github.com/prettier/angular-html-parser/issues/47569)) ([400a6b5](https://github.com/prettier/angular-html-parser/commit/400a6b5e3707f3939d84c659a115b75ef15d2c09))
* **localize:** add triple slash type reference on `@angular/localize` on `ng  add ([#48502](https://github.com/prettier/angular-html-parser/issues/48502)) ([a1a8e91](https://github.com/prettier/angular-html-parser/commit/a1a8e91ecaded6a2e4d700109a26d3117ad77c9c)), closes [#48434](https://github.com/prettier/angular-html-parser/issues/48434)
* **localize:** update ng add schematic to support Angular CLI version 15 ([#47763](https://github.com/prettier/angular-html-parser/issues/47763)) ([c9541f4](https://github.com/prettier/angular-html-parser/commit/c9541f4c49f6924658ea6b555923cbe2bdd2dfa2)), closes [#47677](https://github.com/prettier/angular-html-parser/issues/47677)
* **migrations:** combine newly-added imports in import manager ([#48620](https://github.com/prettier/angular-html-parser/issues/48620)) ([cc284af](https://github.com/prettier/angular-html-parser/commit/cc284afbbc33b91884882204c5958a44a5d11392))
* **platform-server:** align server renderer interface with base renderer ([#47868](https://github.com/prettier/angular-html-parser/issues/47868)) ([54e32da](https://github.com/prettier/angular-html-parser/commit/54e32dad3e130a64e0c312746b67229d8aeb785c)), closes [#47844](https://github.com/prettier/angular-html-parser/issues/47844)
* **platform-server:** call `onSerialize` when state is empty ([#47888](https://github.com/prettier/angular-html-parser/issues/47888)) ([790ee17](https://github.com/prettier/angular-html-parser/commit/790ee17e80c755ec29f94c7f74898834f988d15c)), closes [/github.com/angular/angular/commit/a0b2d364156eed0d33831c37b00ea5c58ff4bbec#diff-3975e0ee5aa3e06ecbcd76f5fa5134612f7fd2e6802ca7d370973bd410aab55cR25-R31](https://github.com/prettier//github.com/angular/angular/commit/a0b2d364156eed0d33831c37b00ea5c58ff4bbec/issues/diff-3975e0ee5aa3e06ecbcd76f5fa5134612f7fd2e6802ca7d370973bd410aab55cR25-R31) [/github.com/ngrx/platform/issues/101#issuecomment-351998548](https://github.com/prettier//github.com/ngrx/platform/issues/101/issues/issuecomment-351998548) [#47172](https://github.com/prettier/angular-html-parser/issues/47172)
* **router:** correct type of nextState parameter in canDeactivate ([#48038](https://github.com/prettier/angular-html-parser/issues/48038)) ([b51929a](https://github.com/prettier/angular-html-parser/commit/b51929a394acaa129699bc72e34882b7e577dd7f)), closes [#47153](https://github.com/prettier/angular-html-parser/issues/47153)
* **router:** Delay router scroll event until navigated components have rendered ([#47563](https://github.com/prettier/angular-html-parser/issues/47563)) ([af8afee](https://github.com/prettier/angular-html-parser/commit/af8afee5bde7a3078c35202db75d1b2b6a8e7bee)), closes [#24547](https://github.com/prettier/angular-html-parser/issues/24547)
* **router:** Ensure renavigating in component init works with enabledBlocking ([#48063](https://github.com/prettier/angular-html-parser/issues/48063)) ([1df0ed7](https://github.com/prettier/angular-html-parser/commit/1df0ed7d6e636d921ad617465c3956dc1b6292eb)), closes [/github.com/ReactiveX/rxjs/blob/afac3d574323333572987e043adcd0f8d4cff546/src/internal/Subject.ts#L101-L104](https://github.com/prettier//github.com/ReactiveX/rxjs/blob/afac3d574323333572987e043adcd0f8d4cff546/src/internal/Subject.ts/issues/L101-L104) [#48052](https://github.com/prettier/angular-html-parser/issues/48052)
* **router:** fix redirectTo on named outlets - resolves [#33783](https://github.com/prettier/angular-html-parser/issues/33783) ([#47927](https://github.com/prettier/angular-html-parser/issues/47927)) ([2ed5aef](https://github.com/prettier/angular-html-parser/commit/2ed5aeffd880639a43e19f3fb77282c7126a6bce))
* **router:** Remove deprecated relativeLinkResolution ([#47623](https://github.com/prettier/angular-html-parser/issues/47623)) ([7b89d95](https://github.com/prettier/angular-html-parser/commit/7b89d95c0e7370d33f006aba8e67bafb53a2fd4f))
* **router:** restore 'history.state' on popstate even if navigationId missing ([#48033](https://github.com/prettier/angular-html-parser/issues/48033)) ([1976e37](https://github.com/prettier/angular-html-parser/commit/1976e37475e144d4df27b1558b2acd929bd439be)), closes [#28108](https://github.com/prettier/angular-html-parser/issues/28108) [#28954](https://github.com/prettier/angular-html-parser/issues/28954)
* **zone.js:** cancel tasks only when they are scheduled or running ([#46435](https://github.com/prettier/angular-html-parser/issues/46435)) ([b618b5a](https://github.com/prettier/angular-html-parser/commit/b618b5aa86138c900055c5496967e3348a7b98fc)), closes [#45711](https://github.com/prettier/angular-html-parser/issues/45711)

## [3.0.0](https://github.com/prettier/angular-html-parser/compare/v1.6.0...v3.0.0) (2022-11-20)

Sync with upstream.

## [2.1.0](https://github.com/prettier/angular-html-parser/compare/v2.0.0...v2.1.0) (2022-10-18)


### Features

* expose utils and classes ([#26](https://github.com/prettier/angular-html-parser/issues/26)) ([aacfa00](https://github.com/prettier/angular-html-parser/commit/aacfa00bd92006bb4abb26adda1fabb69fca3800))

## [2.0.0](https://github.com/prettier/angular-html-parser/compare/v1.8.0...v2.0.0) (2022-10-02)


### ⚠ BREAKING CHANGES

* switch to ESM



<a name="1.8.0"></a>
# [1.8.0](https://github.com/ikatyang/angular-html-parser/compare/v1.7.1...v1.8.0) (2021-04-05)


### Features

* add `type` field to nodes and use enumerable node type ([#21](https://github.com/ikatyang/angular-html-parser/issues/21)) ([5823440](https://github.com/ikatyang/angular-html-parser/commit/5823440))



<a name="1.7.1"></a>
## [1.7.1](https://github.com/ikatyang/angular-html-parser/compare/v1.7.0...v1.7.1) (2020-06-26)


### Bug Fixes

* add missing endSourceSpan for element with void element as its last child ([#20](https://github.com/ikatyang/angular-html-parser/issues/20)) ([f7e8c18](https://github.com/ikatyang/angular-html-parser/commit/f7e8c18))



<a name="1.7.0"></a>
# [1.7.0](https://github.com/ikatyang/angular-html-parser/compare/v1.6.0...v1.7.0) (2020-05-09)


### Features

* **getTagContentType:** add `attrs` parameter ([#17](https://github.com/ikatyang/angular-html-parser/issues/17)) ([6443800](https://github.com/ikatyang/angular-html-parser/commit/6443800))



<a name="1.6.0"></a>
# [1.6.0](https://github.com/ikatyang/angular-html-parser/compare/v1.5.0...v1.6.0) (2020-05-03)


### Features

* **getTagContentType:** add `prefix` and `hasParent` parameters ([#13](https://github.com/ikatyang/angular-html-parser/issues/13)) ([aae23df](https://github.com/ikatyang/angular-html-parser/commit/aae23df))



<a name="1.5.0"></a>
# [1.5.0](https://github.com/ikatyang/angular-html-parser/compare/v1.4.0...v1.5.0) (2020-04-21)


### Features

* add an option to customize tag content type ([#12](https://github.com/ikatyang/angular-html-parser/issues/12)) ([b327e1a](https://github.com/ikatyang/angular-html-parser/commit/b327e1a))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/compare/v1.3.0...v1.4.0) (2020-01-28)


### Bug Fixes

* do not wrap `<tr>` into pseudo `<tbody>` ([b63f8a1](https://github.com/ikatyang/angular-html-parser/commit/b63f8a1))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/compare/v1.2.0...v1.3.0) (2019-11-02)


### Features

* support full named entities ([#9](https://github.com/ikatyang/angular-html-parser/issues/9)) ([7eaec57](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/commit/7eaec57))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/compare/v1.1.0...v1.2.0) (2018-12-07)


### Features

* add an option to specify case-sensitivity for tag names ([#7](https://github.com/ikatyang/angular-html-parser/issues/7)) ([a76b450](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/commit/a76b450))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/compare/v1.0.0...v1.1.0) (2018-11-27)


### Features

* add an option to allow `htm` component closing tags ([#6](https://github.com/ikatyang/angular-html-parser/issues/6)) ([b505c16](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/commit/b505c16))
* support bogus comments ([#5](https://github.com/ikatyang/angular-html-parser/issues/5)) ([75042e9](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/commit/75042e9))



<a name="1.0.0"></a>
# 1.0.0 (2018-10-24)

### Features

* initial implementation ([#1](https://github.com/ikatyang/angular-html-parser/issues/1)) ([0e8b9a5](https://github.com/ikatyang/angular-html-parser/blob/master/packages/angular-html-parser/commit/0e8b9a5))
