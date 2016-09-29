function GroupBy (keySelector, ...args) {
  __assertFunction(keySelector)

  const arr = this.ToArray()

  function isKeyComparer (arg) {
    let result = getParameterCount(arg) === 2
    try {
      result = result && arg('a', 'a') && !arg('a', 'b')
    } catch (err) {
      result = false
    }

    return result
  }

  /*
  GroupBy(keySelector)
  */
  function groupByOneArgument (keySelector) {
    return groupBy(keySelector, elem => elem, undefined, defaultEqualityCompareFn)
  }

  /*
  GroupBy(keySelector, keyComparer)
  GroupBy(keySelector, elementSelector)
  GroupBy(keySelector, resultTransformFn)
  */
  function groupByTwoArguments (keySelector, second) {
    let keyComparer, elementSelector

    if (isKeyComparer(second)) {
      keyComparer = second
      elementSelector = elem => elem
    } else {
      keyComparer = defaultEqualityCompareFn
      elementSelector = second
    }

    return groupByThreeArguments(keySelector, elementSelector, keyComparer)
  }

  /*
  GroupBy(keySelector, resultTransformFn, keyComparer)
  GroupBy(keySelector, elementSelector, keyComparer)
  GroupBy(keySelector, elementSelector, resultTransformFn)
  */
  function groupByThreeArguments (keySelector, second, third) {
    let keyComparer, elementSelector, resultTransformFn

    if (isKeyComparer(third)) {
      keyComparer = third
    } else {
      resultTransformFn = third
    }

    if (getParameterCount(second) === 2) {
      resultTransformFn = second
    } else {
      elementSelector = second
    }

    if (!keyComparer) {
      keyComparer = defaultEqualityCompareFn
    }

    if (!elementSelector) {
      elementSelector = elem => elem
    }

    return groupBy(keySelector, elementSelector, resultTransformFn, keyComparer)
  }

  function groupBy (keySelector, elementSelector, resultTransformFn, keyComparer) {
    let groups = new Map()
    let result

    for (let val of arr) {
      const key = keySelector(val)
      const elem = elementSelector(val)

      if (groups.has(key)) {
        groups.get(key).push(elem)
      } else {
        groups.set(key, [elem])
      }
    }

    if (resultTransformFn) {
      result = groups.ToArray().Select(g => resultTransformFn(g[0], g[1]))
    } else {
      result = groups
    }

    return result
  }

  switch (args.length) {
    case 0:
      return  groupByOneArgument(keySelector)
      break
    case 1:
      return groupByTwoArguments(keySelector, args[0])
      break
    case 2:
      return groupByThreeArguments(keySelector, args[0], args[1])
      break
    case 3:
      return groupBy(keySelector, args[0], args[1], args[2])
      break
    default:
      throw new Error('GroupBy parameter count can not be greater than 4!')
      break
  }
}

__export({ GroupBy })
