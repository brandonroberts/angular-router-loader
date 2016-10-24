var loaderUtils = require('loader-utils');
var path = require('path');
var utils = require('./utils');

var extractResolution = function(query) {
    return query.resolution || utils.RESOLUTION_MODES.LOCAL;
};

module.exports = function(source, sourcemap) {
    this.cacheable && this.cacheable();

    // regex for loadChildren string
    var loadChildrenRegex = /loadChildren[\s]*:[\s]*['|"](.*?)['|"]/gm;

    // parse query params
    var query = loaderUtils.parseQuery(this.query);

    // get query options
    var delimiter = query.delimiter || '#';
    var aot = query.aot || false;
    var factorySuffix = query.moduleSuffix || '.ngfactory';
    var moduleSuffix = query.factorySuffix || 'NgFactory';
    var loader = query.loader || 'require';
    var genDir = query.genDir || '';
    var srcDir = query.srcDir || '';
    var inline = query.inline || true;
    var debug = this.debug || query.debug;

    // get the filename path
    var resourcePath = this.resourcePath;
    var filename = utils.getFilename(resourcePath);

    /**
     *
     * @param {string} path
     */
    var isNgFactoryFile = function(path) {
        return path.endsWith(factorySuffix);
    };

    var replacedSource = source.replace(loadChildrenRegex, function(match, loadString) {
        // check for query string in loadString
        var queryIndex = loadString.lastIndexOf('?');
        var hasQuery = queryIndex !== -1;
        var loadStringQuery = hasQuery ? loaderUtils.parseQuery(loadString.substr(queryIndex)) : {};
        var sync = !!loadStringQuery.sync;

        // Resolution type
        var resolution = extractResolution(loadStringQuery);

        // get the module path string
        var pathString = hasQuery ? loadString.substr(0, queryIndex) : loadString;

        // split the string on the delimiter
        var parts = pathString.split(delimiter);

        // get resolution mode
        // get the file path and module name
        var filePath = parts[0] + ((aot && (resolution !== utils.RESOLUTION_MODES.MODULE)) ? factorySuffix : '');
        var moduleName = (parts[1] || 'default').replace(/\?.*/, '');


        moduleName += (aot ? moduleSuffix : '');

        // update the file path for non-ngfactory files
        if (aot && !isNgFactoryFile(filename) && (resolution === utils.RESOLUTION_MODES.LOCAL)) {
            // build the relative path from the genDir
            filePath = path.join(
                // find the relative path from src base dir to current resource file
                path.relative(path.dirname(resourcePath), path.resolve(genDir)),
                // find the relative dir to file from the genDir
                path.dirname(path.relative(path.resolve(srcDir), path.resolve(resourcePath))),
                filePath
            );
        }

        filePath = utils.normalizeFilePath(filePath, resolution);

        var replacement = match;

        if (sync) {
            replacement = utils.getSyncLoader(filePath, moduleName, inline);
        } else if (loader === 'system') {
            replacement = utils.getSystemLoader(filePath, moduleName, inline);
        } else {
            replacement = utils.getRequireLoader(filePath, moduleName, inline);
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
