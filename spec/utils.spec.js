var should = require('should');
var utils = require('../src/utils');

describe('Utils', function() {
  var getRequireString = utils.getRequireString;

  var path = 'path';
  var name = 'name';

  describe('getRequireString', function() {
    it('should return a require statement', function() {
      getRequireString(path, name).should.eql('require(\'path\')[\'name\']');
    });
  });

  describe('getSyncLoader', function() {
    var getSyncLoader = utils.getSyncLoader;

    it('should return a synchronous require loadChildren statement', function() {
      var result = [
        'loadChildren: function() {\n',
        '  return ' + getRequireString(path, name) + ';\n',
        '}'
      ];

      getSyncLoader('path', 'name').should.eql(result.join(''));
    });
  });

  describe('getRequireLoader', function() {
    var getRequireLoader = utils.getRequireLoader;

    it('should return an asynchronous require loadChildren statement', function() {
      var result = [
        'loadChildren: () => new Promise(function (resolve) {\n',
        '  (require as any).ensure([], function (require: any) {\n',
        '    resolve(' + getRequireString(path, name) + ');\n',
        '  });\n',
        '})'
      ];

      getRequireLoader('path', 'name').should.eql(result.join(''));
    });
  });

  describe('getSystemLoader', function() {
    var getSystemLoader = utils.getSystemLoader;

    it('should return an asynchronous System.import loadChildren statement', function() {
      var result = [
        'loadChildren: () => System.import(\'' + path + '\')\n',
        '  .then(function(module) {\n',
        '    return module[\'' + name + '\'];\n',
        '  })'
      ];

      getSystemLoader('path', 'name').should.eql(result.join(''));
    });
  });

  describe('normalizeFilePath', function() {
    var pmock = require('pmock');
    var normalizeFilePath = utils.normalizeFilePath;
    var env;

    describe('for windows os', function() {
      beforeEach(function() {
        env = pmock.platform('win32');
      });

      it('should replace backslashes with forward slashes', function() {
          normalizeFilePath('./path').should.eql('.\\\\path');
      });

      afterEach(function() {
        env.reset();
      });
    });

    describe('for non-windows os', function() {
      beforeEach(function() {
        env = pmock.platform('posix');
      });

      it('should not replace backslashes', function() {
          normalizeFilePath('./path').should.eql('./path');
      });

      afterEach(function() {
        env.reset();
      });
    });
  });

  describe('getFilename', function() {
    var getFilename = utils.getFilename;

    it('should return the filename for a given path without an extension', function() {
      getFilename('path/to/module.ngfactory.ts').should.eql('module.ngfactory');
    });
  });
});
