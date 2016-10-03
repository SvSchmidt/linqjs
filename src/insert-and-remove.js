/**
 * Add - Adds an element to the end of the sequence
 *
 * @see https://msdn.microsoft.com/de-de/library/3wcytfd1(v=vs.110).aspx
 * @instance
 * @method
 * @memberof Collection
 * @param  {any} value The value to add to the sequence
 * @return {void}
 */
function Add (value) {
  this.Insert(value, this.Count())
}

/**
 * Insert - Inserts an element to the specified index of the sequence
 *
 * @see https://msdn.microsoft.com/de-de/library/sey5k5z4(v=vs.110).aspx
 * @instance
 * @method
 * @memberof Collection
 * @example
let coll = Collection.from([1, 2, 3])
coll.Contains(4) // -> false
coll.Insert(4, 0)
coll.Contains(4) // -> true
coll.ToArray() // [4, 1, 2, 3]
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
}

/**
 * Remove - Removes an element from the sequence
 *
 * @instance
 * @method
 * @memberof Collection
 * @param  {any} value The value to remove
 * @return {Boolean} True if the element was removed, false if not (or the element was not found)
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

  return true
}

__export({ Add, Insert, Remove })
