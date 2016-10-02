  function Concat (second) {
    __assertIterable(second)

    const firstIter = this.getIterator()

    return new Collection(function * () {
      yield* firstIter
      yield* second
    })
  }

  function Union (second, equalityCompareFn = defaultEqualityCompareFn) {
    __assertIterable(second)

    return this.Concat(second).Distinct(equalityCompareFn)
  }

  /**
   * Join - Correlates the elements of two sequences based on matching keys
   *
   * @see https://msdn.microsoft.com/de-de/library/bb534675(v=vs.110).aspx
   * @param  {iterable} second               The second sequence to join with the first one
   * @param  {Function} firstKeySelector     A selector fn to extract the key from the first sequence
   * @param  {Function} secondKeySelector    A selector fn to extract the key from the second sequence
   * @param  {Function} resultSelectorFn     A fn to transform the pairings into the result
   * @param  {Function} keyEqualityCompareFn Optional fn to compare the keys
   * @return {Collection}                      A new collection of the resulting pairs
   */
  function Join (second, firstKeySelector, secondKeySelector, resultSelectorFn, keyEqualityCompareFn) {
    __assertIterable(second)
    __assertFunction(firstKeySelector)
    __assertFunction(secondKeySelector)
    __assertFunction(resultSelectorFn)
    keyEqualityCompareFn = paramOrValue(keyEqualityCompareFn, defaultEqualityCompareFn)
    __assertFunction(keyEqualityCompareFn)

    const firstIter = this.getIterator()

    return new Collection(function * () {
      const secondIter = second[Symbol.iterator]()

      for (let firstValue of firstIter) {
        const firstKey = firstKeySelector(firstValue)

        for (let secondValue of secondIter) {
          const secondKey = secondKeySelector(secondValue)

          if (keyEqualityCompareFn(firstKey, secondKey)) {
            yield resultSelectorFn(firstValue, secondValue)
          }
        }
      }
    })
  }

  /**
   * Except - Returns the element of the sequence that do not appear in second
   *
   * @see https://msdn.microsoft.com/de-de/library/bb300779(v=vs.110).aspx
   * @param  {Iterable} second
   * @return {Collection}        new Collection with the values of first without the ones in second
   */
  function Except (second) {
    __assertIterable(second)

    if (!isCollection(second)) {
      second = new Collection(second)
    }

    const firstIter = this.getIterator()

    return new Collection(function * () {
      for (let val of firstIter) {
        if (!second.Contains(val)) {
          yield val
        }
      }
    })
  }

  /**
   * Zip - Applies a function to the elements of two sequences, producing a sequence of the results
   *
   * @param  {Iterable} second
   * @param  {type} resultSelectorFn A function of the form (firstValue, secondValue) => any to produce the output sequence
   * @return {collection}
   */
  function Zip (second, resultSelectorFn) {
    __assertIterable(second)
    __assertFunction(resultSelectorFn)

    const firstIter = this.getIterator()

    return new Collection(function * () {
      const secondIter = second[Symbol.iterator]()

      for (let firstVal of firstIter) {
        const secondNext = secondIter.next()

        if (secondNext.done) {
          break
        }

        yield resultSelectorFn(firstVal, secondNext.value)
      }
    })
  }

  /**
  * Intersect - Produces the set intersection of two sequences. The default equality comparator is used to compare values.
  *
  * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.sequenceequal(v=vs.110).aspx
  * @method
  * @memberof Collection
  * @instance
  * @example
[44, 26, 92, 30, 71, 38].Intersect([39, 59, 83, 47, 26, 4, 30]).ToArray()
// -> [26, 30]
  * @param  {Iterable} second The sequence to get the intersection from
  * @return {Collection}
   *//**
   * Intersect - Produces the set intersection of two sequences. A provided equality comparator is used to compare values.
   *
   * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.sequenceequal(v=vs.110).aspx
   * @method
   * @memberof Collection
   * @instance
   * @param  {Iterable} second The sequence to get the intersection from
   * @param {Function} equalityCompareFn A function of the form (first, second) => boolean to compare the values
   * @return {Collection}
   */
   function Intersect (second, equalityCompareFn = defaultEqualityCompareFn) {
    __assertIterable(second)
    __assertFunction(equalityCompareFn)

    const firstIter = this.ToArray()

    return new Collection(function * () {
      const secondIter = [...second]

      for (let val of firstIter) {
        if (secondIter.Any(elem => equalityCompareFn(val, elem))) {
          yield val
        }
      }
    })
  }


  __export({ Concat, Union, Join, Except, Zip, Intersect })
