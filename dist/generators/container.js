'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.generateContainer = generateContainer;
exports.destroyContainer = destroyContainer;

var _utils = require('./utils');

var _config_utils = require('../config_utils');

var _storybook = require('./storybook');

function generateContainer(name, options, customConfig) {
  var config = (0, _config_utils.getConfig)(customConfig);

  var _name$split = name.split(':'),
      _name$split2 = _slicedToArray(_name$split, 2),
      moduleName = _name$split2[0],
      entityName = _name$split2[1];

  (0, _utils.ensureModuleNameProvided)(name);
  (0, _utils.ensureModuleExists)(moduleName, customConfig);

  (0, _utils._generate)('container', moduleName, entityName, options, config);

  if (config.generateContainerTests) {
    (0, _utils._generateTest)('container', moduleName, entityName, config);
  }

  (0, _utils._generate)('component', moduleName, entityName, options, config);

  if (config.generateComponentTests) {
    (0, _utils._generateTest)('component', moduleName, entityName, config);
  }

  if (config.storybook) {
    (0, _storybook.generateStorybook)(name, options, customConfig);
  }
}

function destroyContainer(name, options, customConfig) {
  var _name$split3 = name.split(':'),
      _name$split4 = _slicedToArray(_name$split3, 2),
      moduleName = _name$split4[0],
      entityName = _name$split4[1];

  (0, _utils.removeFile)((0, _utils.getOutputPath)(customConfig, 'container', entityName, moduleName));
  (0, _utils.removeFile)((0, _utils.getTestOutputPath)('container', entityName, moduleName));
  (0, _utils.removeFile)((0, _utils.getOutputPath)(customConfig, 'component', entityName, moduleName));
  (0, _storybook.destroyStorybook)(name, options, customConfig);
  (0, _utils.removeFile)((0, _utils.getTestOutputPath)('component', entityName, moduleName));
}