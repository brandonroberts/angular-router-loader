var path = require('path');

function getRequireLoader(filePath, moduleName) {
  var result = [
    'loadChildren: () => new Promise(function (resolve) {\n',
    '  (require as any).ensure([], function (require) {\n',
    '    resolve(require(\'' + filePath + '\')[\'' + moduleName + '\']);\n',
    '  });\n',
    '})'
  ];

  return result.join('');
}

function getSystemLoader(filePath, moduleName) {
  var result = [
    'loadChildren: () => System.import(\'' + filePath + '\')\n',
    '  .then(function(module) {\n',
    '    return module[\'' + moduleName + '\'];\n',
    '  })'
  ];

  return result.join('');
}

function getFilename(resourcePath) {
  var filename = path.basename(resourcePath);

  return path.basename(resourcePath, path.extname(filename));
}

module.exports = { getRequireLoader, getSystemLoader, getFilename };
