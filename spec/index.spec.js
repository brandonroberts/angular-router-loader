var should = require('should');
var loader = require('../src/index');

function checkResult(loaded, result) {
  return loaded.should.eql(result.join(''));
}

describe('Loader', function() {
  var resourcePath = 'path/to/routes.ts';
  var modulePath = './path/to/file.module#FileModule';
  var query = '';

  it('should return a loadChildren async require statement', function() {
    var result = [
      'loadChildren: () => new Promise(function (resolve) {\n',
      '  (require as any).ensure([], function (require: any) {\n',
      '    resolve(require(\'./path/to/file.module\')[\'FileModule\']);\n',
      '  });\n',
      '})'
    ];

    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: query
    }, `loadChildren: '${modulePath}'`);

    checkResult(loadedString, result);
  });

  it('should return a loadChildren sync require statement', function() {
    var result = [
      'loadChildren: function() {\n',
      '  return require(\'./path/to/file.module\')[\'FileModule\'];\n',
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
      'loadChildren: () => System.import(\'./path/to/file.module\')\n',
      '  .then(function(module) {\n',
      '    return module[\'FileModule\'];\n',
      '  })'
    ];

    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: '?loader=system'
    }, `loadChildren: '${modulePath}'`);

    checkResult(loadedString, result);
  });

  it('should return a loadChildren async require statement with default', function() {
    var modulePath = './path/to/file.module';

    var result = [
      'loadChildren: () => new Promise(function (resolve) {\n',
      '  (require as any).ensure([], function (require: any) {\n',
      '    resolve(require(\'./path/to/file.module\')[\'default\']);\n',
      '  });\n',
      '})'
    ];

    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: query
    }, `loadChildren: '${modulePath}'`);

    checkResult(loadedString, result);
  });

  it('should support a custom delimiter', function() {
    var result = [
      'loadChildren: () => new Promise(function (resolve) {\n',
      '  (require as any).ensure([], function (require: any) {\n',
      '    resolve(require(\'./path/to/file.module\')[\'FileModule\']);\n',
      '  });\n',
      '})'
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
      'loadChildren: () => new Promise(function (resolve) {\n',
      '  (require as any).ensure([], function (require: any) {\n',
      '    resolve(require(\'.\\\\path\\\\to\\\\file.module\')[\'FileModule\']);\n',
      '  });\n',
      '})'
    ];

    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: query
    }, `loadChildren: '${modulePath}'`);

    checkResult(loadedString, result);

    env.reset();
  });

  describe('AoT', function() {
    beforeEach(function() {
      query = '?aot=true&genDir=.'
    });

    it('should return a loadChildren async require statement', function() {
      var result = [
        'loadChildren: () => new Promise(function (resolve) {\n',
        '  (require as any).ensure([], function (require: any) {\n',
        '    resolve(require(\'../../path/to/file.module.ngfactory\')[\'FileModuleNgFactory\']);\n',
        '  });\n',
        '})'
      ];

      var loadedString = loader.call({
        resourcePath: resourcePath,
        query: query
      }, `loadChildren: '${modulePath}'`);

      checkResult(loadedString, result);
    });

    it('should return a loadChildren sync require statement', function() {
      var result = [
        'loadChildren: function() {\n',
        '  return require(\'../../path/to/file.module.ngfactory\')[\'FileModuleNgFactory\'];\n',
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
        'loadChildren: () => System.import(\'../../path/to/file.module.ngfactory\')\n',
        '  .then(function(module) {\n',
        '    return module[\'FileModuleNgFactory\'];\n',
        '  })'
      ];

      var loadedString = loader.call({
        resourcePath: resourcePath,
        query: query + '&loader=system'
      }, `loadChildren: '${modulePath}'`);

      checkResult(loadedString, result);
    });

    it('should support a custom moduleSuffix', function() {
      var moduleSuffix = '.ngfile';

      var result = [
        'loadChildren: () => new Promise(function (resolve) {\n',
        '  (require as any).ensure([], function (require: any) {\n',
        '    resolve(require(\'../../path/to/file.module' + moduleSuffix + '\')[\'FileModuleNgFactory\']);\n',
        '  });\n',
        '})'
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
        'loadChildren: () => new Promise(function (resolve) {\n',
        '  (require as any).ensure([], function (require: any) {\n',
        '    resolve(require(\'../../path/to/file.module.ngfactory\')[\'FileModule' + factorySuffix + '\']);\n',
        '  });\n',
        '})'
      ];

      var loadedString = loader.call({
        resourcePath: resourcePath,
        query: query + '&factorySuffix=' + factorySuffix
      }, `loadChildren: '${modulePath}'`);

      checkResult(loadedString, result);
    });
  });
});
