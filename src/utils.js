var os = require('os');
var path = require('path');

module.exports.getRequireString = function(filePath, moduleName, inline) {
  return 'require(\'' + filePath + '\')[\'' + moduleName + '\']';
};

module.exports.getSyncLoader = function(filePath, moduleName, inline) {
  var requireString = module.exports.getRequireString(filePath, moduleName);

  var result = [
    'loadChildren: function() {',
    '  return ' + requireString + ';',
    '}'
  ];

  return inline ? result.join('') : result.join('\n');
};

module.exports.getRequireLoader = function(filePath, chunkName, moduleName, inline, isJs) {
  var requireString = module.exports.getRequireString(filePath, moduleName);

  var result = [
    'loadChildren: function() { return new Promise(function (resolve, reject) {',
    '  ' + (isJs ? 'require' : '(require as any)') + '.ensure([], function (' + (isJs ? 'require' : 'require: any') + ') {',
    '    resolve(' + requireString + ');',
    '  }, function() {',
    '    reject({ loadChunkError: true });',
    '  }' + module.exports.getChunkName('require', chunkName) + ');',
    '}) }'
  ];

  return inline ? result.join('') : result.join('\n');
};

module.exports.getSystemLoader = function(filePath, moduleName, inline, chunkName) {
  var result = [
    'loadChildren: function() { return System.import(' + module.exports.getChunkName('system', chunkName) + '\'' + filePath + '\')',
    '  .then(module => module[\'' + moduleName + '\'], () => { throw({ loadChunkError: true }); }) }'
  ];

  return inline ? result.join('') : result.join('\n');
};

module.exports.getImportLoader = function(filePath, moduleName, inline, chunkName) {
  var result = [
    'loadChildren: function() { return import(' + module.exports.getChunkName('import', chunkName) + '\'' + filePath + '\')',
    '  .then(module => module[\'' + moduleName + '\'], () => { throw({ loadChunkError: true }); }) }'
  ];

  return inline ? result.join('') : result.join('\n');
};

module.exports.getFilename = function(resourcePath) {
  var filename = path.basename(resourcePath);

  return path.basename(resourcePath, path.extname(filename));
};

module.exports.normalizeFilePath = function(filePath, relativePathMatch) {
  var newPath = filePath;

  if (relativePathMatch && !newPath.startsWith('./') && !newPath.startsWith('../')) {
    newPath = './' + newPath;
  }

  if (os.platform() === 'win32') {
    var path = newPath.replace(/\//g, '\\');
    newPath = path.replace(/\\/g, '\\\\');
  }

  return newPath;
}

module.exports.getChunkName = function (loader, chunkName) {
  if (chunkName && (loader === 'import' || loader === 'system')) {
    return '/* webpackChunkName: "' + chunkName + '" */ ';
  } else if (chunkName && loader == 'require') {
    return ', \'' + chunkName + '\'';
  }

  return '';
}
