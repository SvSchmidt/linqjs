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

  function filterArray (arr, predicate = (elem, index) => true, stopAfter = Infinity) {
    __assert(isArray(arr), 'arr must be array!')
    __assertFunction(predicate)
    __assert(isNumeric(stopAfter), 'stopAfter must be numeric!')

    let result = []
    const length = arr.length

    for (let i = 0; i < length; i++) {
      if (predicate(arr[i], i)) {
        result.push(arr[i])

        if (result.length >= stopAfter) {
          break;
        }
      }
    }

    return result
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

  const nativeConstructors = [
    Object, Number, Boolean, String, Symbol
  ]

  function isNative (obj) {
    return /native code/.test(Object(obj).toString()) || !!~nativeConstructors.indexOf(obj)
  }

  function getDefault (constructor = Object) {
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
