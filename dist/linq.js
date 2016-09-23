/*!
 * linqjs v0.0.0
 * (c) Sven Schmidt 
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
  'use strict';

  // this || (0, eval)('this') is a robust way for getting a reference
  // to the global object

  var window = this || (0, eval)('this'); // jshint ignore:line
  (function (factory) {
    try {
      if (typeof define === 'function' && define.amd) {
        // AMD asynchronous module definition (e.g. requirejs)
        define(['require', 'exports'], factory);
      } else if (exports && module && module.exports) {
        // CommonJS/Node.js where module.exports is for nodejs
        factory(exports || module.exports);
      }
    } catch (err) {
      // no module loader (simple <script>-tag) -> assign Maybe directly to the global object
      // -> (0, eval)('this') is a robust way for getting a reference to the global object
      factory(window.linqjs = {}); // jshint ignore:line
    }
  })(function (linqjs) {

    /* src/helpers/defaults.js */

    function defaultEqualityCompareFn(first, second) {
      return toJSON(first) === toJSON(second);
    }

    /* src/helpers/assert.js */

    function __assert(condition, msg) {
      if (!condition) {
        throw new Error(msg);
      }
    }

    function __assertFunction(param) {
      __assert(isFunction(param), 'Parameter must be function!');
    }

    function __assertArray(param) {
      __assert(isArray(param), 'Parameter must be array!');
    }

    function __assertNotEmpty(arr) {
      __assert(isArray(arr));
      __assert(!isEmpty(arr), 'Sequence is empty');
    }

    function __assertIterable(obj) {
      __assert(isIterable(obj), 'Parameter must be iterable!');
    }

    function __assertIterationNotStarted(collection) {
      var iterationStarted = 'StartedIterating' in collection && collection.StartedIterating();
      __assert(!iterationStarted, 'Iteration already started!');
    }

    function __assertString(obj) {
      __assert(isString(obj), 'Parameter must be string!');
    }

    function __assertIndexInRange(arr, index) {
      __assertArray(arr);
      __assertAllNumeric(index);
      __assert(index >= 0 && index <= arr.length, 'array index is out of bounds');
    }

    /* src/helpers/is.js */

    function isArray(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    }

    function isFunction(obj) {
      return typeof obj === 'function';
    }

    function isNumeric(n) {
      return !isNaN(parseFloat(n));
    }

    function isEmpty(arr) {
      __assertArray(arr);

      return arr.length === 0;
    }

    function isIterable(obj) {
      return Symbol.iterator in obj;
    }

    function isString(obj) {
      return typeof obj === 'string';
    }

    /* src/helpers.js */

    function toJSON(obj) {
      return JSON.stringify(obj);
    }

    function __assign(target, source) {
      target = Object(target);

      if (Object.hasOwnProperty('assign') && typeof Object.assign === 'function') {
        Object.assign(target, source);
      } else {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    }

    function __export(obj) {
      __assign(linqjs, obj);
    }

    function isES6() {
      // use evaluation to prevent babel to transpile this test into ES5
      return new Function('\n      try {\n        return (() => true)();\n      } catch (err) {\n        return false\n      }\n    ')();
    }

    /**
     * paramOrValue - Helper method to get the passed parameter or a default value if it is undefined
     *
     * @param  {any} param The parameter to check
     * @param  {any} value Value to return when param is undefined
     * @return {any}
     */
    function paramOrValue(param, value) {
      return typeof param === 'undefined' ? value : param;
    }

    function filterArray(arr) {
      var predicate = arguments.length <= 1 || arguments[1] === undefined ? function (elem, index) {
        return true;
      } : arguments[1];
      var stopAfter = arguments.length <= 2 || arguments[2] === undefined ? Infinity : arguments[2];

      __assert(isArray(arr), 'arr must be array!');
      __assertFunction(predicate);
      __assert(isNumeric(stopAfter), 'stopAfter must be numeric!');

      var result = [];
      var length = arr.length;

      for (var i = 0; i < length; i++) {
        if (predicate(arr[i], i)) {
          result.push(arr[i]);

          if (result.length >= stopAfter) {
            break;
          }
        }
      }

      return result;
    }

    function aggregateArray(arr, seed, accumulator, resultTransformFn) {
      __assertFunction(accumulator);
      __assertFunction(resultTransformFn);
      __assertNotEmpty(arr);

      return resultTransformFn([seed].concat(arr).reduce(accumulator));
    }

    function removeDuplicates(arr) {
      var equalityCompareFn = arguments.length <= 1 || arguments[1] === undefined ? defaultEqualityCompareFn : arguments[1];

      __assert(isArray(arr), 'arr must be array!');
      __assertFunction(equalityCompareFn);

      var result = [];
      var length = arr.length;

      outer: for (var i = 0; i < length; i++) {
        var current = arr[i];

        inner: for (var j = 0; j < result.length; j++) {
          if (equalityCompareFn(current, result[j])) {
            continue outer;
          }
        }

        result.push(current);
      }

      return result;
    }

    /**
     * emptyArray - Helper function to remove all elements from an array (by modifying the original and not returning a new one)
     *
     * @param  {Array} arr The array to remove all elements form
     * @return {void}
     */
    function emptyArray(arr) {
      __assertArray(arr);

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
    function insertIntoArray(arr, value, index) {
      index = paramOrValue(index, arr.length);
      __assertIndexInRange(arr, index);

      var before = arr.slice(0, index);
      var after = arr.slice(index);

      emptyArray(arr);

      arr.unshift.apply(arr, _toConsumableArray(Array.prototype.concat.apply([], [before, value, after])));
    }

    function removeFromArray(arr, value) {
      __assertArray(arr);

      var elemsBefore = [];
      var elemFound = false;
      var current = void 0;

      // remove all elements from the array (shift) and push them into a temporary variable until the desired element was found
      while ((current = arr.shift()) && !(elemFound = defaultEqualityCompareFn(current, value))) {
        elemsBefore.push(current);
      }

      // add the temporary values back to the array (to the front)
      // -> unshift modifies the original array instead of returning a new one
      arr.unshift.apply(arr, elemsBefore);

      return elemFound;
    }

    var nativeConstructors = [Object, Number, Boolean, String, Symbol];

    function isNative(obj) {
      return (/native code/.test(Object(obj).toString()) || !!~nativeConstructors.indexOf(obj)
      );
    }

    function getDefault() {
      var constructorOrValue = arguments.length <= 0 || arguments[0] === undefined ? Object : arguments[0];

      if (constructorOrValue && isNative(constructorOrValue) && typeof constructorOrValue === 'function') {
        var defaultValue = constructorOrValue();

        if (defaultValue instanceof Object || constructorOrValue === Date) {
          return null;
        } else {
          return defaultValue;
        }
      }

      return constructorOrValue;
    }

    /* src/linq.js */

    function install() {
      __assign(Array.prototype, linqjs);
    }

    /* src/math.js */

    function __assertAllNumeric(arr) {}

    function Min() {
      var mapFn = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return x;
      } : arguments[0];

      __assertFunction(mapFn);
      __assertNotEmpty(this);

      return Math.min.apply(null, this.map(mapFn));
    }

    function Max() {
      var mapFn = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return x;
      } : arguments[0];

      __assertFunction(mapFn);
      __assertNotEmpty(this);

      return Math.max.apply(null, this.map(mapFn));
    }

    function Sum() {
      __assertNotEmpty(this);

      return this.reduce(function (prev, curr) {
        return prev + curr;
      });
    }

    function Average() {
      __assertNotEmpty(this);

      return Sum.call(this) / this.length;
    }

    /* src/concatenation.js */

    function Concat(second) {
      __assert(isArray(second), 'second must be an array!');

      return Array.prototype.concat.apply(this, second);
    }

    function Union(second) {
      var equalityCompareFn = arguments.length <= 1 || arguments[1] === undefined ? defaultEqualityCompareFn : arguments[1];

      return removeDuplicates(this.Concat(second), equalityCompareFn);
    }

    /* src/search.js */

    function Where() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (elem, index) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);

      return filterArray(this, predicate);
    }

    /**
     * Count - Returns the amount of elements matching a predicate or the array length if no parameters given
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.count(v=vs.110).aspx
     * @param  {Function} predicate
     * @return {Number}
     */
    function Count() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (elem) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);

      return filterArray(this, predicate).length;
    }

    /**
     * Any - Returns true if at least one element matches the predicate or if no predicate is given but the sequence contains at least one element
     *
     * @see https://msdn.microsoft.com/de-de/library/bb337697(v=vs.110).aspx
     * @param  {Function} predicate
     * @return {Boolean}
     */
    function Any(predicate) {
      if (!predicate) {
        return this.length > 0;
      }

      __assertFunction(predicate);
      return filterArray(this, predicate, 1).length > 0;
    }

    /**
     * All - Returns true if all elements match the predicate
     *
     * @see https://msdn.microsoft.com/de-de/library/bb548541(v=vs.110).aspx
     * @param  {Function} predicate
     * @return {Boolean}
     */
    function All() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (elem) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);

      // All is equal to the question if there's no element which does not match the predicate
      // 'all fruits are yellow' -> 'there is no fruit which is not yellow'
      return !this.Any(function (x) {
        return !predicate(x);
      });
    }

    /* src/access.js */

    function Contains(elem) {
      return !!~this.indexOf(elem);
    }

    /**
     * ElementAt - Returns the element at the given index
     *
     * @see https://msdn.microsoft.com/de-de/library/bb299233(v=vs.110).aspx
     * @param  {Number} index
     * @return {any}
     */
    function ElementAt(index) {
      __assert(index < this.length && index >= 0, 'Array index is out of bounds!');
      __assert(isNumeric(index), 'Index must be numeric!');

      return this[index];
    }

    /**
     * Take - Returns count elements of the sequence starting from the beginning
     *
     * @see https://msdn.microsoft.com/de-de/library/bb503062(v=vs.110).aspx
     * @param  {Number} count = 0 number of elements to be returned
     * @return {Array}
     */
    function Take() {
      var count = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      __assert(isNumeric(count), 'First parameter must be numeric!');

      if (count <= 0) {
        return [];
      }

      return this.slice(0, count);
    }

    /**
     * findFirstNonMatchingIndex - Returns the first index of the array which does not match the predicate
     *
     * @param  {Array} arr
     * @param  {Function} predicate
     * @return {Number}
     */
    function findFirstNonMatchingIndex(arr, predicate) {
      __assertArray(arr);

      var length = arr.length;

      for (var i = 0; i < length; i++) {
        if (!predicate(arr[i], i)) {
          return i;
        }
      }

      return arr.length - 1;
    }

    /**
     * Skip - Skips count elements of the sequence and returns the remaining ones
     *
     * @see https://msdn.microsoft.com/de-de/library/bb358985(v=vs.110).aspx
     * @param  {Nu,ber count = 0 amount of elements to skip
     * @return {Array}
     */
    function Skip() {
      var count = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      __assert(isNumeric(count), 'First parameter must be numeric!');

      if (count <= 0) {
        return this;
      }

      return this.slice(count, this.length);
    }

    /**
     * TakeWhile - Takes elements from the beginning of a sequence until the predicate yields false for an element
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.takewhile(v=vs.110).aspx
     * @param  {Function} predicate     the predicate of the form elem => boolean or (elem, index) => boolean
     * @return {Array}
     */
    function TakeWhile() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (elem, index) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);

      return this.Take(findFirstNonMatchingIndex(this, predicate));
    }

    /**
     * SkipWhile - Skips elements in the array until the predicate yields false and returns the remaining elements
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.skipwhile(v=vs.110).aspx
     * @param  {type} predicate         the predicate of the form elem => boolean or (elem, index) => boolean
     * @return {Array}
     */
    function SkipWhile() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (elem, index) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);

      return this.Skip(findFirstNonMatchingIndex(this, predicate));
    }

    function First() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);
      __assertNotEmpty(this);

      var result = filterArray(this, predicate, 1);

      if (result[0]) {
        return result[0];
      }

      return null;
    }

    function resultOrDefault(arr, originalFn) {
      var predicateOrConstructor = arguments.length <= 2 || arguments[2] === undefined ? function (x) {
        return true;
      } : arguments[2];
      var constructor = arguments.length <= 3 || arguments[3] === undefined ? Object : arguments[3];

      __assertArray(arr);

      var predicate = void 0;

      if (isNative(predicateOrConstructor)) {
        predicate = function predicate(x) {
          return true;
        };
        constructor = predicateOrConstructor;
      } else {
        predicate = predicateOrConstructor;
      }

      __assertFunction(predicate);
      __assert(isNative(constructor), 'constructor must be native constructor, e.g. Number!');

      if (!isEmpty(arr)) {
        var result = originalFn.call(arr, predicate);

        if (result) {
          return result;
        }
      }

      return getDefault(constructor);
    }

    function FirstOrDefault() {
      var predicateOrConstructor = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];
      var constructor = arguments.length <= 1 || arguments[1] === undefined ? Object : arguments[1];

      return resultOrDefault(this, First, predicateOrConstructor, constructor);
    }

    function Last() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);
      __assertNotEmpty(this);

      return this.reverse().First(predicate);
    }

    function LastOrDefault() {
      var predicateOrConstructor = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];
      var constructor = arguments.length <= 1 || arguments[1] === undefined ? Object : arguments[1];

      return resultOrDefault(this, Last, predicateOrConstructor, constructor);
    }

    function Single() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);
      __assertNotEmpty(this);

      var result = filterArray(this, predicate);

      if (result.length === 1) {
        return result[0];
      }

      throw new Error('Sequence contains more than one element');
    }

    function SingleOrDefault() {
      var predicateOrConstructor = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];
      var constructor = arguments.length <= 1 || arguments[1] === undefined ? Object : arguments[1];

      return resultOrDefault(this, Single, predicateOrConstructor, constructor);
    }

    /**
     * DefaultIfEmpty - Returns the array or a new array containing the provided constructors default if empty
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.defaultifempty(v=vs.110).aspx
     * @param {Function} constructor A native constructor to get the default for, e.g. Number
     * @return {Array} 
     */ /**
        * DefaultIfEmpty - Returns the array or a new array containing the provided default value if empty
        *
        * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.defaultifempty(v=vs.110).aspx
        * @param {any} value The default vlaue
        * @return {Array}
        */
    function DefaultIfEmpty(constructorOrValue) {
      if (!isEmpty(this)) {
        return this;
      }

      return [getDefault(constructorOrValue)];
    }

    /* src/heap.js */

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
    var DefaultComparator = function DefaultComparator(a, b) {
      if (a < b) {
        return -1;
      }
      if (b < a) {
        return 1;
      }
      return 0;
    };

    /**
     * HeapElement class that also provides the element index for sorting.
     */
    var HeapElement = function () {

      /**
       * Creates a new HeapElement.
       * 
       * @param {number} index Element index.
       * @param {T}      value Element value.
       * @param {any}    <T>   Value type.
       */
      function HeapElement(index, value) {
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
      HeapElement.CreateHeapElement = function CreateHeapElement(index, obj) {
        if (obj === undefined || obj.__isHeapElementInstance) {
          return obj;
        }
        return new HeapElement(index, obj);
      };

      return HeapElement;
    }();

    /*
     * Partially sorted heap that contains the smallest element within root position.
     */
    var MinHeap = function () {

      /**
       * Creates the heap from the array of elements with the given comparator function.
       * 
       * @param {T[]}              elements   Array with elements to create the heap from.
       *                                      Will be modified in place for heap logic.
       * @param {(T, T) => number} comparator Comparator function (same as the one for Array.sort()).
       * @param {any}              <T>        Heap element type.
       */
      function MinHeap(elements) {
        var comparator = arguments.length <= 1 || arguments[1] === undefined ? DefaultComparator : arguments[1];

        __assertArray(elements);
        __assertFunction(comparator);

        // we do not wrap elements here since the heapify function does that the moment it encounters elements
        this.elements = elements;

        // create comparator that works on heap elements (it also ensures equal elements remain in original order)
        this.comparator = function (a, b) {
          var res = comparator(a.__value, b.__value);
          if (res !== 0) {
            return res;
          }
          return DefaultComparator(a.__index, b.__index);
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
      function heapify(elements, comparator, i) {
        var right = 2 * (i + 1);
        var left = right - 1;
        var bestIndex = i;

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
          var tmp = elements[i];
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

        // sepecial case: empty array
        if (elements.length === 0) {

          // nothing to do here
          return;
        }

        for (var i = Math.floor(elements.length / 2); i >= 0; i--) {

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

        var topElement = this.elements[0];
        var tmp = this.elements.pop();
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
        var heap = this;
        return {
          next: function next() {
            if (heap.hasTopElement()) {
              return {
                done: false,
                value: heap.getTopElement()
              };
            }
            return {
              done: true
            };
          }
        };
      };

      return MinHeap;
    }();

    /*
     * Partially sorted heap that contains the largest element within root position.
     */
    var MaxHeap = function () {

      /**
       * Creates the heap from the array of elements with the given comparator function.
       * 
       * @param {T[]}               elements   Array with elements to create the heap from.
       *                                       Will be modified in place for heap logic.
       * @param {(T, T) => boolean} comparator Comparator function (same as the one for Array.sort()).
       * @param {any}               <T>        Heap element type.
       */
      function MaxHeap(elements) {
        var comparator = arguments.length <= 1 || arguments[1] === undefined ? DefaultComparator : arguments[1];

        __assertArray(elements);
        __assertFunction(comparator);

        // simply negate the result of the comparator function so we get reverse ordering within the heap
        MinHeap.apply(this, [elements, function (a, b) {
          return -1 * comparator(a, b);
        }]);
      }

      // inheritance stuff (we don't want to implement stuff twice)
      MaxHeap.prototype = Object.create(MinHeap.prototype);
      MaxHeap.prototype.constructor = MaxHeap;

      return MaxHeap;
    }();

    /* src/transformation.js */

    /**
     * Aggregate - applies a accumulator function to a sequence
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
     * @param {Function} accumulator The accumulator function of the form (prev, current) => any
     * @return {any} the result of the accumulation
     */ /**
        * Aggregate - applies a accumulator function to a sequence. Starts with seed.
        *
        * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
        * @param {any} seed The starting value of the accumulation
        * @param {Function} accumulator The accumulator function of the form (prev, current) => any
        * @return {any} the result of the accumulation
        */ /**
           * Aggregate - applies a accumulator function to a sequence. Starts with seed and transforms the result using resultTransformFn.
           *
           * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
           * @param {any} seed The starting value of the accumulation
           * @param {Function} accumulator The accumulator function of the form (prev, current) => any
           * @param {Function} resultTransformFn A function to transform the result
           * @return {any} the result of the accumulation
           * @
           */
    function Aggregate(seedOrAccumulator, accumulator, resultTransformFn) {
      if (typeof seedOrAccumulator === 'function' && !accumulator && !resultTransformFn) {
        return aggregateArray(this.slice(1, this.length), this[0], seedOrAccumulator, function (elem) {
          return elem;
        });
      } else if (typeof seedOrAccumulator !== 'function' && typeof accumulator === 'function' && !resultTransformFn) {
        return aggregateArray(this, seedOrAccumulator, accumulator, function (elem) {
          return elem;
        });
      } else {
        return aggregateArray(this, seedOrAccumulator, accumulator, resultTransformFn);
      }
    }

    /**
     * Distinct - Returns the distinct elemens from a sequence using the default equality compare function
     *
     * https://msdn.microsoft.com/de-de/library/system.linq.enumerable.distinct(v=vs.110).aspx
     * @return {Array} 
     */ /**
        * Distinct - Returns the distinct elemens from a sequence using a provided equality compare function
        *
        * https://msdn.microsoft.com/de-de/library/system.linq.enumerable.distinct(v=vs.110).aspx
        * @param {Function} equalityCompareFn The function of the form (first, second) => boolean determining if the values are equal
        * @return {Array}
        */
    function Distinct() {
      var equalityCompareFn = arguments.length <= 0 || arguments[0] === undefined ? defaultEqualityCompareFn : arguments[0];

      __assertFunction(equalityCompareFn);

      return removeDuplicates(this, equalityCompareFn);
    }

    /* src/insert-and-remove.js */

    /**
     * Add - Adds an element to the end of the array
     *
     * @see https://msdn.microsoft.com/de-de/library/3wcytfd1(v=vs.110).aspx
     * @param  {any}         value The value to add
     * @return {void}
     */
    function Add(value) {
      return insertIntoArray(this, value);
    }

    /**
     * Insert - Adds an element to the specified index of the array
     *
     * @see https://msdn.microsoft.com/de-de/library/sey5k5z4(v=vs.110).aspx
     * @param  {any}         value The value to add
     * @param  {Number}      index The index to add the value to
     * @return {void}
     */
    function Insert(value, index) {
      return insertIntoArray(this, value, index);
    }

    /**
     * Remove - Removes an element from an array
     *
     * @param  {any} value The value to remove
     * @return {Boolean}       True if the element was removed, false if not (or the element was not found)
     */
    function Remove(value) {
      return removeFromArray(this, value);
    }

    /* src/collection.js */

    /*
     * Basic collection for lazy linq operations.
     */
    var LinqCollection = function () {

      /**
       * Creates a new LinqCollection from the given iterable.
       * 
       * @param {Iterable<T>} iterable Datasource for this collection.
       * @param {any}         <T>      Element type.
       */
      function LinqCollection(iterable) {
        __assertIterable(iterable);
        this._source = iterable;
        this.__startedIterating = false;
        this.__iterationIndex = 0;
      }

      /**
       * Hook function that will be called once before iterating.
       */
      LinqCollection.prototype._initialize = function _initialize() {
        this.__sourceIterator = this._source[Symbol.iterator]();
      };

      /**
       * Internal iterator.next() method.
       * 
       * @param {any} <T> Element type.
       * @return {IterationElement<T>} Next element when iterating.
       */
      LinqCollection.prototype._next = function _next() {
        return this.__sourceIterator.next();
      };

      /**
       * Internal function that ensures the _initialize() hook is invoked once.
       * This function also adds the iteration index to the result of _next().
       * 
       * @param {any} <T> Element type.
       * @return {IterationElement<T>} Next element when iterating.
       */
      LinqCollection.prototype.__wrappedNext = function __wrappedNext() {
        if (!this.__startedIterating) {
          this.__startedIterating = true;
          this._initialize();
        }
        var result = this._next();
        if (!result.done) {
          result.index = this.__iterationIndex;
          this.__iterationIndex++;
        }
        return result;
      };

      /**
       * Creates an array from this collection.
       * Iterates once over its elements.
       * 
       * @param {any} <T> Element type.
       * @return {T[]} Array with elements from this collection.
       */
      LinqCollection.prototype.ToArray = function ToArray() {
        return [].concat(_toConsumableArray(this));
      };

      /**
       * Returns wheather iteration has started or not.
       * If iteration has not been started yet, _initialize() has not yet been called.
       *
       * @return {boolean}
       */
      LinqCollection.prototype.StartedIterating = function StartedIterating() {
        return this.__startedIterating;
      };

      /**
       * Provides an iterator for this collection.
       * 
       * @param {any} <T> Element type.
       * @return {Iterator<T>} Iterator for this collection.
       */
      LinqCollection.prototype[Symbol.iterator] = function () {
        var _this = this;

        __assertIterationNotStarted(this);
        return {
          next: function next() {
            return _this.__wrappedNext();
          }
        };
      };

      return LinqCollection;
    }();

    /**
     * Creates a LinqCollection from the given iterable.
     * 
     * @param {Iterable<T>} iterable Datasource for the collection.
     * @param {any}         <T>      Element type.
     * @return {LinqCollection<T>} Created LinqCollection.
     */
    function Linq(iterable) {
      __assertIterable(iterable);
      return new LinqCollection(iterable);
    }

    /* src/ordered-collection.js */

    /*
     * Ordered linq collection.
     */
    var OrderedLinqCollection = function () {

      /**
       * Creates a new ordered linq collection using the given comparator and heap for sorting.
       * 
       * @param {Iterable<T>}       iterable        Datasource for this collection.
       * @param {(T, T) => boolean} comparator      Comparator for sorting.
       * @param {MinHeap|MaxHeap}   heapConstructor Heap implementation for sorting.
       * @param {any}               <T>             Element type.
       */
      function OrderedLinqCollection(iterable, comparator, heapConstructor) {
        __assertIterable(iterable);
        __assertFunction(comparator);
        __assertFunction(heapConstructor);
        LinqCollection.apply(this, [iterable]);

        this.__comparator = comparator;
        this.__heapConstructor = heapConstructor;
      }

      // inheritance stuff (we don't want to implement stuff twice)
      OrderedLinqCollection.prototype = Object.create(LinqCollection.prototype);
      OrderedLinqCollection.prototype.constructor = OrderedLinqCollection;

      /**
       * Specifies further sorting by the given comparator for equal elements.
       * 
       * @param {(T, T) => boolean} additionalComparator Comparator for sorting.
       * @param {any}               <T>                  Element type.
       * @return {OrderedLinqCollection<T>} Created ordered linq collection.
       */
      OrderedLinqCollection.prototype.ThenBy = function ThenBy(additionalComparator) {
        __assertIterationNotStarted(this);
        if (isString(additionalComparator)) {
          additionalComparator = GetComparatorFromKeySelector(additionalComparator);
        }
        __assertFunction(additionalComparator);

        // build new comparator function when not yet iterated
        var currentComparator = this.__comparator;
        this.__comparator = function (a, b) {
          var res = currentComparator(a, b);
          if (res !== 0) {
            return res;
          }
          return additionalComparator(a, b);
        };
        return this;
      };

      /**
       * Builds the heap for sorting.
       */
      OrderedLinqCollection.prototype._initialize = function _initialize() {

        // create array for heap
        var values = [].concat(_toConsumableArray(this._source));

        // create heap instance
        var heap = Reflect.construct(this.__heapConstructor, [values, this.__comparator]);

        // grab iterator for later use
        this.__heapIterator = heap[Symbol.iterator]();
      };

      /**
       * Returns the result of the heap iterator.
       * 
       * @param {any} <T> Element type.
       * @return {IterationElement<T>} Next element when iterating.
       */
      OrderedLinqCollection.prototype._next = function _next() {
        __assert(!!this.__heapIterator, 'No heap build!');
        return this.__heapIterator.next();
      };

      return OrderedLinqCollection;
    }();

    /*
     * Extend basis collection with ordering functions.
     */
    (function () {

      /**
       * Orderes this linq collection using the given comparator.
       * 
       * @param {(T, T) => boolean} comparator Comparator to be used.
       * @param {any}               <T>        Element type.
       * @return {OrderedLinqCollection<T>} Ordered collection.
       */
      LinqCollection.prototype.OrderBy = function OrderBy(comparator) {
        if (isString(comparator)) {
          comparator = GetComparatorFromKeySelector(comparator);
        }
        __assertFunction(comparator);
        return new OrderedLinqCollection(this, comparator, MinHeap);
      };

      /**
       * Orderes this linq collection in descending order using the given comparator.
       * 
       * @param {(T, T) => boolean} comparator Comparator to be used.
       * @param {any}               <T>        Element type.
       * @return {OrderedLinqCollection<T>} Ordered collection.
       */
      LinqCollection.prototype.OrderByDescending = function OrderByDescending(comparator) {
        if (isString(comparator)) {
          comparator = GetComparatorFromKeySelector(comparator);
        }
        __assertFunction(comparator);
        return new OrderedLinqCollection(this, comparator, MaxHeap);
      };
    })();

    /**
     * Creates a comparator function from the given selector string.
     * The selector string has to be in same format as within javascript code.
     * 
     * @param  {string} selector Javascript code selector string.
     * @return {(any, any) => boolean} Created comparator function.
     */
    function GetComparatorFromKeySelector(selector) {
      __assertString(selector);
      if (selector === '') {
        return Array.prototype.DefaultComparator;
      }
      if (!(selector.startsWith('[') || selector.startsWith('.'))) {
        selector = '.' + selector;
      }
      var result = void 0;
      eval('result = function (a, b) { return Array.prototype.DefaultComparator(a' + selector + ', b' + selector + ') }');
      return result;
    }

    /* Export public interface */
    __export({ install: install, Min: Min, Max: Max, Average: Average, Sum: Sum, Concat: Concat, Union: Union, Where: Where, Count: Count, Any: Any, All: All, ElementAt: ElementAt, Take: Take, TakeWhile: TakeWhile, Skip: Skip, SkipWhile: SkipWhile, Contains: Contains, First: First, FirstOrDefault: FirstOrDefault, Last: Last, LastOrDefault: LastOrDefault, Single: Single, SingleOrDefault: SingleOrDefault, DefaultIfEmpty: DefaultIfEmpty, DefaultComparator: DefaultComparator, MinHeap: MinHeap, MaxHeap: MaxHeap, Aggregate: Aggregate, Distinct: Distinct, Add: Add, Insert: Insert, Remove: Remove, LinqCollection: LinqCollection, Linq: Linq, GetComparatorFromKeySelector: GetComparatorFromKeySelector, OrderedLinqCollection: OrderedLinqCollection });
  });
})();
