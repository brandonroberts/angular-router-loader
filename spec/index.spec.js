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
    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: query
    }, `loadChildren: '${modulePath}'`);

    var result = [
      'loadChildren: () => new Promise(function (resolve) {\n',
      '  (require as any).ensure([], function (require) {\n',
      '    resolve(require(\'./path/to/file.module\')[\'FileModule\']);\n',
      '  });\n',
      '})'
    ];

    checkResult(loadedString, result);
  });

  it('should return a loadChildren sync require statement', function() {
    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: query
    }, `loadChildren: '${modulePath}?sync=true'`);

    var result = [
      'loadChildren: function() {\n',
      '  return require(\'./path/to/file.module\')[\'FileModule\'];\n',
      '}'
    ];

    checkResult(loadedString, result);
  });

  it ('should return a loadChildren System.import statement', function() {
    var loadedString = loader.call({
      resourcePath: resourcePath,
      query: '?loader=system'
    }, `loadChildren: '${modulePath}'`);

    var result = [
      'loadChildren: () => System.import(\'./path/to/file.module\')\n',
      '  .then(function(module) {\n',
      '    return module[\'FileModule\'];\n',
      '  })'
    ];

    checkResult(loadedString, result);
  });
});
