function Contains (elem) {
  let result = false

  for (let val of this) {
    if (defaultEqualityCompareFn(elem, val)) {
      result = true
      break
    }
  }

  this.reset()

  return result
}

 /**
 * Where - Filters a sequence based on a predicate function
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.where(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @param  {Function} predicate A function of the form elem => boolean to filter the sequence
 * @return {Collection} The filtered collection
  *//**
  * Where - Filters a sequence based on a predicate function. The index of the element is used in the predicate function.
  *
  * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.where(v=vs.110).aspx
  * @method
  * @memberof Collection
  * @instance
  * @param  {Function} predicate A function of the form (elem, index) => boolean to filter the sequence
  * @return {Collection} The filtered collection
  */
function Where (predicate = (elem, index) => true) {
  __assertFunction(predicate)

  const iter = this.getIterator()

  const result = new Collection(function * () {
    let index = 0

    for (let val of iter) {
      if (predicate(val, index)) {
        yield val
      }

      index++
    }
  })

  return result
}

/**
* ConditionalWhere - Filters a sequence based on a predicate function if the condition is true.
*
* @method
* @memberof Collection
* @instance
* @param {Boolean} condition A condition to get checked before filtering the sequence
* @param  {Function} predicate A function of the form elem => boolean to filter the sequence
* @return {Collection} The filtered collection or the original sequence if condition was falsy
 *//**
 * ConditionalWhere - Filters a sequence based on a predicate function if the condition is true. The index of the element is used in the predicate function.
 *
 * @method
 * @memberof Collection
 * @instance
 * @param {Boolean} condition A condition to get checked before filtering the sequence
 * @param  {Function} predicate A function of the form (elem, index) => boolean to filter the sequence
 * @return {Collection} The filtered collection or the original sequence if condition was falsy
 */
function ConditionalWhere(condition, predicate) {
  if (condition) {
    return this.Where(predicate)
  } else {
    return this
  }
}

/**
 * Count - Returns the amount of elements matching a predicate or the array length if no parameters given
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.count(v=vs.110).aspx
 * @param  {Function} predicate
 * @return {Number}
 */
function Count (predicate = elem => true) {
  let count = 0;
  let filtered = this.Where(predicate);
  while (!filtered.next().done) {
    count++;
  }
  return count;
}

 /**
  * Any - Returns true if the sequence contains at least one element, false if it is empty
  *
  * @see https://msdn.microsoft.com/de-de/library/bb337697(v=vs.110).aspx
  * @return {Boolean}
  *//**
  * Any - Returns true if at least one element of the sequence matches the predicate or false if no element matches
  *
  * @see https://msdn.microsoft.com/de-de/library/bb337697(v=vs.110).aspx
  * @param  {Function} predicate A predicate function to test elements against: elem => boolean
  * @return {Boolean}
  */
function Any (predicate) {
  if (isEmpty(this)) {
    return false
  }

  if (!predicate) {
    // since we checked before that the sequence is not empty
    return true
  }

  return !this.Where(predicate).next().done;
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

__export({ Where, ConditionalWhere, Count, Any, All })
