  function Concat (second) {
    __assertIterable(second)

    const _self = this

    if (!isCollection(second)) {
      second = new Collection(second)
    }

    return new Collection(function * () {
      yield* _self
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

    const first = this

    const result = Collection.from(function * () {
      for (let firstValue of first) {
        const firstKey = firstKeySelector(firstValue)

        for (let secondValue of second) {
          const secondKey = secondKeySelector(secondValue)

          if (keyEqualityCompareFn(firstKey, secondKey)) {
            yield resultSelectorFn(firstValue, secondValue)
          }
        }
      }
    })

    this.reset()
    second.reset && second.reset()

    return result
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

    const first = this

    const result = new Collection(function * () {
      for (let val of first) {
        if (!second.Contains(val)) {
          yield val
        }
      }
    })

    this.reset()

    return result
  }

  __export({ Concat, Union, Join, Except })
