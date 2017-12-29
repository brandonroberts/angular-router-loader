var should = require('should');
var loader = require('../src/index');

function checkResult(loaded, result) {
  return loaded.should.eql(result.join(''));
}

describe('Loader', function() {

  var resourcePath = 'path/to/routes.ts';
  var modulePath = './path/to/file.module#FileModule';
  var query = '';

  describe('should match', function() {

    var loadStrings = [
      `loadChildren: '${modulePath}'`,
      `loadChildren:'${modulePath}'`,
      `loadChildren :'${modulePath}'`,
      `loadChildren : '${modulePath}'`,
      `loadChildren :  '${modulePath}'`,
      `loadChildren  :'${modulePath}'`,

      `loadChildren: "${modulePath}"`,
      `loadChildren:"${modulePath}"`,
      `loadChildren :"${modulePath}"`,
      `loadChildren : "${modulePath}"`,

      `"loadChildren":"${modulePath}"`,
      `"loadChildren": "${modulePath}"`,
      `"loadChildren" : "${modulePath}"`,
      `"loadChildren" :  "${modulePath}"`,
      `"loadChildren"  :"${modulePath}"`,
      `"loadChildren"  : "${modulePath}"`,

      `'loadChildren':"${modulePath}"`,
      `'loadChildren': "${modulePath}"`,
      `'loadChildren' : "${modulePath}"`,
      `'loadChildren' :  "${modulePath}"`,
      `'loadChildren'  :"${modulePath}"`,
      `'loadChildren'  : "${modulePath}"`
    ];

    loadStrings.forEach(function(loadString) {
      it(loadString, function() {

        var result = [
          'loadChildren: function() { return new Promise(function (resolve, reject) {',
          '  (require as any).ensure([], function (require: any) {',
          '    resolve(require(\'./path/to/file.module\')[\'FileModule\']);',
          '  }, function() {',
          '    reject({ loadChunkError: true });',
          '  });',
          '}) }'
        ];

        var loadedString = loader.call({
          resourcePath: resourcePath,
          query: query
        }, loadString);

        checkResult(loadedString, result);

      });
    });

    describe('should not match', function() {

      var loadStrings = [
        `loadChildren: \`${modulePath}\``,
        `loadChildren : () => {}`,
        `loadChildren: someFunction('./')`
      ];

      loadStrings.forEach(function(loadString) {
        it(loadString, function() {
          var result = [
            'loadChildren: function() { return new Promise(function (resolve, reject) {',
            '  (require as any).ensure([], function (require: any) {',
            '    resolve(require(\'./path/to/file.module\')[\'FileModule\']);',
            '  }, function() {',
            '    reject({ loadChunkError: true });',
            '  });',
            '}) }'
          ];

          var loadedString = loader.call({
            resourcePath: resourcePath,
            query: query
          }, loadString);

          checkResult(loadedString, [loadString]);

        });
      });
    });

  });

  it('should return a loadChildren async require statement', function() {
    var result = [
      'loadChildren: function() { return new Promise(function (resolve, reject) {',
      '  (require as any).ensure([], function (require: any) {',
      '    resolve(require(\'./path/to/file.module\')[\'FileModule\']);',
      '  }, function() {',
      '    reject({ loadChunkError: true });',
      '  });',
      '}) }'
    ];

    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: query
    }, `loadChildren: '${modulePath}'`);

    checkResult(loadedString, result);
  });

  it('should return a plain javascript loadChildren async require statement', function() {
    var result = [
      'loadChildren: function() { return new Promise(function (resolve, reject) {',
      '  require.ensure([], function (require) {',
      '    resolve(require(\'./path/to/file.module\')[\'FileModule\']);',
      '  }, function() {',
      '    reject({ loadChunkError: true });',
      '  });',
      '}) }'
    ];

    var loadedString = loader.call({
      resourcePath: resourcePath.replace('.ts', '.js'),
      query: query
    }, `loadChildren: '${modulePath}'`);

    checkResult(loadedString, result);
  });

  it('should return a loadChildren sync require statement', function() {
    var result = [
      'loadChildren: function() {',
      '  return require(\'./path/to/file.module\')[\'FileModule\'];',
      '}'
    ];

    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: query
    }, `loadChildren: '${modulePath}?sync=true'`);

    checkResult(loadedString, result);
  });

  it('should return a loadChildren chunkName require statement', function() {
    var result = [
      'loadChildren: function() { return new Promise(function (resolve, reject) {',
      '  (require as any).ensure([], function (require: any) {',
      '    resolve(require(\'./path/to/file.module\')[\'FileModule\']);',
      '  }, function() {',
      '    reject({ loadChunkError: true });',
      '  }, \'name\');',
      '}) }'
    ];

    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: query
    }, `loadChildren: '${modulePath}?chunkName=name'`);

    checkResult(loadedString, result);
  });

  it ('should return a loadChildren System.import statement', function() {
    var result = [
      'loadChildren: function() { return System.import(\'./path/to/file.module\')',
      '  .then(module => module[\'FileModule\'], () => { throw({ loadChunkError: true }); }) }'
    ];

    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: '?loader=system'
    }, `loadChildren: '${modulePath}'`);

    checkResult(loadedString, result);
  });

  it ('should return a loadChildren chunkName System.import statement', function() {
    var result = [
      'loadChildren: function() { return System.import(/* webpackChunkName: "name" */ \'./path/to/file.module\')',
      '  .then(module => module[\'FileModule\'], () => { throw({ loadChunkError: true }); }) }'
    ];

    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: '?loader=system'
    }, `loadChildren: '${modulePath}?chunkName=name'`);

    checkResult(loadedString, result);
  });

  it ('should return a loadChildren dynamic import statement', function() {
    var result = [
      'loadChildren: function() { return import(\'./path/to/file.module\')',
      '  .then(module => module[\'FileModule\'], () => { throw({ loadChunkError: true }); }) }'
    ];

    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: '?loader=import'
    }, `loadChildren: '${modulePath}'`);

    checkResult(loadedString, result);
  });

  it ('should return a loadChildren chunkName dynamic import statement', function() {
    var result = [
      'loadChildren: function() { return import(/* webpackChunkName: "name" */ \'./path/to/file.module\')',
      '  .then(module => module[\'FileModule\'], () => { throw({ loadChunkError: true }); }) }'
    ];

    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: '?loader=import'
    }, `loadChildren: '${modulePath}?chunkName=name'`);

    checkResult(loadedString, result);
  });  

  it('should return a loadChildren async require statement with default', function() {
    var modulePath = './path/to/file.module';

    var result = [
      'loadChildren: function() { return new Promise(function (resolve, reject) {',
      '  (require as any).ensure([], function (require: any) {',
      '    resolve(require(\'./path/to/file.module\')[\'default\']);',
      '  }, function() {',
      '    reject({ loadChunkError: true });',
      '  });',
      '}) }'
    ];

    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: query
    }, `loadChildren: '${modulePath}'`);

    checkResult(loadedString, result);
  });

  it('should support a custom delimiter', function() {
    var result = [
      'loadChildren: function() { return new Promise(function (resolve, reject) {',
      '  (require as any).ensure([], function (require: any) {',
      '    resolve(require(\'./path/to/file.module\')[\'FileModule\']);',
      '  }, function() {',
      '    reject({ loadChunkError: true });',
      '  });',
      '}) }'
    ];

    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: '?delimiter=*'
    }, `loadChildren: '${modulePath.replace('#', '*')}'`);

    checkResult(loadedString, result);
  });

  it('should support windows file paths', function() {
    var pmock = require('pmock');
    var env = pmock.platform('win32');

    var result = [
      'loadChildren: function() { return new Promise(function (resolve, reject) {',
      '  (require as any).ensure([], function (require: any) {',
      '    resolve(require(\'.\\\\path\\\\to\\\\file.module\')[\'FileModule\']);',
      '  }, function() {',
      '    reject({ loadChunkError: true });',
      '  });',
      '}) }'
    ];

    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: query
    }, `loadChildren: '${modulePath}'`);

    checkResult(loadedString, result);

    env.reset();
  });

  it('should support non-relative paths', function() {
    var result = [
      'loadChildren: function() { return new Promise(function (resolve, reject) {',
      '  (require as any).ensure([], function (require: any) {',
      '    resolve(require(\'path/to/file.module\')[\'FileModule\']);',
      '  }, function() {',
      '    reject({ loadChunkError: true });',
      '  });',
      '}) }'
    ];

    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: ''
    }, `loadChildren: '${modulePath.replace('./', '')}'`);

    checkResult(loadedString, result);
  });

  describe('AoT', function() {
    beforeEach(function() {
      query = '?aot=true&genDir=.'
    });

    it('should return a loadChildren async require statement', function() {
      var result = [
        'loadChildren: function() { return new Promise(function (resolve, reject) {',
        '  (require as any).ensure([], function (require: any) {',
        '    resolve(require(\'./path/to/file.module.ngfactory\')[\'FileModuleNgFactory\']);',
        '  }, function() {',
        '    reject({ loadChunkError: true });',
        '  });',  
        '}) }'
      ];

      var loadedString = loader.call({
        resourcePath: resourcePath,
        query: query
      }, `loadChildren: '${modulePath}'`);

      checkResult(loadedString, result);
    });

    it('should return a loadChildren sync require statement', function() {
      var result = [
        'loadChildren: function() {',
        '  return require(\'./path/to/file.module.ngfactory\')[\'FileModuleNgFactory\'];',
        '}'
      ];

      var loadedString = loader.call({
        resourcePath: resourcePath,
        query: query
      }, `loadChildren: '${modulePath}?sync=true'`);

      checkResult(loadedString, result);
    });

    it ('should return a loadChildren System.import statement', function() {
      var result = [
        'loadChildren: function() { return System.import(\'./path/to/file.module.ngfactory\')',
        '  .then(module => module[\'FileModuleNgFactory\'], () => { throw({ loadChunkError: true }); }) }'
      ];

      var loadedString = loader.call({
        resourcePath: resourcePath,
        query: query + '&loader=system'
      }, `loadChildren: '${modulePath}'`);

      checkResult(loadedString, result);
    });

    it ('should return a loadChildren dynamic import statement', function() {
      var result = [
        'loadChildren: function() { return import(\'./path/to/file.module.ngfactory\')',
        '  .then(module => module[\'FileModuleNgFactory\'], () => { throw({ loadChunkError: true }); }) }'
      ];

      var loadedString = loader.call({
        resourcePath: resourcePath,
        query: query + '&loader=import'
      }, `loadChildren: '${modulePath}'`);

      checkResult(loadedString, result);
    });

    it('should support a custom moduleSuffix', function() {
      var moduleSuffix = '.ngfile';

      var result = [
        'loadChildren: function() { return new Promise(function (resolve, reject) {',
        '  (require as any).ensure([], function (require: any) {',
        '    resolve(require(\'./path/to/file.module' + moduleSuffix + '\')[\'FileModuleNgFactory\']);',
        '  }, function() {',
        '    reject({ loadChunkError: true });',
        '  });',  
        '}) }'
      ];

      var loadedString = loader.call({
        resourcePath: resourcePath,
        query: query + '&moduleSuffix=' + moduleSuffix
      }, `loadChildren: '${modulePath}'`);

      checkResult(loadedString, result);
    });

    it('should support a custom factorySuffix', function() {
      var factorySuffix = 'NgFact';

      var result = [
        'loadChildren: function() { return new Promise(function (resolve, reject) {',
        '  (require as any).ensure([], function (require: any) {',
        '    resolve(require(\'./path/to/file.module.ngfactory\')[\'FileModule' + factorySuffix + '\']);',
        '  }, function() {',
        '    reject({ loadChunkError: true });',
        '  });',
        '}) }'
      ];

      var loadedString = loader.call({
        resourcePath: resourcePath,
        query: query + '&factorySuffix=' + factorySuffix
      }, `loadChildren: '${modulePath}'`);

      checkResult(loadedString, result);
    });

    it('should support non-relative paths', function() {
      var result = [
        'loadChildren: function() { return new Promise(function (resolve, reject) {',
        '  (require as any).ensure([], function (require: any) {',
        '    resolve(require(\'path/to/file.module.ngfactory\')[\'FileModuleNgFactory\']);',
        '  }, function() {',
        '    reject({ loadChunkError: true });',
        '  });',  
        '}) }'
      ];

      var loadedString = loader.call({
        resourcePath: resourcePath,
        query: query
      }, `loadChildren: '${modulePath.replace('./', '')}'`);

      checkResult(loadedString, result);
    });
  });

  describe('AoT + genDir', function() {
    var resourcePath = 'src/app/my-module/my-module.routes.ts';
    var modulePath = '../groups/inventory/index#InventoryModule';

    beforeEach(function() {
      query = '?aot=true&genDir=compiled'
    });

    it('should return a loadChildren async require statement', function() {
      var result = [
        'loadChildren: function() { return new Promise(function (resolve, reject) {',
        '  (require as any).ensure([], function (require: any) {',
        '    resolve(require(\'../../../compiled/src/app/groups/inventory/index.ngfactory\')[\'InventoryModuleNgFactory\']);',
        '  }, function() {',
        '    reject({ loadChunkError: true });',
        '  });',  
        '}) }'
      ];

      var loadedString = loader.call({
        resourcePath: resourcePath,
        query: query
      }, `loadChildren: '${modulePath}'`);

      checkResult(loadedString, result);
    });
  });
});
