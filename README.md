# angular2-router-loader

[![CircleCI](https://circleci.com/gh/brandonroberts/angular2-router-loader.svg?style=shield&circle-token=a8a709588d22664ab74922050eda672898d2d417)](https://circleci.com/gh/brandonroberts/angular2-router-loader)
[![npm version](https://badge.fury.io/js/angular2-router-loader.svg)](https://badge.fury.io/js/angular2-router-loader)

A Webpack loader for Angular 2 that enables string-based module loading with the `Angular Router`

## Installation

  `npm install angular2-router-loader --save-dev`

## Usage

Add the `angular2-router-loader` to your typescript loaders

```ts
loaders: [
  {
    test: /\.ts$/,
    loaders: [
      'awesome-typescript-loader',
      'angular2-router-loader'
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

## Loader Options

Options are provided as a query string with the `angular2-router-loader`

```ts
loaders: [
  'angular2-router-loader?option=value'
]

```

### delimiter: `(default: '#')`

Changes to default delimiter for the module path/module name string

### loader: `(default: 'require')`

Sets the loader string returned for code splitting.

original
```ts
{
  path: 'lazy',
  loadChildren './lazy.module#LazyModule'
}
```

replacement
```ts
{
  path: 'lazy',
  loadChildren: () => new Promise(function (resolve) {
    (require as any).ensure([], function (require: any) {
      resolve(require('./lazy/lazy.module')['LazyModule']);
    });
  })
}
```

If you prefer to use `System.import`, set the `loader` to `system`

**NOTE:** Using `system` only works with Webpack 2. Webpack 1 users should use the default.

replacement
```ts
{
  path: 'lazy',
  loadChildren: () => System.import('./lazy/lazy.module').then(function(module) {
    return module['LazyModule'];
  })
}
```

## Loader options (AoT compilation)

### aot: `(default: false)`

Used when bundling from an AoT compilation build.

Enables replacement of the `loadChildren` string to
load the factory file and factory class based on the provided file and class.

### moduleSuffix `(default: '.ngfactory')`

Sets the suffix added to the filename for the factory file created by the AoT compiler

### factorySuffix `(default: 'NgFactory')`

Sets the class suffix added to the file class for the factory created by the AoT compiler

### genDir `(default: '')`

If you set the `genDir` in the `angularCompilerOptions` to compile to a separate directory, this option needs to be set to the relative path that directory.

## AoT example

```ts
loaders: [
  'angular2-router-loader?aot=true'
]
```

original
```ts
{
  path: 'lazy',
  loadChildren './lazy.module#LazyModule'
}
```

replacement
```ts
{
  path: 'lazy',
  loadChildren: () => new Promise(function (resolve) {
    (require as any).ensure([], function (require: any) {
      resolve(require('./lazy/lazy.module.ngfactory')['LazyModuleNgFactory']);
    });
  })
}
```

## Credits

This loader was inspired by the following projects.

[es6-promise-loader](https://github.com/gdi2290/es6-promise-loader) by [PatrickJS](https://twitter.com/@gdi2290)

[angular2-template-loader](https://github.com/TheLarkInn/angular2-template-loader) by [Sean Larkin](https://twitter.com/@TheLarkInn)

### License

MIT (http://www.opensource.org/licenses/mit-license.php)
