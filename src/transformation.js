/**
 * Aggregate - applies a accumulator function to a sequence
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
 * @param {Function} accumulator The accumulator function of the form (prev, current) => any
 * @return {any} the result of the accumulation
 *//**
 * Aggregate - applies a accumulator function to a sequence. Starts with seed.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
 * @param {any} seed The starting value of the accumulation
 * @param {Function} accumulator The accumulator function of the form (prev, current) => any
 * @return {any} the result of the accumulation
 *//**
 * Aggregate - applies a accumulator function to a sequence. Starts with seed and transforms the result using resultTransformFn.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
 * @param {any} seed The starting value of the accumulation
 * @param {Function} accumulator The accumulator function of the form (prev, current) => any
 * @param {Function} resultTransformFn A function to transform the result
 * @return {any} the result of the accumulation
 * @
 */
function Aggregate (seedOrAccumulator, accumulator, resultTransformFn) {
  if (typeof seedOrAccumulator === 'function' && !accumulator && !resultTransformFn) {
    return aggregateArray(this.slice(1, this.length), this[0], seedOrAccumulator, elem => elem)
  } else if (typeof seedOrAccumulator !== 'function' && typeof accumulator === 'function' && !resultTransformFn) {
    return aggregateArray(this, seedOrAccumulator, accumulator, elem => elem)
  } else {
    return aggregateArray(this, seedOrAccumulator, accumulator, resultTransformFn)
  }
}

__export({ Aggregate })
