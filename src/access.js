function Contains (elem) {
  for (let val of this) {
    if (defaultEqualityCompareFn(elem, val)) {
      return true
    }
  }

  this.reset()

  return false
}

/**
 * ElementAt - Returns the element at the given index
 *
 * @see https://msdn.microsoft.com/de-de/library/bb299233(v=vs.110).aspx
 * @param  {Number} index
 * @return {any}
 */
function ElementAt (index) {
  __assertIndexInRange(this, index)
  __assert(isNumeric(index), 'Index must be numeric!')

  const result = this.Skip(index).Take(1)[0]
  this.reset()

  return result
}

/**
 * Take - Returns count elements of the sequence starting from the beginning
 *
 * @see https://msdn.microsoft.com/de-de/library/bb503062(v=vs.110).aspx
 * @param  {Number} count = 0 number of elements to be returned
 * @return {Array}
 */
function Take (count = 0) {
  __assert(isNumeric(count), 'First parameter must be numeric!')

  if (count <= 0) {
    return []
  }

  let result = []

  for (let val of this) {
    result.push(val)

    if (result.length === count) {
      break
    }
  }

  this.reset()

  return result
}

/**
 * Skip - Skips count elements of the sequence and returns the remaining ones
 *
 * @see https://msdn.microsoft.com/de-de/library/bb358985(v=vs.110).aspx
 * @param  {Nu,ber count = 0 amount of elements to skip
 * @return {Array}
 */
function Skip (count = 0) {
  __assert(isNumeric(count), 'First parameter must be numeric!')

  if (count <= 0) {
    return this
  }

  const result = this.SkipWhile((elem, index) => index < count)

  this.reset()

  return result
}

/**
 * TakeWhile - Takes elements from the beginning of a sequence until the predicate yields false for an element
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.takewhile(v=vs.110).aspx
 * @param  {Function} predicate     the predicate of the form elem => boolean or (elem, index) => boolean
 * @return {Array}
 */
function TakeWhile (predicate = (elem, index) => true) {
  __assertFunction(predicate)

  const _self = this

  const result = new Collection(function * () {
    let index = 0
    let endTake = false

    for (let val of _self) {
      if (!endTake && predicate(val, index++)) {
        yield val
        continue
      }

      endTake = true
    }
  }).ToArray()

  this.reset()

  return result
}

/**
 * SkipWhile - Skips elements in the array until the predicate yields false and returns the remaining elements
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.skipwhile(v=vs.110).aspx
 * @param  {type} predicate         the predicate of the form elem => boolean or (elem, index) => boolean
 * @return {Array}
 */
function SkipWhile (predicate = (elem, index) => true) {
  __assertFunction(predicate)

  const _self = this

  const result = new Collection(function * () {
    let index = 0
    let endSkip = false

    for (let val of _self) {
      if (!endSkip && predicate(val, index++)) {
        continue
      }

      endSkip = true
      yield val
    }
  })

  this.reset()

  return result
}

function First (predicate = x => true) {
  __assertFunction(predicate)
  __assertNotEmpty(this)

  const result = this.SkipWhile(elem => !predicate(elem)).Take(1)
  this.reset()

  return result[0]
}

function resultOrDefault(collection, originalFn, predicateOrConstructor = x => true, constructor = Object) {
  //__assertArray(arr)

  let predicate

  if (isNative(predicateOrConstructor)) {
    predicate = x => true
    constructor = predicateOrConstructor
  } else {
    predicate = predicateOrConstructor
  }

  __assertFunction(predicate)
  __assert(isNative(constructor), 'constructor must be native constructor, e.g. Number!')

  const defaultVal = getDefault(constructor)

  if (isEmpty(collection)) {
    return defaultVal
  }

  let result = originalFn.call(collection, predicate)

  if (result) {
    return result
  }

  return defaultVal
}

function FirstOrDefault (predicateOrConstructor = x => true, constructor = Object) {
  return resultOrDefault(this, First, predicateOrConstructor, constructor)
}

function Last (predicate = x => true) {
  //__assertFunction(predicate)
  //__assertNotEmpty(this)

  return new Collection(this.ToArray().reverse()).First(predicate)
}

function LastOrDefault (predicateOrConstructor = x => true, constructor = Object) {
  return resultOrDefault(this, Last, predicateOrConstructor, constructor)
}

function Single (predicate = x => true) {
  __assertFunction(predicate)
  __assertNotEmpty(this)

  let index = 0
  let result

  for (let val of this) {
    if (predicate(val)) {
      result = val
      break
    }

    index++
  }

  this.reset()

  if (this.First(elem => predicate(elem) && !defaultEqualityCompareFn(elem, result))) {
    throw new Error('Sequence contains more than one element')
  }

  return result
}

function SingleOrDefault (predicateOrConstructor = x => true, constructor = Object) {
  return resultOrDefault(this, Single, predicateOrConstructor, constructor)
}

/**
 * DefaultIfEmpty - Returns the array or a new array containing the provided constructors default if empty
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.defaultifempty(v=vs.110).aspx
 * @param {Function} constructor A native constructor to get the default for, e.g. Number
 * @return {Array}
 *//**
 * DefaultIfEmpty - Returns the array or a new array containing the provided default value if empty
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.defaultifempty(v=vs.110).aspx
 * @param {any} value The default vlaue
 * @return {Array}
 */
function DefaultIfEmpty (constructorOrValue) {
  if (!isEmpty(this)) {
    return this
  }

  return [getDefault(constructorOrValue)]
}

__export({ ElementAt, Take, TakeWhile, Skip, SkipWhile, Contains, First, FirstOrDefault, Last, LastOrDefault, Single, SingleOrDefault, DefaultIfEmpty })
