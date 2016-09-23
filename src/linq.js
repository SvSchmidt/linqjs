window.Collection = (function () {
  function Collection (iterable) {
    __assertIterable(iterable)

    this.iterable = iterable
  }

  Collection.from = function (iterable) {
    return new Collection(iterable)
  }

  Collection.prototype = (function () {
    function next () {
      if (!this.started) {
        this.started = true
        const _self = this

        this.iterator = function * () {
          yield* _self.iterable
          _self.reset()
        }()
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

  Collection.prototype.ToArray = function () {
    return [...this]
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
