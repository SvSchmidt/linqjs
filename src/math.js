  function __assertAllNumeric (arr) {

  }

  function Min (mapFn = x => x) {
    __assertFunction(mapFn)
    __assertNotEmpty(this)

    return Math.min.apply(null, this.map(mapFn))
  }

  function Max (mapFn = x => x) {
    __assertFunction(mapFn)
    __assertNotEmpty(this)

    return Math.max.apply(null, this.map(mapFn))
  }

  function Sum() {
    __assertNotEmpty(this)

    return this.reduce((prev, curr) => prev + curr)
  }

  function Average () {
    __assertNotEmpty(this)

    return Sum.call(this) / this.length
  }

  __export({ Min, Max, Average })
