/**
 * Add - Adds an element to the end of the array
 *
 * @see https://msdn.microsoft.com/de-de/library/3wcytfd1(v=vs.110).aspx
 * @param  {any}         value The value to add
 * @return {void}
 */
function Add (value) {
  this.Insert(value, this.Count())
}

/**
 * Insert - Adds an element to the specified index of the collection
 *
 * @see https://msdn.microsoft.com/de-de/library/sey5k5z4(v=vs.110).aspx
 * @param  {any}         value The value to add
 * @param  {Number}      index The index to add the value to
 * @return {void}
 */
function Insert (value, index) {
  __assert(index >= 0 && index <= this.Count(), 'Index is out of bounds!')

  const oldIter = this.ToArray()

  this.iterable = function * () {
    yield* oldIter.slice(0, index)
    yield value
    yield* oldIter.slice(index, oldIter.length)
  }
  this.reset()
}

/**
 * Remove - Removes an element from an array
 *
 * @param  {any} value The value to remove
 * @return {Boolean}       True if the element was removed, false if not (or the element was not found)
 */
function Remove (value) {
  let values = this.ToArray()
  const result = removeFromArray(values, value)

  if (!result) {
    return false
  }

  this.iterable = function * () {
    yield* values
  }
  this.reset()

  return true
}

__export({ Add, Insert, Remove })
