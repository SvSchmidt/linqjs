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
    __assertCollection(coll)

    return !coll.First()
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
