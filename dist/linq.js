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
  (function (factory) {
    try {
      if (typeof define === 'function' && define.amd) {
        // AMD asynchronous module definition (e.g. requirejs)
        define(['require', 'exports'], factory)
      } else if (exports && module && module.exports) {
        // CommonJS/Node.js where module.exports is for nodejs
        factory(exports || module.exports)
      }
    } catch (err) {
      // no module loader (simple <script>-tag) -> assign Maybe directly to the global object
      // -> (0, eval)('this') is a robust way for getting a reference to the global object
      factory(window.linqjs = {}) // jshint ignore:line
    }
  }(function (linqjs) {

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
let DefaultComparator = (a, b) => {
    if (a < b) {
        return -1;
    }
    if (b < a) {
        return 1;
    }
    return 0;
};




/* src/helpers/assert.js */

  function __assert (condition, msg) {
    if (!condition) {
      throw new Error(msg);
    }
  }

  function __assertFunction (param) {
    __assert(isFunction(param), 'Parameter must be function!')
  }

  function __assertArray (param) {
    __assert(isArray(param), 'Parameter must be array!')
  }

  function __assertNotEmpty (coll) {
    __assert(!isEmpty(coll), 'Sequence is empty')
  }

  function __assertIterable (obj) {
    __assert(isIterable(obj), 'Parameter must be iterable!')
  }

  function __assertCollection (obj) {
    __assert(isCollection(obj), 'Pa>rameter must be collection!')
  }

  function __assertIterationNotStarted (collection) {
    let iterationStarted = ('StartedIterating' in collection) && collection.StartedIterating();
    __assert(!iterationStarted, 'Iteration already started!')
  }

  function __assertString (obj) {
    __assert(isString(obj), 'Parameter must be string!')
  }

  function __assertIndexInRange(coll, index) {
    __assertCollection(coll)
    __assert(isNumeric(index), 'Index must be number!')
    __assert(index >= 0 && index <= coll.Count() - 1, 'Index is out of bounds')
  }


/* src/helpers/is.js */

  function isArray (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }

  function isFunction (obj) {
    return typeof obj === 'function'
  }

  function isNumeric (n) {
    return !isNaN(parseFloat(n))
  }

  function isEmpty (coll) {
    __assertCollection(coll)

    return !coll.First()
  }

  function isIterable (obj) {
    return (Symbol.iterator in obj)
  }

  function isString (obj) {
    return typeof obj === 'string';
  }

  function isCollection (obj) {
    return obj instanceof Collection
  }


/* src/helpers.js */

  function toJSON (obj) {
    return JSON.stringify(obj)
  }

  function __assign (target, source) {
    target = Object(target);

    if (Object.hasOwnProperty('assign') && typeof Object.assign === 'function') {
      Object.assign(target, source)
    } else {
      for (let key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }

    return target
  }

  function __export (obj) {
    __assign(linqjs, obj)
  }

  function isES6 () {
    // use evaluation to prevent babel to transpile this test into ES5
    return new Function(`
      try {
        return (() => true)();
      } catch (err) {
        return false
      }
    `)()
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

  function filterArray (arr, predicate = (elem, index) => true, stopAfter = Infinity) {
    __assert(isArray(arr), 'arr must be array!')
    __assertFunction(predicate)
    __assert(isNumeric(stopAfter), 'stopAfter must be numeric!')

    let result = []
    const length = arr.length

    for (let i = 0; i < length; i++) {
      if (predicate(arr[i], i)) {
        result.push(arr[i])

        if (result.length >= stopAfter) {
          break;
        }
      }
    }

    return result
  }

  function aggregateCollection (coll, seed, accumulator, resultTransformFn) {
    __assertFunction(accumulator)
    __assertFunction(resultTransformFn)
    __assertNotEmpty(coll)

    return resultTransformFn([seed].concat(coll.ToArray()).reduce(accumulator))
  }

  function removeDuplicates (coll, equalityCompareFn = defaultEqualityCompareFn) {
    __assertIterable(coll)
    __assertFunction(equalityCompareFn)

    const previous = []

    return new Collection(function * () {
      outer: for (let val of coll) {
        inner: for (let prev of previous) {
          if (equalityCompareFn(val, prev)) {
            continue outer;
          }
        }

        previous.push(val)

        yield val
      }
    }())
  }

  /**
   * emptyArray - Helper function to remove all elements from an array (by modifying the original and not returning a new one)
   *
   * @param  {Array} arr The array to remove all elements form
   * @return {void}
   */
  function emptyArray (arr) {
    __assertArray(arr)

    while (arr.shift()) {}
  }

  /**
   * insertIntoArray - Insert a value into an array at the specified index, defaults to the end
   *
   * @param  {Array} arr   The array to insert a value into
   * @param  {any} value   The value to add
   * @param  {Number} index The index to add the element to, defaults to the end
   * @return {void}
   */
  function insertIntoArray (arr, value, index) {
    index = paramOrValue(index, arr.length)
    __assertIndexInRange(arr, index)

    const before = arr.slice(0, index)
    const after = arr.slice(index)

    emptyArray(arr)

    arr.unshift(...Array.prototype.concat.apply([], [before, value, after]))
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

  const nativeConstructors = [
    Object, Number, Boolean, String, Symbol
  ]

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


/* src/linq.js */

window.Collection = (function () {
  function Collection (iterable) {
    __assertIterable(iterable)

    this.iterable = iterable
  }

  Collection.from = function (iterable) {
    return new Collection(iterable)
  }

  Collection.prototype = (function () {
    function next () {
      if (!this.started) {
        this.started = true
        const _self = this

        this.iterator = function * () {
          yield* _self.iterable
          _self.reset()
        }()
      }

      return this.iterator.next()
    }

    function reset () {
      this.started = false
    }

    return { next, reset }
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

  Collection.prototype.ToArray = function () {
    return [...this]
  }

  return Collection
}())

function install () {
  __assign(Collection.prototype, linqjs)

  const protosToApplyWrappers = [window.Array.prototype]

  Object.keys(linqjs).forEach(k => {
    for (let proto of protosToApplyWrappers) {
      proto[k] = function (...args) {
        return new Collection(this)[k](...args)
      }
    }
  })
}




/* src/math.js */

  function Min (mapFn = x => x) {
    __assertFunction(mapFn)
    __assertNotEmpty(this)

    return Math.min.apply(null, this.ToArray().map(mapFn))
  }

  function Max (mapFn = x => x) {
    __assertFunction(mapFn)
    __assertNotEmpty(this)

    return Math.max.apply(null, this.ToArray().map(mapFn))
  }

  function Sum() {
    __assertNotEmpty(this)

    return this.Aggregate(0, (prev, curr) => prev + curr)
  }

  function Average () {
    __assertNotEmpty(this)

    let sum = this.Sum()
    this.reset()
    let count = this.Count()

    return sum / count
  }




/* src/concatenation.js */

  function Concat (second) {
    __assertIterable(second)

    const _self = this

    if (!isCollection(second)) {
      second = new Collection(second)
    }

    return new Collection(function * () {
      yield* _self
      yield* second
    }())
  }

  function Union (second, equalityCompareFn = defaultEqualityCompareFn) {
    __assertIterable(second)

    return this.Concat(second).Distinct()
  }




/* src/search.js */

function Where (predicate = (elem, index) => true) {
  __assertFunction(predicate)

  const _self = this

  return new Collection(function * () {
    let index = 0

    for (let val of _self) {
      if (predicate(val, index)) {
        yield val
      }

      index++
    }
  }())
}

/**
 * Count - Returns the amount of elements matching a predicate or the array length if no parameters given
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.count(v=vs.110).aspx
 * @param  {Function} predicate
 * @return {Number}
 */
function Count (predicate = elem => true) {
  return this.Where(predicate).ToArray().length
}

/**
 * Any - Returns true if at least one element matches the predicate or if no predicate is given but the sequence contains at least one element
 *
 * @see https://msdn.microsoft.com/de-de/library/bb337697(v=vs.110).aspx
 * @param  {Function} predicate
 * @return {Boolean}
 */
function Any (predicate) {
  if (!predicate) {
    return !!this.First()
  }

  return this.Count(predicate) > 0
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




/* src/access.js */

function Contains (elem) {
  for (let val of this) {
    if (defaultEqualityCompareFn(elem, val)) {
      return true
    }
  }

  return false
}

/**
 * ElementAt - Returns the element at the given index
 *
 * @see https://msdn.microsoft.com/de-de/library/bb299233(v=vs.110).aspx
 * @param  {Number} index
 * @return {any}
 */
function ElementAt (index) {
  __assertIndexInRange(this, index)
  //__assert(isNumeric(index), 'Index must be numeric!')

  return this.SkipWhile((elem, i) => i < index).Take(1)[0]
}

/**
 * Take - Returns count elements of the sequence starting from the beginning
 *
 * @see https://msdn.microsoft.com/de-de/library/bb503062(v=vs.110).aspx
 * @param  {Number} count = 0 number of elements to be returned
 * @return {Array}
 */
function Take (count = 0) {
  __assert(isNumeric(count), 'First parameter must be numeric!')

  if (count <= 0) {
    return []
  }

  let result = []

  for (let val of this) {
    result.push(val)

    if (result.length === count) {
      break
    }
  }

  this.reset()

  return result
}

/**
 * Skip - Skips count elements of the sequence and returns the remaining ones
 *
 * @see https://msdn.microsoft.com/de-de/library/bb358985(v=vs.110).aspx
 * @param  {Nu,ber count = 0 amount of elements to skip
 * @return {Array}
 */
function Skip (count = 0) {
  __assert(isNumeric(count), 'First parameter must be numeric!')

  if (count <= 0) {
    return this
  }

  return this.SkipWhile((elem, index) => index < count)
}

/**
 * TakeWhile - Takes elements from the beginning of a sequence until the predicate yields false for an element
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.takewhile(v=vs.110).aspx
 * @param  {Function} predicate     the predicate of the form elem => boolean or (elem, index) => boolean
 * @return {Array}
 */
function TakeWhile (predicate = (elem, index) => true) {
  __assertFunction(predicate)

  const _self = this

  return new Collection(function * () {
    let index = 0

    for (let val of _self) {
      if (!predicate(val, index)) continue

      yield val
    }
  }()).ToArray()
}

/**
 * SkipWhile - Skips elements in the array until the predicate yields false and returns the remaining elements
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.skipwhile(v=vs.110).aspx
 * @param  {type} predicate         the predicate of the form elem => boolean or (elem, index) => boolean
 * @return {Array}
 */
function SkipWhile (predicate = (elem, index) => true) {
  __assertFunction(predicate)

  const _self = this

  return new Collection(function * () {
    let index = 0

    for (let val of _self) {
      if (predicate(val, index++)) continue

      yield val
    }
  }())
}

function First (predicate = x => true) {
  //__assertFunction(predicate)
  //__assertNotEmpty(this)

  const result = this.SkipWhile(elem => !predicate(elem)).Take(1)
  this.reset()

  if (result[0]) {
    return result[0]
  }

  return null;
}

function resultOrDefault(collection, originalFn, predicateOrConstructor = x => true, constructor = Object) {
  //__assertArray(arr)

  let predicate

  if (isNative(predicateOrConstructor)) {
    predicate = x => true
    constructor = predicateOrConstructor
  } else {
    predicate = predicateOrConstructor
  }

  __assertFunction(predicate)
  __assert(isNative(constructor), 'constructor must be native constructor, e.g. Number!')

  let result = originalFn.call(collection, predicate)

  if (result) {
    return result
  }

  return getDefault(constructor)
}

function FirstOrDefault (predicateOrConstructor = x => true, constructor = Object) {
  return resultOrDefault(this, First, predicateOrConstructor, constructor)
}

function Last (predicate = x => true) {
  //__assertFunction(predicate)
  //__assertNotEmpty(this)

  return new Collection(this.ToArray().reverse()).First(predicate)
}

function LastOrDefault (predicateOrConstructor = x => true, constructor = Object) {
  return resultOrDefault(this, Last, predicateOrConstructor, constructor)
}

function Single (predicate = x => true) {
  //__assertFunction(predicate)
  //__assertNotEmpty(this)

  let index = 0
  let result

  for (let val of this) {
    if (index++ && predicate(val)) {
      result = val
      break
    }
  }

  if (this.First(elem => predicate(elem) && !defaultEqualityCompareFn(elem, result))) {
    throw new Error('Sequence contains more than one element')
  }

  return result
}

function SingleOrDefault (predicateOrConstructor = x => true, constructor = Object) {
  return resultOrDefault(this, Single, predicateOrConstructor, constructor)
}

/**
 * DefaultIfEmpty - Returns the array or a new array containing the provided constructors default if empty
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.defaultifempty(v=vs.110).aspx
 * @param {Function} constructor A native constructor to get the default for, e.g. Number
 * @return {Array}
 *//**
 * DefaultIfEmpty - Returns the array or a new array containing the provided default value if empty
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.defaultifempty(v=vs.110).aspx
 * @param {any} value The default vlaue
 * @return {Array}
 */
function DefaultIfEmpty (constructorOrValue) {
  if (!isEmpty(this)) {
    return this
  }

  return [getDefault(constructorOrValue)]
}




/* src/heap.js */

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
    function MinHeap(elements, comparator = DefaultComparator) {
        __assertArray(elements);
        __assertFunction(comparator);

        this.comparator = comparator;
        this.elements   = elements;

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
    function heapify(elements, comparator, i) {
        let right     = 2 * (i + 1);
        let left      = right - 1;
        let bestIndex = i;

        // check if the element is currently misplaced
        if (left < elements.length && comparator(elements[left], elements[bestIndex]) < 0) {
            bestIndex = left;
        }
        if (right < elements.length && comparator(elements[right], elements[bestIndex]) < 0) {
            bestIndex = right;
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
    function createHeap(elements, comparator) {
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
            return this.elements.pop();
        }

        let topElement = this.elements[0];
        let tmp = this.elements.pop();
        this.elements[0] = tmp;

        // do fancy stuff
        heapify(this.elements, this.comparator, 0);

        return topElement;
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

/*
 * Partially sorted heap that contains the largest element within root position.
 */
let MaxHeap = (function () {

    /**
     * Creates the heap from the array of elements with the given comparator function.
     *
     * @param {T[]}               elements   Array with elements to create the heap from.
     *                                       Will be modified in place for heap logic.
     * @param {(T, T) => boolean} comparator Comparator function (same as the one for Array.sort()).
     * @param {any}               <T>        Heap element type.
     */
    function MaxHeap(elements, comparator = DefaultComparator) {
        __assertArray(elements);
        __assertFunction(comparator);

        // simply negate the result of the comparator function so we get reverse ordering within the heap
        MinHeap.apply(this, [elements, function (a, b) { return -1 * comparator(a, b); }]);
    }

    // inheritance stuff (we don't want to implement stuff twice)
    MaxHeap.prototype = Object.create(MinHeap.prototype);
    MaxHeap.prototype.constructor = MaxHeap;

    return MaxHeap;
})()




/* src/order.js */

// TODO: change implementation to use iterators!

function Order() {
    return this.OrderBy(DefaultComparator);
}

function OrderCompare() {
    return this.sort(DefaultComparator);
}

function OrderBy(comparator) {
    __assertFunction(comparator);
    let heap = new MinHeap(this, comparator);
    return [...heap];
}

function OrderDescending() {
    return this.OrderByDescending(DefaultComparator);
}

function OrderByDescending(comparator) {
    __assertFunction(comparator);
    let heap = new MaxHeap(this, comparator);
    return [...heap];
}



/* src/transformation.js */

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
      return aggregateCollection(this.slice(1, this.length), this[0], seedOrAccumulator, elem => elem)
    } else if (typeof seedOrAccumulator !== 'function' && typeof accumulator === 'function' && !resultTransformFn) {
      return aggregateCollection(this, seedOrAccumulator, accumulator, elem => elem)
    } else {
      return aggregateCollection(this, seedOrAccumulator, accumulator, resultTransformFn)
    }
  }

  function Select (mapFn = x => x) {
    const _self = this

    return new Collection(function * () {
      for (let val of _self) {
        yield mapFn(val)
      }
    }())
  }

  /**
   * Distinct - Returns the distinct elemens from a sequence using the default equality compare function
   *
   * https://msdn.microsoft.com/de-de/library/system.linq.enumerable.distinct(v=vs.110).aspx
   * @return {Array}
   *//**
   * Distinct - Returns the distinct elemens from a sequence using a provided equality compare function
   *
   * https://msdn.microsoft.com/de-de/library/system.linq.enumerable.distinct(v=vs.110).aspx
   * @param {Function} equalityCompareFn The function of the form (first, second) => boolean determining if the values are equal
   * @return {Array}
   */
  function Distinct (equalityCompareFn = defaultEqualityCompareFn) {
    __assertFunction(equalityCompareFn)

    return removeDuplicates(this, equalityCompareFn)
  }




/* src/insert-and-remove.js */

/**
 * Add - Adds an element to the end of the array
 *
 * @see https://msdn.microsoft.com/de-de/library/3wcytfd1(v=vs.110).aspx
 * @param  {any}         value The value to add
 * @return {void}
 */
function Add (value) {
  return insertIntoArray(this, value)
}

/**
 * Insert - Adds an element to the specified index of the array
 *
 * @see https://msdn.microsoft.com/de-de/library/sey5k5z4(v=vs.110).aspx
 * @param  {any}         value The value to add
 * @param  {Number}      index The index to add the value to
 * @return {void}
 */
function Insert (value, index) {
  return insertIntoArray(this, value, index)
}

/**
 * Remove - Removes an element from an array
 *
 * @param  {any} value The value to remove
 * @return {Boolean}       True if the element was removed, false if not (or the element was not found)
 */
function Remove (value) {
  return removeFromArray(this, value)
}


  /* Export public interface */
  __export({ DefaultComparator, install, Min, Max, Average, Sum, Concat, Union, Where, Count, Any, All, ElementAt, Take, TakeWhile, Skip, SkipWhile, Contains, First, FirstOrDefault, Last, LastOrDefault, Single, SingleOrDefault, DefaultIfEmpty, DefaultComparator, MinHeap, MaxHeap, Order, OrderCompare, OrderBy, OrderDescending, OrderByDescending, Aggregate, Distinct, Select, Add, Insert, Remove })
}))
  }())