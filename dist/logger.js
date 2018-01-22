'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = undefined;

var _colors = require('colors');

var logger = exports.logger = {
  create: function create(msg) {
    console.log((0, _colors.green)('  create  ') + msg);
  },
  update: function update(msg) {
    console.log((0, _colors.yellow)('  update  ') + msg);
  },
  exists: function exists(msg) {
    console.log((0, _colors.cyan)('  exists  ') + msg);
  },
  run: function run(msg) {
    console.log((0, _colors.green)('  run  ') + msg);
  },
  invoke: function invoke(msg) {
    console.log((0, _colors.blue)('  invoke  ') + msg);
  },
  remove: function remove(msg) {
    console.log((0, _colors.red)('  remove  ') + msg);
  },
  missing: function missing(msg) {
    console.log((0, _colors.red)('  missing  ') + msg);
  }
};