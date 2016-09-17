function Contains (elem) {
  return !!~this.indexOf(elem)
}

function Take (count = 0) {
  __assert(isNumeric(count))

  if (count <= 0) {
    return []
  }

  return this.slice(0, count)
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

__export({ Take, Contains, First, FirstOrDefault, Last, LastOrDefault, Single, SingleOrDefault })
