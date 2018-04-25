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

    it('should return an asynchronous require loadChildren statement with chunkName parameter', function() {
      var result = [
        'loadChildren: function() { return new Promise(function (resolve, reject) {',
        '  (require as any).ensure([], function (require: any) {',
        '    resolve(' + getRequireString(path, name) + ');',
        '  }, function(e: any) {',
        '    reject({ loadChunkError: true, details: e });',
        '  }, \'name\');',  
        '}) }'
      ];
      getRequireLoader('path', 'name', 'name', true).should.eql(result.join(''));
    });

    it('should return an asynchronous require loadChildren statement without chunkName parameter', function() {
      var result = [
        'loadChildren: function() { return new Promise(function (resolve, reject) {',
        '  (require as any).ensure([], function (require: any) {',
        '    resolve(' + getRequireString(path, name) + ');',
        '  }, function(e: any) {',
        '    reject({ loadChunkError: true, details: e });',
        '  });',  
        '}) }'
      ];
      getRequireLoader('path', undefined, 'name', true).should.eql(result.join(''));
    });

    it('should return an asynchronous require loadChildren statement with vanilla javascript', function() {
      var result = [
        'loadChildren: function() { return new Promise(function (resolve, reject) {',
        '  require.ensure([], function (require) {',
        '    resolve(' + getRequireString(path, name) + ');',
        '  }, function(e) {',
        '    reject({ loadChunkError: true, details: e });',
        '  }, \'name\');',  
        '}) }'
      ];
      getRequireLoader('path', 'name', 'name', true, true).should.eql(result.join(''));
    });

  });

  describe('getSystemLoader', function() {
    var getSystemLoader = utils.getSystemLoader;

    it('should return an asynchronous System.import loadChildren statement', function() {
      var result = [
        'loadChildren: function() { return System.import(\'' + path + '\')',
        '  .then(module => module[\'' + name + '\'], (e: any) => { throw({ loadChunkError: true, details: e }); }) }'
      ];

      getSystemLoader('path', 'name', true).should.eql(result.join(''));
    });
  });

  describe('getImportLoader', function() {
    var getImportLoader = utils.getImportLoader;

    it('should return an asynchronous dynamic import loadChildren statement', function() {
      var result = [
        'loadChildren: function() { return import(\'' + path + '\')',
        '  .then(module => module[\'' + name + '\'], (e: any) => { throw({ loadChunkError: true, details: e }); }) }'
      ];

      getImportLoader('path', 'name', true).should.eql(result.join(''));
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
          normalizeFilePath('./path', true).should.eql('.\\\\path');
      });

      it('should make a relative path if the path is not relative and the original path was relative', function() {
          normalizeFilePath('path', true).should.eql('.\\\\path');
      });

      it('should not make a relative path if the original path was not relative', function() {
          normalizeFilePath('path', false).should.eql('path');
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
          normalizeFilePath('./path', true).should.eql('./path');
      });

      it('should make a relative path if the path is not relative and the original path was relative', function() {
          normalizeFilePath('path', true).should.eql('./path');
      });

      it('should not make a relative path if the original path was not relative', function() {
          normalizeFilePath('path', false).should.eql('path');
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

  describe('getChunkName', function() {
    var getChunkName = utils.getChunkName;
    
    it('should return the chunkName string for a system loader and provided chunkName', function() {
      getChunkName('system', 'name').should.eql('/* webpackChunkName: "name" */ ');
    });

    it('should return the chunkName string for a import loader and provided chunkName', function() {
      getChunkName('import', 'name').should.eql('/* webpackChunkName: "name" */ ');
    });

    it('should return the chunkName string for a require loader and provided chunkName', function() {
      getChunkName('require', 'name').should.eql(', \'name\'');
    });

    it('should return an empty chunkName string for a loader and an empty chunkName', function() {
      getChunkName('require', '').should.eql('');
    });
  });
});
