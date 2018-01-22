'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = create;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _child_process = require('child_process');

var _fsExtra = require('fs-extra');

var _shell = require('shelljs/shell');

var _shell2 = _interopRequireDefault(_shell);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _utils = require('../utils');

var _config_utils = require('../config_utils');

var _logger = require('../logger');

var _module = require('../generators/module');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create(appPath) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if ((0, _utils.checkFileExists)(_shell2.default.pwd() + '/.meteor')) {
    console.log('You are already in a Meteor project');
    return;
  }

  if (!appPath) {
    console.log('Please supply the path of project');
    console.log('Run `mantra create --help` for more options.');
    return;
  }

  var customConfigFilePath = options.config;
  var customConfig = {};
  // if custom config file path is provided, use this to create a new app
  if (_lodash2.default.isString(customConfigFilePath) && (0, _utils.checkFileExists)(customConfigFilePath)) {
    customConfig = (0, _utils.parseYamlFromFile)(customConfigFilePath);
  }
  // save full config file in project
  var config = (0, _config_utils.getConfig)(customConfig);

  var templatesPath = __dirname + '/../../templates';
  //const targetModulePath = `${appPath}${config.modulesPath}`;
  var lineBreak = (0, _utils.getLineBreak)();
  var appName = _path2.default.basename(appPath).replace(/\..*$/, '');

  (0, _utils.createDir)('' + appPath);

  if (process.env.NODE_ENV !== 'test') {
    _logger.logger.invoke('init');
    _shell2.default.set('-e');
    _shell2.default.exec('meteor create ' + appPath, { silent: !options.verbose });
    _shell2.default.pushd(appPath);
    _shell2.default.rm('-rf', ['client', 'server']);
    ('kadira:flow-router' + lineBreak).toEnd('.meteor/packages');
    _shell2.default.rm('-rf', ['client', 'server']);
    ('reactive-dict' + lineBreak).toEnd('.meteor/packages');
    _shell2.default.popd();
  }
  // copy config
  (0, _fsExtra.outputFileSync)(appPath + '/mantra_cli.yaml', _jsYaml2.default.safeDump(config));

  (0, _utils.createFile)(templatesPath + '/imports/configs/context.js', appPath + '/imports/configs/context.js');

  (0, _utils.createFile)(templatesPath + '/client/main.js', appPath + '/client/main.js');

  (0, _utils.createFile)(templatesPath + '/imports/lib/collections/index.js', appPath + '/imports/lib/collections/index.js');

  (0, _utils.createDir)(appPath + '/server/configs');

  (0, _utils.createFile)(templatesPath + '/server/main.js', appPath + '/server/main.js');

  (0, _utils.createFile)(templatesPath + '/server/methods/index.js', appPath + '/server/methods/index.js');

  (0, _utils.createFile)(templatesPath + '/server/publications/index.js', appPath + '/server/publications/index.js');

  (0, _utils.createFile)(templatesPath + '/package.tt', appPath + '/package.json', { appName: appName });

  (0, _utils.createFile)(templatesPath + '/gitignore.tt', appPath + '/.gitignore');

  (0, _utils.createFile)(templatesPath + '/eslintrc.tt', appPath + '/.eslintrc');

  (0, _utils.createFile)(templatesPath + '/babelrc.tt', appPath + '/.babelrc');

  (0, _utils.createFile)(templatesPath + '/.scripts/mocha_boot.tt', appPath + '/.scripts/mocha_boot.js');

  // Generate storybook related files
  if (config.storybook) {
    (0, _utils.createDir)(appPath + '/.storybook');

    (0, _utils.createFile)(templatesPath + '/.storybook/config.js', appPath + '/.storybook/config.js');

    (0, _utils.createFile)(templatesPath + '/.storybook/webpack.config.js', appPath + '/.storybook/webpack.config.js');
  }

  _shell2.default.pushd(appPath);
  (0, _module.generateModule)("core", options, config);
  _shell2.default.popd();

  if (process.env.NODE_ENV !== 'test') {
    _logger.logger.invoke('after_init');
    _shell2.default.set('-e');
    _shell2.default.pushd(appPath);
    _shell2.default.exec('npm install', { silent: !options.verbose });
    _shell2.default.popd();
  }

  console.log('');
  console.log('Created a new app using Mantra v0.7.0 at ' + appPath);
  console.log('');
  console.log('To run your app:');
  console.log('  cd ' + appPath);
  console.log('  meteor');
  console.log('');
  console.log('For the full Mantra specifications, see: https://kadirahq.github.io/mantra');
}