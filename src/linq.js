window.Collection = (function () {
  const getIterator = symbolOrString('getIterator')

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

  Collection.prototype.ToArray = function () {
    const result = [...this]
    this.reset()

    return result
  }

  return Collection
}())

function install () {
  __assign(Collection.prototype, linqjs)

  const protosToApplyWrappers = [window.Array.prototype]

  Object.keys(linqjs).forEach(k => {
    for (let proto of protosToApplyWrappers) {
      proto[k] = function (...args) {
        return new Collection(this)[k](...args)
      }
    }
  })
}

__export({ install })
