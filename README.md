# angular-router-loader

[![CircleCI](https://circleci.com/gh/brandonroberts/angular-router-loader.svg?style=shield&circle-token=a8a709588d22664ab74922050eda672898d2d417)](https://circleci.com/gh/brandonroberts/angular-router-loader)
[![npm version](https://badge.fury.io/js/angular-router-loader.svg)](https://badge.fury.io/js/angular-router-loader)

A Webpack loader for Angular that enables string-based module loading with the `Angular Router`

## Installation

  `npm install angular-router-loader --save-dev`

## Usage

Add the `angular-router-loader` to your typescript loaders

```ts
loaders: [
  {
    test: /\.ts$/,
    loaders: [
      'awesome-typescript-loader',
      'angular-router-loader'
    ]
  }
]
```

## Lazy Loading

In your route configuration, use `loadChildren` with a relative path to your lazy loaded angular module. The string is delimited with a `#` where the right side of split is the angular module class name.

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'lazy', loadChildren './lazy.module#LazyModule' }
];
```

## Synchronous Loading

For synchronous module loading, add the `sync=true` as a query string value to your `loadChildren` string. The module will be included in your bundle and not lazy-loaded.

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'lazy', loadChildren './lazy.module#LazyModule?sync=true' }
];
```

## Additional Documentation

* [Loader Options](./docs/options.md#general-loader-options)
* [AoT Compilation Options](./docs/options.md#loader-options-aot-compilation)
* [Lazy Loading Options](./docs/options.md#lazy-loading-options)


## Credits

This loader was inspired by the following projects.

[es6-promise-loader](https://github.com/gdi2290/es6-promise-loader) by [PatrickJS](https://twitter.com/@gdi2290)

[angular2-template-loader](https://github.com/TheLarkInn/angular2-template-loader) by [Sean Larkin](https://twitter.com/@TheLarkInn)

### License

MIT (http://www.opensource.org/licenses/mit-license.php)
