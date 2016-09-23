  function Min (mapFn = x => x) {
    __assertFunction(mapFn)
    __assertNotEmpty(this)

    return Math.min.apply(null, this.ToArray().map(mapFn))
  }

  function Max (mapFn = x => x) {
    __assertFunction(mapFn)
    __assertNotEmpty(this)

    return Math.max.apply(null, this.ToArray().map(mapFn))
  }

  function Sum() {
    __assertNotEmpty(this)

    return this.Aggregate(0, (prev, curr) => prev + curr)
  }

  function Average () {
    __assertNotEmpty(this)

    let sum = this.Sum()
    this.reset()
    let count = this.Count()

    return sum / count
  }

  __export({ Min, Max, Average, Sum })
