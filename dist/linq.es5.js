/*!
 * linqjs v0.0.0
 * (c) Sven Schmidt 
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
  'use strict';

  // this || (0, eval)('this') is a robust way for getting a reference
  // to the global object

  var window = this || (0, eval)('this'); // jshint ignore:line
  var DEBUG = true;

  (function (Collection) {
    try {
      if (typeof define === 'function' && define.amd) {
        // AMD asynchronous module definition (e.g. requirejs)
        define(['require', 'exports'], function () {
          return Collection;
        });
      } else if (exports && module && module.exports) {
        // CommonJS/Node.js where module.exports is for nodejs
        exports = module.exports = Collection;
      }
    } catch (err) {
      // no module loader (simple <script>-tag) -> assign Maybe directly to the global object
      window.Collection = Collection;
    }
  })(function () {
    var _export;

    // We will apply any public methods to linqjsExports and apply them to the Collection.prototype later
    var linqjsExports = {};
    // Collection is the object we're gonna 'build' and return later
    var Collection = void 0;

    /* src/collection.js */

    /**
     * Collection - Represents a collection of iterable values
     *
     * @class
     * @param  {Iterable|GeneratorFunction} iterableOrGenerator A iterable to create a collection of, e.g. an array or a generator function
     */
    Collection = function () {
      function Collection(iterableOrGenerator) {
        __assert(isIterable(iterableOrGenerator) || isGenerator(iterableOrGenerator), 'Parameter must be iterable or generator!');

        this.iterable = iterableOrGenerator;
      }

      Collection.prototype = function () {
        function next() {
          if (!this.started) {
            this.started = true;
            this.iterator = this.getIterator();
          }

          return this.iterator.next();
        }

        function reset() {
          this.started = false;
        }

        function getIterator() {
          var iter = this.iterable;

          if (isGenerator(iter)) {
            return iter();
          } else {
            return regeneratorRuntime.mark(function _callee() {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      return _context.delegateYield(iter, 't0', 1);

                    case 1:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, this);
            })();
          }
        }

        return { next: next, reset: reset, getIterator: getIterator };
      }();

      Collection.prototype[Symbol.iterator] = regeneratorRuntime.mark(function _callee2() {
        var current;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                current = void 0;

              case 1:
                if (!true) {
                  _context2.next = 10;
                  break;
                }

                current = this.next();

                if (!current.done) {
                  _context2.next = 6;
                  break;
                }

                this.reset();
                return _context2.abrupt('break', 10);

              case 6:
                _context2.next = 8;
                return current.value;

              case 8:
                _context2.next = 1;
                break;

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      });

      return Collection;
    }();

    /* src/collection-static.js */

    /**
     * Same as new Collection()
     * @function from
     * @memberof Collection
     * @static
     * @return {Collection}
     */
    function from(iterable) {
      return new Collection(iterable);
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
    function Range(start, count) {
      __assertNumberBetween(count, 0, Infinity);

      return new Collection(regeneratorRuntime.mark(function _callee3() {
        var i;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                i = start;

              case 1:
                if (!(i != count + start)) {
                  _context3.next = 6;
                  break;
                }

                _context3.next = 4;
                return i++;

              case 4:
                _context3.next = 1;
                break;

              case 6:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
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
    function Repeat(val, count) {
      __assertNumberBetween(count, 0, Infinity);

      return new Collection(regeneratorRuntime.mark(function _callee4() {
        var i;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                i = 0;

              case 1:
                if (!(i < count)) {
                  _context4.next = 7;
                  break;
                }

                _context4.next = 4;
                return val;

              case 4:
                i++;
                _context4.next = 1;
                break;

              case 7:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));
    }

    Object.defineProperty(Collection, 'Empty', {
      get: function get() {
        return Collection.from([]);
      }
    });

    var collectionStaticMethods = { from: from, From: from, Range: Range, Repeat: Repeat };

    __assign(Collection, collectionStaticMethods);

    /* src/helpers/defaults.js */

    function defaultEqualityCompareFn(first, second) {
      return toJSON(first) === toJSON(second);
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
    function DefaultComparator(a, b) {
      if (a < b) {
        return -1;
      }
      if (b < a) {
        return 1;
      }
      return 0;
    };

    /* src/helpers/assert.js */

    var AssertionError = function (_Error) {
      _inherits(AssertionError, _Error);

      function AssertionError(expected, got) {
        _classCallCheck(this, AssertionError);

        return _possibleConstructorReturn(this, (AssertionError.__proto__ || Object.getPrototypeOf(AssertionError)).call(this, 'Expected ' + expected + ', got ' + got + '!'));
      }

      return AssertionError;
    }(Error);

    function __assert(condition) {
      if (!condition) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        if (args.length === 1) {
          throw new Error(msg);
        } else if (args.length === 2) {
          throw new (Function.prototype.bind.apply(AssertionError, [null].concat(args)))();
        }
      }
    }

    function __assertFunction(param) {
      __assert(isFunction(param), 'function', param);
    }

    function __assertArray(param) {
      __assert(isArray(param), 'array', param);
    }

    function __assertNotEmpty(coll) {
      __assert(!isEmpty(coll), 'Sequence is empty!');
    }

    function __assertIterable(obj) {
      __assert(isIterable(obj), 'iterable', obj);
    }

    function __assertCollection(obj) {
      __assert(isCollection(obj), 'collection', obj);
    }

    function __assertString(obj) {
      __assert(isString(obj), 'string', obj);
    }

    function __assertNumeric(obj) {
      __assert(isNumeric(obj), 'numeric value', obj);
    }

    function __assertNumberBetween(num, min) {
      var max = arguments.length <= 2 || arguments[2] === undefined ? Infinity : arguments[2];

      __assertNumeric(num);
      __assert(num >= min && num <= max, 'Number must be between ' + min + ' and ' + max + '!');
    }

    function __assertIndexInRange(coll, index) {
      __assertCollection(coll);
      __assert(isNumeric(index), 'number', index);
      __assert(index >= 0 && index < coll.Count(), 'Index is out of bounds');
    }

    /* src/helpers/is.js */

    function isArray(obj) {
      return obj instanceof [].constructor;
    }

    function isFunction(obj) {
      return typeof obj === 'function';
    }

    function isNumeric(n) {
      return !isNaN(parseFloat(n));
    }

    function isEmpty(coll) {
      if (isCollection(coll)) {
        return isEmpty(coll.Take(1).ToArray());
      }

      return coll.length === 0;
    }

    function isIterable(obj) {
      return Symbol.iterator in Object(obj);
    }

    function isString(obj) {
      return typeof obj === 'string';
    }

    function isCollection(obj) {
      return obj instanceof Collection;
    }

    function isGenerator(obj) {
      return obj instanceof regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }).constructor;
    }

    function isUndefined(obj) {
      return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined));
    }

    /* src/helpers/helpers.js */

    function toJSON(obj) {
      return JSON.stringify(obj);
    }

    function __assign(target, source) {
      Object.assign(Object(target), source);

      return target;
    }

    function __export(obj) {
      __assign(linqjsExports, obj);
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

    function aggregateCollection(coll, seed, accumulator, resultTransformFn) {
      __assertFunction(accumulator);
      __assertFunction(resultTransformFn);
      __assertNotEmpty(coll);

      return resultTransformFn([seed].concat(coll).reduce(accumulator));
    }

    function removeDuplicates(coll) {
      var equalityCompareFn = arguments.length <= 1 || arguments[1] === undefined ? defaultEqualityCompareFn : arguments[1];

      __assertIterable(coll);
      __assertFunction(equalityCompareFn);

      var previous = [];

      return new Collection(regeneratorRuntime.mark(function _callee6() {
        var iter, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, val, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, prev;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                iter = coll.getIterator();
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context6.prev = 4;
                _iterator = iter[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context6.next = 40;
                  break;
                }

                val = _step.value;
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context6.prev = 11;
                _iterator2 = previous[Symbol.iterator]();

              case 13:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context6.next = 20;
                  break;
                }

                prev = _step2.value;

                if (!equalityCompareFn(val, prev)) {
                  _context6.next = 17;
                  break;
                }

                return _context6.abrupt('continue', 37);

              case 17:
                _iteratorNormalCompletion2 = true;
                _context6.next = 13;
                break;

              case 20:
                _context6.next = 26;
                break;

              case 22:
                _context6.prev = 22;
                _context6.t0 = _context6['catch'](11);
                _didIteratorError2 = true;
                _iteratorError2 = _context6.t0;

              case 26:
                _context6.prev = 26;
                _context6.prev = 27;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 29:
                _context6.prev = 29;

                if (!_didIteratorError2) {
                  _context6.next = 32;
                  break;
                }

                throw _iteratorError2;

              case 32:
                return _context6.finish(29);

              case 33:
                return _context6.finish(26);

              case 34:

                previous.push(val);

                _context6.next = 37;
                return val;

              case 37:
                _iteratorNormalCompletion = true;
                _context6.next = 6;
                break;

              case 40:
                _context6.next = 46;
                break;

              case 42:
                _context6.prev = 42;
                _context6.t1 = _context6['catch'](4);
                _didIteratorError = true;
                _iteratorError = _context6.t1;

              case 46:
                _context6.prev = 46;
                _context6.prev = 47;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 49:
                _context6.prev = 49;

                if (!_didIteratorError) {
                  _context6.next = 52;
                  break;
                }

                throw _iteratorError;

              case 52:
                return _context6.finish(49);

              case 53:
                return _context6.finish(46);

              case 54:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[4, 42, 46, 54], [11, 22, 26, 34], [27,, 29, 33], [47,, 49, 53]]);
      }));
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

    function getParameterCount(fn) {
      __assertFunction(fn);

      return fn.length;
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
     */ /**
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
    function Min() {
      var mapFn = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return x;
      } : arguments[0];

      __assertFunction(mapFn);
      __assertNotEmpty(this);

      return Math.min.apply(null, this.Select(mapFn).ToArray());
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
     */ /**
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
    function Max() {
      var mapFn = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return x;
      } : arguments[0];

      __assertFunction(mapFn);
      __assertNotEmpty(this);

      return Math.max.apply(null, this.Select(mapFn).ToArray());
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
     */ /**
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
    function Sum() {
      var mapFn = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return x;
      } : arguments[0];

      __assertNotEmpty(this);

      return this.Select(mapFn).Aggregate(0, function (prev, curr) {
        return prev + curr;
      });
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
     */ /**
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
    function Average() {
      var mapFn = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return x;
      } : arguments[0];

      __assertNotEmpty(this);

      return this.Sum(mapFn) / this.Count();
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
     * @param  {iterable} second               The second sequence to concat with the first one
     * @return {Collection}                      A new collection of the resulting pairs
     */
    function Concat(second) {
      __assertIterable(second);

      var firstIter = this.getIterator();

      return new Collection(regeneratorRuntime.mark(function _callee7() {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.delegateYield(firstIter, 't0', 1);

              case 1:
                return _context7.delegateYield(second, 't1', 2);

              case 2:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));
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
     * @param {iterable} second The sequence to create the set union with
     * @return {Collction}
     */ /**
        * Union - Concatenates two sequences and removes duplicate values (produces the set union).
        * A custom equality comparator is used to compare values for equality.
        *
        * @method
        * @memberof Collection
        * @instance
        * @param {Function} equalityCompareFn A function of the form (first, second) => Boolean to determine whether or not two values are considered equal
        * @return {Number}
        */
    function Union(second) {
      var equalityCompareFn = arguments.length <= 1 || arguments[1] === undefined ? defaultEqualityCompareFn : arguments[1];

      __assertIterable(second);

      return this.Concat(second).Distinct(equalityCompareFn);
    }

    /**
     * Join - Correlates the elements of two sequences based on matching keys
     *
     * @see https://msdn.microsoft.com/de-de/library/bb534675(v=vs.110).aspx
     * @param  {iterable} second               The second sequence to join with the first one
     * @param  {Function} firstKeySelector     A selector fn to extract the key from the first sequence
     * @param  {Function} secondKeySelector    A selector fn to extract the key from the second sequence
     * @param  {Function} resultSelectorFn     A fn to transform the pairings into the result
     * @param  {Function} keyEqualityCompareFn Optional fn to compare the keys
     * @return {Collection}                      A new collection of the resulting pairs
     */
    function Join(second, firstKeySelector, secondKeySelector, resultSelectorFn, keyEqualityCompareFn) {
      __assertIterable(second);
      __assertFunction(firstKeySelector);
      __assertFunction(secondKeySelector);
      __assertFunction(resultSelectorFn);
      keyEqualityCompareFn = paramOrValue(keyEqualityCompareFn, defaultEqualityCompareFn);
      __assertFunction(keyEqualityCompareFn);

      var firstIter = this.getIterator();

      return new Collection(regeneratorRuntime.mark(function _callee8() {
        var secondIter, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, firstValue, firstKey, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, secondValue, secondKey;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                secondIter = second[Symbol.iterator]();
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context8.prev = 4;
                _iterator3 = firstIter[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                  _context8.next = 40;
                  break;
                }

                firstValue = _step3.value;
                firstKey = firstKeySelector(firstValue);
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context8.prev = 12;
                _iterator4 = secondIter[Symbol.iterator]();

              case 14:
                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                  _context8.next = 23;
                  break;
                }

                secondValue = _step4.value;
                secondKey = secondKeySelector(secondValue);

                if (!keyEqualityCompareFn(firstKey, secondKey)) {
                  _context8.next = 20;
                  break;
                }

                _context8.next = 20;
                return resultSelectorFn(firstValue, secondValue);

              case 20:
                _iteratorNormalCompletion4 = true;
                _context8.next = 14;
                break;

              case 23:
                _context8.next = 29;
                break;

              case 25:
                _context8.prev = 25;
                _context8.t0 = _context8['catch'](12);
                _didIteratorError4 = true;
                _iteratorError4 = _context8.t0;

              case 29:
                _context8.prev = 29;
                _context8.prev = 30;

                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }

              case 32:
                _context8.prev = 32;

                if (!_didIteratorError4) {
                  _context8.next = 35;
                  break;
                }

                throw _iteratorError4;

              case 35:
                return _context8.finish(32);

              case 36:
                return _context8.finish(29);

              case 37:
                _iteratorNormalCompletion3 = true;
                _context8.next = 6;
                break;

              case 40:
                _context8.next = 46;
                break;

              case 42:
                _context8.prev = 42;
                _context8.t1 = _context8['catch'](4);
                _didIteratorError3 = true;
                _iteratorError3 = _context8.t1;

              case 46:
                _context8.prev = 46;
                _context8.prev = 47;

                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }

              case 49:
                _context8.prev = 49;

                if (!_didIteratorError3) {
                  _context8.next = 52;
                  break;
                }

                throw _iteratorError3;

              case 52:
                return _context8.finish(49);

              case 53:
                return _context8.finish(46);

              case 54:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this, [[4, 42, 46, 54], [12, 25, 29, 37], [30,, 32, 36], [47,, 49, 53]]);
      }));
    }

    /**
     * Except - Returns the element of the sequence that do not appear in second
     *
     * @see https://msdn.microsoft.com/de-de/library/bb300779(v=vs.110).aspx
     * @method
     * @memberof Collection
     * @instance
     * @example
    [1, 2, 3, 4].Except([1, 5, 6, 7]).ToArray()
    // -> [2, 3, 4]
     * @param  {Iterable} second
     * @return {Collection}        new Collection with the values of first without the ones in second
     */
    function Except(second) {
      __assertIterable(second);

      if (!isCollection(second)) {
        second = new Collection(second);
      }

      var firstIter = this.getIterator();

      return new Collection(regeneratorRuntime.mark(function _callee9() {
        var _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, val;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _iteratorNormalCompletion5 = true;
                _didIteratorError5 = false;
                _iteratorError5 = undefined;
                _context9.prev = 3;
                _iterator5 = firstIter[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                  _context9.next = 13;
                  break;
                }

                val = _step5.value;

                if (second.Contains(val)) {
                  _context9.next = 10;
                  break;
                }

                _context9.next = 10;
                return val;

              case 10:
                _iteratorNormalCompletion5 = true;
                _context9.next = 5;
                break;

              case 13:
                _context9.next = 19;
                break;

              case 15:
                _context9.prev = 15;
                _context9.t0 = _context9['catch'](3);
                _didIteratorError5 = true;
                _iteratorError5 = _context9.t0;

              case 19:
                _context9.prev = 19;
                _context9.prev = 20;

                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                  _iterator5.return();
                }

              case 22:
                _context9.prev = 22;

                if (!_didIteratorError5) {
                  _context9.next = 25;
                  break;
                }

                throw _iteratorError5;

              case 25:
                return _context9.finish(22);

              case 26:
                return _context9.finish(19);

              case 27:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this, [[3, 15, 19, 27], [20,, 22, 26]]);
      }));
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
    
    const numbersAndWords = numbers.Zip(words, (first, second) => first + " " + second)
    numbersAndWords.ForEach(x => console.log(x))
    // Outputs:
    "1 one"
    "2 two"
    "3 three"
     * @param  {Iterable} second
     * @param  {type} resultSelectorFn A function of the form (firstValue, secondValue) => any to produce the output sequence
     * @return {Collection}
     */
    function Zip(second, resultSelectorFn) {
      __assertIterable(second);
      __assertFunction(resultSelectorFn);

      var firstIter = this.getIterator();

      return new Collection(regeneratorRuntime.mark(function _callee10() {
        var secondIter, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, firstVal, secondNext;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                secondIter = second[Symbol.iterator]();
                _iteratorNormalCompletion6 = true;
                _didIteratorError6 = false;
                _iteratorError6 = undefined;
                _context10.prev = 4;
                _iterator6 = firstIter[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                  _context10.next = 16;
                  break;
                }

                firstVal = _step6.value;
                secondNext = secondIter.next();

                if (!secondNext.done) {
                  _context10.next = 11;
                  break;
                }

                return _context10.abrupt('break', 16);

              case 11:
                _context10.next = 13;
                return resultSelectorFn(firstVal, secondNext.value);

              case 13:
                _iteratorNormalCompletion6 = true;
                _context10.next = 6;
                break;

              case 16:
                _context10.next = 22;
                break;

              case 18:
                _context10.prev = 18;
                _context10.t0 = _context10['catch'](4);
                _didIteratorError6 = true;
                _iteratorError6 = _context10.t0;

              case 22:
                _context10.prev = 22;
                _context10.prev = 23;

                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                  _iterator6.return();
                }

              case 25:
                _context10.prev = 25;

                if (!_didIteratorError6) {
                  _context10.next = 28;
                  break;
                }

                throw _iteratorError6;

              case 28:
                return _context10.finish(25);

              case 29:
                return _context10.finish(22);

              case 30:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this, [[4, 18, 22, 30], [23,, 25, 29]]);
      }));
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
    * @param  {Iterable} second The sequence to get the intersection from
    * @return {Collection}
     */ /**
        * Intersect - Produces the set intersection of two sequences. A provided equality comparator is used to compare values.
        *
        * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.sequenceequal(v=vs.110).aspx
        * @method
        * @memberof Collection
        * @instance
        * @param  {Iterable} second The sequence to get the intersection from
        * @param {Function} equalityCompareFn A function of the form (first, second) => boolean to compare the values
        * @return {Collection}
        */
    function Intersect(second) {
      var equalityCompareFn = arguments.length <= 1 || arguments[1] === undefined ? defaultEqualityCompareFn : arguments[1];

      __assertIterable(second);
      __assertFunction(equalityCompareFn);

      var firstIter = this.ToArray();

      return new Collection(regeneratorRuntime.mark(function _callee11() {
        var _this2 = this;

        var secondIter, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _loop, _iterator7, _step7;

        return regeneratorRuntime.wrap(function _callee11$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                secondIter = [].concat(_toConsumableArray(second));
                _iteratorNormalCompletion7 = true;
                _didIteratorError7 = false;
                _iteratorError7 = undefined;
                _context12.prev = 4;
                _loop = regeneratorRuntime.mark(function _loop() {
                  var val;
                  return regeneratorRuntime.wrap(function _loop$(_context11) {
                    while (1) {
                      switch (_context11.prev = _context11.next) {
                        case 0:
                          val = _step7.value;

                          if (!secondIter.Any(function (elem) {
                            return equalityCompareFn(val, elem);
                          })) {
                            _context11.next = 4;
                            break;
                          }

                          _context11.next = 4;
                          return val;

                        case 4:
                        case 'end':
                          return _context11.stop();
                      }
                    }
                  }, _loop, _this2);
                });
                _iterator7 = firstIter[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                  _context12.next = 12;
                  break;
                }

                return _context12.delegateYield(_loop(), 't0', 9);

              case 9:
                _iteratorNormalCompletion7 = true;
                _context12.next = 7;
                break;

              case 12:
                _context12.next = 18;
                break;

              case 14:
                _context12.prev = 14;
                _context12.t1 = _context12['catch'](4);
                _didIteratorError7 = true;
                _iteratorError7 = _context12.t1;

              case 18:
                _context12.prev = 18;
                _context12.prev = 19;

                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                  _iterator7.return();
                }

              case 21:
                _context12.prev = 21;

                if (!_didIteratorError7) {
                  _context12.next = 24;
                  break;
                }

                throw _iteratorError7;

              case 24:
                return _context12.finish(21);

              case 25:
                return _context12.finish(18);

              case 26:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee11, this, [[4, 14, 18, 26], [19,, 21, 25]]);
      }));
    }

    /* src/search.js */

    /**
    * IndexOf - Returns the first index of the given element in the sequence or -1 if it was not found.
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
     */ /**
        * IndexOf - Returns the first index of the given element in the sequence or -1 if it was not found.
        * A provided equality compare function is used to specify equality.
        *
        * @method
        * @memberof Collection
        * @instance
        * @param {Function} equalityCompareFn A function of the form (first, second) => Boolean to determine whether or not two values are considered equal
        * @return {Number}
        */
    function IndexOf(element) {
      var equalityCompareFn = arguments.length <= 1 || arguments[1] === undefined ? defaultEqualityCompareFn : arguments[1];

      __assertFunction(equalityCompareFn);

      var iter = this.getIterator();
      var i = 0;

      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = iter[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var _val = _step8.value;

          if (equalityCompareFn(_val, element)) {
            return i;
          }

          i++;
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      return -1;
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
     * @return {Boolean}
     */ /**
        * Contains - Returns true if the sequence contains the specified element, false if not.
        * A provided equality compare function is used to specify equality.
        *
        * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.contains(v=vs.110).aspx
        * @method
        * @memberof Collection
        * @instance
        * @param {Function} equalityCompareFn A function of the form (first, second) => Boolean to determine whether or not two values are considered equal
        * @return {Boolean}
        */
    function Contains(elem) {
      var equalityCompareFn = arguments.length <= 1 || arguments[1] === undefined ? defaultEqualityCompareFn : arguments[1];

      return !!~this.IndexOf(elem, equalityCompareFn);
    }

    /**
    * Where - Filters a sequence based on a predicate function
    *
    * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.where(v=vs.110).aspx
    * @method
    * @memberof Collection
    * @instance
    * @param  {Function} predicate A function of the form elem => boolean to filter the sequence
    * @return {Collection} The filtered collection
    */ /**
       * Where - Filters a sequence based on a predicate function. The index of the element is used in the predicate function.
       *
       * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.where(v=vs.110).aspx
       * @method
       * @memberof Collection
       * @instance
       * @param  {Function} predicate A function of the form (elem, index) => boolean to filter the sequence
       * @return {Collection} The filtered collection
       */
    function Where() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (elem, index) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);

      var iter = this.getIterator();

      var result = new Collection(regeneratorRuntime.mark(function _callee12() {
        var index, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, _val2;

        return regeneratorRuntime.wrap(function _callee12$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                index = 0;
                _iteratorNormalCompletion9 = true;
                _didIteratorError9 = false;
                _iteratorError9 = undefined;
                _context13.prev = 4;
                _iterator9 = iter[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
                  _context13.next = 15;
                  break;
                }

                _val2 = _step9.value;

                if (!predicate(_val2, index)) {
                  _context13.next = 11;
                  break;
                }

                _context13.next = 11;
                return _val2;

              case 11:

                index++;

              case 12:
                _iteratorNormalCompletion9 = true;
                _context13.next = 6;
                break;

              case 15:
                _context13.next = 21;
                break;

              case 17:
                _context13.prev = 17;
                _context13.t0 = _context13['catch'](4);
                _didIteratorError9 = true;
                _iteratorError9 = _context13.t0;

              case 21:
                _context13.prev = 21;
                _context13.prev = 22;

                if (!_iteratorNormalCompletion9 && _iterator9.return) {
                  _iterator9.return();
                }

              case 24:
                _context13.prev = 24;

                if (!_didIteratorError9) {
                  _context13.next = 27;
                  break;
                }

                throw _iteratorError9;

              case 27:
                return _context13.finish(24);

              case 28:
                return _context13.finish(21);

              case 29:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee12, this, [[4, 17, 21, 29], [22,, 24, 28]]);
      }));

      return result;
    }

    /**
    * ConditionalWhere - Filters a sequence based on a predicate function if the condition is true.
    *
    * @method
    * @memberof Collection
    * @instance
    * @param {Boolean} condition A condition to get checked before filtering the sequence
    * @param  {Function} predicate A function of the form elem => boolean to filter the sequence
    * @return {Collection} The filtered collection or the original sequence if condition was falsy
    */ /**
       * ConditionalWhere - Filters a sequence based on a predicate function if the condition is true. The index of the element is used in the predicate function.
       *
       * @method
       * @memberof Collection
       * @instance
       * @param {Boolean} condition A condition to get checked before filtering the sequence
       * @param  {Function} predicate A function of the form (elem, index) => boolean to filter the sequence
       * @return {Collection} The filtered collection or the original sequence if condition was falsy
       */
    function ConditionalWhere(condition, predicate) {
      if (condition) {
        return this.Where(predicate);
      } else {
        return this;
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
     */ /**
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
    function Count() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (elem) {
        return true;
      } : arguments[0];

      var count = 0;
      var filtered = this.Where(predicate);
      while (!filtered.next().done) {
        count++;
      }
      return count;
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
     */ /**
        * Any - Returns true if at least one element of the sequence matches the predicate or false if no element matches
        *
        * @see https://msdn.microsoft.com/de-de/library/bb337697(v=vs.110).aspx
        * @method
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
    function Any(predicate) {
      if (isEmpty(this)) {
        return false;
      }

      if (!predicate) {
        // since we checked before that the sequence is not empty
        return true;
      }

      return !this.Where(predicate).next().done;
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

    function resultOrDefault(collection, originalFn) {
      var predicateOrDefault = arguments.length <= 2 || arguments[2] === undefined ? function (x) {
        return true;
      } : arguments[2];
      var fallback = arguments.length <= 3 || arguments[3] === undefined ? Object : arguments[3];

      var predicate = void 0;

      if (isNative(predicateOrDefault) || !isFunction(predicateOrDefault)) {
        predicate = function predicate(x) {
          return true;
        };
        fallback = predicateOrDefault;
      } else {
        predicate = predicateOrDefault;
      }

      __assertFunction(predicate);

      var defaultVal = getDefault(fallback);

      if (isEmpty(collection)) {
        return defaultVal;
      }

      var result = originalFn.call(collection, predicate);

      if (!result) {
        return defaultVal;
      }

      return result;
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
    function ElementAt(index) {
      __assertIndexInRange(this, index);

      var result = this.Skip(index).Take(1).ToArray()[0];
      this.reset();

      return result;
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
    function Take() {
      var count = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      __assertNumeric(count);

      if (count <= 0) {
        return Collection.Empty;
      }

      var iter = this.getIterator();
      return new Collection(regeneratorRuntime.mark(function _callee13() {
        var i, _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, _val3;

        return regeneratorRuntime.wrap(function _callee13$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                i = 0;
                _iteratorNormalCompletion10 = true;
                _didIteratorError10 = false;
                _iteratorError10 = undefined;
                _context14.prev = 4;
                _iterator10 = iter[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done) {
                  _context14.next = 15;
                  break;
                }

                _val3 = _step10.value;
                _context14.next = 10;
                return _val3;

              case 10:
                if (!(++i === count)) {
                  _context14.next = 12;
                  break;
                }

                return _context14.abrupt('break', 15);

              case 12:
                _iteratorNormalCompletion10 = true;
                _context14.next = 6;
                break;

              case 15:
                _context14.next = 21;
                break;

              case 17:
                _context14.prev = 17;
                _context14.t0 = _context14['catch'](4);
                _didIteratorError10 = true;
                _iteratorError10 = _context14.t0;

              case 21:
                _context14.prev = 21;
                _context14.prev = 22;

                if (!_iteratorNormalCompletion10 && _iterator10.return) {
                  _iterator10.return();
                }

              case 24:
                _context14.prev = 24;

                if (!_didIteratorError10) {
                  _context14.next = 27;
                  break;
                }

                throw _iteratorError10;

              case 27:
                return _context14.finish(24);

              case 28:
                return _context14.finish(21);

              case 29:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee13, this, [[4, 17, 21, 29], [22,, 24, 28]]);
      }));
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
    function Skip() {
      var count = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      __assertNumeric(count);

      if (count <= 0) {
        return this;
      }

      var result = this.SkipWhile(function (elem, index) {
        return index < count;
      });

      this.reset();

      return result;
    }

    /**
    * TakeWhile - Takes elements from the beginning of a sequence while the predicate yields true
    *
    * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.takewhile(v=vs.110).aspx
    * @method
    * @memberof Collection
    * @instance
    * @param  {Function} predicate The predicate of the form elem => boolean
    * @return {Collection}
     */ /**
        * TakeWhile - Takes elements from the beginning of a sequence while the predicate yields true. The index of the element can be used in the logic of the predicate function.
        *
        * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.takewhile(v=vs.110).aspx
        * @method
        * @memberof Collection
        * @instance
        * @param  {Function} predicate The predicate of the form (elem, index) => boolean
        * @return {Collection}
        */
    function TakeWhile() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (elem, index) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);

      var iter = this.getIterator();

      var result = new Collection(regeneratorRuntime.mark(function _callee14() {
        var index, endTake, _iteratorNormalCompletion11, _didIteratorError11, _iteratorError11, _iterator11, _step11, _val4;

        return regeneratorRuntime.wrap(function _callee14$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                index = 0;
                endTake = false;
                _iteratorNormalCompletion11 = true;
                _didIteratorError11 = false;
                _iteratorError11 = undefined;
                _context15.prev = 5;
                _iterator11 = iter[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done) {
                  _context15.next = 17;
                  break;
                }

                _val4 = _step11.value;

                if (!(!endTake && predicate(_val4, index++))) {
                  _context15.next = 13;
                  break;
                }

                _context15.next = 12;
                return _val4;

              case 12:
                return _context15.abrupt('continue', 14);

              case 13:

                endTake = true;

              case 14:
                _iteratorNormalCompletion11 = true;
                _context15.next = 7;
                break;

              case 17:
                _context15.next = 23;
                break;

              case 19:
                _context15.prev = 19;
                _context15.t0 = _context15['catch'](5);
                _didIteratorError11 = true;
                _iteratorError11 = _context15.t0;

              case 23:
                _context15.prev = 23;
                _context15.prev = 24;

                if (!_iteratorNormalCompletion11 && _iterator11.return) {
                  _iterator11.return();
                }

              case 26:
                _context15.prev = 26;

                if (!_didIteratorError11) {
                  _context15.next = 29;
                  break;
                }

                throw _iteratorError11;

              case 29:
                return _context15.finish(26);

              case 30:
                return _context15.finish(23);

              case 31:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee14, this, [[5, 19, 23, 31], [24,, 26, 30]]);
      }));

      this.reset();

      return result;
    }

    /**
    * TakeUntil - Takes elements from the beginning of a sequence until the predicate yields true. TakeUntil behaves like calling TakeWhile with a negated predicate.
    *
    * @method
    * @memberof Collection
    * @instance
    * @param  {Function} predicate The predicate of the form elem => boolean
    * @return {Collection}
     */ /**
        * TakeUntil - Takes elements from the beginning of a sequence until the predicate yields true. The index of the element can be used in the logic of the predicate function.
        * TakeUntil behaves like calling TakeWhile with a negated predicate.
        *
        * @method
        * @memberof Collection
        * @instance
        * @param  {Function} predicate The predicate of the form (elem, index) => boolean
        * @return {Collection}
        */
    function TakeUntil() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (elem, index) {
        return false;
      } : arguments[0];

      return this.TakeWhile(function (elem, index) {
        return !predicate(elem, index);
      });
    }

    /**
    * SkipWhile - Skips elements in the sequence while the predicate yields true and returns the remaining sequence
    *
    * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.skipwhile(v=vs.110).aspx
    * @method
    * @memberof Collection
    * @instance
    * @param  {type} predicate The predicate of the form elem => boolean
    * @return {Collection}
     */ /**
        * SkipWhile - Skips elements in the sequence while the predicate yields true and returns the remaining sequence. The index of the element
        * can be used in the logic of the predicate function.
        *
        * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.skipwhile(v=vs.110).aspx
        * @method
        * @memberof Collection
        * @instance
        * @param  {type} predicate The predicate of the form (elem, index) => boolean
        * @return {Collection}
        */
    function SkipWhile() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (elem, index) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);

      var iter = this.getIterator();

      return new Collection(regeneratorRuntime.mark(function _callee15() {
        var index, endSkip, _iteratorNormalCompletion12, _didIteratorError12, _iteratorError12, _iterator12, _step12, _val5;

        return regeneratorRuntime.wrap(function _callee15$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                index = 0;
                endSkip = false;
                _iteratorNormalCompletion12 = true;
                _didIteratorError12 = false;
                _iteratorError12 = undefined;
                _context16.prev = 5;
                _iterator12 = iter[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done) {
                  _context16.next = 17;
                  break;
                }

                _val5 = _step12.value;

                if (!(!endSkip && predicate(_val5, index++))) {
                  _context16.next = 11;
                  break;
                }

                return _context16.abrupt('continue', 14);

              case 11:

                endSkip = true;
                _context16.next = 14;
                return _val5;

              case 14:
                _iteratorNormalCompletion12 = true;
                _context16.next = 7;
                break;

              case 17:
                _context16.next = 23;
                break;

              case 19:
                _context16.prev = 19;
                _context16.t0 = _context16['catch'](5);
                _didIteratorError12 = true;
                _iteratorError12 = _context16.t0;

              case 23:
                _context16.prev = 23;
                _context16.prev = 24;

                if (!_iteratorNormalCompletion12 && _iterator12.return) {
                  _iterator12.return();
                }

              case 26:
                _context16.prev = 26;

                if (!_didIteratorError12) {
                  _context16.next = 29;
                  break;
                }

                throw _iteratorError12;

              case 29:
                return _context16.finish(26);

              case 30:
                return _context16.finish(23);

              case 31:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee15, this, [[5, 19, 23, 31], [24,, 26, 30]]);
      }));
    }

    /**
    * SkipUntil - Skips elements from the beginning of a sequence until the predicate yields true. SkipUntil behaves like calling SkipWhile with a negated predicate.
    *
    * @method
    * @memberof Collection
    * @instance
    * @param  {Function} predicate The predicate of the form elem => boolean
    * @return {Collection}
     */ /**
        * SkipUntil - Takes elements from the beginning of a sequence until the predicate yields true. The index of the element can be used in the logic of the predicate function.
        * SkipUntil behaves like calling SkipWhile with a negated predicate.
        *
        * @method
        * @memberof Collection
        * @instance
        * @param  {Function} predicate The predicate of the form (elem, index) => boolean
        * @return {Collection}
        */
    function SkipUntil() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (elem, index) {
        return false;
      } : arguments[0];

      return this.SkipWhile(function (elem, index) {
        return !predicate(elem, index);
      });
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
     */ /**
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
    function First() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);
      __assertNotEmpty(this);

      var result = this.SkipWhile(function (elem) {
        return !predicate(elem);
      }).Take(1).ToArray()[0];
      this.reset();

      return result;
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
     */ /**
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
    function FirstOrDefault() {
      var predicateOrConstructor = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];
      var constructor = arguments.length <= 1 || arguments[1] === undefined ? Object : arguments[1];

      return resultOrDefault(this, First, predicateOrConstructor, constructor);
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
     */ /**
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
    function Last() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);
      __assertNotEmpty(this);

      return this.Reverse().First(predicate);
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
     */ /**
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
    function LastOrDefault() {
      var predicateOrConstructor = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];
      var constructor = arguments.length <= 1 || arguments[1] === undefined ? Object : arguments[1];

      return resultOrDefault(this, Last, predicateOrConstructor, constructor);
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
     */ /**
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
    function Single() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);
      __assertNotEmpty(this);

      var index = 0;
      var result = void 0;

      var _iteratorNormalCompletion13 = true;
      var _didIteratorError13 = false;
      var _iteratorError13 = undefined;

      try {
        for (var _iterator13 = this.getIterator()[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
          var _val6 = _step13.value;

          if (predicate(_val6)) {
            result = _val6;
            break;
          }

          index++;
        }
      } catch (err) {
        _didIteratorError13 = true;
        _iteratorError13 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion13 && _iterator13.return) {
            _iterator13.return();
          }
        } finally {
          if (_didIteratorError13) {
            throw _iteratorError13;
          }
        }
      }

      if (this.First(function (elem) {
        return predicate(elem) && !defaultEqualityCompareFn(elem, result);
      })) {
        throw new Error('Sequence contains more than one element');
      }

      return result;
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
     */ /**
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
    function SingleOrDefault() {
      var predicateOrConstructor = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];
      var constructor = arguments.length <= 1 || arguments[1] === undefined ? Object : arguments[1];

      return resultOrDefault(this, Single, predicateOrConstructor, constructor);
    }

    /**
     * DefaultIfEmpty - Returns a new sequence containing the provided constructors default if the sequence is empty or the sequence itself if not
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.defaultifempty(v=vs.110).aspx
     * @method
     * @memberof Collection
     * @instance
     * @param {Function} constructor A native constructor to get the default for, e.g. Number
     * @return {Collection}
     */ /**
        * DefaultIfEmpty - Returns the sequence or a new sequence containing the provided default value if it is empty
        *
        * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.defaultifempty(v=vs.110).aspx
        * @method
        * @memberof Collection
        * @instance
        * @param {any} value The default vlaue
        * @return {Collection}
        */
    function DefaultIfEmpty(constructorOrValue) {
      if (!isEmpty(this)) {
        return this;
      }

      return [getDefault(constructorOrValue)];
    }

    /* src/heap.js */

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
     * @memberof Collection
     * @instance
     * @method
     * @param {Function} accumulator The accumulator function of the form (prev, current) => any
     * @return {any} the result of the accumulation
     */ /**
        * Aggregate - applies a accumulator function to a sequence. Starts with seed.
        *
        * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
        * @memberof Collection
        * @instance
        * @method
        * @param {any} seed The starting value of the accumulation
        * @param {Function} accumulator The accumulator function of the form (prev, current) => any
        * @example
        [1, 2, 3].Aggregate(0, (prev, curr) => prev + curr)
        // -> 6 (this example is equal to [1, 2, 3].Sum())
        * @return {any} the result of the accumulation
        */ /**
           * Aggregate - applies a accumulator function to a sequence. Starts with seed and transforms the result using resultTransformFn.
           *
           * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
           * @memberof Collection
           * @instance
           * @method
           * @param {any} seed The starting value of the accumulation
           * @param {Function} accumulator The accumulator function of the form (prev, current) => any
           * @param {Function} resultTransformFn A function to transform the result
           * @return {any} the result of the accumulation
           * @
           */
    function Aggregate(seedOrAccumulator, accumulator, resultTransformFn) {
      var values = this.ToArray();

      if (typeof seedOrAccumulator === 'function' && !accumulator && !resultTransformFn) {
        return aggregateCollection(values.slice(1, values.length), values.slice(0, 1)[0], seedOrAccumulator, function (elem) {
          return elem;
        });
      } else if (typeof seedOrAccumulator !== 'function' && typeof accumulator === 'function' && !resultTransformFn) {
        return aggregateCollection(values, seedOrAccumulator, accumulator, function (elem) {
          return elem;
        });
      } else {
        return aggregateCollection(values, seedOrAccumulator, accumulator, resultTransformFn);
      }
    }

    /**
    * Select - Projects each member of the sequence into a new form
    *
    * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.select(v=vs.110).aspx
    * @memberof Collection
    * @instance
    * @method
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
    */ /**
       * Select - Projects each member of the sequence into a new form. The index of the source element can be used in the mapFn.
       *
       * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.select(v=vs.110).aspx
       * @memberof Collection
       * @instance
       * @method
       * @param {Function} mapFn The function to use to map each element of the sequence, has the form (elem, index) => any
       * @example
       [1, 2, 3].Select((x, i) => x + i).ToArray()
       // -> [1, 3, 5]
       * @return {Collection}
       */
    function Select() {
      var mapFn = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return x;
      } : arguments[0];

      var iter = this.getIterator();

      var index = 0;

      return new Collection(regeneratorRuntime.mark(function _callee16() {
        var _iteratorNormalCompletion14, _didIteratorError14, _iteratorError14, _iterator14, _step14, _val7;

        return regeneratorRuntime.wrap(function _callee16$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _iteratorNormalCompletion14 = true;
                _didIteratorError14 = false;
                _iteratorError14 = undefined;
                _context17.prev = 3;
                _iterator14 = iter[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done) {
                  _context17.next = 13;
                  break;
                }

                _val7 = _step14.value;
                _context17.next = 9;
                return mapFn(_val7, index);

              case 9:
                index++;

              case 10:
                _iteratorNormalCompletion14 = true;
                _context17.next = 5;
                break;

              case 13:
                _context17.next = 19;
                break;

              case 15:
                _context17.prev = 15;
                _context17.t0 = _context17['catch'](3);
                _didIteratorError14 = true;
                _iteratorError14 = _context17.t0;

              case 19:
                _context17.prev = 19;
                _context17.prev = 20;

                if (!_iteratorNormalCompletion14 && _iterator14.return) {
                  _iterator14.return();
                }

              case 22:
                _context17.prev = 22;

                if (!_didIteratorError14) {
                  _context17.next = 25;
                  break;
                }

                throw _iteratorError14;

              case 25:
                return _context17.finish(22);

              case 26:
                return _context17.finish(19);

              case 27:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee16, this, [[3, 15, 19, 27], [20,, 22, 26]]);
      }));
    }

    /**
     * Flatten - Flattens a sequence meaning reducing the level of nesting by one
     *
     * @memberof Collection
     * @instance
     * @method
     * @example
     * // [1, 2, 3, 4, 5, 6,]
     * [1, 2, 3, [4, 5, 6,]]].Flatten().ToArray()
     * @return {Collection}  A new flattened Collection
     */
    function Flatten() {
      return this.SelectMany(function (x) {
        return x;
      });
    }

    /**
     * SelectMany - Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.selectmany(v=vs.110).aspx
     * @memberof Collection
     * @instance
     * @method
     * @param {Function} mapFn The function to use to map each element of the sequence, has the form elem => any
     * @return {Collection}
     */ /**
        * SelectMany - Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
        * The index of the source element can be used in the mapFn.
        *
        * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.selectmany(v=vs.110).aspx
        * @memberof Collection
        * @instance
        * @method
        * @param {Function} mapFn The function to use to map each element of the sequence, has the form (elem, index) => any
        * @return {Collection}
        */ /**
           * SelectMany - Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
           * Invokes a resultSelector function on each element of the sequence.
           *
           * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.selectmany(v=vs.110).aspx
           * @memberof Collection
           * @instance
           * @method
           * @param {Function} mapFn The function to use to map each element of the sequence, has the form elem => any
           * @param {Function} resultSelector a function of the form (sourceElement, element) => any to map the result Value
           * @return {Collection}
           */ /**
              * SelectMany - Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
              * Invokes a resultSelector function on each element of the sequence. The index of the source element can be used in the mapFn.
              *
              * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.selectmany(v=vs.110).aspx
              * @memberof Collection
              * @instance
              * @method
              * @param {Function} mapFn The function to use to map each element of the sequence, has the form (elem, index) => any
              * @param {Function} resultSelector a function of the form (sourceElement, element) => any to map the result Value
              * @return {Collection}
              * @
              */
    function SelectMany(mapFn) {
      var resultSelector = arguments.length <= 1 || arguments[1] === undefined ? function (x, y) {
        return y;
      } : arguments[1];

      __assertFunction(mapFn);
      __assertFunction(resultSelector);

      var iter = this.getIterator();

      return new Collection(regeneratorRuntime.mark(function _callee17() {
        var index, _iteratorNormalCompletion15, _didIteratorError15, _iteratorError15, _iterator15, _step15, current, mappedEntry, newIter, _iteratorNormalCompletion16, _didIteratorError16, _iteratorError16, _iterator16, _step16, _val8;

        return regeneratorRuntime.wrap(function _callee17$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                index = 0;
                _iteratorNormalCompletion15 = true;
                _didIteratorError15 = false;
                _iteratorError15 = undefined;
                _context18.prev = 4;
                _iterator15 = iter[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done) {
                  _context18.next = 41;
                  break;
                }

                current = _step15.value;
                mappedEntry = mapFn(current, index);
                newIter = mappedEntry;


                if (!isIterable(mappedEntry)) {
                  newIter = [mappedEntry];
                } else {
                  newIter = mappedEntry;
                }

                _iteratorNormalCompletion16 = true;
                _didIteratorError16 = false;
                _iteratorError16 = undefined;
                _context18.prev = 14;
                _iterator16 = newIter[Symbol.iterator]()[Symbol.iterator]();

              case 16:
                if (_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done) {
                  _context18.next = 23;
                  break;
                }

                _val8 = _step16.value;
                _context18.next = 20;
                return resultSelector(current, _val8);

              case 20:
                _iteratorNormalCompletion16 = true;
                _context18.next = 16;
                break;

              case 23:
                _context18.next = 29;
                break;

              case 25:
                _context18.prev = 25;
                _context18.t0 = _context18['catch'](14);
                _didIteratorError16 = true;
                _iteratorError16 = _context18.t0;

              case 29:
                _context18.prev = 29;
                _context18.prev = 30;

                if (!_iteratorNormalCompletion16 && _iterator16.return) {
                  _iterator16.return();
                }

              case 32:
                _context18.prev = 32;

                if (!_didIteratorError16) {
                  _context18.next = 35;
                  break;
                }

                throw _iteratorError16;

              case 35:
                return _context18.finish(32);

              case 36:
                return _context18.finish(29);

              case 37:

                index++;

              case 38:
                _iteratorNormalCompletion15 = true;
                _context18.next = 6;
                break;

              case 41:
                _context18.next = 47;
                break;

              case 43:
                _context18.prev = 43;
                _context18.t1 = _context18['catch'](4);
                _didIteratorError15 = true;
                _iteratorError15 = _context18.t1;

              case 47:
                _context18.prev = 47;
                _context18.prev = 48;

                if (!_iteratorNormalCompletion15 && _iterator15.return) {
                  _iterator15.return();
                }

              case 50:
                _context18.prev = 50;

                if (!_didIteratorError15) {
                  _context18.next = 53;
                  break;
                }

                throw _iteratorError15;

              case 53:
                return _context18.finish(50);

              case 54:
                return _context18.finish(47);

              case 55:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee17, this, [[4, 43, 47, 55], [14, 25, 29, 37], [30,, 32, 36], [48,, 50, 54]]);
      }));
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
     */ /**
        * Distinct - Returns the distinct elemens from a sequence using a provided equality compare function
        *
        * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.distinct(v=vs.110).aspx
        * @memberof Collection
        * @instance
        * @method
        * @param {Function} equalityCompareFn The function of the form (first, second) => boolean determining if the values are equal
        * @return {Collection}
        */
    function Distinct() {
      var equalityCompareFn = arguments.length <= 0 || arguments[0] === undefined ? defaultEqualityCompareFn : arguments[0];

      __assertFunction(equalityCompareFn);

      return removeDuplicates(this, equalityCompareFn);
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
    function ToArray() {
      return [].concat(_toConsumableArray(this.getIterator()));
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
     */ /**
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
        */ /**
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
           */ /**
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
    function ToDictionary(keySelector, elementSelectorOrKeyComparer, keyComparer) {
      __assertFunction(keySelector);

      if (!elementSelectorOrKeyComparer && !keyComparer) {
        // ToDictionary(keySelector)
        return this.ToDictionary(keySelector, function (elem) {
          return elem;
        }, defaultEqualityCompareFn);
      } else if (!keyComparer && getParameterCount(elementSelectorOrKeyComparer) === 1) {
        // ToDictionary(keySelector, elementSelector)
        return this.ToDictionary(keySelector, elementSelectorOrKeyComparer, defaultEqualityCompareFn);
      } else if (!keyComparer && getParameterCount(elementSelectorOrKeyComparer) === 2) {
        // ToDictionary(keySelector, keyComparer)
        return this.ToDictionary(keySelector, function (elem) {
          return elem;
        }, elementSelectorOrKeyComparer);
      }

      // ToDictionary(keySelector, elementSelector, keyComparer)

      __assertFunction(keyComparer);
      __assertFunction(elementSelectorOrKeyComparer);

      var usedKeys = [];
      var result = new Map();
      var input = this.ToArray();
      var elementSelector = elementSelectorOrKeyComparer;

      var _iteratorNormalCompletion17 = true;
      var _didIteratorError17 = false;
      var _iteratorError17 = undefined;

      try {
        var _loop2 = function _loop2() {
          var value = _step17.value;

          var key = keySelector(value);
          var elem = elementSelector(value);

          __assert(key != null, 'Key is not allowed to be null!');
          __assert(!usedKeys.Any(function (x) {
            return keyComparer(x, key);
          }), 'Key \'' + key + '\' is already in use!');

          usedKeys.push(key);
          result.set(key, elem);
        };

        for (var _iterator17 = input[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
          _loop2();
        }
      } catch (err) {
        _didIteratorError17 = true;
        _iteratorError17 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion17 && _iterator17.return) {
            _iterator17.return();
          }
        } finally {
          if (_didIteratorError17) {
            throw _iteratorError17;
          }
        }
      }

      return result;
    }

    /**
     * ToJSON - Returns the representation of the sequence in javascript object notation (JSON)
     *
     * @instance
     * @method
     * @memberof Collection
     * @return {string}
     */
    function ToJSON() {
      return toJSON(this.ToArray());
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
    function Reverse() {
      var arr = this.ToArray();

      return new Collection(regeneratorRuntime.mark(function _callee18() {
        var i;
        return regeneratorRuntime.wrap(function _callee18$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                i = arr.length - 1;

              case 1:
                if (!(i >= 0)) {
                  _context19.next = 7;
                  break;
                }

                _context19.next = 4;
                return arr[i];

              case 4:
                i--;
                _context19.next = 1;
                break;

              case 7:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee18, this);
      }));
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
    function ForEach(fn) {
      __assertFunction(fn);

      var _iteratorNormalCompletion18 = true;
      var _didIteratorError18 = false;
      var _iteratorError18 = undefined;

      try {
        for (var _iterator18 = this.getIterator()[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
          var _val9 = _step18.value;

          fn(_val9);
        }
      } catch (err) {
        _didIteratorError18 = true;
        _iteratorError18 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion18 && _iterator18.return) {
            _iterator18.return();
          }
        } finally {
          if (_didIteratorError18) {
            throw _iteratorError18;
          }
        }
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
    function Add(value) {
      this.Insert(value, this.Count());
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
    function Insert(value, index) {
      __assert(index >= 0 && index <= this.Count(), 'Index is out of bounds!');

      var oldIter = this.ToArray();

      this.iterable = regeneratorRuntime.mark(function _callee19() {
        return regeneratorRuntime.wrap(function _callee19$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                return _context20.delegateYield(oldIter.slice(0, index), 't0', 1);

              case 1:
                _context20.next = 3;
                return value;

              case 3:
                return _context20.delegateYield(oldIter.slice(index, oldIter.length), 't1', 4);

              case 4:
              case 'end':
                return _context20.stop();
            }
          }
        }, _callee19, this);
      });
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
    function Remove(value) {
      var values = this.ToArray();
      var result = removeFromArray(values, value);

      if (!result) {
        return false;
      }

      this.iterable = regeneratorRuntime.mark(function _callee20() {
        return regeneratorRuntime.wrap(function _callee20$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                return _context21.delegateYield(values, 't0', 1);

              case 1:
              case 'end':
                return _context21.stop();
            }
          }
        }, _callee20, this);
      });

      return true;
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
        Collection.apply(this, [iterable]);

        this.__comparator = comparator;
        this.__heapConstructor = heapConstructor;
      }

      /**
       * Specifies further sorting by the given comparator for equal elements.
       *
       * @param {(T, T) => boolean} additionalComparator Comparator for sorting.
       * @param {any}               <T>                  Element type.
       * @return {OrderedLinqCollection<T>} Created ordered linq collection.
       */
      OrderedLinqCollection.prototype.ThenBy = function (additionalComparator) {
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

      OrderedLinqCollection.prototype.getIterator = function () {
        var _self = this;

        return regeneratorRuntime.mark(function _callee21() {
          return regeneratorRuntime.wrap(function _callee21$(_context22) {
            while (1) {
              switch (_context22.prev = _context22.next) {
                case 0:
                  return _context22.delegateYield(Reflect.construct(_self.__heapConstructor, [[].concat(_toConsumableArray(_self.iterable)), _self.__comparator]), 't0', 1);

                case 1:
                case 'end':
                  return _context22.stop();
              }
            }
          }, _callee21, this);
        })();
      };

      return OrderedLinqCollection;
    }();

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
        return Collection.prototype.DefaultComparator;
      }
      if (!(selector.startsWith('[') || selector.startsWith('.'))) {
        selector = '.' + selector;
      }
      var result = void 0;
      eval('result = function (a, b) { return Collection.prototype.DefaultComparator(a' + selector + ', b' + selector + ') }');
      return result;
    }

    /* src/order.js */

    // TODO: change implementation to use iterators!

    function Order() {
      return this.OrderBy(DefaultComparator);
    }

    function OrderDescending() {
      return this.OrderByDescending(DefaultComparator);
    }

    /**
     * Orderes this linq collection using the given comparator.
     *
     * @param {(T, T) => boolean} comparator Comparator to be used.
     * @param {any}               <T>        Element type.
     * @return {OrderedLinqCollection<T>} Ordered collection.
     */
    function OrderBy(comparator) {
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
    function OrderByDescending(comparator) {
      if (isString(comparator)) {
        comparator = GetComparatorFromKeySelector(comparator);
      }
      __assertFunction(comparator);
      return new OrderedLinqCollection(this, comparator, MaxHeap);
    };

    /**
     * Shuffle - Orders a sequence by random (produces a possible permutation of the sequence) and returns the shuffled elements as a new collection
     *
     * @instance
     * @memberof Collection
     * @method
     * @return {Collection}
     */
    function Shuffle() {
      return this.OrderBy(function () {
        return Math.floor(Math.random() * 3) - 1;
      } /* Returns -1, 0 or 1 */);
    }

    /* src/grouping.js */

    /**
     * GroupBy - Groups a sequence using the keys selected from the members using the keySelector
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
     * @instance
     * @memberof Collection
     * @method
     * @example
     * // Map {"S" => ["Sven"], "M" => ["Mauz"]}
     * ['Sven', 'Mauz'].GroupBy(x => x[0])
     * @param {Function} keySelector A function to select grouping keys from the sequence members
     * @return {Map} The grouped sequence as a Map
     */ /**
        * GroupBy - Groups a sequence using the keys selected from the members using the keySelector. The keys are compared using keyComparer.
        *
        * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
        * @instance
        * @memberof Collection
        * @method
        * @example
        * // Map {"4" => ["4", 4], "5" => ["5"]}
        * ['4', 4, '5'].GroupBy(x => x, (first, second) => parseInt(first) === parseInt(second))
        * @param {Function} keySelector A function to select grouping keys from the sequence members
        * @param {Function} keyComparer A function of the form (first, second) => bool to check if keys are considered equal
        * @return {Map} The grouped sequence as a Map
        */ /**
           * GroupBy - Groups a sequence using the keys selected from the members using the keySelector.
           * Each group member is projected to a single value (e.g. a property) using the elementSelector.
           *
           * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
           * @instance
           * @memberof Collection
           * @method
           * @example
           * // Map {23 => ["Sven"], 20 => ["jon"]}
           * [{ name: 'Sven', age: 23 }, { name: 'jon', age: 20 }].GroupBy(x => x.age, x => x.name)
           * @param {Function} keySelector A function to select grouping keys from the sequence members
           * @param {Function} elementSelector A function to map each group member to a specific value
           * @return {Map} The grouped sequence as a Map
           */ /**
              * GroupBy - Groups a sequence using the keys selected from the members using the keySelector.
              * The resultSelector is used to project each resulting group to a single value (e.g. an object with aggregated properties).
              *
              * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
              * @instance
              * @memberof Collection
              * @method
              * @example
              * // [ { age:23, persons: "Sven&julia" }, { age: 20, persons: "jon" } ]
              * [{ name: 'Sven', age: 23 }, { name: 'julia', age: 23 }, { name: 'jon', age: 20 }].GroupBy(x => x.age, (age, persons) => ({ age, persons: persons.map(p => p.name).join('&') })).ToArray()
              * @param {Function} keySelector A function to select grouping keys from the sequence members
              * @param {Function} resultSelector A function of the form (key, groupMembers) => any to select a final result from each group
              * @return {Collection} The grouped sequence with projected results as a new Collection
              */ /**
                 * GroupBy - Groups a sequence using the keys selected from the members using the keySelector. Keys are compared using the specified keyComparer.
                 * Each group member is projected to a single value (e.g. a property) using the elementSelector.
                 *
                 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
                 * @instance
                 * @memberof Collection
                 * @method
                 * @param {Function} keySelector A function to select grouping keys from the sequence members
                 * @param {Function} elementSelector A function to map each group member to a specific value
                 * @param {Function} keyComparer A function of the form (first, second) => bool to check if keys are considered equal
                 * @return {Map} The grouped sequence as a Map
                 */ /**
                    * GroupBy - Groups a sequence using the keys selected from the members using the keySelector. Keys are compared using the specified keyComparer.
                    * Each group member is projected to a single value (e.g. a property) using the elementSelector.
                    *
                    * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
                    * @instance
                    * @memberof Collection
                    * @method
                    * @param {Function} keySelector A function to select grouping keys from the sequence members
                    * @param {Function} elementSelector A function to map each group member to a specific value
                    * @param {Function} keyComparer A function of the form (first, second) => bool to check if keys are considered equal
                    * @return {Map} The grouped sequence as a Map
                    */ /**
                       * GroupBy - Groups a sequence using the keys selected from the members using the keySelector.
                       * Each group member is projected to a single value (e.g. a property) using the elementSelector.
                       * The resultSelector is used to project each resulting group to a single value (e.g. an object with aggregated properties).
                       *
                       * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
                       * @instance
                       * @memberof Collection
                       * @method
                       * @param {Function} keySelector A function to select grouping keys from the sequence members
                       * @param {Function} elementSelector A function to map each group member to a specific value
                       * @param {Function} resultSelector A function of the form (key, groupMembers) => any to select a final result from each group
                       * @return {Collection} The grouped sequence with projected results as a new Collection
                       */ /**
                          * GroupBy - Groups a sequence using the keys selected from the members using the keySelector. The keys are compared using the keyComparer.
                          * Each group member is projected to a single value (e.g. a property) using the elementSelector.
                          * The resultSelector is used to project each resulting group to a single value (e.g. an object with aggregated properties).
                          *
                          * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.groupby(v=vs.110).aspx
                          * @instance
                          * @memberof Collection
                          * @method
                          * @param {Function} keySelector A function to select grouping keys from the sequence members
                          * @param {Function} elementSelector A function to map each group member to a specific value
                          * @param {Function} resultSelector A function of the form (key, groupMembers) => any to select a final result from each group
                          * @param {Function} keyComparer A function of the form (first, second) => bool to check if keys are considered equal
                          * @return {Collection} The grouped sequence with projected results as a new Collection
                          * @
                          */
    function GroupBy(keySelector) {
      var arr = this.ToArray();

      /**
       * isKeyComparer - Checks whether or not a function is a keyComparer. We need to differentiate between the keyComparer and the resultSelector
       * since both take two arguments.
       */
      function isKeyComparer(arg) {
        var result = getParameterCount(arg) === 2;
        try {
          // if this is a key comparer, it must return truthy values for equal values and falsy ones if they're different
          result = result && arg(1, 1) && !arg(1, 2);
        } catch (err) {
          // if the function throws an error for values, it can't be a keyComparer
          result = false;
        }

        return result;
      }

      /**
       * getKey - Get the matching key in the group for a given key and a keyComparer or return the parameter itself if the key is not present yet
       */
      function getKey(groups, key, keyComparer) {
        var _iteratorNormalCompletion19 = true;
        var _didIteratorError19 = false;
        var _iteratorError19 = undefined;

        try {
          for (var _iterator19 = groups.keys()[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
            var groupKey = _step19.value;

            if (keyComparer(groupKey, key)) {
              return groupKey;
            }
          }
        } catch (err) {
          _didIteratorError19 = true;
          _iteratorError19 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion19 && _iterator19.return) {
              _iterator19.return();
            }
          } finally {
            if (_didIteratorError19) {
              throw _iteratorError19;
            }
          }
        }

        return key;
      }

      /*
      GroupBy(keySelector)
      */
      function groupByOneArgument(keySelector) {
        return groupBy(keySelector, function (elem) {
          return elem;
        }, undefined, defaultEqualityCompareFn);
      }

      /*
      GroupBy(keySelector, keyComparer)
      GroupBy(keySelector, elementSelector)
      GroupBy(keySelector, resultSelector)
      */
      function groupByTwoArguments(keySelector, second) {
        var keyComparer = void 0,
            elementSelector = void 0;

        if (isKeyComparer(second)) {
          keyComparer = second;
          elementSelector = function elementSelector(elem) {
            return elem;
          };
        } else {
          keyComparer = defaultEqualityCompareFn;
          elementSelector = second;
        }

        return groupByThreeArguments(keySelector, elementSelector, keyComparer);
      }

      /*
      GroupBy(keySelector, resultSelector, keyComparer)
      GroupBy(keySelector, elementSelector, keyComparer)
      GroupBy(keySelector, elementSelector, resultSelector)
      */
      function groupByThreeArguments(keySelector, second, third) {
        var keyComparer = void 0,
            elementSelector = void 0,
            resultSelector = void 0;

        if (isKeyComparer(third)) {
          keyComparer = third;
        } else {
          resultSelector = third;
        }

        if (getParameterCount(second) === 2) {
          resultSelector = second;
        } else {
          elementSelector = second;
        }

        if (!keyComparer) {
          keyComparer = defaultEqualityCompareFn;
        }

        if (!elementSelector) {
          elementSelector = function elementSelector(elem) {
            return elem;
          };
        }

        return groupBy(keySelector, elementSelector, resultSelector, keyComparer);
      }

      /**
       * This is the "basic" function to use. The others just transform their parameters to be used with this one.
       */
      function groupBy(keySelector, elementSelector, resultSelector, keyComparer) {
        __assertFunction(keySelector);
        __assertFunction(elementSelector);
        __assert(isUndefined(resultSelector) || isFunction(resultSelector), 'resultSelector must be undefined or function!');
        __assertFunction(keyComparer);

        var groups = new Map();
        var result = void 0;

        var _iteratorNormalCompletion20 = true;
        var _didIteratorError20 = false;
        var _iteratorError20 = undefined;

        try {
          for (var _iterator20 = arr[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
            var _val10 = _step20.value;

            // Instead of checking groups.has we use our custom function since we want to treat some keys as equal even if they aren't for the Map
            var _key3 = getKey(groups, keySelector(_val10), keyComparer);
            var elem = elementSelector(_val10);

            if (groups.has(_key3)) {
              groups.get(_key3).push(elem);
            } else {
              groups.set(_key3, [elem]);
            }
          }
        } catch (err) {
          _didIteratorError20 = true;
          _iteratorError20 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion20 && _iterator20.return) {
              _iterator20.return();
            }
          } finally {
            if (_didIteratorError20) {
              throw _iteratorError20;
            }
          }
        }

        if (resultSelector) {
          // If we want to select the final result with the resultSelector, we use the built-in Select function and retrieve a new Collection
          result = groups.ToArray().Select(function (g) {
            return resultSelector.apply(undefined, _toConsumableArray(g));
          });
        } else {
          // our result is just the grouos -> return the Map
          result = groups;
        }

        return result;
      }

      // the first parameter of GroupBy is always the keySelector, so we have to differentiate the following arguments
      // and select the appropriate function
      var fn = void 0;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      switch (args.length) {
        case 0:
          fn = groupByOneArgument;
          break;
        case 1:
          fn = groupByTwoArguments;
          break;
        case 2:
          fn = groupByThreeArguments;
          break;
        case 3:
          fn = groupBy;
          break;
        default:
          throw new Error('GroupBy parameter count can not be greater than 4!');
      }

      return fn.apply(undefined, [keySelector].concat(args));
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
     */ /**
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
    function SequenceEqual(second) {
      var equalityCompareFn = arguments.length <= 1 || arguments[1] === undefined ? defaultEqualityCompareFn : arguments[1];

      if (!isIterable(second)) {
        return false;
      }

      var first = this.ToArray();
      second = second.ToArray();

      if (first.length !== second.length) {
        return false;
      }

      for (var i = 0; i < first.length; i++) {
        var firstVal = first[i];
        var secondVal = second[i];

        if (!equalityCompareFn(firstVal, secondVal)) {
          return false;
        }
      }

      return true;
    }

    /* Export public interface */
    __export((_export = { DefaultComparator: DefaultComparator, Min: Min, Max: Max, Average: Average, Sum: Sum, Concat: Concat, Union: Union, Join: Join, Except: Except, Zip: Zip, Intersect: Intersect, Where: Where, ConditionalWhere: ConditionalWhere, Count: Count, Contains: Contains, IndexOf: IndexOf, Any: Any, All: All, ElementAt: ElementAt, Take: Take, TakeWhile: TakeWhile, TakeUntil: TakeUntil, Skip: Skip, SkipWhile: SkipWhile, SkipUntil: SkipUntil }, _defineProperty(_export, 'Contains', Contains), _defineProperty(_export, 'First', First), _defineProperty(_export, 'FirstOrDefault', FirstOrDefault), _defineProperty(_export, 'Last', Last), _defineProperty(_export, 'LastOrDefault', LastOrDefault), _defineProperty(_export, 'Single', Single), _defineProperty(_export, 'SingleOrDefault', SingleOrDefault), _defineProperty(_export, 'DefaultIfEmpty', DefaultIfEmpty), _defineProperty(_export, 'DefaultComparator', DefaultComparator), _defineProperty(_export, 'MinHeap', MinHeap), _defineProperty(_export, 'MaxHeap', MaxHeap), _defineProperty(_export, 'Aggregate', Aggregate), _defineProperty(_export, 'Distinct', Distinct), _defineProperty(_export, 'Select', Select), _defineProperty(_export, 'SelectMany', SelectMany), _defineProperty(_export, 'Flatten', Flatten), _defineProperty(_export, 'Reverse', Reverse), _defineProperty(_export, 'ToArray', ToArray), _defineProperty(_export, 'ToDictionary', ToDictionary), _defineProperty(_export, 'ToJSON', ToJSON), _defineProperty(_export, 'ForEach', ForEach), _defineProperty(_export, 'Add', Add), _defineProperty(_export, 'Insert', Insert), _defineProperty(_export, 'Remove', Remove), _defineProperty(_export, 'GetComparatorFromKeySelector', GetComparatorFromKeySelector), _defineProperty(_export, 'OrderedLinqCollection', OrderedLinqCollection), _defineProperty(_export, 'Order', Order), _defineProperty(_export, 'OrderBy', OrderBy), _defineProperty(_export, 'OrderDescending', OrderDescending), _defineProperty(_export, 'OrderByDescending', OrderByDescending), _defineProperty(_export, 'Shuffle', Shuffle), _defineProperty(_export, 'GroupBy', GroupBy), _defineProperty(_export, 'SequenceEqual', SequenceEqual), _export));
    // Install linqjs
    // [1] Assign exports to the prototype of Collection
    __assign(Collection.prototype, linqjsExports);

    // [2] Let OrderedCollection inherit from Collection (we don't want to implement stuff twice)
    OrderedLinqCollection.prototype = __assign(__assign({}, Collection.prototype), OrderedLinqCollection.prototype);
    OrderedLinqCollection.prototype.constructor = OrderedLinqCollection;

    // [3] Apply wrapper functions to selected prototypes which are iterable (Array, Set, Map etc.)
    var protosToApplyWrappers = [window.Array.prototype, window.Set.prototype, window.Map.prototype];

    Object.keys(Collection.prototype).forEach(function (k) {
      var _iteratorNormalCompletion21 = true;
      var _didIteratorError21 = false;
      var _iteratorError21 = undefined;

      try {
        for (var _iterator21 = protosToApplyWrappers[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
          var proto = _step21.value;

          proto[k] = function () {
            var _ref;

            return (_ref = new Collection(this))[k].apply(_ref, arguments);
          };
        }
      } catch (err) {
        _didIteratorError21 = true;
        _iteratorError21 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion21 && _iterator21.return) {
            _iterator21.return();
          }
        } finally {
          if (_didIteratorError21) {
            throw _iteratorError21;
          }
        }
      }
    });

    // [4] Return final Collection class
    return Collection;
  }());
})();
