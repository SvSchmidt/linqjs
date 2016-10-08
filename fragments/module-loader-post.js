  // Install linqjs
  // [1] Assign exports to the prototype of Collection
  __assign(Collection.prototype, linqjsExports)

  // [2] Let OrderedCollection inherit from Collection (we don't want to implement stuff twice)
  OrderedCollection.prototype = __assign(__assign({}, Collection.prototype), OrderedCollection.prototype)
  OrderedCollection.prototype.constructor = OrderedCollection

  // [3] Apply wrapper functions to selected prototypes which are iterable (Array, Set, Map etc.)
  const protosToApplyWrappers = [window.Array.prototype, window.Set.prototype, window.Map.prototype]

  Object.keys(Collection.prototype).forEach(k => {
    for (let proto of protosToApplyWrappers) {
      proto[k] = function (...args) {
        return new Collection(this)[k](...args)
      }
    }
  })

  // [4] Return final Collection class
  return Collection
}()))
