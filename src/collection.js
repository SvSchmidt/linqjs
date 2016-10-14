/**
 * Collection - Represents a collection of iterable values
 *
 * @class
 * @param  {Iterable|GeneratorFunction} iterableOrGenerator A iterable to create a collection of, e.g. an array or a generator function
 */
let Collection = (function () {
  function Collection (iterableOrGenerator) {
    __assert(isIterable(iterableOrGenerator) || isGenerator(iterableOrGenerator), 'Parameter must be iterable or generator!')

    this.iterable = iterableOrGenerator
  }

  Collection.prototype = (function () {
    function next (reset = false) {
      if (reset || !this.started) {
        this.started = true
        this.iterator = this.getIterator()
      }

      return this.iterator.next()
    }

    function reset () {
      this.started = false
    }

    function getIterator () {
      const iter = this.iterable

      if (isGenerator(iter)) {
        return iter()
      } else {
        return function * () {
          yield* iter
        }()
      }
    }

    return { next, reset, getIterator };
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

  return Collection
}())
