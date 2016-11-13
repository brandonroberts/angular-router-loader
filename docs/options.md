## General Loader Options

Options are provided as a query string with the `angular2-router-loader`

```ts
loaders: [
  'angular2-router-loader?option=value'
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

Enables replacement of the `loadChildren` string to
load the Angular compiled factory file and factory class based on the provided file and class.

### genDir `(default: '')`

In your `tsconfig.json`, if you set the `genDir` in the `angularCompilerOptions` to compile to a separate directory, this option needs to be set to the relative path to your application directory.

## AoT example

Example file structure
```
|-- src  
   |-- app  
|-- tsconfig.json
```
tsconfig.json (Angular Compiler Options)

```json
"angularCompilerOptions": {
  "genDir": "src/compiled",
  "skipMetadataEmit" : true
}
```

Webpack Configuration (TypeScript loaders)
```ts
loaders: [
  {
    test: /\.ts$/,
    loaders: [
      'awesome-typescript-loader',
      'angular2-router-loader?aot=true&genDir=src/compiled/src/app'
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
    });
  })
}
```

## Lazy Loading Options

### chunkName (require loader only)

Allows you to provide [named chunks](http://webpack.github.io/docs/code-splitting.html#named-chunks) for code splitting.

original
```ts
{
  path: 'lazy',
  loadChildren './lazy.module#LazyModule?chunkName=MyChunk'
}
```

replacement
```ts
{
  path: 'lazy',
  loadChildren: () => new Promise(function (resolve) {
    (require as any).ensure([], function (require: any) {
      resolve(require('./lazy/lazy.module')['LazyModule']);
    }, 'MyChunk');
  })
}
```
