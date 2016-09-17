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

    function isES6() {
      // use evaluation to prevent babel to transpile this test into ES5
      return new Function('\n      try {\n        return (() => true)();\n      } catch (err) {\n        return false\n      }\n    ')();
    }

    function capitalize(str) {
      str = String(str);

      return str.charAt(0).toUpperCase() + str.substr(1);
    }

    function isNative(obj) {
      return (/native code/.test(Object(obj).toString())
      );
    }

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

    function removeDuplicates(arr) {
      var equalityCompareFn = arguments.length <= 1 || arguments[1] === undefined ? function (a, b) {
        return a === b;
      } : arguments[1];

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

    function getDefault(constructor) {
      if (constructor && isNative(constructor) && typeof constructor === 'function') {
        var defaultValue = constructor();

        if (defaultValue instanceof Object || constructor === Date) {
          return null;
        } else {
          return defaultValue;
        }
      }

      return null;
    }
    /*
    Aggregate, All, Alternate, Any, Average, BufferWithCount, CascadeBreadthFirst, CascadeDepthFirst, Catch, Choice, Concat,
    Contains, Count, Cycle, DefaultIfEmpty, Distinct, Do, ElementAt, ElementAtOrDefault, Empty, Except, Finally, First, FirstOrDefault,
    Flatten, ForEach, Force, From, Generate, GetEnumerator, GroupBy, GroupJoin, IndexOf, Insert, Intersect, Join, Last, LastIndexOf,
    LastOrDefault, Let, Matches, Max, MaxBy, MemoizeAll, Min, MinBy, OfType, OrderBy, OrderByDescending, Pairwise, PartitionBy,
    Range, RangeDown, RangeTo, Repeat, RepeatWithFinalize, Return, Reverse, Scan, Select, SelectMany, SequenceEqual, Share, Shuffle,
    Single, SingleOrDefault, Skip, SkipWhile, Sum, Take, TakeExceptLast, TakeFromLast, TakeWhile, ThenBy, ThenByDescending, ToArray,
    ToDictionary, ToInfinity,ToJSON, ToLookup, ToNegativeInfinity, ToObject, ToString, Trace, Unfold, Union, Where, Write, WriteLine, Zip
    */

    function install() {
      __assign(Array.prototype, linqjs);
    }

    function __assertAllNumeric(arr) {}

    function Min() {
      var mapFn = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return x;
      } : arguments[0];

      __assertFunction(mapFn);

      return Math.min.apply(null, this.map(mapFn));
    }

    function Max() {
      var mapFn = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return x;
      } : arguments[0];

      __assertFunction(mapFn);

      return Math.max.apply(null, this.map(mapFn));
    }

    function Average() {
      var sum = this.reduce(function (prev, curr) {
        return prev + curr;
      });

      return sum / this.length;
    }

    function Concat(second) {
      __assert(isArray(second), 'second must be an array!');

      return Array.prototype.concat.apply(this, second);
    }

    function Union(second) {
      var equalityCompareFn = arguments.length <= 1 || arguments[1] === undefined ? function (a, b) {
        return a === b;
      } : arguments[1];

      return removeDuplicates(this.Concat(second), equalityCompareFn);
    }

    function Where() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (elem, index) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);

      return filterArray(this, predicate);
    }

    function Contains(elem) {
      return !!~this.indexOf(elem);
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

    function Last() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);
      __assertNotEmpty(this);

      return this.reverse().First(predicate);
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
    var defaultComparator = function defaultComparator(a, b) {
      if (a < b) {
        return -1;
      }
      if (b < a) {
        return 1;
      }
      return 0;
    };

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
        var comparator = arguments.length <= 1 || arguments[1] === undefined ? defaultComparator : arguments[1];

        __assertArray(elements);
        __assertFunction(comparator);

        this.comparator = comparator;
        this.elements = elements;

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

        // check if the element is currently misplaced
        if (left < elements.length && comparator(elements[left], elements[bestIndex]) < 0) {
          bestIndex = left;
        }
        if (right < elements.length && comparator(elements[right], elements[bestIndex]) < 0) {
          bestIndex = right;
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
        if (this.elements.length == 1) {
          return this.elements.pop();
        }

        var topElement = this.elements[0];
        var tmp = this.elements.pop();
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
        var comparator = arguments.length <= 1 || arguments[1] === undefined ? defaultComparator : arguments[1];

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

    /**
     * Creates an array from the values of the given iterable.
     * 
     * @param  {Iterable<T>} iterable Iterable to create an array from.
     * @param  {any}         <T>      Element type.
     * 
     * @return {T[]} Array with elements from the iterator.
     */
    function getArrayFromIterable(iterable) {
      return [].concat(_toConsumableArray(iterable));
    } // TODO: change implementation to use iterators!

    function Order() {
      return this.OrderBy(defaultComparator);
    }

    function OrderCompare() {
      return this.sort(defaultComparator);
    }

    function OrderBy(comparator) {
      __assertFunction(comparator);
      var heap = new MinHeap(this, comparator);
      return getArrayFromIterable(heap);
    }

    function OrderDescending() {
      return this.OrderByDescending(defaultComparator);
    }

    function OrderByDescending(comparator) {
      __assertFunction(comparator);
      var heap = new MaxHeap(this, comparator);
      return getArrayFromIterable(heap);
    }

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function getTimestamp() {
      return new Date().getTime();
    }

    function HeapSpeedTest() {
      var aFaster = 0;
      var bFaster = 0;
      var equallyFast = 0;
      for (var test = 1; test <= 100; test++) {
        var list = [];
        var length = getRandomInt(10, 1000 * test);
        var take = getRandomInt(1, 10);
        for (var i = 0; i < length; i++) {
          list.push(getRandomInt(-1000000, 1000000));
        }
        var listA = list;
        var listB = list.slice(0);
        console.log('Test #' + test + ' with ' + length + ' random elements, taking the first ' + take + ':');

        var startA = getTimestamp();
        var resA = listA.sort(defaultComparator).slice(0, take);
        var endA = getTimestamp();
        var timeA = endA - startA;
        console.log(' -> Array.sort() finished after ' + timeA + ' milliseconds');

        var startB = getTimestamp();
        var heap = new MinHeap(listB, defaultComparator);
        var iterator = heap[Symbol.iterator]();
        var resB = [];
        for (var _i = 0; _i < take; _i++) {
          resB.push(iterator.next().value);
        }
        var endB = getTimestamp();
        var timeB = endB - startB;
        if (timeB > timeA) {
          console.warn(' -> Heap finished after ' + timeB + ' milliseconds and took ' + (timeB - timeA) + ' milliseconds longer');
        } else {
          console.log(' -> Heap finished after ' + timeB + ' milliseconds');
        }

        var success = true;
        for (var _i2 = 0; _i2 < length; _i2++) {
          if (resA[_i2] !== resB[_i2]) {
            success = false;
            break;
          }
        }
        if (success) {
          console.log(' -> Finished successfully.');
        } else {
          console.error(' -> Finished with different results!', resA, resB);
        }

        if (timeA < timeB) {
          aFaster++;
        } else if (timeB < timeA) {
          bFaster++;
        } else {
          equallyFast++;
        }
      }

      var total = aFaster + bFaster + equallyFast;
      console.log('Array.sort() was faster: ' + aFaster + '/' + total);
      console.log('Heap         was faster: ' + bFaster + '/' + total);
      console.log('Both where equally fast: ' + equallyFast + '/' + total);
    }

    /* Export public interface */
    __export({ install: install, Min: Min, Max: Max, Average: Average, Concat: Concat, Union: Union, Where: Where, Contains: Contains, First: First, Last: Last, Single: Single, Order: Order, OrderCompare: OrderCompare, OrderBy: OrderBy, OrderDescending: OrderDescending, OrderByDescending: OrderByDescending, HeapSpeedTest: HeapSpeedTest });
  });
})();
