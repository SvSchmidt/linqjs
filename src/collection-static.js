/**
 * Same as new Collection()
 * @function from
 * @memberof Collection
 * @static
 * @return {Collection}
 */
function from (iterable) {
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

Object.defineProperty(Collection, 'Empty', {
  get: function () { return Collection.from([]) }
})

const collectionStaticMethods = { from, From: from, Range }

__assign(Collection, collectionStaticMethods)
