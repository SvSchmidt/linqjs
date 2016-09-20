/**
 * Add - Adds an element to the end of the array
 *
 * @see https://msdn.microsoft.com/de-de/library/3wcytfd1(v=vs.110).aspx
 * @param  {any}         value The value to add
 * @return {void}
 */
function Add (value) {
  return insertIntoArray(this, value)
}

/**
 * Insert - Adds an element to the specified index of the array
 *
 * @see https://msdn.microsoft.com/de-de/library/sey5k5z4(v=vs.110).aspx
 * @param  {any}         value The value to add
 * @param  {Number}      index The index to add the value to
 * @return {void}
 */
function Insert (value, index) {
  return insertIntoArray(this, value, index)
}

/**
 * Remove - Removes an element from an array
 *
 * @param  {any} value The value to remove
 * @return {Boolean}       True if the element was removed, false if not (or the element was not found)
 */
function Remove (value) {
  return removeFromArray(this, value)
}

__export({ Add, Insert, Remove })
