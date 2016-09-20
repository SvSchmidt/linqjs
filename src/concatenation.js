  function Concat (second) {
    __assert(isArray(second), 'second must be an array!')

    return Array.prototype.concat.apply(this, second)
  }

  function Union (second, equalityCompareFn = defaultEqualityCompareFn) {
    return removeDuplicates(this.Concat(second), equalityCompareFn)
  }

  __export({ Concat, Union })
