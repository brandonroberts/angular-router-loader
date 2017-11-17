## General Loader Options

Options are provided as a query string with the `angular-router-loader`

```ts
loaders: [
  'angular-router-loader?option=value'
]

```

### debug: `(default: false)`

Logs the file, loadChildren string found and replacement string used to the console.

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
  loadChildren: () => new Promise(function (resolve, reject) {
    (require as any).ensure([], function (require: any) {
      resolve(require('./lazy/lazy.module')['LazyModule']);
    }, function () {
      reject({ loadChunkError: true });
    });
  })
}
```

To use `System.import`, set the `loader` to `system`

**NOTE:** Using `system` only works with Webpack 2. Webpack 1 users should use the default.

replacement
```ts
{
  path: 'lazy',
  loadChildren: () => System.import('./lazy/lazy.module')
    .then(module => module['LazyModule'], () => { throw({ loadChunkError: true }); })
}
```

To use `dynamic import`, set the `loader` to `import`

replacement
```ts
{
  path: 'lazy',
  loadChildren: () => import('./lazy/lazy.module')
    .then(module => module['LazyModule'], () => { throw({ loadChunkError: true }); })
}
```

## Loader options (AoT compilation)

### aot: `(default: false)`

Enables replacement of the `loadChildren` string to
load the Angular compiled factory file and factory class based on the provided file and class.

### genDir `(default: '')`

**NOTE:** Angular version < 5 only

In your `tsconfig.json`, if you set the `genDir` in the `angularCompilerOptions` to compile to a separate directory, this option needs to be set to the same value here.

## AoT example

Example file structure (after an AOT build)
```
|-- compiled
   |-- src
      |-- app
|-- src
   |-- app
|-- tsconfig.json
```
tsconfig.json (Angular Compiler Options)

```json
"angularCompilerOptions": {
  "genDir": "compiled",
  "skipMetadataEmit" : true
}
```

Webpack Configuration (TypeScript loaders)

**Angular Version >= 5**

```ts
loaders: [
  {
    test: /\.ts$/,
    loaders: [
      'awesome-typescript-loader'
    ]
  },
  {
    test: /\.(ts|js)$/,
    loaders: [
      'angular-router-loader?aot=true'
    ]
  }  
]
```

**Angular Version < 5**

```ts
loaders: [
  {
    test: /\.ts$/,
    loaders: [
      'awesome-typescript-loader',
      'angular-router-loader?aot=true&genDir=compiled'
    ]
  }  
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
    }, function () {
      reject({ loadChunkError: true });
    });
  })
}
```

## Lazy Loading Options

### chunkName

Allows you to provide [named chunks](http://webpack.github.io/docs/code-splitting.html#named-chunks) for code splitting.

original
```ts
{
  path: 'lazy',
  loadChildren './lazy.module#LazyModule?chunkName=MyChunk'
}
```

replacement (require loader)
```ts
{
  path: 'lazy',
  loadChildren: () => new Promise(function (resolve) {
    (require as any).ensure([], function (require: any) {
      resolve(require('./lazy/lazy.module')['LazyModule']);
    }, function () {
      reject({ loadChunkError: true });
    }, 'MyChunk');
  })
}
```

replacement (system loader)
```ts
{
  path: 'lazy',
  loadChildren: () => System.import(/* webpackChunkName: "MyChunk" */ './lazy/lazy.module')
    .then(module => module['LazyModule'], () => { throw({ loadChunkError: true }); })
}
```

replacement (import loader)
```ts
{
  path: 'lazy',
  loadChildren: () => import(/* webpackChunkName: "MyChunk" */ './lazy/lazy.module')
    .then(module => module['LazyModule'], () => { throw({ loadChunkError: true }); })
}
```
