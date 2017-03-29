var loaderUtils = require('loader-utils');
var path = require('path');
var utils = require('./utils');

module.exports = function(source, sourcemap) {
  this.cacheable && this.cacheable();

  // regex for loadChildren string
  var loadChildrenRegex = /loadChildren[\s]*:[\s]*['|"](.*?)['|"]/gm;

  // parse query params
  var query = loaderUtils.getOptions(this) || {};

  // get query options
  var delimiter = query.delimiter || '#';
  var aot = query.aot || false;
  var moduleSuffix = query.moduleSuffix || '.ngfactory';
  var factorySuffix = query.factorySuffix || 'NgFactory';
  var loader = query.loader || 'require';
  var genDir = query.genDir || '';
  var inline = query.inline || true;
  var debug = (typeof query.debug !== 'boolean' ? this.debug : query.debug);
  var baseDir = query.baseDir || process.cwd();

  // get the filename path
  var resourcePath = this.resourcePath;
  var filename = utils.getFilename(resourcePath);
  var isJs = path.extname(resourcePath).toLowerCase() === '.js';

  var replacedSource = source.replace(loadChildrenRegex, function(match, loadString) {
    // check for query string in loadString
    var queryIndex = loadString.lastIndexOf('?');
    var hasQuery = queryIndex !== -1;
    var loadStringQuery = hasQuery ? loaderUtils.getOptions({ query: loadString.substr(queryIndex) }) : {};
    var sync = !!loadStringQuery.sync;
    var chunkName = loadStringQuery.chunkName || undefined;
    var isRelativePath = loadString.startsWith('.');

    // get the module path string
    var pathString = hasQuery ? loadString.substr(0, queryIndex) : loadString;

    // split the string on the delimiter
    var parts = pathString.split(delimiter);

    // get the file path and module name
    var filePath = parts[0] + (aot ? moduleSuffix : '');
    var moduleName = (parts[1] || 'default');

    moduleName += (aot ? factorySuffix : '');

    // update the file path for non-ngfactory files
    if (aot && filename.substr(-9) !== moduleSuffix.substr(-9) && isRelativePath) {
      // the full path of the directory of the current resource
      var currentDir = path.dirname(resourcePath);

      // the absolute path of our destenation NgModule module.
      var absoluteNgModulePath = path.resolve(currentDir, filePath);

      /*
       *  If "genDir" is empty the compiler emits to the source tree, next to the original component source code.
       *  absoluteNgModulePath points to there so we're good.
       *
       *  If "genDir" exist need to map the path based on "genDir"
       */
      if (genDir && genDir !== '.') {

        /*
         "genDir" is tricky.
         The path used for "genDir" is resolved relative to the "tsconfig.json" file used to execute ngc.
         This out of the context of webpack so we can't figure this out automatically.
         The user needs to set a "genDir" relative to the root of the project which should resolve to the same absolute path ngc resolves for "genDir".

         If "tsconfig.json" is in the root of the project it's identical.
         */

        var relativeNgModulePath = path.relative(baseDir, absoluteNgModulePath);
        absoluteNgModulePath = path.join(path.resolve(baseDir, genDir), relativeNgModulePath);
      }


      // filePath is an absolute path, we need the relative filePath:
      filePath = path.relative(currentDir, absoluteNgModulePath);
    }

    filePath = utils.normalizeFilePath(filePath, isRelativePath);

    var replacement = match;

    if (sync) {
      replacement = utils.getSyncLoader(filePath, moduleName, inline);
    } else if (loader === 'system') {
      replacement = utils.getSystemLoader(filePath, moduleName, inline);
    } else {
      replacement = utils.getRequireLoader(filePath, chunkName, moduleName, inline, isJs);
    }

    if (debug) {
      console.log('[angular-router-loader]: --DEBUG--');
      console.log('[angular-router-loader]: File: ' + resourcePath);
      console.log('[angular-router-loader]: Original: ' + match);
      console.log('[angular-router-loader]: Replacement: ' + replacement);
    }

    return replacement;
  });

  if (this.callback) {
    this.callback(null, replacedSource, sourcemap);
  } else {
    return replacedSource;
  }
}
