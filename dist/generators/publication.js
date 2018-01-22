'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatePublication = generatePublication;
exports.destroyPublication = destroyPublication;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

var _config_utils = require('../config_utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generatePublication(name, options, customConfig) {
  var config = (0, _config_utils.getConfig)(customConfig);

  var _generate2 = (0, _utils._generate)('publication', null, name, options, config),
      exists = _generate2.exists;

  if (!exists) {
    (0, _utils.updateIndexFile)({
      indexFilePath: './server/publications/index.js',
      exportBeginning: 'export default function () {',
      insertImport: 'import ' + name + ' from \'./' + (0, _utils.getFileName)(customConfig, name) + '\';',
      insertExport: '  ' + name + '();'
    });
  }
}

function destroyPublication(name, options, customConfig) {
  (0, _utils.removeFile)((0, _utils.getOutputPath)(customConfig, 'publication', name));

  (0, _utils.removeFromIndexFile)('./server/publications/index.js', name, customConfig);
}