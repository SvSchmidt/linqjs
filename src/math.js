  function __assertAllNumeric (arr) {
    
  }

  function Min (mapFn = x => x) {
    __assertFunction(mapFn)

    return Math.min.apply(null, this.map(mapFn))
  }

  function Max (mapFn = x => x) {
    __assertFunction(mapFn)

    return Math.max.apply(null, this.map(mapFn))
  }

  function Average () {
    const sum = this.reduce((prev, curr) => prev + curr)

    return sum / this.length;
  }

  __export({ Min, Max, Average })
