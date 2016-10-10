/**
 * Same as new Collection()
 * @function Collection.From
 * @memberof Collection
 * @static
 * @return {Collection}
 */
function From (iterable) {
  return new Collection(iterable)
}

/**
 * Creates a sequence of count values starting with start including
 * @function Range
 * @memberof Collection
 * @static
 * @param  {Number} start The value to start with, e.g. 1
 * @param  {Number} count The amount of numbers to generate from start
 * @return {Collection}       A new collection with the number range
 */
function Range (start, count) {
  __assertNumberBetween(count, 0, Infinity)

  return new Collection(function * () {
    let i = start
    while (i != count + start) {
      yield i++
    }
  })
}

/**
 * Repeat - Generates a sequence that consists of count times val
 *
 * @see https://msdn.microsoft.com/de-de/library/bb348899(v=vs.110).aspx
 * @static
 * @memberof Collection
 * @method
 * @example
Collection.Repeat('na', 10).ToArray().join(' ') + ' BATMAN!'
// -> 'na na na na na na na na na na BATMAN!'
 * @param  {any} val The value to repeat
 * @param  {Number} count
 * @return {Collection}
 */
function Repeat (val, count) {
  __assertNumberBetween(count, 0, Infinity)

  return new Collection(function * () {
    for (let i = 0; i < count; i++) {
      yield val
    }
  })
}

/**
 * Represents a empty Collection, e.g. Collection.Empty.ToArray() -> []
 *
 * @name Collection.Empty
 * @static
 */
Object.defineProperty(Collection, 'Empty', {
  get: function () { return Collection.from([]) }
})

const staticMethods = { From, from: From, Range, Repeat }

__assign(Collection, staticMethods)
