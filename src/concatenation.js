/**
 * Concat - Concatenates two sequences
 *
 * @see https://msdn.microsoft.com/de-de/library/bb302894(v=vs.110).aspx
 * @method
 * @instance
 * @memberof Collection
 * @example
[1, 2, 3].Concat([4, 5, 6]).ToArray()
// -> [1, 2, 3, 4, 5, 6]
 * @param  {iterable} inner               The inner sequence to concat with the outer one
 * @return {Collection}                      A new collection of the resulting pairs
 */
function Concat (inner) {
  __assertIterable(inner)

  const outer = this

  return new Collection(function * () {
    yield* outer.getIterator()
    yield* inner
  })
}

/**
* Union - Concatenates two sequences and removes duplicate values (produces the set union).
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.union(v=vs.110).aspx
* @method
* @memberof Collection
* @instance
* @example
[1, 2, 3].Union([1, 4, 5, 6]).ToArray()
// -> [1, 2, 3, 4, 5, 6]
 * @param {iterable} inner The sequence to create the set union with
 * @return {Collction}
 *//**
 * Union - Concatenates two sequences and removes duplicate values (produces the set union).
 * A custom equality comparator is used to compare values for equality.
 *
 * @method
 * @memberof Collection
 * @instance
 * @param {Function} equalityCompareFn A function of the form (first, second) => Boolean to determine whether or not two values are considered equal
 * @return {Number}
 */
function Union (inner, equalityCompareFn = defaultEqualityCompareFn) {
  __assertIterable(inner)

  return this.Concat(inner).Distinct(equalityCompareFn)
}

/**
 * Join - Correlates the elements of two sequences based on matching keys
 *
 * @see https://msdn.microsoft.com/de-de/library/bb534675(v=vs.110).aspx
 * @instance
 * @memberof Collection
 * @method
 * @param  {iterable} inner               The inner sequence to join with the outer one
 * @param  {Function} outerKeySelector     A selector fn to extract the key from the outer sequence
 * @param  {Function} innerKeySelector    A selector fn to extract the key from the inner sequence
 * @param  {Function} resultSelectorFn     A fn to transform the pairings into the result
 * @param  {Function} keyEqualityCompareFn Optional fn to compare the keys
 * @return {Collection}                      A new collection of the resulting pairs
 */
function Join (inner, outerKeySelector, innerKeySelector, resultSelectorFn, keyEqualityCompareFn) {
  __assertIterable(inner)
  __assertFunction(outerKeySelector)
  __assertFunction(innerKeySelector)
  __assertFunction(resultSelectorFn)
  keyEqualityCompareFn = paramOrValue(keyEqualityCompareFn, defaultEqualityCompareFn)
  __assertFunction(keyEqualityCompareFn)

  const outer = this

  return new Collection(function * () {
    for (let outerValue of outer.getIterator()) {
      const outerKey = outerKeySelector(outerValue)

      for (let innerValue of inner[Symbol.iterator]()) {
        const innerKey = innerKeySelector(innerValue)

        if (keyEqualityCompareFn(outerKey, innerKey)) {
          yield resultSelectorFn(outerValue, innerValue)
        }
      }
    }
  })
}

/**
 * Except - Returns the element of the sequence that do not appear in inner
 *
 * @see https://msdn.microsoft.com/de-de/library/bb300779(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @example
const people = [
  'Sven', 'Julia', 'Tobi', 'Sarah', 'George', 'Jorge', 'Jon'
]
const peopleIHate = ['George', 'Jorge']
const peopleILike = people.Except(peopleIHate)
peopleILike.ToArray()
// -> ['Sven', 'Julia', 'Tobi', 'Sarah', 'Jon']
 * @param  {Iterable} inner The second sequence to get exceptions from
 * @return {Collection} new Collection with the values of outer without the ones in inner
 */
function Except (inner) {
  __assertIterable(inner)

  if (!isCollection(inner)) {
    inner = new Collection(inner)
  }

  const outer = this

  return new Collection(function * () {
    for (let val of outer.getIterator()) {
      if (!inner.Contains(val)) {
        yield val
      }
    }
  })
}

/**
 * Zip - Applies a function to the elements of two sequences, producing a sequence of the results
 *
 * @see https://msdn.microsoft.com/de-de/library/dd267698(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @example
const numbers = [ 1, 2, 3, 4 ]
const words = [ "one", "two", "three" ]

const numbersAndWords = numbers.Zip(words, (outer, inner) => outer + " " + inner)
numbersAndWords.ForEach(x => console.log(x))
// Outputs:
// "1 one"
// "2 two"
// "3 three"
 * @param  {Iterable} inner
 * @param  {type} resultSelectorFn A function of the form (outerValue, innerValue) => any to produce the output sequence
 * @return {Collection}
 */
function Zip (inner, resultSelectorFn) {
  __assertIterable(inner)
  __assertFunction(resultSelectorFn)

  const outer = this

  return new Collection(function * () {
    const innerIter = inner[Symbol.iterator]()

    for (let outerVal of outer.getIterator()) {
      const innerNext = innerIter.next()

      if (innerNext.done) {
        break
      }

      yield resultSelectorFn(outerVal, innerNext.value)
    }
  })
}

/**
* Intersect - Produces the set intersection of two sequences. The default equality comparator is used to compare values.
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.sequenceequal(v=vs.110).aspx
* @method
* @memberof Collection
* @instance
* @example
[44, 26, 92, 30, 71, 38].Intersect([39, 59, 83, 47, 26, 4, 30]).ToArray()
// -> [26, 30]
* @param  {Iterable} inner The sequence to get the intersection from
* @return {Collection}
 *//**
 * Intersect - Produces the set intersection of two sequences. A provided equality comparator is used to compare values.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.sequenceequal(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @param  {Iterable} inner The sequence to get the intersection from
 * @param {Function} equalityCompareFn A function of the form (outer, inner) => boolean to compare the values
 * @return {Collection}
 */
 function Intersect (inner, equalityCompareFn = defaultEqualityCompareFn) {
  __assertIterable(inner)
  __assertFunction(equalityCompareFn)

  const outerIter = this.ToArray()

  return new Collection(function * () {
    const innerIter = [...inner]

    for (let val of outerIter) {
      if (innerIter.Any(elem => equalityCompareFn(val, elem))) {
        yield val
      }
    }
  })
}


__export({ Concat, Union, Join, Except, Zip, Intersect })
