function Where (predicate = (elem, index) => true) {
  __assertFunction(predicate)

  return filterArray(this, predicate)
}

/**
 * Count - Returns the amount of elements matching a predicate or the array length if no parameters given
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.count(v=vs.110).aspx
 * @param  {Function} predicate
 * @return {Number}
 */
function Count (predicate = elem => true) {
  __assertFunction(predicate)

  return filterArray(this, predicate).length
}

/**
 * Any - Returns true if at least one element matches the predicate or if no predicate is given but the sequence contains at least one element
 *
 * @see https://msdn.microsoft.com/de-de/library/bb337697(v=vs.110).aspx
 * @param  {Function} predicate
 * @return {Boolean}
 */
function Any (predicate) {
  if (!predicate) {
    return this.length > 0
  }

  __assertFunction(predicate)
  return filterArray(this, predicate, 1).length > 0
}

/**
 * All - Returns true if all elements match the predicate
 *
 * @see https://msdn.microsoft.com/de-de/library/bb548541(v=vs.110).aspx
 * @param  {Function} predicate
 * @return {Boolean}
 */
function All (predicate = elem => true) {
  __assertFunction(predicate)

  // All is equal to the question if there's no element which does not match the predicate
  // 'all fruits are yellow' -> 'there is no fruit which is not yellow'
  return !this.Any(x => !predicate(x))
}

__export({ Where, Count, Any, All })
