'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertToFile = insertToFile;
exports.removeFromFile = removeFromFile;
exports.createDir = createDir;
exports.getFileContent = getFileContent;
exports.createFile = createFile;
exports.executeCommand = executeCommand;
exports.checkFileExists = checkFileExists;
exports.runScriptFile = runScriptFile;
exports.isWindows = isWindows;
exports.getLineBreak = getLineBreak;
exports.parseYamlFromFile = parseYamlFromFile;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _editer = require('editer');

var _editer2 = _interopRequireDefault(_editer);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fsExtra = require('fs-extra');

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _logger = require('./logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function editFile(type, pathToFile, string, options) {
  var fileContent = _fs2.default.readFileSync(pathToFile, { encoding: 'utf-8' });
  var updatedContent = void 0;

  if (type === 'insert') {
    updatedContent = _editer2.default.insert(string, fileContent, options);
  } else if (type === 'remove') {
    updatedContent = _editer2.default.remove(string, fileContent, options);
  }

  _fs2.default.writeFileSync(pathToFile, updatedContent);
}

/**
 * Writes a string on the file at the given path, at a location specified by
 * options. Uses 'editer' module under the hood the find the exact location of
 * the insertion.
 *
 * @param pathToFile {String} - the path to the file. Can be either absolute or
 *        relative.
 */
function insertToFile(pathToFile, string, options) {
  editFile('insert', pathToFile, string, options);
}

function removeFromFile(pathToFile, string, options) {
  editFile('remove', pathToFile, string, options);
}

/**
 * Creates a directory and displays a message in the console
 *
 * @param path {String} - the path on which the directory is to be created
 */
function createDir(path) {
  (0, _fsExtra.mkdirsSync)(path);

  var displayPath = path.replace(/^\.\//, '').replace(/$/, '/');
  _logger.logger.create(displayPath);
}

/**
 * Reads the content of the template file and evaluates template variables
 * in the template if necessary
 *
 * @param templatePath {String} - the path to the template file
 * @param templateVariables {Object} - key value pairs of variables to be
 *        evaluated in the template
 */
function getFileContent(templatePath, templateVariables) {
  var templateContent = _fs2.default.readFileSync(templatePath);

  if (templateVariables) {
    return _lodash2.default.template(templateContent)(templateVariables);
  } else {
    return templateContent;
  }
}

/**
 * Creates a file at a given path using the template and template variables
 * provided. Logs a message on the console.
 * If the parent directory does not exist, recursively create parent directories
 * by using `fs-extra` module.
 *
 * @param templatePath {String} - the path to the template file
 * @param targetPath {String} - the path on which the file is to be generated
 * @param templateVariables {Object} - key value pairs of variables to be
 *        evaluated in the template
 */
function createFile(templatePath, targetPath, templateVariables) {
  var fileContent = getFileContent(templatePath, templateVariables);
  (0, _fsExtra.outputFileSync)(targetPath, fileContent);

  var displayPath = targetPath.replace(/^\.\//, '');
  _logger.logger.create(displayPath);
}

/**
 * Executes a command. Logs a message in the console.
 *
 * @param cmd {String} - the command to execute
 * @param options {Object} - options to be provided to child_process.execSync
 */
function executeCommand(cmd, options) {
  _logger.logger.run(cmd);
  (0, _child_process.execSync)(cmd, options);
}

/**
 * Checks if a file or directory exists at the given path
 * @param path {String} - the path to the file or directory. Can be either
 *        absolute or relative.
 * @return Boolean - true if the file or directory exists. Otherwise false.
 */
function checkFileExists(path) {
  try {
    _fs2.default.lstatSync(path);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }

  return true;
}

function runScriptFile(pathToScript) {
  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var scriptName = _path2.default.basename(pathToScript).replace(/\..*$/, '');

  _logger.logger.invoke(scriptName);
  var commandPrefix = isWindows() ? '' : 'bash';
  (0, _child_process.execSync)(commandPrefix + ' ' + pathToScript + ' ' + args.join(' '), options);
}

function isWindows() {
  return (/^win/.test(process.platform)
  );
}

function getLineBreak() {
  if (isWindows()) {
    return '\r\n';
  } else {
    return '\n';
  }
}

/**
 * parseYamlFromFile parses YAML into object from a given file.
 * @param path {String} - path to the YAML file
 * @return {Object} - config object
 */
function parseYamlFromFile(path) {
  var content = _fs2.default.readFileSync(path, { encoding: 'utf-8' });
  return _jsYaml2.default.safeLoad(content);
}