'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateCollection = generateCollection;
exports.destroyCollection = destroyCollection;

var _utils = require('./utils');

var _utils2 = require('../utils');

var _shell = require('shelljs/shell');

var _shell2 = _interopRequireDefault(_shell);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('../logger');

var _config_utils = require('../config_utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateCollection(name, options, customConfig) {
  var config = (0, _config_utils.getConfig)(customConfig);

  var _generate2 = (0, _utils._generate)('collection', null, name, options, config),
      exists = _generate2.exists;

  var entityName = (0, _utils.pascalCase)(name);
  if (!exists) {
    (0, _utils.updateIndexFile)({
      indexFilePath: './imports/lib/collections/index.js',
      exportBeginning: 'export {',
      insertImport: 'import ' + entityName + ' from \'./' + (0, _utils.getFileName)(customConfig, entityName) + '\';',
      insertExport: '  ' + entityName,
      commaDelimited: true
    });
  }

  var packageList = _fs2.default.readFileSync('./.meteor/packages');

  if (options.schema === 'collection2') {
    // if no aldeed:collection2, or commented out
    if (!/aldeed\:collection2/.test(packageList) || /#+\s*aldeed\:collection2/.test(packageList)) {
      _logger.logger.invoke('add_collection_2');
      var lineBreak = (0, _utils2.getLineBreak)();
      ('aldeed:collection2' + lineBreak).toEnd('.meteor/packages');
    }
  } else if (options.schema === 'astronomy') {
    // if no jagi:astronomy, or commented out
    if (!/jagi\:astronomy/.test(packageList) || /#+\s*jagi\:astronomy/.test(packageList)) {
      _logger.logger.invoke('add_astronomy');
      var _lineBreak = (0, _utils2.getLineBreak)();
      ('jagi:astronomy' + _lineBreak).toEnd('.meteor/packages');
    }
  }
}

function destroyCollection(name, options, customConfig) {
  (0, _utils.removeFile)((0, _utils.getOutputPath)(customConfig, 'collection', name));

  (0, _utils.removeFromIndexFile)('./imports/lib/collections/index.js', name, { capitalizeVarName: true }, customConfig);
}