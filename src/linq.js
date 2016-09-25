linqjs.install = function () {
  window.Collection = Collection
  __assign(Collection.prototype, linqjsExports)

  // inheritance stuff (we don't want to implement stuff twice)
  OrderedLinqCollection.prototype = __assign(__assign({}, Collection.prototype), OrderedLinqCollection.prototype);
  OrderedLinqCollection.prototype.constructor = OrderedLinqCollection;

  const protosToApplyWrappers = [window.Array.prototype, window.Set.prototype, window.Map.prototype]

  Object.keys(Collection.prototype).forEach(k => {
    for (let proto of protosToApplyWrappers) {
      proto[k] = function (...args) {
        return new Collection(this)[k](...args)
      }
    }
  })
}
