/**
* SequenceEqual - Compares two sequences for equality. Returns true if they have equal length and the equality compare function
* returns true for each element in the sequence in correct order. The default equality comparator is used.
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.sequenceequal(v=vs.110).aspx
* @method
* @memberof Collection
* @instance
* @param  {Iterable} second The sequence to compare with
* @return {Boolean}
 *//**
 * SequenceEqual - Compares two sequences for equality. Returns true if they have equal length and the equality compare function
 * returns true for each element in the sequence in correct order. A custom comparator function is provided.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.sequenceequal(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @param  {Iterable} second The sequence to compare with
 * @param {Function} equalityCompareFn A function of the form (first, second) => boolean to compare the values
 * @return {Boolean}
 */
function SequenceEqual (second, equalityCompareFn = defaultEqualityCompareFn) {
  if (!isIterable(second)) {
    return false
  }

  const first = this.ToArray()
  second = second.ToArray()

  if (first.length !== second.length) {
    return false
  }

  for (let i = 0; i < first.length; i++) {
    let firstVal = first[i]
    let secondVal = second[i]

    if (!equalityCompareFn(firstVal, secondVal)) {
      return false
    }
  }

  return true
}

__export({ SequenceEqual })
