const getIterator = symbolOrString('getIterator')

window.Collection = (function () {
  function Collection (iterableOrGenerator) {
    __assert(isIterable(iterableOrGenerator) || isGenerator(iterableOrGenerator), 'Parameter must be iterable or generator!')

    this.iterable = iterableOrGenerator
  }

  Collection.from = function (iterable) {
    return new Collection(iterable)
  }

  Collection.prototype = (function () {
    function next () {
      if (!this.started) {
        this.started = true
        this.iterator = this[getIterator]()
      }

      return this.iterator.next()
    }

    function reset () {
      this.started = false
    }

    function ToArray() {
      const result = [...this]
      this.reset()

      return result
    }

    return { next, reset }
  }())

  Collection.prototype[Symbol.iterator] = function * () {
    let current

    while (true) {
      current = this.next()

      if (current.done) {
        this.reset()
        break
      }

      yield current.value
    }
  }

  Collection.prototype[getIterator] = function () {
    const iter = this.iterable

    if (isGenerator(iter)) {
      return iter()
    } else {
      return function * () {
        yield* iter
      }()
    }
  }

  return Collection
}())

function install () {
  __assign(Collection.prototype, linqjs)

  // inheritance stuff (we don't want to implement stuff twice)
  OrderedLinqCollection.prototype = __assign(__assign({}, Collection.prototype), OrderedLinqCollection.prototype);
  OrderedLinqCollection.prototype.constructor = OrderedLinqCollection;

  const protosToApplyWrappers = [window.Array.prototype, window.Set.prototype, window.Map.prototype]

  Object.keys(linqjs).forEach(k => {
    for (let proto of protosToApplyWrappers) {
      proto[k] = function (...args) {
        return new Collection(this)[k](...args)
      }
    }
  })
}

__export({ install })
