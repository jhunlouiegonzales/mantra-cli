'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGenerator = getGenerator;
exports.default = generate;

var _action = require('../generators/action');

var _component = require('../generators/component');

var _container = require('../generators/container');

var _collection = require('../generators/collection');

var _method = require('../generators/method');

var _publication = require('../generators/publication');

var _module = require('../generators/module');

/**
 * Get a generator given an entity type. Returns undefined if there is no
 * generator for the type.
 *
 * @param type {String} - type of entity to generate
 * @return generator {Function} - generator for that entity
 */
function getGenerator(type) {
  var generatorMap = {
    action: _action.generateAction,
    component: _component.generateComponent,
    container: _container.generateContainer,
    collection: _collection.generateCollection,
    method: _method.generateMethod,
    publication: _publication.generatePublication,
    module: _module.generateModule
  };

  return generatorMap[type];
}

function validateName(name) {
  var entityName = void 0;
  if (/.*:.*/.test(name)) {
    var split = name.split(':');
    if (split.length !== 2) {
      return false;
    }
    entityName = split[1];
  } else {
    entityName = name;
  }

  if (entityName.indexOf('.') > -1) {
    return false;
  }

  return true;
}

function generate(type, name) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var config = arguments[3];

  var generator = getGenerator(type);

  if (!generator) {
    console.log('Could not find a generator for ' + type);
    console.log('Run `mantra generate --help` for more options.');
    return;
  }

  if (!validateName(name)) {
    console.log(name + ' is an invalid name');
    console.log('Name of the file cannot contain any dots.');
    return;
  }

  generator(name, options, config);
}