'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _commands = require('./commands');

var _config_utils = require('./config_utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version(_package2.default.version);

_commander2.default.command('create [appPath]').alias('c').option('-v, --verbose', 'show output of scripts in the console').option('-c, --config [value]', 'use custom config file').description('create a new application').action(function (appPath, options) {
  (0, _commands.create)(appPath, options);
});

_commander2.default.command('generate [type] [name]').alias('g').option('-c, --use-class', 'extend React.Component class when generating components').option('-s, --schema [value]', 'specify a schema solution to use for Mongo collections').description('generate an entity with the name provided').action(function (type, name, options) {
  var customConfig = (0, _config_utils.readCustomConfig)();

  (0, _commands.generate)(type, name, options, customConfig);
}).on('--help', function () {
  console.log('  Choose from the following generator types:');
  console.log('');
  console.log('  action, component, container, collection, method, publication, module');
  console.log('');
  console.log('  You need to provide module name for action, component, and container');
  console.log("  Format your 'name' argument in the form of moduleName:entityName");
  console.log('');
  console.log('  e.g. `mantra generate action core:post`');
});

_commander2.default.command('destroy [type] [name]').alias('d').description('delete files generated for the given type and name').action(function (type, name, options) {
  var customConfig = (0, _config_utils.readCustomConfig)();

  (0, _commands.destroy)(type, name, options, customConfig);
});

_commander2.default.parse(process.argv);