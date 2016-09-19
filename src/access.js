function Contains (elem) {
  return !!~this.indexOf(elem)
}

/**
 * ElementAt - Returns the element at the given index
 *
 * @see https://msdn.microsoft.com/de-de/library/bb299233(v=vs.110).aspx
 * @param  {Number} index
 * @return {any}
 */
function ElementAt (index) {
  __assert(index < this.length && index >= 0, 'Array index is out of bounds!')
  __assert(isNumeric(index), 'Index must be numeric!')

  return this[index]
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

  return this.slice(0, count)
}

/**
 * findFirstNonMatchingIndex - Returns the first index of the array which does not match the predicate
 *
 * @param  {Array} arr
 * @param  {Function} predicate
 * @return {Number}
 */
function findFirstNonMatchingIndex (arr, predicate) {
  __assertArray(arr)

  const length = arr.length

  for (let i = 0; i < length; i++) {
    if (!predicate(arr[i], i)) {
      return i
    }
  }

  return arr.length - 1
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

  return this.slice(count, this.length)
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

  return this.Take(findFirstNonMatchingIndex(this, predicate))
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

  return this.Skip(findFirstNonMatchingIndex(this, predicate))
}

function First (predicate = x => true) {
  __assertFunction(predicate)
  __assertNotEmpty(this)

  let result = filterArray(this, predicate, 1)

  if (result[0]) {
    return result[0]
  }

  return null;
}

function resultOrDefault(arr, originalFn, predicateOrConstructor = x => true, constructor = Object) {
  __assertArray(arr)

  let predicate

  if (isNative(predicateOrConstructor)) {
    predicate = x => true
    constructor = predicateOrConstructor
  } else {
    predicate = predicateOrConstructor
  }

  __assertFunction(predicate)
  __assert(isNative(constructor), 'constructor must be native constructor, e.g. Number!')

  if (!isEmpty(arr)) {
    let result = originalFn.call(arr, predicate)

    if (result) {
      return result;
    }
  }

  return getDefault(constructor)
}

function FirstOrDefault (predicateOrConstructor = x => true, constructor = Object) {
  return resultOrDefault(this, First, predicateOrConstructor, constructor)
}

function Last (predicate = x => true) {
  __assertFunction(predicate)
  __assertNotEmpty(this)

  return this.reverse().First(predicate)
}

function LastOrDefault (predicateOrConstructor = x => true, constructor = Object) {
  return resultOrDefault(this, Last, predicateOrConstructor, constructor)
}

function Single (predicate = x => true) {
  __assertFunction(predicate)
  __assertNotEmpty(this)

  let result = filterArray(this, predicate)

  if (result.length === 1) {
    return result[0]
  }

  throw new Error('Sequence contains more than one element')
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
