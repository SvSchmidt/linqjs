  function Concat (second) {
    __assertIterable(second)

    const _self = this

    if (!isCollection(second)) {
      second = new Collection(second)
    }

    return new Collection(function * () {
      yield* _self
      yield* second
    }())
  }

  function Union (second, equalityCompareFn = defaultEqualityCompareFn) {
    __assertIterable(second)

    return this.Concat(second).Distinct(equalityCompareFn)
  }

  __export({ Concat, Union })
