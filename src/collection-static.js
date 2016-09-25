function from (iterable) {
  return new Collection(iterable)
}

function Range (start, count) {
  __assertNumberBetween(count, 0, Infinity)

  return new Collection(function * () {
    let i = start
    while (i != count + start) {
      yield i++
    }
  })
}

const collectionStatics = { from, Range }

__assign(Collection, collectionStatics)
