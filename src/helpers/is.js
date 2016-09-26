  function isArray (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }

  function isFunction (obj) {
    return typeof obj === 'function'
  }

  function isNumeric (n) {
    return !isNaN(parseFloat(n))
  }

  function isEmpty (coll) {
    if (isCollection(coll)) {
      return isEmpty(coll.Take(1).ToArray())
    }

    return coll.length === 0
  }

  function isIterable (obj) {
    return (Symbol.iterator in obj)
  }

  function isString (obj) {
    return typeof obj === 'string';
  }

  function isCollection (obj) {
    return obj instanceof Collection
  }

  function isGenerator (obj) {
    return Object.prototype.toString.call(obj) === '[object GeneratorFunction]'
  }
