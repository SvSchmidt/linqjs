  class AssertionError extends Error {
    constructor (expected, got) {
      super(`Expected ${expected}, got ${got}!`)
    }
  }

  function __assert (condition, ...args) {
    if (!condition) {
      if (args.length === 1) {
        throw new Error(args[0]);
      } else if (args.length === 2) {
        throw new AssertionError(...args)
      }
    }
  }

  function __assertFunction (param) {
    __assert(isFunction(param), 'function', param)
  }

  function __assertArray (param) {
    __assert(isArray(param), 'array', param)
  }

  function __assertNotEmpty (self) {
    __assert(!isEmpty(self), 'Sequence is empty!')
  }

  function __assertIterable (obj) {
    __assert(isIterable(obj), 'iterable', obj)
  }

  function __assertCollection (obj) {
    __assert(isCollection(obj), 'collection', obj)
  }

  function __assertNumeric (obj) {
    __assert(isNumeric(obj), 'numeric value', obj)
  }

  function __assertNumberBetween (num, min, max = Infinity) {
    __assertNumeric(num)
    __assert(num >= min && num <= max, `Number must be between ${min} and ${max}!`)
  }

  function __assertIndexInRange (self, index) {
    __assertCollection(self)
    __assert(isNumeric(index), 'number', index)
    __assert(index >= 0 && index < self.Count(), 'Index is out of bounds')
  }
