  function toJSON (obj) {
    return JSON.stringify(obj)
  }

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

  /**
   * paramOrValue - Helper method to get the passed parameter or a default value if it is undefined
   *
   * @param  {any} param The parameter to check
   * @param  {any} value Value to return when param is undefined
   * @return {any}
   */
  function paramOrValue(param, value) {
    return typeof param === 'undefined'
      ? value
      : param
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

  function aggregateArray (arr, seed, accumulator, resultTransformFn) {
    __assertFunction(accumulator)
    __assertFunction(resultTransformFn)
    __assertNotEmpty(arr)

    return resultTransformFn([seed].concat(arr).reduce(accumulator))
  }

  function removeDuplicates (arr, equalityCompareFn = defaultEqualityCompareFn) {
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

  /**
   * emptyArray - Helper function to remove all elements from an array (by modifying the original and not returning a new one)
   *
   * @param  {Array} arr The array to remove all elements form
   * @return {void}
   */
  function emptyArray (arr) {
    __assertArray(arr)

    while (arr.shift()) {}
  }

  /**
   * insertIntoArray - Insert a value into an array at the specified index, defaults to the end
   *
   * @param  {Array} arr   The array to insert a value into
   * @param  {any} value   The value to add
   * @param  {Number} index The index to add the element to, defaults to the end
   * @return {void}
   */
  function insertIntoArray (arr, value, index) {
    index = paramOrValue(index, arr.length)
    __assertIndexInRange(arr, index)

    const before = arr.slice(0, index)
    const after = arr.slice(index)

    emptyArray(arr)

    arr.unshift(...Array.prototype.concat.apply([], [before, value, after]))
  }

  function removeFromArray (arr, value) {
    __assertArray(arr)

    let elemsBefore = []
    let elemFound = false
    let current

    // remove all elements from the array (shift) and push them into a temporary variable until the desired element was found
    while ((current = arr.shift()) && !(elemFound = defaultEqualityCompareFn(current, value))) {
      elemsBefore.push(current)
    }

    // add the temporary values back to the array (to the front)
    // -> unshift modifies the original array instead of returning a new one
    arr.unshift(...elemsBefore)

    return elemFound
  }

  const nativeConstructors = [
    Object, Number, Boolean, String, Symbol
  ]

  function isNative (obj) {
    return /native code/.test(Object(obj).toString()) || !!~nativeConstructors.indexOf(obj)
  }

  function getDefault (constructorOrValue = Object) {
    if (constructorOrValue && isNative(constructorOrValue) && typeof constructorOrValue === 'function') {
      let defaultValue = constructorOrValue()

      if (defaultValue instanceof Object || constructorOrValue === Date) {
        return null
      } else {
        return defaultValue
      }
    }

    return constructorOrValue
  }
