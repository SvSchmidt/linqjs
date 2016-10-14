/*!
 * linqjs v0.0.0
 * (c) Sven Schmidt 
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
(function () {
  'use strict';

  // this || (0, eval)('this') is a robust way for getting a reference
  // to the global object
  const window = this || (0, eval)('this'); // jshint ignore:line
  const DEBUG = true;
(function (Collection) {
  try {
    if (typeof define === 'function' && define.amd) {
      // AMD asynchronous module definition (e.g. requirejs)
      define(['require', 'exports'], function () { return Collection })
    } else if (exports && module && module.exports) {
      // CommonJS/Node.js where module.exports is for nodejs
      exports = module.exports = Collection
    }
  } catch (err) {
    // no module loader (simple <script>-tag) -> assign Maybe directly to the global object
    window.Collection = Collection
  }
}(function () {
  // We will apply any public methods to linqjsExports and apply them to the Collection.prototype later
  let linqjsExports = {}


/* src/collection.js */

/**
 * Collection - Represents a collection of iterable values
 *
 * @class
 * @param  {Iterable|GeneratorFunction} iterableOrGenerator A iterable to create a collection of, e.g. an array or a generator function
 */
let Collection = (function () {
  function Collection (iterableOrGenerator) {
    __assert(isIterable(iterableOrGenerator) || isGenerator(iterableOrGenerator), 'Parameter must be iterable or generator!')

    this.iterable = iterableOrGenerator
  }

  Collection.prototype = (function () {
    function next (reset = false) {
      if (reset || !this.started) {
        this.started = true
        this.iterator = this.getIterator()
      }

      return this.iterator.next()
    }

    function reset () {
      this.started = false
    }

    function getIterator () {
      const iter = this.iterable

      if (isGenerator(iter)) {
        return iter()
      } else {
        return function * () {
          yield* iter
        }()
      }
    }

    return { next, reset, getIterator };
  }())

  Collection.prototype[Symbol.iterator] = function * () {
    let current

    while (true) {
      current = this.next()

      if (current.done) {
        this.reset()
        break
      }

      yield current.value
    }
  }

  return Collection
}())


/* src/collection-static.js */

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


/* src/helpers/defaults.js */

function defaultEqualityCompareFn (first, second) {
  return toJSON(first) === toJSON(second)
}

/**
 * Default comparator implementation that uses the "<" operator.
 * Retuns values as specified by the comparator function fir Array.sort().
 *
 * @param  {T}  a   Element "a" to be compared.
 * @param  {T}  b   Element "b" to be compared.
 * @param {any} <T> Element type.
 *
 * @return {number} Returns -1 if "a" is smaller than "b",
 *                  returns  1 if "b" is smaller than "a",
 *                  returns  0 if they are equal.
 */
function defaultComparator (a, b) {
    if (a < b) {
        return -1;
    }
    if (b < a) {
        return 1;
    }
    return 0;
}




/* src/helpers/assert.js */

  class AssertionError extends Error {
    constructor (expected, got) {
      super(`Expected ${expected}, got ${got}!`)
    }
  }

  function __assert (condition, ...args) {
    if (!condition) {
      if (args.length === 1) {
        throw new Error(args[0]);
      } else if (args.length === 2) {
        throw new AssertionError(...args)
      }
    }
  }

  function __assertFunction (param) {
    __assert(isFunction(param), 'function', param)
  }

  function __assertArray (param) {
    __assert(isArray(param), 'array', param)
  }

  function __assertNotEmpty (self) {
    __assert(!isEmpty(self), 'Sequence is empty!')
  }

  function __assertIterable (obj) {
    __assert(isIterable(obj), 'iterable', obj)
  }

  function __assertCollection (obj) {
    __assert(isCollection(obj), 'collection', obj)
  }

  function __assertString (obj) {
    __assert(isString(obj), 'string', obj)
  }

  function __assertNumeric (obj) {
    __assert(isNumeric(obj), 'numeric value', obj)
  }

  function __assertNumberBetween (num, min, max = Infinity) {
    __assertNumeric(num)
    __assert(num >= min && num <= max, `Number must be between ${min} and ${max}!`)
  }

  function __assertIndexInRange (self, index) {
    __assertCollection(self)
    __assert(isNumeric(index), 'number', index)
    __assert(index >= 0 && index < self.Count(), 'Index is out of bounds')
  }


/* src/helpers/is.js */

  function isArray (obj) {
    return obj instanceof ([]).constructor;
  }

  function isFunction (obj) {
    return typeof obj === 'function'
  }

  function isNumeric (n) {
    return !isNaN(parseFloat(n))
  }

  function isEmpty (coll) {
    if (isCollection(coll)) {
      return coll.next(true).done
    }

    return coll.length === 0
  }

  function isIterable (obj) {
    return (Symbol.iterator in Object(obj))
  }

  function isString (obj) {
    return typeof obj === 'string';
  }

  function isCollection (obj) {
    return obj instanceof Collection
  }

  function isGenerator (obj) {
    return obj instanceof (function * () {}).constructor;
  }

  function isUndefined (obj) {
    return typeof obj === typeof undefined
  }


/* src/helpers/helpers.js */

  function toJSON (obj) {
    return JSON.stringify(obj)
  }

  function __assign (target, source) {
    Object.assign(Object(target), source)

    return target
  }

  function __export (obj) {
    __assign(linqjsExports, obj)
  }

  /**
   * paramOrValue - Helper method to get the passed parameter or a default value if it is undefined
   *
   * @param  {any} param The parameter to check
   * @param  {any} value Value to return when param is undefined
   * @return {any}
   */
  function paramOrValue(param, value) {
    return typeof param === 'undefined'
      ? value
      : param
  }

  function aggregateCollection (coll, seed, accumulator, resultTransformFn) {
    __assertFunction(accumulator)
    __assertFunction(resultTransformFn)
    __assertNotEmpty(coll)

    return resultTransformFn([seed].concat(coll).reduce(accumulator))
  }

  function removeDuplicates (coll, equalityCompareFn = defaultEqualityCompareFn) {
    __assertIterable(coll)
    __assertFunction(equalityCompareFn)

    const previous = []

    return new Collection(function * () {
      const iter = coll.getIterator()

      outer: for (let val of iter) {
        inner: for (let prev of previous) {
          if (equalityCompareFn(val, prev)) {
            continue outer;
          }
        }

        previous.push(val)

        yield val
      }
    })
  }

  function removeFromArray (arr, value) {
    __assertArray(arr)

    let elemsBefore = []
    let elemFound = false
    let current

    // remove all elements from the array (shift) and push them into a temporary variable until the desired element was found
    while ((current = arr.shift()) && !(elemFound = defaultEqualityCompareFn(current, value))) {
      elemsBefore.push(current)
    }

    // add the temporary values back to the array (to the front)
    // -> unshift modifies the original array instead of returning a new one
    arr.unshift(...elemsBefore)

    return elemFound
  }

  const nativeConstructors = [Object, Number, Boolean, String, Symbol]

  function isNative (obj) {
    return /native code/.test(Object(obj).toString()) || !!~nativeConstructors.indexOf(obj)
  }

  function getDefault (constructorOrValue = Object) {
    if (constructorOrValue && isNative(constructorOrValue) && typeof constructorOrValue === 'function') {
      let defaultValue = constructorOrValue()

      if (defaultValue instanceof Object || constructorOrValue === Date) {
        return null
      } else {
        return defaultValue
      }
    }

    return constructorOrValue
  }

  function getParameterCount (fn) {
    __assertFunction(fn)

    return fn.length
  }


/* src/math.js */

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




/* src/concatenation.js */

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





/* src/search.js */

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




/* src/access.js */

function resultOrDefault(self, originalFn, predicateOrDefault = x => true, fallback = Object) {
  let predicate

  if (isNative(predicateOrDefault) || !isFunction(predicateOrDefault)) {
    predicate = x => true
    fallback = predicateOrDefault
  } else {
    predicate = predicateOrDefault
  }

  __assertFunction(predicate)

  const defaultVal = getDefault(fallback)

  if (isEmpty(self)) {
    return defaultVal
  }

  let result = originalFn.call(self, predicate)

  if (!result) {
    return defaultVal
  }

  return result
}

/**
 * ElementAt - Returns the element at the given index
 *
 * @see https://msdn.microsoft.com/de-de/library/bb299233(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @param  {Number} index
 * @return {any}
 */
function ElementAt (index) {
  __assertIndexInRange(this, index)

  const result = this.Skip(index).Take(1).ToArray()[0]
  this.reset()

  return result
}

/**
 * Take - Returns count elements of the sequence starting from the beginning as a new Collection
 *
 * @see https://msdn.microsoft.com/de-de/library/bb503062(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @param  {Number} count = 0 number of elements to be returned
 * @return {Collection}
 */
function Take (count = 0) {
  __assertNumeric(count)

  if (count <= 0) {
    return Collection.Empty
  }

  const self = this

  return new Collection(function * () {
    let i = 0
    for (let val of self.getIterator()) {
      yield val

      if (++i === count) {
        break
      }
    }
  })
}

/**
 * Skip - Skips count elements of the sequence and returns the remaining sequence
 *
 * @see https://msdn.microsoft.com/de-de/library/bb358985(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @param  {Number} count=0 amount of elements to skip
 * @return {Collection}
 */
function Skip (count = 0) {
  __assertNumeric(count)

  if (count <= 0) {
    return this
  }

  return this.SkipWhile((elem, index) => index < count)
}

 /**
 * TakeWhile - Takes elements from the beginning of a sequence while the predicate yields true
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.takewhile(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @variation (elem => boolean)
 * @example
 const girls = [
   { name: 'Julia', isHot: true },
   { name: 'Sarah', isHot: true },
   { name: 'Maude', isHot: false },
 ]

 girls.TakeWhile(g => g.isHot).ToArray()
 // -> [ { name: 'Julia', isHot: true },  { name: 'Sarah', isHot: true } ]
 * @param  {Function} predicate The predicate of the form elem => boolean
 * @return {Collection}
  *//**
  * TakeWhile - Takes elements from the beginning of a sequence while the predicate yields true. The index of the element can be used in the logic of the predicate function.
  *
  * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.takewhile(v=vs.110).aspx
  * @method
  * @memberof Collection
  * @instance
  * @variation ((elem, index) => boolean)
  * @param  {Function} predicate The predicate of the form (elem, index) => boolean
  * @return {Collection}
  */
function TakeWhile (predicate = (elem, index) => true) {
  __assertFunction(predicate)

  const self = this

  const result = new Collection(function * () {
    let index = 0
    let endTake = false

    for (let val of self.getIterator()) {
      if (!endTake && predicate(val, index++)) {
        yield val
        continue
      }

      endTake = true
    }
  })

  this.reset()

  return result
}

/**
* TakeUntil - Takes elements from the beginning of a sequence until the predicate yields true. TakeUntil behaves like calling TakeWhile with a negated predicate.
*
* @method
* @memberof Collection
* @instance
* @variation (elem => boolean)
* @example
const girls = [
  { name: 'Julia', isHot: true },
  { name: 'Sarah', isHot: true },
  { name: 'Maude', isHot: false },
]

girls.TakeUntil(g => !g.isHot).ToArray()
// -> [ { name: 'Julia', isHot: true },  { name: 'Sarah', isHot: true } ]
* @param  {Function} predicate The predicate of the form elem => boolean
* @return {Collection}
 *//**
 * TakeUntil - Takes elements from the beginning of a sequence until the predicate yields true. The index of the element can be used in the logic of the predicate function.
 * TakeUntil behaves like calling TakeWhile with a negated predicate.
 *
 * @method
 * @memberof Collection
 * @instance
* @variation ((elem, index) => boolean)
 * @param  {Function} predicate The predicate of the form (elem, index) => boolean
 * @return {Collection}
 */
function TakeUntil (predicate = (elem, index) => false) {
  return this.TakeWhile((elem, index) => !predicate(elem, index))
}

 /**
 * SkipWhile - Skips elements in the sequence while the predicate yields true and returns the remaining sequence
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.skipwhile(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @variation (elem => boolean)
 * @instance
 * @example
 const numbers = [1, 3, 7, 9, 12, 13, 14, 15]

numbers.SkipWhile(x => x % 2 === 1).ToArray()
// -> [12, 13, 14, 15]
 * @param  {type} predicate The predicate of the form elem => boolean
 * @return {Collection}
  *//**
  * SkipWhile - Skips elements in the sequence while the predicate yields true and returns the remaining sequence. The index of the element
  * can be used in the logic of the predicate function.
  *
  * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.skipwhile(v=vs.110).aspx
  * @method
  * @memberof Collection
  * @instance
  * @variation ((elem, index) => boolean)
  * @param  {type} predicate The predicate of the form (elem, index) => boolean
  * @return {Collection}
  */
function SkipWhile (predicate = (elem, index) => true) {
  __assertFunction(predicate)

  const self = this

  return new Collection(function * () {
    let index = 0
    let endSkip = false

    for (let val of self.getIterator()) {
      if (!endSkip && predicate(val, index++)) {
        continue
      }

      endSkip = true
      yield val
    }
  })
}

/**
* SkipUntil - Skips elements from the beginning of a sequence until the predicate yields true. SkipUntil behaves like calling SkipWhile with a negated predicate.
*
* @method
* @memberof Collection
* @instance
* @variation (elem => boolean)
* @example
const people = [
  { name: 'Gandalf', race: 'istari' },
  { name: 'Thorin', race: 'dwarfs' },
  { name: 'Frodo', race: 'hobbit' },
  { name: 'Samweis', race: 'hobbit' },
  { name: 'Pippin', race: 'hobbit' },
]

people.SkipUntil(p => p.race === 'hobbit').Select(x => x.name).ToArray()
// -> ['Frodo', 'Samweis', 'Pippin']
* @param  {Function} predicate The predicate of the form elem => boolean
* @return {Collection}
 *//**
 * SkipUntil - Takes elements from the beginning of a sequence until the predicate yields true. The index of the element can be used in the logic of the predicate function.
 * SkipUntil behaves like calling SkipWhile with a negated predicate.
 *
 * @method
 * @memberof Collection
 * @instance
 * @variation ((elem, index) => boolean)
 * @param  {Function} predicate The predicate of the form (elem, index) => boolean
 * @return {Collection}
 */
function SkipUntil (predicate = (elem, index) => false) {
  return this.SkipWhile((elem, index) => !predicate(elem, index))
}

/**
* First - Returns the first element in a sequence
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.first(v=vs.110).aspx
* @method
* @memberof Collection
* @instance
* @throws Will throw an error if the sequence is empty
* @example
[1, 2, 3].First()
// -> 1
* @return {any}
 *//**
 * First - Returns the first element in a sequence that matches the given predicate
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.first(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @throws Will throw an error if the sequence is empty
 * @param  {Function} predicate The predicate of the form elem => Boolean
 * @example
[1, 2, 3, 4].First(x => x % 2 === 0)
// -> 2
 * @return {any}
 */
function First (predicate = x => true) {
  __assertFunction(predicate)
  __assertNotEmpty(this)

  const result = this.SkipWhile(elem => !predicate(elem)).Take(1).ToArray()[0]
  this.reset()

  return result
}

/**
* FirstOrDefault - Returns the first element in a sequence or a default value if the sequence is empty.
* The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...)
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.firstordefault(v=vs.110).aspx
* @method
* @memberof Collection
* @instance
* @example
[].FirstOrDefault()
// -> null
[].FirstOrDefault(Number)
// -> 0
 * @return {any}
 *//**
 * FirstOrDefault - Returns the first element in a sequence that matches the predicate or a default value if no such element is found.
 * The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...)
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.firstordefault(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @param  {Function} predicate The predicate of the form elem => Boolean
 * @example
 [1, 2, 3].FirstOrDefault(x => x > 5)
 // -> null
 [1, 2, 3].FirstOrDefault(x => x > 5, 6)
 // -> 6
 * @return {any}
 */
function FirstOrDefault (predicateOrConstructor = x => true, constructor = Object) {
  return resultOrDefault(this, First, predicateOrConstructor, constructor)
}

/**
* Last - Returns the last element in a sequence
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.last(v=vs.110).aspx
* @method
* @memberof Collection
* @instance
* @throws Will throw an error if the sequence is empty
* @example
[1, 2, 3].Last()
// -> 3
 * @return {any}
 *//**
 * Last - Returns the last element in a sequence that matches the given predicate
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.last(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @throws Will throw an error if the sequence is empty
 * @param  {Function} predicate The predicate of the form elem => Boolean
 * @example
[1, 2, 3, 4].Last(x => x % 2 === 0)
// -> 4
 * @return {any}
 */
function Last (predicate = x => true) {
  __assertFunction(predicate)
  __assertNotEmpty(this)

  return this.Reverse().First(predicate)
}

/**
* LastOrDefault - Returns the last element in a sequence or a default value if the sequence is empty.
* The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...)
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.lastordefault(v=vs.110).aspx
* @method
* @memberof Collection
* @instance
* @example
[].FirstOrDefault()
// -> null
[].FirstOrDefault(Number)
// -> 0
 * @return {any}
 *//**
 * LastOrDefault - Returns the last element in a sequence that matches the predicate or a default value if no such element is found.
 * The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...)
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.lastordefault(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @param  {Function} predicate The predicate of the form elem => Boolean
 * @example
 [1, 2, 3].LastOrDefault(x => x > 5)
 // -> null
 [1, 2, 3].LastOrDefault(x => x > 5, 6)
 // -> 6
 * @return {any}
 */
function LastOrDefault (predicateOrConstructor = x => true, constructor = Object) {
  return resultOrDefault(this, Last, predicateOrConstructor, constructor)
}

/**
* Single - Returns a single value of a sequence. Throws an error if there's not exactly one element.
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.single(v=vs.110).aspx
* @method
* @memberof Collection
* @instance
* @throws Will throw an error if the sequence is empty or there's more than one element
* @example
[1, 2, 3].Single()
// -> Error
[1].Single()
// -> 1
 * @return {any}
 *//**
 * Single - Returns a single, specific value of a sequence matching the predicate. Throws an error if there's not exactly one such element.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.single(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @throws Will throw an error if the sequence is empty or there's more than one element matching the predicate
 * @example
[1, 2, 3].Single(x => x % 2 === 0)
// -> 2
[1, 2, 3].Single(x => x < 3)
// Error
 * @param  {Function} predicate The predicate of the form elem => Boolean
 * @return {any}
 */
function Single (predicate = x => true) {
  __assertFunction(predicate)
  __assertNotEmpty(this)

  let index = 0
  let result

  for (let val of this.getIterator()) {
    if (predicate(val)) {
      result = val
      break
    }

    index++
  }

  if (this.First(elem => predicate(elem) && !defaultEqualityCompareFn(elem, result))) {
    throw new Error('Sequence contains more than one element')
  }

  return result
}

/**
* SingleOrDefault - Returns a single element of a sequence or a default value if the sequence is empty.
* Will throw an error if there's more than one element.
* The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...)
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.singleordefault(v=vs.110).aspx
* @method
* @memberof Collection
* @instance
* @example
[1, 2, 3].SingleOrDefault()
// -> Error
[].SingleOrDefault(Number)
// -> 1
 * @return {any}
 *//**
 * SingleOrDefault - Returns a single, specific element of a sequence matching the predicate or a default value if no such element is found.
 * Will throw an error if there's more than one such element.
 * The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...)
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.singleordefault(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @param  {Function} predicate The predicate of the form elem => Boolean
 * @example
 [1, 2, 3].SingleOrDefault(x => x > 5)
 // -> null
 [1, 2, 3].SingleOrDefault(x => x > 5, 6)
 // -> 6
 [1, 2, 3].SingleOrDefault(x => x > 1, 6)
 // -> Error
 * @return {any}
 */
function SingleOrDefault (predicateOrConstructor = x => true, constructor = Object) {
  return resultOrDefault(this, Single, predicateOrConstructor, constructor)
}

/**
 * DefaultIfEmpty - Returns a new sequence containing the provided constructors default if the sequence is empty or the sequence itself if not
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.defaultifempty(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @variation (constructor)
 * @param {Function} constructor A native constructor to get the default for, e.g. Number
 * @return {Collection}
 *//**
 * DefaultIfEmpty - Returns the sequence or a new sequence containing the provided default value if it is empty
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.defaultifempty(v=vs.110).aspx
 * @method
 * @memberof Collection
 * @instance
 * @variation (defaultValue)
 * @param {any} value The default value
 * @return {Collection}
 */
function DefaultIfEmpty (constructorOrValue) {
  if (!isEmpty(this)) {
    return this
  }

  return [getDefault(constructorOrValue)]
}




/* src/heap.js */

/**
 * HeapElement class that also provides the element index for sorting.
 */
let HeapElement = (function () {

    /**
     * Creates a new HeapElement.
     *
     * @param {number} index Element index.
     * @param {T}      value Element value.
     * @param {any}    <T>   Value type.
     */
    function HeapElement (index, value) {
        this.__index = index;
        this.__value = value;

        // for faster instance detection
        this.__isHeapElementInstance = true;
    }

    /**
     * Creates or returns a heap element from the given data.
     * If obj is a HeapElement obj is returned, creates a HeapElement otherwise.
     *
     * @param {number}           index Current element index.
     * @param {T|HeapElement<T>} obj   Element.
     * @param {any}              <T>   Value type.
     * @return {HeapElement<T>} Created heap element or obj if it already is a heap object.
     */
    HeapElement.CreateHeapElement = function (index, obj) {
        if (obj === undefined || obj.__isHeapElementInstance) {
            return obj;
        }
        return new HeapElement(index, obj);
    };

    return HeapElement;
})();

/*
 * Partially sorted heap that contains the smallest element within root position.
 */
let MinHeap = (function () {

    /**
     * Creates the heap from the array of elements with the given comparator function.
     *
     * @param {T[]}              elements   Array with elements to create the heap from.
     *                                      Will be modified in place for heap logic.
     * @param {(T, T) => number} comparator Comparator function (same as the one for Array.sort()).
     * @param {any}              <T>        Heap element type.
     */
    function MinHeap (elements, comparator = defaultComparator) {
        __assertArray(elements);
        __assertFunction(comparator);

        // we do not wrap elements here since the heapify function does that the moment it encounters elements
        this.elements = elements;

        // create comparator that works on heap elements (it also ensures equal elements remain in original order)
        this.comparator = (a, b) => {
            let res = comparator(a.__value, b.__value);

            if (res !== 0) {
                return res;
            }

            return defaultComparator(a.__index, b.__index);
        };

        // create heap ordering
        createHeap(this.elements, this.comparator);
    }

    /**
     * Places the element at the given position into the correct position within the heap.
     *
     * @param {T}                elements   Array with elements used for the heap.
     * @param {(T, T) => number} comparator Comparator function (same as the one for Array.sort()).
     * @param {number}           i          Index of the element that will be placed to the correct position.
     * @param {any}              <T>        Heap element type.
     */
    function heapify (elements, comparator, i) {
        let right     = 2 * (i + 1);
        let left      = right - 1;
        let bestIndex = i;

        // wrap elements the moment we encouter them first
        elements[bestIndex] = HeapElement.CreateHeapElement(bestIndex, elements[bestIndex]);

        // check if the element is currently misplaced
        if (left < elements.length) {
            elements[left] = HeapElement.CreateHeapElement(left, elements[left]);
            if (comparator(elements[left], elements[bestIndex]) < 0) {
                bestIndex = left;
            }
        }
        if (right < elements.length) {
            elements[right] = HeapElement.CreateHeapElement(right, elements[right]);
            if (comparator(elements[right], elements[bestIndex]) < 0) {
                bestIndex = right;
            }
        }

        // if the element is misplaced, swap elements and continue until we get the right position
        if (bestIndex !== i) {
            let tmp = elements[i];
            elements[i] = elements[bestIndex];
            elements[bestIndex] = tmp;

            // let misplaced elements "bubble up" to get heap properties
            heapify(elements, comparator, bestIndex);
        }
    }

    /**
     * Creates a heap from the given array using the given comparator.
     *
     * @param {T[]}              elements   Array with elements used for the heap.
     *                                      Will be modified in place for heap logic.
     * @param {(T, T) => number} comparator Comparator function (same as the one for Array.sort()).
     * @param {any}              <T>        Heap element type.
     */
    function createHeap (elements, comparator) {

        // sepecial case: empty array
        if (elements.length === 0) {

            // nothing to do here
            return;
        }

        for (let i = Math.floor(elements.length / 2); i >= 0; i--) {

            // do fancy stuff
            heapify(elements, comparator, i);
        }
    }

    /**
     * Checks if the heap contains at least one element.
     *
     * @return {boolean} If the heap contains elements or not.
     */
    MinHeap.prototype.hasTopElement = function () {
        return this.elements.length > 0;
    };

    /**
     * Gets and removes the top element from the heap.
     * This method performs a bit of reordering to keep heap properties.
     *
     * @param {any} <T> Heap element type.
     *
     * @return {T} Top element from heap.
     */
    MinHeap.prototype.getTopElement = function () {

        // special case: only one element left
        if (this.elements.length === 1) {
            return this.elements.pop().__value;
        }

        let topElement = this.elements[0];
        let tmp = this.elements.pop();
        this.elements[0] = tmp;

        // do fancy stuff
        heapify(this.elements, this.comparator, 0);

        return topElement.__value;
    };

    /**
     * Creates an iterator for this heap instance.
     *
     * @return {Iterator} Iterator for the heap.
     */
    MinHeap.prototype[Symbol.iterator] = function () {

        // keep matching heap instance
        let heap = this;
        return {
            next: function () {
                if (heap.hasTopElement()) {
                    return {
                        done:  false,
                        value: heap.getTopElement()
                    };
                }
                return {
                    done: true
                };
            }
        }
    };

    return MinHeap;
})();




/* src/transformation.js */

/**
 * Aggregate - applies a accumulator function to a sequence
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @variation (accumulator)
 * @param {Function} accumulator The accumulator function of the form (prev, current) => any
 * @example
 const sentence = "the quick brown fox jumps over the lazy dog"
 const words = sentence.split(' ')
 const reversed = words.Aggregate((workingSentence, next) => next + " " + workingSentence)
 // --> "dog lazy the over jumps fox brown quick the"
 * @return {any} the result of the accumulation
 *//**
 * Aggregate - applies a accumulator function to a sequence. Starts with seed.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @variation (seed, accumulator)
 * @param {any} seed The starting value of the accumulation
 * @param {Function} accumulator The accumulator function of the form (prev, current) => any
 * @example
[1, 2, 3].Aggregate(0, (prev, curr) => prev + curr)
// -> 6 (this example is equal to [1, 2, 3].Sum())
 * @return {any} the result of the accumulation
 *//**
 * Aggregate - applies a accumulator function to a sequence. Starts with seed and transforms the result using resultTransformFn.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @variation (seed, accumulator, resultTransformFn)
 * @param {any} seed The starting value of the accumulation
 * @param {Function} accumulator The accumulator function of the form (prev, current) => any
 * @param {Function} resultTransformFn A function to transform the result
 * @example
const fruits = ["apple", "mango", "orange", "passionfruit", "grape"]
const longestName = fruits.Aggregate('banana',
   (longest, next) => next.length > longest.length ? next : longest,
   fruit => fruit.toUpperCase())
// -> "PASSIONFRUIT"
 * @return {any} the result of the accumulation
 */
function Aggregate (seedOrAccumulator, accumulator, resultTransformFn) {
  const values = this.ToArray()

  if (typeof seedOrAccumulator === 'function' && !accumulator && !resultTransformFn) {
    return aggregateCollection(values.slice(1, values.length), values.slice(0, 1)[0], seedOrAccumulator, elem => elem)
  } else if (typeof seedOrAccumulator !== 'function' && typeof accumulator === 'function' && !resultTransformFn) {
    return aggregateCollection(values, seedOrAccumulator, accumulator, elem => elem)
  } else {
    return aggregateCollection(values, seedOrAccumulator, accumulator, resultTransformFn)
  }
}


/**
* Select - Projects each member of the sequence into a new form
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.select(v=vs.110).aspx
* @memberof Collection
* @instance
* @method
* @variation (elem => any)
* @param {Function} mapFn The function to use to map each element of the sequence, has the form elem => any
* @example
const petOwners = [
  { Name: 'Higa, Sidney', Pets: ['Scruffy', 'Sam'] },
  { Name: 'Ashkenazi, Ronen', Pets: ['Walker', 'Sugar'] },
  { Name: 'Price, Vernette', Pets: ['Scratches', 'Diesel'] },
]

petOwners.Select(x => x.Name).ToArray()
// -> ['Higa, Sidney', 'Ashkenazi, Ronen', 'Price, Vernette']
* @return {Collection}
*//**
* Select - Projects each member of the sequence into a new form. The index of the source element can be used in the mapFn.
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.select(v=vs.110).aspx
* @memberof Collection
* @instance
* @method
* @variation ((elem, index) => any)
* @param {Function} mapFn The function to use to map each element of the sequence, has the form (elem, index) => any
* @example
[1, 2, 3].Select((x, i) => x + i).ToArray()
// -> [1, 3, 5]
* @return {Collection}
*/
function Select (mapFn = x => x) {
  const self = this

  let index = 0

  return new Collection(function * () {
    for (let val of self.getIterator()) {
      yield mapFn(val, index)
      index ++
    }
  })
}

/**
 * Flatten - Flattens a sequence meaning reducing the level of nesting by one
 *
 * @memberof Collection
 * @instance
 * @method
 * @example
[1, 2, 3, [4, 5, 6,]]].Flatten().ToArray()
// -> [1, 2, 3, 4, 5, 6,]
 * @return {Collection}  A new, flattened Collection
 */
function Flatten () {
  return this.SelectMany(x => x)
}

/**
 * SelectMany - Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.selectmany(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @variation (elem => any)
 * @example
const petOwners = [
 { Name: 'Higa, Sidney', Pets: ['Scruffy', 'Sam'] },
 { Name: 'Ashkenazi, Ronen', Pets: ['Walker', 'Sugar'] },
 { Name: 'Price, Vernette', Pets: ['Scratches', 'Diesel'] },
]

const pets = petOwners.SelectMany(petOwner => petOwner.Pets).ToArray())
// -> ['Scruffy', 'Sam', 'Walker', 'Sugar', 'Scratches', 'Diesel']
 * @param {Function} mapFn The function to use to map each element of the sequence, has the form elem => any
 * @return {Collection}
 *//**
 * SelectMany - Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
 * The index of the source element can be used in the mapFn.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.selectmany(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @variation ((elem, index) => any)
 * @param {Function} mapFn The function to use to map each element of the sequence, has the form (elem, index) => any
 * @return {Collection}
 *//**
 * SelectMany - Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
 * Invokes a resultSelector function on each element of the sequence.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.selectmany(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @variation (elem => any, resultSelector)
 * @example
const petOwners = [
  { Name: 'Higa, Sidney', Pets: ['Scruffy', 'Sam'] },
  { Name: 'Ashkenazi, Ronen', Pets: ['Walker', 'Sugar'] },
  { Name: 'Price, Vernette', Pets: ['Scratches', 'Diesel'] },
]
petOwners.SelectMany(
    petOwner => petOwner.Pets,
    (owner, petName) => ({ owner, petName })
  ).Select(ownerAndPet => ({
     owner: ownerAndPet.owner.Name,
     pet: ownerAndPet.petName,
  }))
  .Take(2)
  .ToArray()

// -> [
//  { owner: "Higa, Sidney", pet: "Scruffy"},
//  { owner: "Higa, Sidney", pet: "Sam"}
// ]
 * @param {Function} mapFn The function to use to map each element of the sequence, has the form elem => any
 * @param {Function} resultSelector a function of the form (sourceElement, element) => any to map the result Value
 * @return {Collection}
 *//**
 * SelectMany - Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
 * Invokes a resultSelector function on each element of the sequence. The index of the source element can be used in the mapFn.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.selectmany(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @variation ((elem, index) => any, resultSelector)
 * @param {Function} mapFn The function to use to map each element of the sequence, has the form (elem, index) => any
 * @param {Function} resultSelector a function of the form (sourceElement, element) => any to map the result Value
 * @return {Collection}
 */
function SelectMany (mapFn, resultSelector = (x, y) => y) {
  __assertFunction(mapFn)
  __assertFunction(resultSelector)

  const iter = this.getIterator()

  return new Collection(function * () {
    let index = 0

    for (let current of iter) {
      let mappedEntry = mapFn(current, index)
      let newIter = mappedEntry

      if (!isIterable(mappedEntry)) {
        newIter = [mappedEntry]
      } else {
        newIter = mappedEntry
      }

      for (let val of newIter[Symbol.iterator]()) {
        yield resultSelector(current, val)
      }

      index++
    }
  })
}

/**
 * Distinct - Returns the distinct elemens from a sequence using the default equality compare function
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.distinct(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @example
[1, 2, 3, 3, 4, 7, 9, 9, 12].Distinct().ToArray()
// -> [1, 2, 3, 4, 7, 9, 12]
 * @return {Collection}
 *//**
 * Distinct - Returns the distinct elemens from a sequence using a provided equality compare function
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.distinct(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @param {Function} equalityCompareFn The function of the form (first, second) => boolean determining if the values are equal
 * @return {Collection}
 */
function Distinct (equalityCompareFn = defaultEqualityCompareFn) {
  __assertFunction(equalityCompareFn)

  return removeDuplicates(this, equalityCompareFn)
}

/**
 * ToArray - Enforces immediate evaluation of the whole Collection and returns an array of the result
 *
 * @see https://msdn.microsoft.com/de-de/library/bb298736(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @return {Array}
 */
function ToArray () {
  return [...this.getIterator()]
}

/**
 * ToDictionary - Enforces immediate evaluation of the whole Collcetion and returns a Map (dictionary) of the results.
 * The key is defined by the keySelector.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.todictionary(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @param {Function} keySelector The function to use to retrieve the key from the Collection
 * @return {Map}
 *//**
 * ToDictionary - Enforces immediate evaluation of the whole Collcetion and returns a Map (dictionary) of the results.
 * The key is defined by the keySelector and each element is transformed using the elementSelector.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.todictionary(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @example
const pets = [
{ name: 'miez', species: 'cat' },
{ name: 'wuff', species: 'dog' },
{ name: 'leo', species: 'cat' },
{ name: 'flipper', species: 'dolphin' }
]
pets.ToDictionary(pet => pet.name, pet => pet.species)
// -> Map {"miez" => "cat", "wuff" => "dog", "leo" => "cat", "flipper" => "dolphin"}
 * @param {Function} keySelector The function to use to retrieve the key from the Collection
 * @param {Function} elementSelector A function to map each element to a specific value, e.g. to properties
 * @return {Map}
 *//**
 * ToDictionary - Enforces immediate evaluation of the whole Collcetion and returns a Map (dictionary) of the results.
 * The key is defined by the keySelector. The keys are compared using the keyComparer. Duplicate keys throw an error.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.todictionary(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @example
const pets = [
{ name: 'miez', species: 'cat' },
{ name: 'wuff', species: 'dog' },
{ name: 'leo', species: 'cat' },
{ name: 'flipper', species: 'dolphin' }
]
pets.ToDictionary(p => p.name, p => p.species, (a, b) => a.length === b.length)
// -> error since cat and dog have 3 chars each and considered equal
 * @param {Function} keySelector The function to use to retrieve the key from the Collection
 * @param {Function} keyComparer A function of the form (a, b) => bool specifying whether or not two keys are equal
 * @return {Map}
 *//**
 * ToDictionary - Enforces immediate evaluation of the whole Collcetion and returns a Map (dictionary) of the results.
 * The key is defined by the keySelector and each element is transformed using the elementSelector.
 * The keys are compared using the keyComparer. Duplicate keys throw an error.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.todictionary(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @param {Function} keySelector The function to use to retrieve the key from the Collection
 * @param {Function} elementSelector A function to map each element to a specific value, e.g. to properties
 * @param {Function} keyComparer A function of the form (a, b) => bool specifying whether or not two keys are equal
 * @return {Map}
 */
function ToDictionary (keySelector, elementSelectorOrKeyComparer, keyComparer) {
  __assertFunction(keySelector)

  if (!elementSelectorOrKeyComparer && !keyComparer) {
    // ToDictionary(keySelector)
    return this.ToDictionary(keySelector, elem => elem, defaultEqualityCompareFn)
  } else if (!keyComparer && getParameterCount(elementSelectorOrKeyComparer) === 1) {
    // ToDictionary(keySelector, elementSelector)
    return this.ToDictionary(keySelector, elementSelectorOrKeyComparer, defaultEqualityCompareFn)
  } else if (!keyComparer && getParameterCount(elementSelectorOrKeyComparer) === 2) {
    // ToDictionary(keySelector, keyComparer)
    return this.ToDictionary(keySelector, elem => elem, elementSelectorOrKeyComparer)
  }

  // ToDictionary(keySelector, elementSelector, keyComparer)

  __assertFunction(keyComparer)
  __assertFunction(elementSelectorOrKeyComparer)

  let usedKeys = []
  let result = new Map()
  const input = this.ToArray()
  const elementSelector = elementSelectorOrKeyComparer

  for (let value of input) {
    let key = keySelector(value)
    let elem = elementSelector(value)

    __assert(key != null, 'Key is not allowed to be null!')
    __assert(!usedKeys.Any(x => keyComparer(x, key)), `Key '${key}' is already in use!`)

    usedKeys.push(key)
    result.set(key, elem)
  }

  return result
}

/**
 * ToJSON - Returns the representation of the sequence in javascript object notation (JSON)
 *
 * @instance
 * @method
 * @memberof Collection
 * @return {string}
 */
 function ToJSON () {
   return toJSON(this.ToArray())
 }

/**
 * Reverse - Returns a new sequence with the elements of the original one in reverse order
 * This method should be considered inperformant since the collection must get enumerated once
 *
 * @see https://msdn.microsoft.com/de-de/library/bb358497(v=vs.110).aspx
 * @method
 * @instance
 * @memberof Collection
 * @return {Collection}
 */
function Reverse () {
  const arr = this.ToArray()

  return new Collection(function * () {
    for (let i = arr.length - 1; i >= 0; i--) {
      yield arr[i]
    }
  })
}

/**
 * ForEach - Invokes a function for each value of the Collection
 *
 * @method
 * @instance
 * @memberof Collection
 * @example
[1, 2, 3].ForEach(x => console.log(x))
// Output:
1
2
3
 * @param  {Function} fn
 * @return {void}
 */
function ForEach (fn) {
  __assertFunction(fn)

  for (let val of this.getIterator()) {
    fn(val)
  }
}




/* src/insert-and-remove.js */

/**
 * Add - Adds an element to the end of the sequence
 *
 * @see https://msdn.microsoft.com/de-de/library/3wcytfd1(v=vs.110).aspx
 * @instance
 * @method
 * @memberof Collection
 * @param  {any} value The value to add to the sequence
 * @return {void}
 */
function Add (value) {
  this.Insert(value, this.Count())
}

/**
 * Insert - Inserts an element to the specified index of the sequence
 *
 * @see https://msdn.microsoft.com/de-de/library/sey5k5z4(v=vs.110).aspx
 * @instance
 * @method
 * @memberof Collection
 * @example
let coll = Collection.from([1, 2, 3])
coll.Contains(4) // -> false
coll.Insert(4, 0)
coll.Contains(4) // -> true
coll.ToArray() // [4, 1, 2, 3]
 * @param  {any}         value The value to add
 * @param  {Number}      index The index to add the value to
 * @return {void}
 */
function Insert (value, index) {
  __assert(index >= 0 && index <= this.Count(), 'Index is out of bounds!')

  const oldIter = this.ToArray()

  this.iterable = function * () {
    yield* oldIter.slice(0, index)
    yield value
    yield* oldIter.slice(index, oldIter.length)
  }
}

/**
 * Remove - Removes an element from the sequence
 *
 * @instance
 * @method
 * @memberof Collection
 * @param  {any} value The value to remove
 * @return {Boolean} True if the element was removed, false if not (or the element was not found)
 */
function Remove (value) {
  let values = this.ToArray()
  const result = removeFromArray(values, value)

  if (!result) {
    return false
  }

  this.iterable = function * () {
    yield* values
  }

  return true
}




/* src/ordered-collection.js */

/**
 * OrderedCollection - Represents an ordered collection of iterable values
 * providing additional methods to order an already ordered collection a second time keeping the order of non-equal elements
 *
 * @class
 * @param  {Iterable|GeneratorFunction} iterableOrGenerator A iterable to create a collection of, e.g. an array or a generator function
 * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
 */
let OrderedCollection = (function () {
    function OrderedCollection (iterableOrGenerator, comparator) {
        __assertFunction(comparator)

        Collection.apply(this, [iterableOrGenerator])

        this.__comparator = comparator
    }

    /**
     * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
     * The default comparator is used to compare values.
     *
     * @method
     * @memberof OrderedCollection
     * @instance
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.thenby(v=vs.110).aspx
     * @example
const pets = [
   {
     Name: 'Barley',
     Age: 8,
   },
   {
     Name: 'Boots',
     Age: 1,
   },
   {
     Name: 'Whiskers',
     Age: 1,
   },
   {
     Name: 'Fluffy',
     Age: 2,
   },
   {
     Name: 'Donald',
     Age: 4,
   },
   {
     Name: 'Snickers',
     Age: 13,
   }
 ]

 pets.OrderBy(x => x.Name.length).ThenBy(x => x.Age).Select(x => x.Name).ToArray()
 // -> ["Boots", "Fluffy", "Donald", "Barley", "Whiskers", "Snickers"]
     * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
     * @return {OrderedCollection} Ordered collection.
     *//**
     * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
     * A custom comparator is used to compare values.
     *
     * @method
     * @memberof OrderedCollection
     * @instance
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.thenby(v=vs.110).aspx
     * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
     * @param {Function} comparator A comparator of the form (a, b) => number to compare two values
     * @return {OrderedCollection} Ordered collection.
     */
    OrderedCollection.prototype.ThenBy = function (keySelector, comparator = defaultComparator) {
      const currentComparator = this.__comparator
      const additionalComparator = GetComparatorFromKeySelector(keySelector, comparator)

      const newComparator = (a, b) => {
        const res = currentComparator(a, b)

        if (res !== 0) {
          return res
        }

        return additionalComparator(a, b)
      }

      const self = this

      return new OrderedCollection(this.getIterator(), newComparator)
    };

    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order according to a key.
     * The default comparator is used to compare values.
     *
     * @method
     * @memberof OrderedCollection
     * @instance
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.thenbydescending(v=vs.110).aspx
     * @example
const pets = [
   {
     Name: 'Barley',
     Age: 8,
   },
   {
     Name: 'Boots',
     Age: 1,
   },
   {
     Name: 'Whiskers',
     Age: 1,
   },
   {
     Name: 'Fluffy',
     Age: 2,
   },
   {
     Name: 'Donald',
     Age: 4,
   },
   {
     Name: 'Snickers',
     Age: 13,
   }
 ]

 pets.OrderBy(x => x.Name.length).ThenBy(x => x.Age).Select(x => x.Name).ToArray()
 // -> ["Boots", "Barley", "Donald", "Fluffy", "Snickers", "Whiskers"]
     * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
     * @return {OrderedCollection} Ordered collection.
     *//**
     * Performs a subsequent ordering of the elements in a sequence in descending order according to a key.
     * A custom comparator is used to compare values.
     *
     * @method
     * @memberof OrderedCollection
     * @instance
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.thenbydescending(v=vs.110).aspx
     * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
     * @param {Function} comparator A comparator of the form (a, b) => number to compare two values
     * @return {OrderedCollection} Ordered collection.
     */
    OrderedCollection.prototype.ThenByDescending = function (keySelector, comparator = defaultComparator) {
      return this.ThenBy(keySelector, (a, b) => comparator(b, a))
    }

    OrderedCollection.prototype.getIterator = function () {
      const _self = this

      return function * () {
        yield* Reflect.construct(MinHeap, [[..._self.iterable], _self.__comparator])
      }()
    }

    return OrderedCollection;
})();

/**
 * Creates a comparator function from the given selector string or selector function.
 * The selector can either be a string which can be mapped to a property (e.g. Age) or a function to get the ordering key, e.g. person => person.Age
 *
 * @param  {String|Function} selector
 * @return {Function} Created comparator function of the form (first, second) => Number.
 */
function GetComparatorFromKeySelector(selector, comparator = defaultComparator) {
    if (isFunction(selector)) {
      return new Function('comparator', 'keySelectorFn', 'a', 'b', `return comparator(keySelectorFn(a), keySelectorFn(b))`).bind(null, comparator, selector)
    } else if (isString(selector)) {
      if (!(selector.startsWith('[') || selector.startsWith('.'))) {
          selector = `.${selector}`
      }

      return new Function('comparator', 'a', 'b', `return comparator(a${selector}, b${selector})`).bind(null, comparator)
    }
}


/* src/order.js */

/**
 * Orders the sequence by the numeric representation of the values ascending.
 * The default comparator is used to compare values.
 *
 * @method
 * @memberof Collection
 * @instance
 * @example
[1,7,9234,132,345,12,356,1278,809953,345,2].Order().ToArray()

// -> [1, 2, 7, 12, 132, 345, 345, 356, 1278, 9234, 809953]
 * @return {OrderedCollection} Ordered collection.
 *//**
 * Orders the sequence by the numeric representation of the values ascending.
 * A custom comparator is used to compare values.
 *
 * @method
 * @memberof Collection
 * @instance
 * @param {Function} comparator A comparator of the form (a, b) => number to compare two values
 * @return {OrderedCollection} Ordered collection.
 */
function Order(comparator = defaultComparator) {
  return this.OrderBy(x => x, comparator);
}

/**
 * Orders the sequence by the numeric representation of the values descending.
 * The default comparator is used to compare values.
 *
 * @method
 * @memberof Collection
 * @instance
 * @example
[1,7,9234,132,345,12,356,1278,809953,345,2].OrderDescending().ToArray()

// -> [809953, 9234, 1278, 356, 345, 345, 132, 12, 7, 2, 1]
 * @return {OrderedCollection} Ordered collection.
 *//**
 * Orders the sequence by the numeric representation of the values descending.
 * A custom comparator is used to compare values.
 *
 * @method
 * @memberof Collection
 * @instance
 * @param {Function} comparator A comparator of the form (a, b) => number to compare two values
 * @return {OrderedCollection} Ordered collection.
 */
function OrderDescending(comparator = defaultComparator) {
  return this.OrderByDescending(x => x, comparator);
}

/**
 * Orders the sequence by the appropriate property selected by keySelector ascending.
 * The default comparator is used to compare values.
 * @method
 * @memberof Collection
 * @instance
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.orderby(v=vs.110).aspx
 * @example
const pets = [
 {
   Name: 'Barley',
   Age: 8,
 },
 {
   Name: 'Booots',
   Age: 4,
 },
 {
   Name: 'Whiskers',
   Age: 1,
 }
]

pets.OrderBy(x => x.Age).ToArray()
// -> [ { Name: "Whiskers", "Age": 1 }, { Name: "Booots", Age: 4}, { Name: "Barley", Age: 8 } ]
 * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
 * @return {OrderedCollection} Ordered collection.
 *//**
 * Orders the sequence by the appropriate property selected by keySelector ascending.
 * A custom comparator is used to compare values.
 * @method
 * @memberof Collection
 * @instance
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.orderby(v=vs.110).aspx
 * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
 * @param {Function} comparator A comparator of the form (a, b) => number to compare two values
 * @return {OrderedCollection} Ordered collection.
 */
function OrderBy (keySelector, comparator = defaultComparator) {
  __assertFunction(comparator)

  return new OrderedCollection(this, GetComparatorFromKeySelector(keySelector, comparator), MinHeap)
}

/**
 * Orders the sequence by the appropriate property selected by keySelector ascending.
 * The default comparator is used to compare values.
 * @method
 * @memberof Collection
 * @instance
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.orderbydescending(v=vs.110).aspx
 * @example
const pets = [
 {
   Name: 'Barley',
   Age: 8,
 },
 {
   Name: 'Booots',
   Age: 4,
 },
 {
   Name: 'Whiskers',
   Age: 1,
 }
]

pets.OrderByDescending(x => x.Age).ToArray()
// -> [ { Name: "Barley", Age: 8 }, { Name: "Booots", Age: 4}, { Name: "Whiskers", "Age": 1 }, ]
 * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
 * @return {OrderedCollection} Ordered collection.
 *//**
 * Orders the sequence by the appropriate property selected by keySelector ascending.
 * A custom comparator is used to compare values.
 * @method
 * @memberof Collection
 * @instance
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.orderbydescending(v=vs.110).aspx
 * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
 * @param {Function} comparator A comparator of the form (a, b) => number to compare two values
 * @return {OrderedCollection} Ordered collection.
 */
function OrderByDescending (keySelector, comparator = defaultComparator)  {
    return new OrderedCollection(this, GetComparatorFromKeySelector(keySelector, (a, b) => comparator(b, a)))
}

/**
 * Shuffle - Orders a sequence by random (produces a possible permutation of the sequence) and returns the shuffled elements as a new collection
 *
 * @instance
 * @memberof Collection
 * @method
 * @return {Collection}
 */
function Shuffle () {
  return this.OrderBy(() => Math.floor(Math.random() * 3) - 1 /* Returns -1, 0 or 1 */)
}




/* src/grouping.js */

/**
 * getEqualKey - Get the matching key in the group for a given key and a keyComparer or return the parameter itself if the key is not present yet
 */
function getEqualKey(groups, key, keyComparer) {
  for (let groupKey of groups.keys()) {
    if (keyComparer(groupKey, key)) {
      return groupKey
    }
  }

  return key
}

/**
 * GroupBy - Groups a sequence using the keys selected from the members using the keySelector
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
 * @instance
 * @memberof Collection
 * @method
 * @variation (keySelector)
 * @example
 * // Map {"S" => ["Sven"], "M" => ["Mauz"]}
 * ['Sven', 'Mauz'].GroupBy(x => x[0])
 * @param {Function} keySelector A function to select grouping keys from the sequence members
 * @return {Map} The grouped sequence as a Map
 *//**
 * GroupBy - Groups a sequence using the keys selected from the members using the keySelector. The keys are compared using keyComparer.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
 * @instance
 * @memberof Collection
 * @method
 * @variation (keySelector, keyComparer)
 * @example
 * // Map {"4" => ["4", 4], "5" => ["5"]}
 * ['4', 4, '5'].GroupBy(x => x, (outer, inner) => parseInt(outer) === parseInt(inner))
 * @param {Function} keySelector A function to select grouping keys from the sequence members
 * @param {Function} keyComparer A function of the form (outer, inner) => bool to check if keys are considered equal
 * @return {Map} The grouped sequence as a Map
 *//**
 * GroupBy - Groups a sequence using the keys selected from the members using the keySelector.
 * Each group member is projected to a single value (e.g. a property) using the elementSelector.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
 * @instance
 * @memberof Collection
 * @method
 * @variation (keySelector, elementSelector)
 * @example
 * // Map {23 => ["Sven"], 20 => ["jon"]}
 * [{ name: 'Sven', age: 23 }, { name: 'jon', age: 20 }].GroupBy(x => x.age, x => x.name)
 * @param {Function} keySelector A function to select grouping keys from the sequence members
 * @param {Function} elementSelector A function to map each group member to a specific value
 * @return {Map} The grouped sequence as a Map
 *//**
 * GroupBy - Groups a sequence using the keys selected from the members using the keySelector.
 * The resultSelector is used to project each resulting group to a single value (e.g. an object with aggregated properties).
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
 * @instance
 * @memberof Collection
 * @method
 * @variation (keySelector, resultSelector)
 * @example
 * // [ { age:23, persons: "Sven&julia" }, { age: 20, persons: "jon" } ]
 * [{ name: 'Sven', age: 23 }, { name: 'julia', age: 23 }, { name: 'jon', age: 20 }].GroupBy(x => x.age, (age, persons) => ({ age, persons: persons.map(p => p.name).join('&') })).ToArray()
 * @param {Function} keySelector A function to select grouping keys from the sequence members
 * @param {Function} resultSelector A function of the form (key, groupMembers) => any to select a final result from each group
 * @return {Collection} The grouped sequence with projected results as a new Collection
 *//**
 * GroupBy - Groups a sequence using the keys selected from the members using the keySelector. Keys are compared using the specified keyComparer.
 * The resultSelector is used to project each resulting group to a single value (e.g. an object with aggregated properties).
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
 * @instance
 * @memberof Collection
 * @method
 * @variation (keySelector, resultSelector, keyComparer)
 * @param {Function} keySelector A function to select grouping keys from the sequence members
 * @param {Function} resultSelector A function of the form (key, groupMembers) => any to select a final result from each group
 * @param {Function} keyComparer A function of the form (outer, inner) => bool to check if keys are considered equal
 * @return {Collection} The grouped sequence with projected results as a new Collection
 *//**
 * GroupBy - Groups a sequence using the keys selected from the members using the keySelector. Keys are compared using the specified keyComparer.
 * Each group member is projected to a single value (e.g. a property) using the elementSelector.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
 * @instance
 * @memberof Collection
 * @method
 * @variation (keySelector, elementSelector, keyComparer)
 * @param {Function} keySelector A function to select grouping keys from the sequence members
 * @param {Function} elementSelector A function to map each group member to a specific value
 * @param {Function} keyComparer A function of the form (outer, inner) => bool to check if keys are considered equal
 * @return {Map} The grouped sequence as a Map
 *//**
 * GroupBy - Groups a sequence using the keys selected from the members using the keySelector.
 * Each group member is projected to a single value (e.g. a property) using the elementSelector.
 * The resultSelector is used to project each resulting group to a single value (e.g. an object with aggregated properties).
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
 * @instance
 * @memberof Collection
 * @method
 * @variation (keySelector, elementSelector, resultSelector)
 * @param {Function} keySelector A function to select grouping keys from the sequence members
 * @param {Function} elementSelector A function to map each group member to a specific value
 * @param {Function} resultSelector A function of the form (key, groupMembers) => any to select a final result from each group
 * @return {Collection} The grouped sequence with projected results as a new Collection
 *//**
 * GroupBy - Groups a sequence using the keys selected from the members using the keySelector. The keys are compared using the keyComparer.
 * Each group member is projected to a single value (e.g. a property) using the elementSelector.
 * The resultSelector is used to project each resulting group to a single value (e.g. an object with aggregated properties).
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
 * @instance
 * @memberof Collection
 * @method
 * @variation (keySelector, elementSelector, resultSelector, keyComparer)
 * @param {Function} keySelector A function to select grouping keys from the sequence members
 * @param {Function} elementSelector A function to map each group member to a specific value
 * @param {Function} resultSelector A function of the form (key, groupMembers) => any to select a final result from each group
 * @param {Function} keyComparer A function of the form (outer, inner) => bool to check if keys are considered equal
 * @return {Collection} The grouped sequence with projected results as a new Collection
 * @
 */
function GroupBy (keySelector, ...args) {
  const arr = this.ToArray()

  /**
   * isKeyComparer - Checks whether or not a function is a keyComparer. We need to differentiate between the keyComparer and the resultSelector
   * since both take two arguments.
   */
  function isKeyComparer (arg) {
    let result = getParameterCount(arg) === 2
    try {
      // if this is a key comparer, it must return truthy values for equal values and falsy ones if they're different
      result = result && arg(1, 1) && !arg(1, 2)
    } catch (err) {
      // if the function throws an error for values, it can't be a keyComparer
      result = false
    }

    return result
  }

  /*
  GroupBy(keySelector)
  */
  function groupByOneArgument (keySelector) {
    return groupBy(keySelector, elem => elem, undefined, defaultEqualityCompareFn)
  }

  /*
  GroupBy(keySelector, keyComparer)
  GroupBy(keySelector, elementSelector)
  GroupBy(keySelector, resultSelector)
  */
  function groupByTwoArguments (keySelector, inner) {
    let keyComparer, elementSelector

    if (isKeyComparer(inner)) {
      keyComparer = inner
      elementSelector = elem => elem
    } else {
      keyComparer = defaultEqualityCompareFn
      elementSelector = inner
    }

    return groupByThreeArguments(keySelector, elementSelector, keyComparer)
  }

  /*
  GroupBy(keySelector, resultSelector, keyComparer)
  GroupBy(keySelector, elementSelector, keyComparer)
  GroupBy(keySelector, elementSelector, resultSelector)
  */
  function groupByThreeArguments (keySelector, inner, third) {
    let keyComparer, elementSelector, resultSelector

    if (isKeyComparer(third)) {
      keyComparer = third
    } else {
      resultSelector = third
    }

    if (getParameterCount(inner) === 2) {
      resultSelector = inner
    } else {
      elementSelector = inner
    }

    if (!keyComparer) {
      keyComparer = defaultEqualityCompareFn
    }

    if (!elementSelector) {
      elementSelector = elem => elem
    }

    return groupBy(keySelector, elementSelector, resultSelector, keyComparer)
  }

  /**
   * This is the "basic" function to use. The others just transform their parameters to be used with this one.
   */
  function groupBy (keySelector, elementSelector, resultSelector, keyComparer) {
    __assertFunction(keySelector)
    __assertFunction(elementSelector)
    __assert(isUndefined(resultSelector) || isFunction(resultSelector), 'resultSelector must be undefined or function!')
    __assertFunction(keyComparer)

    let groups = new Map()
    let result

    for (let val of arr) {
      // Instead of checking groups.has we use our custom function since we want to treat some keys as equal even if they aren't for the Map
      const key = getEqualKey(groups, keySelector(val), keyComparer)
      const elem = elementSelector(val)

      if (groups.has(key)) {
        groups.get(key).push(elem)
      } else {
        groups.set(key, [elem])
      }
    }

    if (resultSelector) {
      // If we want to select the final result with the resultSelector, we use the built-in Select function and retrieve a new Collection
      result = groups.ToArray().Select(g => resultSelector(...g))
    } else {
      // our result is just the grouos -> return the Map
      result = groups
    }

    return result
  }

  // the outer parameter of GroupBy is always the keySelector, so we have to differentiate the following arguments
  // and select the appropriate function
  let fn
  switch (args.length) {
    case 0:
      fn = groupByOneArgument
      break
    case 1:
      fn = groupByTwoArguments
      break
    case 2:
      fn = groupByThreeArguments
      break
    case 3:
      fn = groupBy
      break
    default:
      throw new Error('GroupBy parameter count can not be greater than 4!')
  }

  return fn(keySelector, ...args)
}


/**
 * GroupJoin - Correlates the elements of two sequences based on equality of keys and groups the results.
 * The default equality comparer is used to compare keys.
 *
 * @instance
 * @memberof Collection
 * @method
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupjoin(v=vs.110).aspx
 * @param  {Iterable} inner The values to join with this Collection
 * @param  {Function} outerKeySelector A function to extract the grouping keys from the outer Collection
 * @param  {Function} innerKeySelector A function to extract the grouping keys from the inner Collection
 * @param  {Function} resultSelector A function of the form (key, values) => any to select the final result from each grouping
 * @return {any}
 *//**
 * GroupJoin - Correlates the elements of two sequences based on equality of keys and groups the results.
 * The provided custom keyComparer is used to compare keys.
 *
 * @instance
 * @memberof Collection
 * @method
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupjoin(v=vs.110).aspx
 * @param  {Iterable} inner The values to join with this Collection
 * @param  {Function} outerKeySelector A function to extract the grouping keys from the outer Collection
 * @param  {Function} innerKeySelector A function to extract the grouping keys from the inner Collection
 * @param  {Function} resultSelector A function of the form (key, values) => any to select the final result from each grouping
 * @param {Function} keyComparer A function of the form (first, second) => bool to compare keys for equality
 * @return {any}
 */
function GroupJoin (inner, outerKeySelector, innerKeySelector, resultSelector, equalityCompareFn = defaultEqualityCompareFn) {
  __assertIterable(inner)
  __assertFunction(outerKeySelector)
  __assertFunction(innerKeySelector)
  __assertFunction(resultSelector)

  let groups = new Map()
  const outer = this

  for (let outerVal of outer.getIterator()) {
    const outerKey = outerKeySelector(outerVal)

    groups.set(outerVal, new Collection(function * () {
      for (let innerVal of inner[Symbol.iterator]()) {
        if (equalityCompareFn(outerKey, innerKeySelector(innerVal))) {
          yield innerVal
        }
      }
    }))
  }

  return new Collection(function * () {
    for (let [key, values] of groups) {
      yield resultSelector(key, values.ToArray())
    }
  })
}




/* src/equality.js */

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


  /* Export public interface */
  __export({ defaultComparator, Min, Max, Average, Sum, Concat, Union, Join, Except, Zip, Intersect, Where, ConditionalWhere, Count, Contains, IndexOf, LastIndexOf, Any, All, ElementAt, Take, TakeWhile, TakeUntil, Skip, SkipWhile, SkipUntil, Contains, First, FirstOrDefault, Last, LastOrDefault, Single, SingleOrDefault, DefaultIfEmpty, MinHeap, Aggregate, Distinct, Select, SelectMany, Flatten, Reverse, ToArray, ToDictionary, ToJSON, ForEach, Add, Insert, Remove, Order, OrderBy, OrderDescending, OrderByDescending, Shuffle, GroupBy, GroupJoin, SequenceEqual })
  // Install linqjs
  // [1] Assign exports to the prototype of Collection
  __assign(Collection.prototype, linqjsExports)

  // [2] Let OrderedCollection inherit from Collection (we don't want to implement stuff twice)
  OrderedCollection.prototype = __assign(__assign({}, Collection.prototype), OrderedCollection.prototype)
  OrderedCollection.prototype.constructor = OrderedCollection

  // [3] Apply wrapper functions to selected prototypes which are iterable (Array, Set, Map etc.)
  const protosToApplyWrappers = [window.Array.prototype, window.Set.prototype, window.Map.prototype]

  Object.keys(Collection.prototype).forEach(k => {
    for (let proto of protosToApplyWrappers) {
      proto[k] = function (...args) {
        return new Collection(this)[k](...args)
      }
    }
  })

  // [4] Return final Collection class
  return Collection
}()))
}())
