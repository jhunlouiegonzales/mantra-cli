'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.generateAction = generateAction;
exports.destroyAction = destroyAction;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

var _config_utils = require('../config_utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateAction(name, options, customConfig) {
  var config = (0, _config_utils.getConfig)(customConfig);

  var _name$split = name.split(':'),
      _name$split2 = _slicedToArray(_name$split, 2),
      moduleName = _name$split2[0],
      entityName = _name$split2[1];

  (0, _utils.ensureModuleNameProvided)(name);
  (0, _utils.ensureModuleExists)(moduleName, customConfig);

  var _generate2 = (0, _utils._generate)('action', moduleName, entityName, options, config),
      exists = _generate2.exists;

  if (!exists) {
    (0, _utils.updateIndexFile)({
      indexFilePath: './' + config.modulesPath + '/' + moduleName + '/actions/index.js',
      exportBeginning: 'export default {',
      insertImport: 'import ' + entityName + ' from \'./' + (0, _utils.getFileName)(customConfig, entityName) + '\';',
      insertExport: '  ' + entityName,
      commaDelimited: true
    });
  }

  (0, _utils._generateTest)('action', moduleName, entityName, config);
}

function destroyAction(name, options, customConfig) {
  var config = (0, _config_utils.getConfig)(customConfig);

  var _name$split3 = name.split(':'),
      _name$split4 = _slicedToArray(_name$split3, 2),
      moduleName = _name$split4[0],
      entityName = _name$split4[1];

  (0, _utils.ensureModuleNameProvided)(name);
  (0, _utils.ensureModuleExists)(moduleName, customConfig);

  (0, _utils.removeFile)((0, _utils.getOutputPath)(customConfig, 'action', entityName, moduleName));
  (0, _utils.removeFile)((0, _utils.getTestOutputPath)('action', entityName, moduleName));
  (0, _utils.removeFromIndexFile)('./' + config.modulesPath + '/' + moduleName + '/actions/index.js', entityName, customConfig);
}