/*!
 * linqjs v0.0.0
 * (c) Sven Schmidt 
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

    Object.defineProperty(Collection, 'Empty', {
      get: function get() {
        return Collection.from([]);
      }
    });

    var collectionStaticMethods = { from: from, Range: Range };

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

    function __assertNotEmpty(coll) {
      __assert(!isEmpty(coll), 'Sequence is empty');
    }

    function __assertIterable(obj) {
      __assert(isIterable(obj), 'Parameter must be iterable!');
    }

    function __assertCollection(obj) {
      __assert(isCollection(obj), 'Pa>rameter must be collection!');
    }

    function __assertIterationNotStarted(collection) {
      __assert(!(collection.hasOwnProperty('StartedIterating') && collection.StartedIterating()), 'Iteration already started!');
    }

    function __assertString(obj) {
      __assert(isString(obj), 'Parameter must be string!');
    }

    function __assertNumeric(obj) {
      __assert(isNumeric(obj), 'Parameter must be numeric!');
    }

    function __assertNumberBetween(num, min) {
      var max = arguments.length <= 2 || arguments[2] === undefined ? Infinity : arguments[2];

      __assertNumeric(num);
      __assert(num >= min && num <= max, 'Number must be between ' + min + ' and ' + max + '!');
    }

    function __assertIndexInRange(coll, index) {
      __assertCollection(coll);
      __assert(isNumeric(index), 'Index must be number!');
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
      return Symbol.iterator in obj;
    }

    function isString(obj) {
      return typeof obj === 'string';
    }

    function isCollection(obj) {
      return obj instanceof Collection;
    }

    function isGenerator(obj) {
      return obj instanceof regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }).constructor;
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

      return new Collection(regeneratorRuntime.mark(function _callee5() {
        var iter, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, val, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, prev;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                iter = coll.getIterator();
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context5.prev = 4;
                _iterator = iter[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context5.next = 40;
                  break;
                }

                val = _step.value;
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context5.prev = 11;
                _iterator2 = previous[Symbol.iterator]();

              case 13:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context5.next = 20;
                  break;
                }

                prev = _step2.value;

                if (!equalityCompareFn(val, prev)) {
                  _context5.next = 17;
                  break;
                }

                return _context5.abrupt('continue', 37);

              case 17:
                _iteratorNormalCompletion2 = true;
                _context5.next = 13;
                break;

              case 20:
                _context5.next = 26;
                break;

              case 22:
                _context5.prev = 22;
                _context5.t0 = _context5['catch'](11);
                _didIteratorError2 = true;
                _iteratorError2 = _context5.t0;

              case 26:
                _context5.prev = 26;
                _context5.prev = 27;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 29:
                _context5.prev = 29;

                if (!_didIteratorError2) {
                  _context5.next = 32;
                  break;
                }

                throw _iteratorError2;

              case 32:
                return _context5.finish(29);

              case 33:
                return _context5.finish(26);

              case 34:

                previous.push(val);

                _context5.next = 37;
                return val;

              case 37:
                _iteratorNormalCompletion = true;
                _context5.next = 6;
                break;

              case 40:
                _context5.next = 46;
                break;

              case 42:
                _context5.prev = 42;
                _context5.t1 = _context5['catch'](4);
                _didIteratorError = true;
                _iteratorError = _context5.t1;

              case 46:
                _context5.prev = 46;
                _context5.prev = 47;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 49:
                _context5.prev = 49;

                if (!_didIteratorError) {
                  _context5.next = 52;
                  break;
                }

                throw _iteratorError;

              case 52:
                return _context5.finish(49);

              case 53:
                return _context5.finish(46);

              case 54:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[4, 42, 46, 54], [11, 22, 26, 34], [27,, 29, 33], [47,, 49, 53]]);
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

    function Min() {
      var mapFn = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return x;
      } : arguments[0];

      __assertFunction(mapFn);
      __assertNotEmpty(this);

      return Math.min.apply(null, this.Select(mapFn).ToArray());
    }

    function Max() {
      var mapFn = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return x;
      } : arguments[0];

      __assertFunction(mapFn);
      __assertNotEmpty(this);

      return Math.max.apply(null, this.Select(mapFn).ToArray());
    }

    function Sum() {
      __assertNotEmpty(this);

      return this.Aggregate(0, function (prev, curr) {
        return prev + curr;
      });
    }

    function Average() {
      __assertNotEmpty(this);

      return this.Sum() / this.Count();
    }

    /* src/concatenation.js */

    function Concat(second) {
      __assertIterable(second);

      var firstIter = this;

      if (!isCollection(second)) {
        second = new Collection(second);
      }

      return new Collection(regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.delegateYield(firstIter, 't0', 1);

              case 1:
                return _context6.delegateYield(second.getIterator(), 't1', 2);

              case 2:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));
    }

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

      var firstIter = this;

      var result = new Collection(regeneratorRuntime.mark(function _callee7() {
        var secondIter, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, firstValue, firstKey, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, secondValue, secondKey;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                secondIter = second.getIterator();
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context7.prev = 4;
                _iterator3 = firstIter[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                  _context7.next = 40;
                  break;
                }

                firstValue = _step3.value;
                firstKey = firstKeySelector(firstValue);
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context7.prev = 12;
                _iterator4 = secondIter[Symbol.iterator]();

              case 14:
                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                  _context7.next = 23;
                  break;
                }

                secondValue = _step4.value;
                secondKey = secondKeySelector(secondValue);

                if (!keyEqualityCompareFn(firstKey, secondKey)) {
                  _context7.next = 20;
                  break;
                }

                _context7.next = 20;
                return resultSelectorFn(firstValue, secondValue);

              case 20:
                _iteratorNormalCompletion4 = true;
                _context7.next = 14;
                break;

              case 23:
                _context7.next = 29;
                break;

              case 25:
                _context7.prev = 25;
                _context7.t0 = _context7['catch'](12);
                _didIteratorError4 = true;
                _iteratorError4 = _context7.t0;

              case 29:
                _context7.prev = 29;
                _context7.prev = 30;

                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }

              case 32:
                _context7.prev = 32;

                if (!_didIteratorError4) {
                  _context7.next = 35;
                  break;
                }

                throw _iteratorError4;

              case 35:
                return _context7.finish(32);

              case 36:
                return _context7.finish(29);

              case 37:
                _iteratorNormalCompletion3 = true;
                _context7.next = 6;
                break;

              case 40:
                _context7.next = 46;
                break;

              case 42:
                _context7.prev = 42;
                _context7.t1 = _context7['catch'](4);
                _didIteratorError3 = true;
                _iteratorError3 = _context7.t1;

              case 46:
                _context7.prev = 46;
                _context7.prev = 47;

                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }

              case 49:
                _context7.prev = 49;

                if (!_didIteratorError3) {
                  _context7.next = 52;
                  break;
                }

                throw _iteratorError3;

              case 52:
                return _context7.finish(49);

              case 53:
                return _context7.finish(46);

              case 54:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this, [[4, 42, 46, 54], [12, 25, 29, 37], [30,, 32, 36], [47,, 49, 53]]);
      }));

      this.reset();

      return result;
    }

    /**
     * Except - Returns the element of the sequence that do not appear in second
     *
     * @see https://msdn.microsoft.com/de-de/library/bb300779(v=vs.110).aspx
     * @param  {Iterable} second
     * @return {Collection}        new Collection with the values of first without the ones in second
     */
    function Except(second) {
      __assertIterable(second);

      var firstIter = this;

      var result = new Collection(regeneratorRuntime.mark(function _callee8() {
        var _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, val;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _iteratorNormalCompletion5 = true;
                _didIteratorError5 = false;
                _iteratorError5 = undefined;
                _context8.prev = 3;
                _iterator5 = firstIter[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                  _context8.next = 13;
                  break;
                }

                val = _step5.value;

                if (second.Contains(val)) {
                  _context8.next = 10;
                  break;
                }

                _context8.next = 10;
                return val;

              case 10:
                _iteratorNormalCompletion5 = true;
                _context8.next = 5;
                break;

              case 13:
                _context8.next = 19;
                break;

              case 15:
                _context8.prev = 15;
                _context8.t0 = _context8['catch'](3);
                _didIteratorError5 = true;
                _iteratorError5 = _context8.t0;

              case 19:
                _context8.prev = 19;
                _context8.prev = 20;

                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                  _iterator5.return();
                }

              case 22:
                _context8.prev = 22;

                if (!_didIteratorError5) {
                  _context8.next = 25;
                  break;
                }

                throw _iteratorError5;

              case 25:
                return _context8.finish(22);

              case 26:
                return _context8.finish(19);

              case 27:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this, [[3, 15, 19, 27], [20,, 22, 26]]);
      }));

      this.reset();
      second.reset && second.reset();

      return result;
    }

    /**
     * Zip - Applies a function to the elements of two sequences, producing a sequence of the results
     *
     * @param  {Iterable} second
     * @param  {type} resultSelectorFn A function of the form (firstValue, secondValue) => any to produce the output sequence
     * @return {collection}
     */
    function Zip(second, resultSelectorFn) {
      __assertIterable(second);
      __assertFunction(resultSelectorFn);

      var firstIter = this;

      var result = new Collection(regeneratorRuntime.mark(function _callee9() {
        var secondIter, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, firstVal, secondNext;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                secondIter = second.getIterator();
                _iteratorNormalCompletion6 = true;
                _didIteratorError6 = false;
                _iteratorError6 = undefined;
                _context9.prev = 4;
                _iterator6 = firstIter[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                  _context9.next = 16;
                  break;
                }

                firstVal = _step6.value;
                secondNext = secondIter.next();

                if (!secondNext.done) {
                  _context9.next = 11;
                  break;
                }

                return _context9.abrupt('break', 16);

              case 11:
                _context9.next = 13;
                return resultSelectorFn(firstVal, secondNext.value);

              case 13:
                _iteratorNormalCompletion6 = true;
                _context9.next = 6;
                break;

              case 16:
                _context9.next = 22;
                break;

              case 18:
                _context9.prev = 18;
                _context9.t0 = _context9['catch'](4);
                _didIteratorError6 = true;
                _iteratorError6 = _context9.t0;

              case 22:
                _context9.prev = 22;
                _context9.prev = 23;

                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                  _iterator6.return();
                }

              case 25:
                _context9.prev = 25;

                if (!_didIteratorError6) {
                  _context9.next = 28;
                  break;
                }

                throw _iteratorError6;

              case 28:
                return _context9.finish(25);

              case 29:
                return _context9.finish(22);

              case 30:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this, [[4, 18, 22, 30], [23,, 25, 29]]);
      }));

      this.reset();

      return result;
    }

    /* src/search.js */

    function Contains(elem) {
      var result = false;

      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = this[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var val = _step7.value;

          if (defaultEqualityCompareFn(elem, val)) {
            result = true;
            break;
          }
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      this.reset();

      return result;
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

      var result = new Collection(regeneratorRuntime.mark(function _callee10() {
        var index, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, val;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                index = 0;
                _iteratorNormalCompletion8 = true;
                _didIteratorError8 = false;
                _iteratorError8 = undefined;
                _context10.prev = 4;
                _iterator8 = iter[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
                  _context10.next = 15;
                  break;
                }

                val = _step8.value;

                if (!predicate(val, index)) {
                  _context10.next = 11;
                  break;
                }

                _context10.next = 11;
                return val;

              case 11:

                index++;

              case 12:
                _iteratorNormalCompletion8 = true;
                _context10.next = 6;
                break;

              case 15:
                _context10.next = 21;
                break;

              case 17:
                _context10.prev = 17;
                _context10.t0 = _context10['catch'](4);
                _didIteratorError8 = true;
                _iteratorError8 = _context10.t0;

              case 21:
                _context10.prev = 21;
                _context10.prev = 22;

                if (!_iteratorNormalCompletion8 && _iterator8.return) {
                  _iterator8.return();
                }

              case 24:
                _context10.prev = 24;

                if (!_didIteratorError8) {
                  _context10.next = 27;
                  break;
                }

                throw _iteratorError8;

              case 27:
                return _context10.finish(24);

              case 28:
                return _context10.finish(21);

              case 29:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this, [[4, 17, 21, 29], [22,, 24, 28]]);
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
     * @return {Boolean}
     */ /**
        * Any - Returns true if at least one element of the sequence matches the predicate or false if no element matches
        *
        * @see https://msdn.microsoft.com/de-de/library/bb337697(v=vs.110).aspx
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

      __assert(isNumeric(count), 'First parameter must be numeric!');

      if (count <= 0) {
        return Collection.Empty;
      }

      var iter = this.getIterator();
      return new Collection(regeneratorRuntime.mark(function _callee11() {
        var i, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, val;

        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                i = 0;
                _iteratorNormalCompletion9 = true;
                _didIteratorError9 = false;
                _iteratorError9 = undefined;
                _context11.prev = 4;
                _iterator9 = iter[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
                  _context11.next = 15;
                  break;
                }

                val = _step9.value;
                _context11.next = 10;
                return val;

              case 10:
                if (!(++i === count)) {
                  _context11.next = 12;
                  break;
                }

                return _context11.abrupt('break', 15);

              case 12:
                _iteratorNormalCompletion9 = true;
                _context11.next = 6;
                break;

              case 15:
                _context11.next = 21;
                break;

              case 17:
                _context11.prev = 17;
                _context11.t0 = _context11['catch'](4);
                _didIteratorError9 = true;
                _iteratorError9 = _context11.t0;

              case 21:
                _context11.prev = 21;
                _context11.prev = 22;

                if (!_iteratorNormalCompletion9 && _iterator9.return) {
                  _iterator9.return();
                }

              case 24:
                _context11.prev = 24;

                if (!_didIteratorError9) {
                  _context11.next = 27;
                  break;
                }

                throw _iteratorError9;

              case 27:
                return _context11.finish(24);

              case 28:
                return _context11.finish(21);

              case 29:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this, [[4, 17, 21, 29], [22,, 24, 28]]);
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

      __assert(isNumeric(count), 'First parameter must be numeric!');

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

      var result = new Collection(regeneratorRuntime.mark(function _callee12() {
        var index, endTake, _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, val;

        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                index = 0;
                endTake = false;
                _iteratorNormalCompletion10 = true;
                _didIteratorError10 = false;
                _iteratorError10 = undefined;
                _context12.prev = 5;
                _iterator10 = iter[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done) {
                  _context12.next = 17;
                  break;
                }

                val = _step10.value;

                if (!(!endTake && predicate(val, index++))) {
                  _context12.next = 13;
                  break;
                }

                _context12.next = 12;
                return val;

              case 12:
                return _context12.abrupt('continue', 14);

              case 13:

                endTake = true;

              case 14:
                _iteratorNormalCompletion10 = true;
                _context12.next = 7;
                break;

              case 17:
                _context12.next = 23;
                break;

              case 19:
                _context12.prev = 19;
                _context12.t0 = _context12['catch'](5);
                _didIteratorError10 = true;
                _iteratorError10 = _context12.t0;

              case 23:
                _context12.prev = 23;
                _context12.prev = 24;

                if (!_iteratorNormalCompletion10 && _iterator10.return) {
                  _iterator10.return();
                }

              case 26:
                _context12.prev = 26;

                if (!_didIteratorError10) {
                  _context12.next = 29;
                  break;
                }

                throw _iteratorError10;

              case 29:
                return _context12.finish(26);

              case 30:
                return _context12.finish(23);

              case 31:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this, [[5, 19, 23, 31], [24,, 26, 30]]);
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

      return new Collection(regeneratorRuntime.mark(function _callee13() {
        var index, endSkip, _iteratorNormalCompletion11, _didIteratorError11, _iteratorError11, _iterator11, _step11, val;

        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                index = 0;
                endSkip = false;
                _iteratorNormalCompletion11 = true;
                _didIteratorError11 = false;
                _iteratorError11 = undefined;
                _context13.prev = 5;
                _iterator11 = iter[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done) {
                  _context13.next = 17;
                  break;
                }

                val = _step11.value;

                if (!(!endSkip && predicate(val, index++))) {
                  _context13.next = 11;
                  break;
                }

                return _context13.abrupt('continue', 14);

              case 11:

                endSkip = true;
                _context13.next = 14;
                return val;

              case 14:
                _iteratorNormalCompletion11 = true;
                _context13.next = 7;
                break;

              case 17:
                _context13.next = 23;
                break;

              case 19:
                _context13.prev = 19;
                _context13.t0 = _context13['catch'](5);
                _didIteratorError11 = true;
                _iteratorError11 = _context13.t0;

              case 23:
                _context13.prev = 23;
                _context13.prev = 24;

                if (!_iteratorNormalCompletion11 && _iterator11.return) {
                  _iterator11.return();
                }

              case 26:
                _context13.prev = 26;

                if (!_didIteratorError11) {
                  _context13.next = 29;
                  break;
                }

                throw _iteratorError11;

              case 29:
                return _context13.finish(26);

              case 30:
                return _context13.finish(23);

              case 31:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this, [[5, 19, 23, 31], [24,, 26, 30]]);
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

    function resultOrDefault(collection, originalFn) {
      var predicateOrConstructor = arguments.length <= 2 || arguments[2] === undefined ? function (x) {
        return true;
      } : arguments[2];
      var constructor = arguments.length <= 3 || arguments[3] === undefined ? Object : arguments[3];

      //__assertArray(arr)

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

      var defaultVal = getDefault(constructor);

      if (isEmpty(collection)) {
        return defaultVal;
      }

      return originalFn.call(collection, predicate);
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

      //__assertFunction(predicate)
      //__assertNotEmpty(this)

      return new Collection(this.ToArray().reverse()).First(predicate);
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

      var index = 0;
      var result = void 0;

      var _iteratorNormalCompletion12 = true;
      var _didIteratorError12 = false;
      var _iteratorError12 = undefined;

      try {
        for (var _iterator12 = this.getIterator()[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
          var val = _step12.value;

          if (predicate(val)) {
            result = val;
            break;
          }

          index++;
        }
      } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion12 && _iterator12.return) {
            _iterator12.return();
          }
        } finally {
          if (_didIteratorError12) {
            throw _iteratorError12;
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

    function Select() {
      var mapFn = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return x;
      } : arguments[0];

      var _self = this;

      return new Collection(regeneratorRuntime.mark(function _callee14() {
        var _iteratorNormalCompletion13, _didIteratorError13, _iteratorError13, _iterator13, _step13, val;

        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _self.reset();

                _iteratorNormalCompletion13 = true;
                _didIteratorError13 = false;
                _iteratorError13 = undefined;
                _context14.prev = 4;
                _iterator13 = _self[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done) {
                  _context14.next = 13;
                  break;
                }

                val = _step13.value;
                _context14.next = 10;
                return mapFn(val);

              case 10:
                _iteratorNormalCompletion13 = true;
                _context14.next = 6;
                break;

              case 13:
                _context14.next = 19;
                break;

              case 15:
                _context14.prev = 15;
                _context14.t0 = _context14['catch'](4);
                _didIteratorError13 = true;
                _iteratorError13 = _context14.t0;

              case 19:
                _context14.prev = 19;
                _context14.prev = 20;

                if (!_iteratorNormalCompletion13 && _iterator13.return) {
                  _iterator13.return();
                }

              case 22:
                _context14.prev = 22;

                if (!_didIteratorError13) {
                  _context14.next = 25;
                  break;
                }

                throw _iteratorError13;

              case 25:
                return _context14.finish(22);

              case 26:
                return _context14.finish(19);

              case 27:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this, [[4, 15, 19, 27], [20,, 22, 26]]);
      }));
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

    function ToArray() {
      return [].concat(_toConsumableArray(this.getIterator()));
    }

    /**
     * ToDictionary - description
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.todictionary(v=vs.110).aspx
     * @param  {Function} keySelector                  Function to get the keys from the elements
     * @param  {Function} elementSelectorOrKeyComparer Function to either get the elements or compare the keys
     * @param  {Function} keyComparer                  Function to compare the keys
     * @return {Map}                                   A dictionary (Map)
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

      var _iteratorNormalCompletion14 = true;
      var _didIteratorError14 = false;
      var _iteratorError14 = undefined;

      try {
        var _loop = function _loop() {
          var value = _step14.value;

          var key = keySelector(value);
          var elem = elementSelector(value);

          __assert(key != null, 'Key is not allowed to be null!');
          __assert(!usedKeys.Any(function (x) {
            return keyComparer(x, key);
          }), 'Key \'' + key + '\' is already in use!');

          usedKeys.push(key);
          result.set(key, elem);
        };

        for (var _iterator14 = input[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError14 = true;
        _iteratorError14 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion14 && _iterator14.return) {
            _iterator14.return();
          }
        } finally {
          if (_didIteratorError14) {
            throw _iteratorError14;
          }
        }
      }

      return result;
    }

    /*
    GroupBy(keySelector)
    GroupBy(keySelector, keyComparer)
    GroupBy(keySelector, elementSelector)
    GroupBy(keySelector, resultTransformFn)
    GroupBy(keySelector, resultTransformFn, keyComparer)
    GroupBy(keySelector, elementSelector, keyComparer)
    GroupBy(keySelector, elementSelector, resultTransformFn)
    GroupBy(keySelector, elementSelector, resultTransformFn, keyComparer)
    */
    function GroupBy(keySelector, keyComparerOrResultTransformFnOrElementSelector, keyComparerOrResultTransformFn, keyComparer) {
      __assertFunction(keySelector);
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
      this.Insert(value, this.Count());
    }

    /**
     * Insert - Adds an element to the specified index of the collection
     *
     * @see https://msdn.microsoft.com/de-de/library/sey5k5z4(v=vs.110).aspx
     * @param  {any}         value The value to add
     * @param  {Number}      index The index to add the value to
     * @return {void}
     */
    function Insert(value, index) {
      __assert(index >= 0 && index <= this.Count(), 'Index is out of bounds!');

      var oldIter = this.ToArray();

      this.iterable = regeneratorRuntime.mark(function _callee15() {
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                return _context15.delegateYield(oldIter.slice(0, index), 't0', 1);

              case 1:
                _context15.next = 3;
                return value;

              case 3:
                return _context15.delegateYield(oldIter.slice(index, oldIter.length), 't1', 4);

              case 4:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this);
      });
      this.reset();
    }

    /**
     * Remove - Removes an element from an array
     *
     * @param  {any} value The value to remove
     * @return {Boolean}       True if the element was removed, false if not (or the element was not found)
     */
    function Remove(value) {
      var values = this.ToArray();
      var result = removeFromArray(values, value);

      if (!result) {
        return false;
      }

      this.iterable = regeneratorRuntime.mark(function _callee16() {
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                return _context16.delegateYield(values, 't0', 1);

              case 1:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this);
      });
      this.reset();

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

      OrderedLinqCollection.prototype.getIterator = function () {
        var _self = this;

        return regeneratorRuntime.mark(function _callee17() {
          return regeneratorRuntime.wrap(function _callee17$(_context17) {
            while (1) {
              switch (_context17.prev = _context17.next) {
                case 0:
                  return _context17.delegateYield(Reflect.construct(_self.__heapConstructor, [[].concat(_toConsumableArray(_self.iterable)), _self.__comparator]), 't0', 1);

                case 1:
                case 'end':
                  return _context17.stop();
              }
            }
          }, _callee17, this);
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

    /* Export public interface */
    __export((_export = { DefaultComparator: DefaultComparator, Min: Min, Max: Max, Average: Average, Sum: Sum, Concat: Concat, Union: Union, Join: Join, Except: Except, Zip: Zip, Where: Where, ConditionalWhere: ConditionalWhere, Count: Count, Any: Any, All: All, ElementAt: ElementAt, Take: Take, TakeWhile: TakeWhile, TakeUntil: TakeUntil, Skip: Skip, SkipWhile: SkipWhile, SkipUntil: SkipUntil, Contains: Contains, First: First, FirstOrDefault: FirstOrDefault, Last: Last, LastOrDefault: LastOrDefault, Single: Single, SingleOrDefault: SingleOrDefault, DefaultIfEmpty: DefaultIfEmpty }, _defineProperty(_export, 'DefaultComparator', DefaultComparator), _defineProperty(_export, 'MinHeap', MinHeap), _defineProperty(_export, 'MaxHeap', MaxHeap), _defineProperty(_export, 'Aggregate', Aggregate), _defineProperty(_export, 'Distinct', Distinct), _defineProperty(_export, 'Select', Select), _defineProperty(_export, 'ToArray', ToArray), _defineProperty(_export, 'ToDictionary', ToDictionary), _defineProperty(_export, 'Add', Add), _defineProperty(_export, 'Insert', Insert), _defineProperty(_export, 'Remove', Remove), _defineProperty(_export, 'GetComparatorFromKeySelector', GetComparatorFromKeySelector), _defineProperty(_export, 'OrderedLinqCollection', OrderedLinqCollection), _defineProperty(_export, 'Order', Order), _defineProperty(_export, 'OrderBy', OrderBy), _defineProperty(_export, 'OrderDescending', OrderDescending), _defineProperty(_export, 'OrderByDescending', OrderByDescending), _export));
    // Install linqjs
    // [1] Assign exports to the prototype of Collection
    __assign(Collection.prototype, linqjsExports);

    // [2] Let OrderedCollection inherit from Collection (we don't want to implement stuff twice)
    OrderedLinqCollection.prototype = __assign(__assign({}, Collection.prototype), OrderedLinqCollection.prototype);
    OrderedLinqCollection.prototype.constructor = OrderedLinqCollection;

    // [3] Apply wrapper functions to selected prototypes which are iterable (Array, Set, Map etc.)
    var protosToApplyWrappers = [window.Array.prototype, window.Set.prototype, window.Map.prototype];

    Object.keys(Collection.prototype).forEach(function (k) {
      var _iteratorNormalCompletion15 = true;
      var _didIteratorError15 = false;
      var _iteratorError15 = undefined;

      try {
        for (var _iterator15 = protosToApplyWrappers[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
          var proto = _step15.value;

          proto[k] = function () {
            var _ref;

            return (_ref = new Collection(this))[k].apply(_ref, arguments);
          };
        }
      } catch (err) {
        _didIteratorError15 = true;
        _iteratorError15 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion15 && _iterator15.return) {
            _iterator15.return();
          }
        } finally {
          if (_didIteratorError15) {
            throw _iteratorError15;
          }
        }
      }
    });

    // [4] Return final Collection class
    return Collection;
  }());
})();
