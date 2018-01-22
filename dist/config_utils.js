'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_CONFIG = undefined;
exports.getConfig = getConfig;
exports.readCustomConfig = readCustomConfig;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_CONFIG = exports.DEFAULT_CONFIG = {
  tabSize: 2,
  storybook: false,
  generateComponentTests: true,
  generateContainerTests: true,
  modulesPath: 'imports/modules',
  snakeCaseFileNames: true,
  jsxExtension: "jsx",
  storiesFolder: ".stories"
};

/**
 * getConfig returns a full config object based on the default config
 * and overriding values.
 *
 * @param customConfig {Object} - key values pairs to override the default config
 * @return {Object} - custom config
 */
function getConfig() {
  var customConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var config = _lodash2.default.clone(DEFAULT_CONFIG);
  return _lodash2.default.assign(config, customConfig);
}

/**
 * readCustomConfig parses `mantra_cli.yaml` and returns an object containing configs
 * if `mantra_cli.yaml` exists in the app root. Otherwise, it returns an empty object
 */
function readCustomConfig() {
  var userConfigPath = './mantra_cli.yaml';

  // If user config exists, override defaultConfig with user config
  if ((0, _utils.checkFileExists)(userConfigPath)) {
    return (0, _utils.parseYamlFromFile)(userConfigPath);
  }

  return {};
}