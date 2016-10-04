(function () {
  'use strict';

  // this || (0, eval)('this') is a robust way for getting a reference
  // to the global object
  const window = this || (0, eval)('this'); // jshint ignore:line
  const DEBUG = DEBUG_CONSTANT_VALUE;
