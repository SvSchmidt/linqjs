function Contains (elem) {
  return !!~this.indexOf(elem)
}


/**
 * Take - Returns count elements of the sequence starting from the beginning
 *
 * @see https://msdn.microsoft.com/de-de/library/bb503062(v=vs.110).aspx
 * @param  {Number} count = 0 number of elements to be returned
 * @return {Array}
 */
function Take (count = 0) {
  __assert(isNumeric(count))

  if (count <= 0) {
    return []
  }

  return this.slice(0, count)
}

/**
 * TakeWhile - Takes elements from the beginning of a sequence until the predicate returns false for an element
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.takewhile(v=vs.110).aspx
 * @param  {Function} predicate     the predicate with (elem) => boolean or (elem, index) => boolean
 * @return {Array}
 */
function TakeWhile (predicate = (elem, index) => true) {
  __assertFunction(predicate)

  let result = []
  const length = this.length

  for (let i = 0; i < length; i++) {
    if (predicate(this[i], i)) {
      result.push(this[i])
    } else {
      break
    }
  }

  return result
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

__export({ Take, TakeWhile, Contains, First, FirstOrDefault, Last, LastOrDefault, Single, SingleOrDefault })
