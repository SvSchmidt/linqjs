/**
* IndexOf - Returns the index of the first occurence of the given element in the sequence or -1 if it was not found.
*
* @method
* @memberof Collection
* @instance
* @example
[1, 2, 3].IndexOf(2)
// -> 1
[1, 2, 3].IndexOf(4)
// -> -1
 * @return {Number}
 *//**
 * IndexOf - Returns the index of the first occurence of the given element in the sequence or -1 if it was not found.
 * A provided equality compare function is used to specify equality.
 *
 * @method
 * @memberof Collection
 * @instance
 * @param {Function} equalityCompareFn A function of the form (first, second) => Boolean to determine whether or not two values are considered equal
 * @return {Number}
 */
function IndexOf(element, equalityCompareFn = defaultEqualityCompareFn) {
  __assertFunction(equalityCompareFn)

  let i = 0

  for (let val of this.getIterator()) {
    if (equalityCompareFn(val, element)) {
      return i
    }

    i++
  }

  return -1
}

/**
* LastIndexOf - Returns the index of the last occurence of the given element in the sequence or -1 if it was not found.
*
* @method
* @memberof Collection
* @instance
* @example
[1, 2, 3, 1, 4, 7, 1].LastIndexOf(1)
// -> 6
[1, 2, 3].LastIndexOf(4)
// -> -1
 * @return {Number}
 *//**
 * IndexOf - Returns the index of the last occurence of the given element in the sequence or -1 if it was not found.
 * A provided equality compare function is used to specify equality.
 *
 * @method
 * @memberof Collection
 * @instance
 * @param {Function} equalityCompareFn A function of the form (first, second) => Boolean to determine whether or not two values are considered equal
 * @return {Number}
 */
function LastIndexOf(element, equalityCompareFn = defaultEqualityCompareFn) {
  __assertFunction(equalityCompareFn)

  let i = 0
  let lastIndex = -1

  for (let val of  this.getIterator()) {
    if (equalityCompareFn(val, element)) {
      lastIndex = i
    }

    i++
  }

  return lastIndex
}

/**
* Contains - Returns true if the sequence contains the specified element, false if not.
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.contains(v=vs.110).aspx
* @method
* @memberof Collection
* @instance
* @example
[1, 2, 3].Contains(2)
// -> true
[1, 2, 3].Contains(4)
// -> false
 * @param {any} elem The element to check
 * @return {Boolean}
 *//**
 * Contains - Returns true if the sequence contains the specified element, false if not.
 * A provided equality compare function is used to specify equality.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.contains(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @param {any} elem The element to check
 * @param {Function} equalityCompareFn A function of the form (first, second) => Boolean to determine whether or not two values are considered equal
 * @return {Boolean}
 */
function Contains (elem, equalityCompareFn = defaultEqualityCompareFn) {
  return !!~this.IndexOf(elem, equalityCompareFn)
}

/**
* Where - Filters a sequence based on a predicate function
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.where(v=vs.110).aspx
* @method
* @memberof Collection
* @instance
* @variation (elem => boolean)
* @param  {Function} predicate A function of the form elem => boolean to filter the sequence
* @return {Collection} The filtered collection
*//**
* Where - Filters a sequence based on a predicate function. The index of the element is used in the predicate function.
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.where(v=vs.110).aspx
* @method
* @memberof Collection
* @instance
* @variation ((elem, index) => boolean)
* @param  {Function} predicate A function of the form (elem, index) => boolean to filter the sequence
* @return {Collection} The filtered collection
*/
function Where (predicate = (elem, index) => true) {
  __assertFunction(predicate)

  const self = this

  const result = new Collection(function * () {
    let index = 0

    for (let val of self.getIterator()) {
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
* @variation (condition, elem => bool)
* @param {Boolean} condition A condition to get checked before filtering the sequence
* @param  {Function} predicate A function of the form elem => boolean to filter the sequence
* @return {Collection} The filtered collection or the original sequence if condition was falsy
*//**
* ConditionalWhere - Filters a sequence based on a predicate function if the condition is true. The index of the element is used in the predicate function.
*
* @method
* @memberof Collection
* @instance
* @variation (condition, (elem, index) => bool)
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
 * Count - Returns the length of the sequence
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.count(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @example
[1, 2, 3, 4, 5].Count()
// -> 5
 * @return {Number}
 *//**
 * Count - Returns the number of elements in the sequence matching the predicate
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.count(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @example
[1, 2, 3, 4, 5].Count(x => x > 2)
// -> 3
 * @param  {Function} predicate The predicate of the form elem => boolean
 * @return {Number}
 */
function Count (predicate = elem => true) {
  let count = 0
  let filtered = this.Where(predicate)

  while (!filtered.next().done) {
    count++
  }

  return count
}

 /**
  * Any - Returns true if the sequence contains at least one element, false if it is empty
  *
  * @see https://msdn.microsoft.com/de-de/library/bb337697(v=vs.110).aspx
  * @method
  * @memberof Collection
  * @instance
  * @example
[1, 2, 3].Any()
// -> true
  * @return {Boolean}
  *//**
  * Any - Returns true if at least one element of the sequence matches the predicate or false if no element matches
  *
  * @see https://msdn.microsoft.com/de-de/library/bb337697(v=vs.110).aspx
  * @method
  * @variation (predicate)
  * @memberof Collection
  * @instance
  * @example
[1, 2, 3].Any(x => x > 1)
// -> true
[1, 2, 3].Any(x => x > 5)
// -> false
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

  return !this.Where(predicate).next().done
}

/**
 * All - Returns true if all elements in the sequence match the predicate
 *
 * @see https://msdn.microsoft.com/de-de/library/bb548541(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @example
[1, 2, 3, 4, 5, 6].All(x => x > 3)
// -> false
[2, 4, 6, 8, 10, 12].All(x => x % 2 === 0)
// -> true
 * @param  {Function} predicate
 * @return {Boolean}
 */
function All (predicate = elem => true) {
  __assertFunction(predicate)

  // All is equal to the question if there's no element which does not match the predicate
  // 'all fruits are yellow' -> 'there is no fruit which is not yellow'
  return !this.Any(x => !predicate(x))
}

__export({ Where, ConditionalWhere, Count, Contains, IndexOf, LastIndexOf, Any, All })
