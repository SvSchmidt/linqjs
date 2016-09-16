(function (factory) {
  try {
    if (typeof define === 'function' && define.amd) {
      // AMD asynchronous module definition (e.g. requirejs)
      define(['require', 'exports'], factory)
    } else if (exports && module && module.exports) {
      // CommonJS/Node.js where module.exports is for nodejs
      factory(exports || module.exports)
    }
  } catch (err) {
    // no module loader (simple <script>-tag) -> assign Maybe directly to the global object
    // -> (0, eval)('this') is a robust way for getting a reference to the global object
    factory(window.linqjs = {}) // jshint ignore:line
  }
}(function (linqjs) {
