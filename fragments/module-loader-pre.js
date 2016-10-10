(function (Collection) {
  try {
    if (typeof define === 'function' && define.amd) {
      // AMD asynchronous module definition (e.g. requirejs)
      define(['require', 'exports'], function () { return Collection })
    } else if (exports && module && module.exports) {
      // CommonJS/Node.js where module.exports is for nodejs
      exports = module.exports = Collection
    }
  } catch (err) {
    // no module loader (simple <script>-tag) -> assign Maybe directly to the global object
    window.Collection = Collection
  }
}(function () {
  // We will apply any public methods to linqjsExports and apply them to the Collection.prototype later
  let linqjsExports = {}
