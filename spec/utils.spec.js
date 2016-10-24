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
        'loadChildren: function() {',
        '  return ' + getRequireString(path, name) + ';',
        '}'
      ];

      getSyncLoader('path', 'name', true).should.eql(result.join(''));
    });
  });

  describe('getRequireLoader', function() {
    var getRequireLoader = utils.getRequireLoader;

    it('should return an asynchronous require loadChildren statement', function() {
      var result = [
        'loadChildren: () => new Promise(function (resolve) {',
        '  (require as any).ensure([], function (require: any) {',
        '    resolve(' + getRequireString(path, name) + ');',
        '  });',
        '})'
      ];

      getRequireLoader('path', 'name', true).should.eql(result.join(''));
    });
  });

  describe('getSystemLoader', function() {
    var getSystemLoader = utils.getSystemLoader;

    it('should return an asynchronous System.import loadChildren statement', function() {
      var result = [
        'loadChildren: () => System.import(\'' + path + '\')',
        '  .then(function(module) {',
        '    return module[\'' + name + '\'];',
        '  })'
      ];

      getSystemLoader('path', 'name', true).should.eql(result.join(''));
    });
  });

  describe('normalizeFilePath', function() {
    var pmock = require('pmock');
    var normalizeFilePath = utils.normalizeFilePath;
    var env;

    describe("resolution=local", function () {
      describe('for windows os', function() {
        beforeEach(function() {
          env = pmock.platform('win32');
        });

        it('should replace backslashes with forward slashes', function() {
          normalizeFilePath('./path').should.eql('.\\\\path');
        });

        it('should make a relative path if the path is not relative', function() {
          normalizeFilePath('path').should.eql('.\\\\path');
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

        it('should make a relative path if the path is not relative', function() {
          normalizeFilePath('path').should.eql('./path');
        });

        afterEach(function() {
          env.reset();
        });
      });
    });

    describe("resolution=module", function () {
      describe('for windows os', function() {
        beforeEach(function() {
          env = pmock.platform('win32');
        });

        it('should replace backslashes with forward slashes', function() {
          normalizeFilePath('./path', 'module').should.eql('.\\\\path');
        });

        it('should do nothing if no relative path detected', function() {
          normalizeFilePath('path', 'module').should.eql('path');
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
          normalizeFilePath('./path', 'module').should.eql('./path');
        });

        it('should do nothing if no relative path detected', function() {
          normalizeFilePath('path', 'module').should.eql('path');
        });

        afterEach(function() {
          env.reset();
        });
      });

      afterEach(function() {
        env.reset();
      });
    })
  });

  describe('getFilename', function() {
    it('should return the filename for a given path without an extension', function() {
      utils.getFilename('path/to/module.ngfactory.ts').should.eql('module.ngfactory');
    });
  });
});
