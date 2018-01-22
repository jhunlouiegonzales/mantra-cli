'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateModule = generateModule;
exports.destroyModule = destroyModule;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('../utils');

var _utils2 = require('./utils');

var _config_utils = require('../config_utils');

var _logger = require('../logger');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeRelative = function makeRelative(from, to) {
  var relativePath = _path2.default.relative(from, to);
  // add ./ if its child
  if (!_lodash2.default.startsWith(relativePath, ".")) {
    return "./" + relativePath;
  }
  return relativePath;
};

function generateModule(name, options) {
  var customConfig = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var config = (0, _config_utils.getConfig)(customConfig);
  var snakeCaseName = _lodash2.default.snakeCase(name);
  var storybookConfigFile = '.storybook/config.js';
  var modulePath = './' + config.modulesPath + '/' + snakeCaseName;

  // Template Path
  var templatesPath = __dirname + '/../../templates';

  (0, _utils.createDir)(modulePath);
  (0, _utils.createDir)(modulePath + '/components');
  (0, _utils.createDir)(modulePath + '/containers');

  (0, _utils.createFile)(templatesPath + '/imports/modules/core/actions/index.js', modulePath + '/actions/index.js');

  (0, _utils.createFile)(templatesPath + '/imports/modules/core/index.js', modulePath + '/index.js');

  if (name === 'core') {
    (0, _utils.createDir)(modulePath + '/configs');
    (0, _utils.createDir)(modulePath + '/libs');

    (0, _utils.createFile)(templatesPath + '/imports/modules/core/routes.tt', modulePath + '/routes.' + config.jsxExtension);

    (0, _utils.createFile)(templatesPath + '/imports/modules/core/components/main_layout.jsx', modulePath + '/components/main_layout.' + config.jsxExtension);

    (0, _utils.createFile)(templatesPath + '/imports/modules/core/components/home.jsx', modulePath + '/components/home.' + config.jsxExtension);
  }

  // Modify client/main.js to import and load the newly generated module
  var clientDir = "./client";
  var clientMain = clientDir + '/main.js';
  var modulePathRelative = makeRelative(clientDir, modulePath);

  (0, _utils.insertToFile)(clientMain, 'import ' + snakeCaseName + 'Module from \'' + modulePathRelative + '\';', {
    or: [{
      after: {
        regex: /import .*Module from \'\.\/modules\/.*\';/g,
        last: true
      },
      asNewLine: true
    }, {
      after: {
        regex: /\/\/ modules/g
      },
      asNewLine: true
    }]
  });

  (0, _utils.insertToFile)(clientMain, 'app.loadModule(' + snakeCaseName + 'Module);', {
    or: [{
      after: {
        regex: /app.loadModule\(.*Module\);/g,
        last: true
      },
      asNewLine: true
    }, {
      after: {
        regex: /\/\/ load modules/g
      },
      asNewLine: true
    }]
  });

  if (config.storybook) {
    var moduleStoriesDir = modulePath + '/components/' + config.storiesFolder;
    var moduleStoriesIndex = moduleStoriesDir + '/index.js';

    addToStorybookConfig({ storybookConfigFile: storybookConfigFile, moduleStoriesIndex: moduleStoriesIndex, config: config });
    (0, _utils.createDir)(moduleStoriesDir);
    (0, _utils.createFile)(templatesPath + '/imports/modules/core/components/.stories/index.js', moduleStoriesIndex);
  }
}

var storyRequireStatement = function storyRequireStatement(storyFile) {
  return 'require(\'' + _path2.default.relative("./.storybook", storyFile) + '\');';
};

function addToStorybookConfig(_ref) {
  var storybookConfigFile = _ref.storybookConfigFile,
      moduleStoriesIndex = _ref.moduleStoriesIndex,
      config = _ref.config;

  var statement = storyRequireStatement(moduleStoriesIndex);
  var tab = _lodash2.default.repeat(' ', config.tabSize);
  // avoid duplicates
  removeFromStorybookConfig({ storybookConfigFile: storybookConfigFile, moduleStoriesIndex: moduleStoriesIndex });
  (0, _utils.insertToFile)(storybookConfigFile, tab + statement, { after: { regex: /loadStories[^{]*{/g }, asNewLine: true });
}

function removeFromStorybookConfig(_ref2) {
  var storybookConfigFile = _ref2.storybookConfigFile,
      moduleStoriesIndex = _ref2.moduleStoriesIndex;

  var content = _fs2.default.readFileSync(storybookConfigFile, { encoding: 'utf-8' });
  var statement = storyRequireStatement(moduleStoriesIndex);
  content = (0, _utils2.removeWholeLine)(content, statement);
  (0, _fsExtra.outputFileSync)(storybookConfigFile, content);
}

function destroyModule(name, options, customConfig) {
  var config = (0, _config_utils.getConfig)(customConfig);
  var snakeCaseName = _lodash2.default.snakeCase(name);
  var modulePath = './' + config.modulesPath + '/' + snakeCaseName;
  (0, _utils2.removeFile)(modulePath);

  var storybookConfigFile = '.storybook/config.js';
  if ((0, _utils.checkFileExists)(storybookConfigFile)) {
    var moduleStoriesIndex = modulePath + '/components/' + config.storiesFolder + '/index.js';
    removeFromStorybookConfig({ storybookConfigFile: storybookConfigFile, moduleStoriesIndex: moduleStoriesIndex });
  }
  var clientDir = "./client";
  var clientMain = clientDir + '/main.js';
  var modulePathRelative = makeRelative(clientDir, modulePath);

  _logger.logger.update(clientMain);
  var content = _fs2.default.readFileSync(clientMain, { encoding: 'utf-8' });
  content = (0, _utils2.removeWholeLine)(content, 'import ' + snakeCaseName + 'Module from \'' + modulePathRelative + '\';');
  content = (0, _utils2.removeWholeLine)(content, 'app.loadModule(' + snakeCaseName + 'Module);');

  _fs2.default.writeFileSync(clientMain, content);
}