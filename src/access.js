function Contains (elem) {
  return !!~this.indexOf(elem)
}

function First (predicate = x => true) {
  __assertFunction(predicate)

  let result = filterArray(this, predicate, 1)

  if (result[0]) {
    return result[0]
  }

  return null;
}

function Last (predicate = x => true) {
  __assertFunction(predicate)

  return this.reverse().First(predicate)
}

function Single (predicate = x => true) {
  __assertFunction(predicate)

  let result = filterArray(this, predicate)

  if (result.length === 1) {
    return result[0]
  }

  throw new Error('Sequence contains more than one element')
}

__export({ Contains, First, Last, Single })
