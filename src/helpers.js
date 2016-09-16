  function __assign (target, source) {
    target = Object(target);

    if (Object.hasOwnProperty('assign') && typeof Object.assign === 'function') {
      Object.assign(target, source)
    } else {
      for (let key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }

    return target
  }

  function __export (obj) {
    __assign(linqjs, obj)
  }

  function __assert(condition, msg) {
    if (!condition) {
      throw new Error(msg);
    }
  }

  function __assertFunction(param) {
    __assert(isFunction(param), 'Parameter must be function!')
  }

  function isES6 () {
    // use evaluation to prevent babel to transpile this test into ES5
    return new Function(`
      try {
        return (() => true)();
      } catch (err) {
        return false
      }
    `)()
  }

  function capitalize (str) {
    str = String(str)

    return str.charAt(0).toUpperCase() + str.substr(1)
  }

  function isNative (obj) {
    return /native code/.test(Object(obj).toString())
  }

  function isArray (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }

  function isFunction (obj) {
    return typeof obj === 'function'
  }

  function removeDuplicates (arr, equalityCompareFn = (a, b) => a === b) {
    __assert(isArray(arr), 'arr must be array!')
    __assertFunction(equalityCompareFn)

    const result = []
    const length = arr.length

    outer: for (let i = 0; i < length; i++) {
      let current = arr[i]

      inner: for (let j = 0; j < result.length; j++) {
        if (equalityCompareFn(current, result[j])) {
          continue outer;
        }
      }

      result.push(current)
    }

    return result
  }

  function getDefault (constructor) {
    if (constructor && isNative(constructor) && typeof constructor === 'function') {
      let defaultValue = constructor()

      if (defaultValue instanceof Object || constructor === Date) {
        return null
      } else {
        return defaultValue
      }
    }

    return null;
  }
