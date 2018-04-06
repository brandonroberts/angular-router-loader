<a name="0.8.3"></a>
## [0.8.3](https://github.com/brandonroberts/angular-router-loader/compare/v0.8.2...v0.8.3) (2018-04-05)



<a name="0.8.2"></a>
## [0.8.2](https://github.com/brandonroberts/angular-router-loader/compare/v0.8.1...v0.8.2) (2018-01-03)



<a name="0.8.1"></a>
## [0.8.1](https://github.com/brandonroberts/angular-router-loader/compare/v0.8.0...v0.8.1) (2017-12-19)


### Bug Fixes

* **utils:** Update vanilla JS require loader to be fully ES5 ([#98](https://github.com/brandonroberts/angular-router-loader/issues/98)) ([e6d9d88](https://github.com/brandonroberts/angular-router-loader/commit/e6d9d88))



<a name="0.8.0"></a>
# [0.8.0](https://github.com/brandonroberts/angular-router-loader/compare/v0.7.0...v0.8.0) (2017-11-17)


### Features

* **loader:** Add promise rejection upon loader error ([#94](https://github.com/brandonroberts/angular-router-loader/issues/94)) ([68d89ff](https://github.com/brandonroberts/angular-router-loader/commit/68d89ff)), closes [#75](https://github.com/brandonroberts/angular-router-loader/issues/75)
* **loader:** Add support for chunk name to system && import loaders ([#93](https://github.com/brandonroberts/angular-router-loader/issues/93)) ([df345fc](https://github.com/brandonroberts/angular-router-loader/commit/df345fc))


### BREAKING CHANGES

* **loader:** Webpack >= 2.4 is required for the error callback to be supported with require.ensure

BEFORE:

Webpack < 2.4 is supported

AFTER:

Webpack >= 2.4 is supported



<a name="0.7.0"></a>
# [0.7.0](https://github.com/brandonroberts/angular-router-loader/compare/v0.6.0...v0.7.0) (2017-11-14)


### Bug Fixes

* **docs:** Added updated changelog ([7d1f7f3](https://github.com/brandonroberts/angular-router-loader/commit/7d1f7f3))


### Features

* **loader:** Add support for dynamic import ([#90](https://github.com/brandonroberts/angular-router-loader/issues/90)) ([a9835ab](https://github.com/brandonroberts/angular-router-loader/commit/a9835ab))
* **loader:** Update regex to be able to use double-quotes and single-quotes ([#80](https://github.com/brandonroberts/angular-router-loader/issues/80)) ([0444b6e](https://github.com/brandonroberts/angular-router-loader/commit/0444b6e))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/brandonroberts/angular-router-loader/compare/v0.3.4...v0.6.0) (2017-03-29)


### Bug Fixes

* **deps:** Updated webpack/loader-utils version to fix deprecation warning ([#61](https://github.com/brandonroberts/angular-router-loader/issues/61)) ([979ae85](https://github.com/brandonroberts/angular-router-loader/commit/979ae85))
* **docs:** Clarify `genDir` option usage ([#51](https://github.com/brandonroberts/angular-router-loader/issues/51)) ([b6f46b3](https://github.com/brandonroberts/angular-router-loader/commit/b6f46b3))
* **docs:** Fix colons in readme.md ([#36](https://github.com/brandonroberts/angular-router-loader/issues/36)) ([58db6de](https://github.com/brandonroberts/angular-router-loader/commit/58db6de))
* **loader:** Fixed bug when using query string with loadChildren ([#62](https://github.com/brandonroberts/angular-router-loader/issues/62)) ([8616eae](https://github.com/brandonroberts/angular-router-loader/commit/8616eae))
* **loader:** Prefer the query 'debug' parameter to the global value ([#37](https://github.com/brandonroberts/angular-router-loader/issues/37)) ([b96316c](https://github.com/brandonroberts/angular-router-loader/commit/b96316c))


### Features

* **loader:** Added support for plain JavaScript async require statement ([#69](https://github.com/brandonroberts/angular-router-loader/issues/69)) ([7714e1f](https://github.com/brandonroberts/angular-router-loader/commit/7714e1f))



<a name="0.3.4"></a>
## [0.3.4](https://github.com/brandonroberts/angular-router-loader/compare/v0.3.2...v0.3.4) (2016-11-13)


### Bug Fixes

* **loader:** Updated string matching to account for spaces in between loadChildren ([578c68b](https://github.com/brandonroberts/angular-router-loader/commit/578c68b))


### Features

* **docs:** Added example of named chunks ([#29](https://github.com/brandonroberts/angular-router-loader/issues/29)) ([4643068](https://github.com/brandonroberts/angular-router-loader/commit/4643068))
* **loader:** Added support for named chunks ([#27](https://github.com/brandonroberts/angular-router-loader/issues/27)) ([43e83a3](https://github.com/brandonroberts/angular-router-loader/commit/43e83a3))
* **loader:** Added support for non-relative paths ([28befa8](https://github.com/brandonroberts/angular-router-loader/commit/28befa8))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/brandonroberts/angular-router-loader/compare/v0.3.1...v0.3.2) (2016-10-09)



<a name="0.3.1"></a>
## [0.3.1](https://github.com/brandonroberts/angular-router-loader/compare/v0.2.2...v0.3.1) (2016-10-07)


### Bug Fixes

* **loader:** Fixed files without a relative path. ([01fb92e](https://github.com/brandonroberts/angular-router-loader/commit/01fb92e))


### Features

* **loader:** Updated regex to be less greedy on finding occurrences. Added debug mode ([b821d38](https://github.com/brandonroberts/angular-router-loader/commit/b821d38))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/brandonroberts/angular-router-loader/compare/v0.2.1...v0.2.2) (2016-09-22)


### Features

* **tests:** Added unit tests for loader ([03f828f](https://github.com/brandonroberts/angular-router-loader/commit/03f828f))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/brandonroberts/angular-router-loader/compare/v0.2.0...v0.2.1) (2016-09-18)


### Bug Fixes

* **loader:** Fixed bug with sync loading filename ([84c8562](https://github.com/brandonroberts/angular-router-loader/commit/84c8562))


### Features

* **tests:** Added initial unit tests for loader ([824cc57](https://github.com/brandonroberts/angular-router-loader/commit/824cc57))
* **tests:** Added unit tests for util functions ([982897b](https://github.com/brandonroberts/angular-router-loader/commit/982897b))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/brandonroberts/angular-router-loader/compare/v0.1.3...v0.2.0) (2016-09-18)


### Features

* **loader:** Added option for sync module loading ([dd26e77](https://github.com/brandonroberts/angular-router-loader/commit/dd26e77))



<a name="0.1.3"></a>
## [0.1.3](https://github.com/brandonroberts/angular-router-loader/compare/v0.1.2...v0.1.3) (2016-09-14)


### Bug Fixes

* **windows:** Fixed file path replacement on windows ([d17ab66](https://github.com/brandonroberts/angular-router-loader/commit/d17ab66))



<a name="0.1.2"></a>
## [0.1.2](https://github.com/brandonroberts/angular-router-loader/compare/v0.1.1...v0.1.2) (2016-09-14)


### Bug Fixes

* **windows:** Fixed variable for replacement ([2d321ef](https://github.com/brandonroberts/angular-router-loader/commit/2d321ef))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/brandonroberts/angular-router-loader/compare/e630236...v0.1.1) (2016-09-14)


### Bug Fixes

* **loader:** Added check for Windows OS and use appropriate path API ([e630236](https://github.com/brandonroberts/angular-router-loader/commit/e630236))



