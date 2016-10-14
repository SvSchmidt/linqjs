/**
* Min - Returns the minimum of the numbers contained in the sequence. Transforms the values using a map function before.
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.min(v=vs.110).aspx
* @method
* @memberof Collection
* @instance
* @throws Throws an error if the sequence is empty
* @example
[1, 2, 3].Min()
// -> 1
 * @return {Number}
 *//**
 * Min - Returns the minimum of the numbers contained in the sequence
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.min(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @throws Throws an error if the sequence is empty
 * @param {Function} mapFn A function to use to transform each value before getting the minimum
 * @example
[2, 3, 5].Min(x => x * 2)
// -> 4
  * @return {Number}
 */
function Min (mapFn = x => x) {
  __assertFunction(mapFn)
  __assertNotEmpty(this)

  return Math.min.apply(null, this.Select(mapFn).ToArray())
}

/**
* Max - Returns the maximum of the numbers contained in the sequence
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.max(v=vs.110).aspx
* @method
* @memberof Collection
* @instance
* @throws Throws an error if the sequence is empty
* @example
[1, 2, 3].Max()
// -> 3
 * @return {Number}
 *//**
 * Max - Returns the max of the numbers contained in the sequence. Transforms the values using a map function before.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.max(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @throws Throws an error if the sequence is empty
 * @param {Function} mapFn A function to use to transform each value before getting the maximum
 * @example
[2, 3, 5].Max(x => x * 2)
// -> 10
  * @return {Number}
 */
function Max (mapFn = x => x) {
  __assertFunction(mapFn)
  __assertNotEmpty(this)

  return Math.max.apply(null, this.Select(mapFn).ToArray())
}

/**
* Sum - Returns the sum of the numbers contained in the sequence
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.sum(v=vs.110).aspx
* @method
* @memberof Collection
* @instance
* @throws Throws an error if the sequence is empty
* @example
[1, 2, 3].Sum()
// -> 6
 * @return {Number}
 *//**
 * Sum - Returns the sum of the numbers contained in the sequence. Transforms the values using a map function before.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.sum(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @throws Throws an error if the sequence is empty
 * @param {Function} mapFn A function to use to transform each value before calculating the sum
 * @example
[2, 3, 5].Sum(x => x * 2)
// -> 20
  * @return {Number}
 */
function Sum (mapFn = x => x) {
  __assertNotEmpty(this)

  return this.Select(mapFn).Aggregate(0, (prev, curr) => prev + curr)
}

/**
* Average - Returns the average of the numbers contained in the sequence
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.average(v=vs.110).aspx
* @method
* @memberof Collection
* @instance
* @throws Throws an error if the sequence is empty
* @example
[1, 2, 3].Average()
// -> 2
 * @return {Number}
 *//**
 * Average - Returns the average of the numbers contained in the sequence. Transforms the values using a map function before.
 *
 * @see hhttps://msdn.microsoft.com/de-de/library/system.linq.enumerable.average(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @throws Throws an error if the sequence is empty
 * @param {Function} mapFn A function to use to transform each value before calculating the average
 * @example
[2, 3, 5].Average(x => x * 2)
// -> 6.666666667
  * @return {Number}
 */
function Average (mapFn = x => x) {
  __assertNotEmpty(this)

  return this.Sum(mapFn) / this.Count()
}

__export({ Min, Max, Average, Sum })
