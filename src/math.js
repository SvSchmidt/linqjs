  function Min (mapFn = x => x) {
    __assertFunction(mapFn)
    __assertNotEmpty(this)

    return Math.min.apply(null, this.Select(mapFn).ToArray())
  }

  function Max (mapFn = x => x) {
    __assertFunction(mapFn)
    __assertNotEmpty(this)

    return Math.max.apply(null, this.Select(mapFn).ToArray())
  }

  function Sum() {
    __assertNotEmpty(this)

    return this.Aggregate(0, (prev, curr) => prev + curr)
  }

  function Average () {
    __assertNotEmpty(this)

    return this.Sum() / this.Count()
  }

  __export({ Min, Max, Average, Sum })
