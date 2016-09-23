function Contains (elem) {
  for (let val of this) {
    if (defaultEqualityCompareFn(elem, val)) {
      return true
    }
  }

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
  //__assert(isNumeric(index), 'Index must be numeric!')

  return this.SkipWhile((elem, i) => i < index).Take(1)[0]
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

  return this.SkipWhile((elem, index) => index < count)
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

  return new Collection(function * () {
    let index = 0

    for (let val of _self) {
      if (!predicate(val, index)) continue

      yield val
    }
  }()).ToArray()
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

  return new Collection(function * () {
    let index = 0

    for (let val of _self) {
      if (predicate(val, index++)) continue

      yield val
    }
  }())
}

function First (predicate = x => true) {
  //__assertFunction(predicate)
  //__assertNotEmpty(this)

  const result = this.SkipWhile(elem => !predicate(elem)).Take(1)
  this.reset()

  if (result[0]) {
    return result[0]
  }

  return null;
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

  let result = originalFn.call(collection, predicate)

  if (result) {
    return result
  }

  return getDefault(constructor)
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
  //__assertFunction(predicate)
  //__assertNotEmpty(this)

  let index = 0
  let result

  for (let val of this) {
    if (index++ && predicate(val)) {
      result = val
      break
    }
  }

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
