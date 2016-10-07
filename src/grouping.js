/**
 * getEqualKey - Get the matching key in the group for a given key and a keyComparer or return the parameter itself if the key is not present yet
 */
function getEqualKey(groups, key, keyComparer) {
  for (let groupKey of groups.keys()) {
    if (keyComparer(groupKey, key)) {
      return groupKey
    }
  }

  return key
}

/**
 * GroupBy - Groups a sequence using the keys selected from the members using the keySelector
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
 * @instance
 * @memberof Collection
 * @method
 * @variation (keySelector)
 * @example
 * // Map {"S" => ["Sven"], "M" => ["Mauz"]}
 * ['Sven', 'Mauz'].GroupBy(x => x[0])
 * @param {Function} keySelector A function to select grouping keys from the sequence members
 * @return {Map} The grouped sequence as a Map
 *//**
 * GroupBy - Groups a sequence using the keys selected from the members using the keySelector. The keys are compared using keyComparer.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
 * @instance
 * @memberof Collection
 * @method
 * @variation (keySelector, keyComparer)
 * @example
 * // Map {"4" => ["4", 4], "5" => ["5"]}
 * ['4', 4, '5'].GroupBy(x => x, (outer, inner) => parseInt(outer) === parseInt(inner))
 * @param {Function} keySelector A function to select grouping keys from the sequence members
 * @param {Function} keyComparer A function of the form (outer, inner) => bool to check if keys are considered equal
 * @return {Map} The grouped sequence as a Map
 *//**
 * GroupBy - Groups a sequence using the keys selected from the members using the keySelector.
 * Each group member is projected to a single value (e.g. a property) using the elementSelector.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
 * @instance
 * @memberof Collection
 * @method
 * @variation (keySelector, elementSelector)
 * @example
 * // Map {23 => ["Sven"], 20 => ["jon"]}
 * [{ name: 'Sven', age: 23 }, { name: 'jon', age: 20 }].GroupBy(x => x.age, x => x.name)
 * @param {Function} keySelector A function to select grouping keys from the sequence members
 * @param {Function} elementSelector A function to map each group member to a specific value
 * @return {Map} The grouped sequence as a Map
 *//**
 * GroupBy - Groups a sequence using the keys selected from the members using the keySelector.
 * The resultSelector is used to project each resulting group to a single value (e.g. an object with aggregated properties).
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
 * @instance
 * @memberof Collection
 * @method
 * @variation (keySelector, resultSelector)
 * @example
 * // [ { age:23, persons: "Sven&julia" }, { age: 20, persons: "jon" } ]
 * [{ name: 'Sven', age: 23 }, { name: 'julia', age: 23 }, { name: 'jon', age: 20 }].GroupBy(x => x.age, (age, persons) => ({ age, persons: persons.map(p => p.name).join('&') })).ToArray()
 * @param {Function} keySelector A function to select grouping keys from the sequence members
 * @param {Function} resultSelector A function of the form (key, groupMembers) => any to select a final result from each group
 * @return {Collection} The grouped sequence with projected results as a new Collection
 *//**
 * GroupBy - Groups a sequence using the keys selected from the members using the keySelector. Keys are compared using the specified keyComparer.
 * The resultSelector is used to project each resulting group to a single value (e.g. an object with aggregated properties).
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
 * @instance
 * @memberof Collection
 * @method
 * @variation (keySelector, resultSelector, keyComparer)
 * @param {Function} keySelector A function to select grouping keys from the sequence members
 * @param {Function} resultSelector A function of the form (key, groupMembers) => any to select a final result from each group
 * @param {Function} keyComparer A function of the form (outer, inner) => bool to check if keys are considered equal
 * @return {Collection} The grouped sequence with projected results as a new Collection
 *//**
 * GroupBy - Groups a sequence using the keys selected from the members using the keySelector. Keys are compared using the specified keyComparer.
 * Each group member is projected to a single value (e.g. a property) using the elementSelector.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
 * @instance
 * @memberof Collection
 * @method
 * @variation (keySelector, elementSelector, keyComparer)
 * @param {Function} keySelector A function to select grouping keys from the sequence members
 * @param {Function} elementSelector A function to map each group member to a specific value
 * @param {Function} keyComparer A function of the form (outer, inner) => bool to check if keys are considered equal
 * @return {Map} The grouped sequence as a Map
 *//**
 * GroupBy - Groups a sequence using the keys selected from the members using the keySelector.
 * Each group member is projected to a single value (e.g. a property) using the elementSelector.
 * The resultSelector is used to project each resulting group to a single value (e.g. an object with aggregated properties).
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
 * @instance
 * @memberof Collection
 * @method
 * @variation (keySelector, elementSelector, resultSelector)
 * @param {Function} keySelector A function to select grouping keys from the sequence members
 * @param {Function} elementSelector A function to map each group member to a specific value
 * @param {Function} resultSelector A function of the form (key, groupMembers) => any to select a final result from each group
 * @return {Collection} The grouped sequence with projected results as a new Collection
 *//**
 * GroupBy - Groups a sequence using the keys selected from the members using the keySelector. The keys are compared using the keyComparer.
 * Each group member is projected to a single value (e.g. a property) using the elementSelector.
 * The resultSelector is used to project each resulting group to a single value (e.g. an object with aggregated properties).
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
 * @instance
 * @memberof Collection
 * @method
 * @variation (keySelector, elementSelector, resultSelector, keyComparer)
 * @param {Function} keySelector A function to select grouping keys from the sequence members
 * @param {Function} elementSelector A function to map each group member to a specific value
 * @param {Function} resultSelector A function of the form (key, groupMembers) => any to select a final result from each group
 * @param {Function} keyComparer A function of the form (outer, inner) => bool to check if keys are considered equal
 * @return {Collection} The grouped sequence with projected results as a new Collection
 * @
 */
function GroupBy (keySelector, ...args) {
  const arr = this.ToArray()

  /**
   * isKeyComparer - Checks whether or not a function is a keyComparer. We need to differentiate between the keyComparer and the resultSelector
   * since both take two arguments.
   */
  function isKeyComparer (arg) {
    let result = getParameterCount(arg) === 2
    try {
      // if this is a key comparer, it must return truthy values for equal values and falsy ones if they're different
      result = result && arg(1, 1) && !arg(1, 2)
    } catch (err) {
      // if the function throws an error for values, it can't be a keyComparer
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
  GroupBy(keySelector, resultSelector)
  */
  function groupByTwoArguments (keySelector, inner) {
    let keyComparer, elementSelector

    if (isKeyComparer(inner)) {
      keyComparer = inner
      elementSelector = elem => elem
    } else {
      keyComparer = defaultEqualityCompareFn
      elementSelector = inner
    }

    return groupByThreeArguments(keySelector, elementSelector, keyComparer)
  }

  /*
  GroupBy(keySelector, resultSelector, keyComparer)
  GroupBy(keySelector, elementSelector, keyComparer)
  GroupBy(keySelector, elementSelector, resultSelector)
  */
  function groupByThreeArguments (keySelector, inner, third) {
    let keyComparer, elementSelector, resultSelector

    if (isKeyComparer(third)) {
      keyComparer = third
    } else {
      resultSelector = third
    }

    if (getParameterCount(inner) === 2) {
      resultSelector = inner
    } else {
      elementSelector = inner
    }

    if (!keyComparer) {
      keyComparer = defaultEqualityCompareFn
    }

    if (!elementSelector) {
      elementSelector = elem => elem
    }

    return groupBy(keySelector, elementSelector, resultSelector, keyComparer)
  }

  /**
   * This is the "basic" function to use. The others just transform their parameters to be used with this one.
   */
  function groupBy (keySelector, elementSelector, resultSelector, keyComparer) {
    __assertFunction(keySelector)
    __assertFunction(elementSelector)
    __assert(isUndefined(resultSelector) || isFunction(resultSelector), 'resultSelector must be undefined or function!')
    __assertFunction(keyComparer)

    let groups = new Map()
    let result

    for (let val of arr) {
      // Instead of checking groups.has we use our custom function since we want to treat some keys as equal even if they aren't for the Map
      const key = getEqualKey(groups, keySelector(val), keyComparer)
      const elem = elementSelector(val)

      if (groups.has(key)) {
        groups.get(key).push(elem)
      } else {
        groups.set(key, [elem])
      }
    }

    if (resultSelector) {
      // If we want to select the final result with the resultSelector, we use the built-in Select function and retrieve a new Collection
      result = groups.ToArray().Select(g => resultSelector(...g))
    } else {
      // our result is just the grouos -> return the Map
      result = groups
    }

    return result
  }

  // the outer parameter of GroupBy is always the keySelector, so we have to differentiate the following arguments
  // and select the appropriate function
  let fn
  switch (args.length) {
    case 0:
      fn = groupByOneArgument
      break
    case 1:
      fn = groupByTwoArguments
      break
    case 2:
      fn = groupByThreeArguments
      break
    case 3:
      fn = groupBy
      break
    default:
      throw new Error('GroupBy parameter count can not be greater than 4!')
  }

  return fn(keySelector, ...args)
}


/**
 * GroupJoin - Correlates the elements of two sequences based on equality of keys and groups the results.
 * The default equality comparer is used to compare keys.
 *
 * @instance
 * @memberof Collection
 * @method
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupjoin(v=vs.110).aspx
 * @param  {Iterable} inner The values to join with this Collection
 * @param  {Function} outerKeySelector A function to extract the grouping keys from the outer Collection
 * @param  {Function} innerKeySelector A function to extract the grouping keys from the inner Collection
 * @param  {Function} resultSelector A function of the form (key, values) => any to select the final result from each grouping
 * @return {any}
 *//**
 * GroupJoin - Correlates the elements of two sequences based on equality of keys and groups the results.
 * The provided custom keyComparer is used to compare keys.
 *
 * @instance
 * @memberof Collection
 * @method
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupjoin(v=vs.110).aspx
 * @param  {Iterable} inner The values to join with this Collection
 * @param  {Function} outerKeySelector A function to extract the grouping keys from the outer Collection
 * @param  {Function} innerKeySelector A function to extract the grouping keys from the inner Collection
 * @param  {Function} resultSelector A function of the form (key, values) => any to select the final result from each grouping
 * @param {Function} keyComparer A function of the form (first, second) => bool to compare keys for equality
 * @return {any}
 */
function GroupJoin (inner, outerKeySelector, innerKeySelector, resultSelector, equalityCompareFn = defaultEqualityCompareFn) {
  __assertIterable(inner)
  __assertFunction(outerKeySelector)
  __assertFunction(innerKeySelector)
  __assertFunction(resultSelector)

  let groups = new Map()
  const outer = this

  for (let outerVal of outer.getIterator()) {
    const outerKey = outerKeySelector(outerVal)

    groups.set(outerVal, new Collection(function * () {
      for (let innerVal of inner[Symbol.iterator]()) {
        if (equalityCompareFn(outerKey, innerKeySelector(innerVal))) {
          yield innerVal
        }
      }
    }))
  }

  return new Collection(function * () {
    for (let [key, values] of groups) {
      yield resultSelector(key, values.ToArray())
    }
  })
}

__export({ GroupBy, GroupJoin })
