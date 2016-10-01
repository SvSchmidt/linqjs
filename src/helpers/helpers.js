  function toJSON (obj) {
    return JSON.stringify(obj)
  }

  function __assign (target, source) {
    Object.assign(Object(target), source)

    return target
  }

  function __export (obj) {
    __assign(linqjsExports, obj)
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

  function aggregateCollection (coll, seed, accumulator, resultTransformFn) {
    __assertFunction(accumulator)
    __assertFunction(resultTransformFn)
    __assertNotEmpty(coll)

    return resultTransformFn([seed].concat(coll).reduce(accumulator))
  }

  function removeDuplicates (coll, equalityCompareFn = defaultEqualityCompareFn) {
    __assertIterable(coll)
    __assertFunction(equalityCompareFn)

    const previous = []

    return new Collection(function * () {
      const iter = coll.getIterator()

      outer: for (let val of iter) {
        inner: for (let prev of previous) {
          if (equalityCompareFn(val, prev)) {
            continue outer;
          }
        }

        previous.push(val)

        yield val
      }
    })
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

  const nativeConstructors = [Object, Number, Boolean, String, Symbol]

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

  function getParameterCount (fn) {
    __assertFunction(fn)

    return fn.length
  }
