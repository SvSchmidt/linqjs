  /**
   * Aggregate - applies a accumulator function to a sequence
   *
   * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
   * @param {Function} accumulator The accumulator function of the form (prev, current) => any
   * @return {any} the result of the accumulation
   *//**
   * Aggregate - applies a accumulator function to a sequence. Starts with seed.
   *
   * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
   * @param {any} seed The starting value of the accumulation
   * @param {Function} accumulator The accumulator function of the form (prev, current) => any
   * @return {any} the result of the accumulation
   *//**
   * Aggregate - applies a accumulator function to a sequence. Starts with seed and transforms the result using resultTransformFn.
   *
   * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
   * @param {any} seed The starting value of the accumulation
   * @param {Function} accumulator The accumulator function of the form (prev, current) => any
   * @param {Function} resultTransformFn A function to transform the result
   * @return {any} the result of the accumulation
   * @
   */
  function Aggregate (seedOrAccumulator, accumulator, resultTransformFn) {
    const values = this.ToArray()

    if (typeof seedOrAccumulator === 'function' && !accumulator && !resultTransformFn) {
      return aggregateCollection(values.slice(1, values.length), values.slice(0, 1)[0], seedOrAccumulator, elem => elem)
    } else if (typeof seedOrAccumulator !== 'function' && typeof accumulator === 'function' && !resultTransformFn) {
      return aggregateCollection(values, seedOrAccumulator, accumulator, elem => elem)
    } else {
      return aggregateCollection(values, seedOrAccumulator, accumulator, resultTransformFn)
    }
  }

  function Select (mapFn = x => x) {
    const iter = this.getIterator()

    return new Collection(function * () {
      for (let val of iter) {
        yield mapFn(val)
      }
    })
  }

  /**
   * Flatten - Flattens a sequence meaning reducing the level of nesting by one
   *
   * @memberof Collection
   * @instance
   * @method
   * @example
   * // [1, 2, 3, 4, 5, 6,]
   * [1, 2, 3, [4, 5, 6,]]].Flatten().ToArray()
   * @return {Collection}  A new flattened Collection
   */
  function Flatten () {
    return this.SelectMany(x => x)
  }

  /**
   * SelectMany - Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
   *
   * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.selectmany(v=vs.110).aspx
   * @memberof Collection
   * @instance
   * @method
   * @param {Function} mapFn The function to use to map each element of the sequence, has the form elem => any
   * @return {Collection}
   *//**
   * SelectMany - Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
   * The index of the source element can be used in the mapFn.
   *
   * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.selectmany(v=vs.110).aspx
   * @memberof Collection
   * @instance
   * @method
   * @param {Function} mapFn The function to use to map each element of the sequence, has the form (elem, index) => any
   * @return {Collection}
   *//**
   * SelectMany - Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
   * Invokes a resultSelector function on each element of the sequence.
   *
   * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.selectmany(v=vs.110).aspx
   * @memberof Collection
   * @instance
   * @method
   * @param {Function} mapFn The function to use to map each element of the sequence, has the form elem => any
   * @param {Function} resultSelector a function of the form (sourceElement, element) => any to map the result Value
   * @return {Collection}
   *//**
   * SelectMany - Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
   * Invokes a resultSelector function on each element of the sequence. The index of the source element can be used in the mapFn.
   *
   * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.selectmany(v=vs.110).aspx
   * @memberof Collection
   * @instance
   * @method
   * @param {Function} mapFn The function to use to map each element of the sequence, has the form (elem, index) => any
   * @param {Function} resultSelector a function of the form (sourceElement, element) => any to map the result Value
   * @return {Collection}
   * @
   */
  function SelectMany (mapFn, resultSelector = (x, y) => y) {
    __assertFunction(mapFn)
    __assertFunction(resultSelector)

    const iter = this.getIterator()

    return new Collection(function * () {
      let index = 0

      for (let current of iter) {
        let mappedEntry = mapFn(current, index)
        let newIter = mappedEntry

        if (!isIterable(mappedEntry)) {
          newIter = [mappedEntry]
        } else {
          newIter = mappedEntry
        }

        for (let val of newIter[Symbol.iterator]()) {
          yield resultSelector(current, val)
        }

        index++
      }
    })
  }

  /**
   * Distinct - Returns the distinct elemens from a sequence using the default equality compare function
   *
   * https://msdn.microsoft.com/de-de/library/system.linq.enumerable.distinct(v=vs.110).aspx
   * @return {Array}
   *//**
   * Distinct - Returns the distinct elemens from a sequence using a provided equality compare function
   *
   * https://msdn.microsoft.com/de-de/library/system.linq.enumerable.distinct(v=vs.110).aspx
   * @param {Function} equalityCompareFn The function of the form (first, second) => boolean determining if the values are equal
   * @return {Array}
   */
  function Distinct (equalityCompareFn = defaultEqualityCompareFn) {
    __assertFunction(equalityCompareFn)

    return removeDuplicates(this, equalityCompareFn)
  }

  function ToArray () {
    return [...this.getIterator()]
  }

  /**
   * ToDictionary - description
   *
   * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.todictionary(v=vs.110).aspx
   * @param  {Function} keySelector                  Function to get the keys from the elements
   * @param  {Function} elementSelectorOrKeyComparer Function to either get the elements or compare the keys
   * @param  {Function} keyComparer                  Function to compare the keys
   * @return {Map}                                   A dictionary (Map)
   */
  function ToDictionary (keySelector, elementSelectorOrKeyComparer, keyComparer) {
    __assertFunction(keySelector)

    if (!elementSelectorOrKeyComparer && !keyComparer) {
      // ToDictionary(keySelector)
      return this.ToDictionary(keySelector, elem => elem, defaultEqualityCompareFn)
    } else if (!keyComparer && getParameterCount(elementSelectorOrKeyComparer) === 1) {
      // ToDictionary(keySelector, elementSelector)
      return this.ToDictionary(keySelector, elementSelectorOrKeyComparer, defaultEqualityCompareFn)
    } else if (!keyComparer && getParameterCount(elementSelectorOrKeyComparer) === 2) {
      // ToDictionary(keySelector, keyComparer)
      return this.ToDictionary(keySelector, elem => elem, elementSelectorOrKeyComparer)
    }

    // ToDictionary(keySelector, elementSelector, keyComparer)

    __assertFunction(keyComparer)
    __assertFunction(elementSelectorOrKeyComparer)

    let usedKeys = []
    let result = new Map()
    const input = this.ToArray()
    const elementSelector = elementSelectorOrKeyComparer

    for (let value of input) {
      let key = keySelector(value)
      let elem = elementSelector(value)

      __assert(key != null, 'Key is not allowed to be null!')
      __assert(!usedKeys.Any(x => keyComparer(x, key)), `Key '${key}' is already in use!`)

      usedKeys.push(key)
      result.set(key, elem)
    }

    return result
  }

  /**
   * ToJSON - Returns the representation of the sequence in javascript object notation (JSON)
   *
   * @instance
   * @method
   * @memberof Collection
   * @return {string}
   */
   function ToJSON () {
     return toJSON(this.ToArray())
   }

  /**
   * Reverse - Returns a new sequence with the elements of the original one in reverse order
   * This method should be considered inperformant since the collection must get enumerated once
   *
   * @see https://msdn.microsoft.com/de-de/library/bb358497(v=vs.110).aspx
   * @method
   * @instance
   * @memberof Collection
   * @return {Collection}
   */
  function Reverse () {
    const arr = this.ToArray()

    return new Collection(function * () {
      for (let i = arr.length - 1; i >= 0; i--) {
        yield arr[i]
      }
    })
  }

  __export({ Aggregate, Distinct, Select, SelectMany, Flatten, Reverse, ToArray, ToDictionary, ToJSON })
