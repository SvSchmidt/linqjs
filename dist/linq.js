/*!
 * linqjs v0.0.0
 * (c) Sven Schmidt 
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
'use strict';

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

    function Contains(elem) {
      return !!~this.indexOf(elem);
    }

    function First() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);

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

      return this.reverse().First(predicate);
    }

    function Single() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);

      var result = filterArray(this, predicate);

      if (result.length === 1) {
        return result[0];
      }

      throw new Error('Sequence contains more than one element');
    }

    /* Export public interface */
    __export({ install: install, Min: Min, Max: Max, Average: Average, Concat: Concat, Union: Union, Contains: Contains, First: First, Last: Last, Single: Single });
  });
})();
