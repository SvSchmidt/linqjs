  function isArray (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }

  function isFunction (obj) {
    return typeof obj === 'function'
  }

  function isNumeric (n) {
    return !isNaN(parseFloat(n))
  }

  function isEmpty (arr) {
    __assertArray(arr)

    return arr.length === 0
  }
