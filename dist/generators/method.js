'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateMethod = generateMethod;
exports.destroyMethod = destroyMethod;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

var _config_utils = require('../config_utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateMethod(name, options, customConfig) {
  var config = (0, _config_utils.getConfig)(customConfig);

  var _generate2 = (0, _utils._generate)('method', null, name, options, config),
      exists = _generate2.exists;

  if (!exists) {
    (0, _utils.updateIndexFile)({
      indexFilePath: './server/methods/index.js',
      exportBeginning: 'export default function () {',
      insertImport: 'import ' + name + ' from \'./' + (0, _utils.getFileName)(customConfig, name) + '\';',
      insertExport: '  ' + name + '();'
    });
  }
}

function destroyMethod(name, options, customConfig) {
  (0, _utils.removeFile)((0, _utils.getOutputPath)(customConfig, 'method', name));

  (0, _utils.removeFromIndexFile)('./server/methods/index.js', name, customConfig);
}