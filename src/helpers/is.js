  function isArray (obj) {
    return obj instanceof ([]).constructor;
  }

  function isFunction (obj) {
    return typeof obj === 'function'
  }

  function isNumeric (n) {
    return !isNaN(parseFloat(n))
  }

  function isEmpty (coll) {
    if (isCollection(coll)) {
      return coll.next(true).done
    }

    return coll.length === 0
  }

  function isIterable (obj) {
    return (Symbol.iterator in Object(obj))
  }

  function isString (obj) {
    return typeof obj === 'string';
  }

  function isCollection (obj) {
    return obj instanceof Collection
  }

  function isGenerator (obj) {
    return obj instanceof (function * () {}).constructor;
  }

  function isUndefined (obj) {
    return typeof obj === typeof undefined
  }
