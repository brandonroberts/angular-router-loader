var loaderUtils = require('loader-utils');
var path = require('path');
var utils = require('./utils');

module.exports = function(source, sourcemap) {
  this.cacheable && this.cacheable();

  // regex for loadChildren string
  var loadChildrenRegex = /loadChildren[\s]*:[\s]*['|"](.*?)['|"]/gm;

  // parse query params
  var query = loaderUtils.parseQuery(this.query);

  // get query options
  var delimiter = query.delimiter || '#';
  var aot = query.aot || false;
  var moduleSuffix = query.moduleSuffix || '.ngfactory';
  var factorySuffix = query.factorySuffix || 'NgFactory';
  var loader = query.loader || 'require';
  var genDir = query.genDir || '';
  var inline = query.inline || true;
  var debug = this.debug || query.debug;

  // get the filename path
  var resourcePath = this.resourcePath;
  var filename = utils.getFilename(resourcePath);

  var replacedSource = source.replace(loadChildrenRegex, function(match, loadString) {
    // check for query string in loadString
    var queryIndex = loadString.lastIndexOf('?');
    var hasQuery = queryIndex !== -1;
    var loadStringQuery = hasQuery ? loaderUtils.parseQuery(loadString.substr(queryIndex)) : {};
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
      // find the relative dir to file from the genDir
      var relativeDir = path.relative(path.dirname(resourcePath), path.resolve(genDir));

      // build the relative path from the genDir
      filePath = path.join(relativeDir, filePath);
    }

    filePath = utils.normalizeFilePath(filePath, isRelativePath);

    var replacement = match;

    if (sync) {
      replacement = utils.getSyncLoader(filePath, moduleName, inline);
    } else if (loader === 'system') {
      replacement = utils.getSystemLoader(filePath, moduleName, inline);
    } else {
      replacement = utils.getRequireLoader(filePath, chunkName, moduleName, inline);
    }

    if (debug) {
      console.log('[angular2-router-loader]: --DEBUG--');
      console.log('[angular2-router-loader]: File: ' + resourcePath);
      console.log('[angular2-router-loader]: Original: ' + match);
      console.log('[angular2-router-loader]: Replacement: ' + replacement);
    }

    return replacement;
  });

  if (this.callback) {
    this.callback(null, replacedSource, sourcemap);
  } else {
    return replacedSource;
  }
}
