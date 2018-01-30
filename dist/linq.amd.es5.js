"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports"], function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @private
     * @internal
     */

    var __AssertionError = function (_Error) {
        _inherits(__AssertionError, _Error);

        function __AssertionError(expected, got) {
            _classCallCheck(this, __AssertionError);

            return _possibleConstructorReturn(this, (__AssertionError.__proto__ || Object.getPrototypeOf(__AssertionError)).call(this, "Expected " + expected + ", got " + got + "!"));
        }

        return __AssertionError;
    }(Error);
    /**
     * @private
     * @internal
     */


    function __assert(condition) {
        if (!condition) {
            if ((arguments.length <= 1 ? 0 : arguments.length - 1) === 2) {
                throw new __AssertionError(arguments.length <= 1 ? undefined : arguments[1], arguments.length <= 2 ? undefined : arguments[2]);
            } else {
                throw new Error(arguments.length <= 1 ? undefined : arguments[1]);
            }
        }
    }
    /**
     * @private
     * @internal
     */
    function __assertFunction(param) {
        __assert(__isFunction(param), 'function', param);
    }
    /**
     * @private
     * @internal
     */
    function __assertArray(param) {
        __assert(__isArray(param), 'array', param);
    }
    /**
     * @private
     * @internal
     */
    function __assertNotEmpty(self) {
        __assert(!__isEmpty(self), 'Sequence is empty!');
    }
    /**
     * @private
     * @internal
     */
    function __assertIterable(obj) {
        __assert(__isIterable(obj), 'iterable', obj);
    }
    /**
     * @private
     * @internal
     */
    function __assertCollection(obj) {
        __assert(__isCollection(obj), 'collection', obj);
    }
    /**
     * @private
     * @internal
     */
    function __assertNumeric(obj) {
        __assert(__isNumeric(obj), 'numeric value', obj);
    }
    /**
     * @private
     * @internal
     */
    function __assertNumberBetween(num, min) {
        var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;

        __assertNumeric(num);
        __assert(num >= min && num <= max, "Number must be between " + min + " and " + max + "!");
    }
    /**
     * @private
     * @internal
     */
    function __assertIndexInRange(self, index) {
        __assertCollection(self);
        __assert(__isNumeric(index), 'number', index);
        __assert(index >= 0 && index < self.count(), 'Index is out of bounds');
    }
    /**
     * @private
     * @internal
     */
    function __defaultEqualityCompareFn(first, second) {
        return first === second;
    }
    /**
     * Default comparator implementation that uses the "<" operator.
     * Returns values as specified by the comparator function fir Array.sort().
     *
     * @param a Element "a" to be compared.
     * @param b Element "b" to be compared.
     * @return -1 if "a" is smaller than "b",
     *         1 if "b" is smaller than "a",
     *         0 if they are equal.
     */
    function defaultComparator(a, b) {
        if (a < b) {
            return -1;
        }
        if (b < a) {
            return 1;
        }
        return 0;
    }
    exports.defaultComparator = defaultComparator;
    /**
     * @private
     * @internal
     */
    function __isArray(obj) {
        return obj instanceof Array;
    }
    /**
     * @private
     * @internal
     */
    function __isFunction(obj) {
        return typeof obj === 'function';
    }
    /**
     * @private
     * @internal
     */
    function __isNumeric(n) {
        return !isNaN(parseFloat(n));
    }
    /**
     * @private
     * @internal
     */
    function __isEmpty(iterable) {
        return iterable[Symbol.iterator]().next().done;
    }
    /**
     * @private
     * @internal
     */
    function __isIterable(obj) {
        return Symbol.iterator in Object(obj);
    }
    /**
     * @private
     * @internal
     */
    function __isString(obj) {
        return typeof obj === 'string';
    }
    /**
     * @private
     * @internal
     */
    function __isCollection(obj) {
        return obj instanceof __Collection;
    }
    /**
     * @private
     * @internal
     */
    function __isGenerator(obj) {
        return obj instanceof /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }).constructor;
    }
    /**
     * @private
     * @internal
     */
    function __isUndefined(obj) {
        return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === (typeof undefined === "undefined" ? "undefined" : _typeof(undefined));
    }
    /**
     * @private
     * @internal
     */
    function __isPredicate(obj) {
        return !__isNative(obj) && __isFunction(obj) && __getParameterCount(obj) == 1;
    }
    /**
     * @private
     * @internal
     */
    var __nativeConstructors = [Object, Number, Boolean, String, Symbol];
    /**
     * @private
     * @internal
     */
    function __isNative(obj) {
        return (/native code/.test(Object(obj).toString()) || !!~__nativeConstructors.indexOf(obj)
        );
    }
    /**
     * @private
     * @internal
     */
    function __aggregateCollection(coll, seed, accumulator, resultTransformFn) {
        __assertFunction(accumulator);
        __assertFunction(resultTransformFn);
        var value = seed;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = coll[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var element = _step.value;

                value = accumulator(value, element);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return resultTransformFn(value);
    }
    /**
     * @private
     * @internal
     */
    function __removeDuplicates(coll) {
        var equalityCompareFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __defaultEqualityCompareFn;

        __assertIterable(coll);
        __assertFunction(equalityCompareFn);
        var previous = [];
        return new __Collection( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, val, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, prev;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _iteratorNormalCompletion2 = true;
                            _didIteratorError2 = false;
                            _iteratorError2 = undefined;
                            _context2.prev = 3;
                            _iterator2 = coll[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                                _context2.next = 39;
                                break;
                            }

                            val = _step2.value;
                            _iteratorNormalCompletion3 = true;
                            _didIteratorError3 = false;
                            _iteratorError3 = undefined;
                            _context2.prev = 10;
                            _iterator3 = previous[Symbol.iterator]();

                        case 12:
                            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                                _context2.next = 19;
                                break;
                            }

                            prev = _step3.value;

                            if (!equalityCompareFn(val, prev)) {
                                _context2.next = 16;
                                break;
                            }

                            return _context2.abrupt("continue", 36);

                        case 16:
                            _iteratorNormalCompletion3 = true;
                            _context2.next = 12;
                            break;

                        case 19:
                            _context2.next = 25;
                            break;

                        case 21:
                            _context2.prev = 21;
                            _context2.t0 = _context2["catch"](10);
                            _didIteratorError3 = true;
                            _iteratorError3 = _context2.t0;

                        case 25:
                            _context2.prev = 25;
                            _context2.prev = 26;

                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }

                        case 28:
                            _context2.prev = 28;

                            if (!_didIteratorError3) {
                                _context2.next = 31;
                                break;
                            }

                            throw _iteratorError3;

                        case 31:
                            return _context2.finish(28);

                        case 32:
                            return _context2.finish(25);

                        case 33:
                            previous.push(val);
                            _context2.next = 36;
                            return val;

                        case 36:
                            _iteratorNormalCompletion2 = true;
                            _context2.next = 5;
                            break;

                        case 39:
                            _context2.next = 45;
                            break;

                        case 41:
                            _context2.prev = 41;
                            _context2.t1 = _context2["catch"](3);
                            _didIteratorError2 = true;
                            _iteratorError2 = _context2.t1;

                        case 45:
                            _context2.prev = 45;
                            _context2.prev = 46;

                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }

                        case 48:
                            _context2.prev = 48;

                            if (!_didIteratorError2) {
                                _context2.next = 51;
                                break;
                            }

                            throw _iteratorError2;

                        case 51:
                            return _context2.finish(48);

                        case 52:
                            return _context2.finish(45);

                        case 53:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[3, 41, 45, 53], [10, 21, 25, 33], [26,, 28, 32], [46,, 48, 52]]);
        }));
    }
    /**
     * @private
     * @internal
     */
    function __removeFromArray(arr, value) {
        __assertArray(arr);
        var elementsBefore = [];
        var elementFound = void 0;
        var current = void 0;
        // remove all elements from the array (shift) and push them into a temporary variable until the desired element was found
        while ((current = arr.shift()) && !(elementFound = __defaultEqualityCompareFn(current, value))) {
            elementsBefore.push(current);
        }
        // add the temporary values back to the array (to the front)
        // -> unshift modifies the original array instead of returning a new one
        arr.unshift.apply(arr, elementsBefore);
        return elementFound;
    }
    /**
     * @private
     * @internal
     */
    function __getDefault() {
        var constructorOrValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object;

        if (constructorOrValue && __isNative(constructorOrValue) && typeof constructorOrValue === 'function') {
            var defaultValue = constructorOrValue();
            if (defaultValue instanceof Object || constructorOrValue === Date) {
                return null;
            } else {
                return defaultValue;
            }
        }
        return constructorOrValue;
    }
    /**
     * @private
     * @internal
     */
    function __getParameterCount(fn) {
        __assertFunction(fn);
        return fn.length;
    }
    /**
     * @private
     * @internal
     */
    function __getComparatorFromKeySelector(selector) {
        var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultComparator;

        if (__isFunction(selector)) {
            return new Function('comparator', 'keySelectorFn', 'a', 'b', "return comparator(keySelectorFn(a), keySelectorFn(b))").bind(null, comparator, selector);
        } else if (__isString(selector)) {
            if (!(selector.startsWith('[') || selector.startsWith('.'))) {
                selector = "." + selector;
            }
            return new Function('comparator', 'a', 'b', "return comparator(a" + selector + ", b" + selector + ")").bind(null, comparator);
        }
        throw new __AssertionError("string or function", selector);
    }
    /**
     * @private
     * @internal
     */

    var __Collection = function () {
        //#region Constructor
        function __Collection(iterableOrGenerator) {
            _classCallCheck(this, __Collection);

            //#endregion
            //#region Iterable
            this.__iterable = null;
            __assert(__isIterable(iterableOrGenerator) || __isGenerator(iterableOrGenerator), 'iterable or generator', iterableOrGenerator);
            this.__iterable = iterableOrGenerator;
        }

        _createClass(__Collection, [{
            key: Symbol.iterator,
            value: function value() {
                var iterable = this.__iterable;
                if (__isGenerator(iterable)) {
                    return iterable();
                } else {
                    return (/*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                while (1) {
                                    switch (_context3.prev = _context3.next) {
                                        case 0:
                                            return _context3.delegateYield(iterable, "t0", 1);

                                        case 1:
                                        case "end":
                                            return _context3.stop();
                                    }
                                }
                            }, _callee3, this);
                        })()
                    );
                }
            }
            //#endregion
            //#region Access

        }, {
            key: "__resultOrDefault",
            value: function __resultOrDefault(originalFn) {
                var predicateOrDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (x) {
                    return true;
                };
                var fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Object;

                var predicate = void 0;
                if (__isPredicate(predicateOrDefault)) {
                    predicate = predicateOrDefault;
                } else {
                    predicate = function predicate(x) {
                        return true;
                    };
                    fallback = predicateOrDefault;
                }
                __assertFunction(predicate);
                var defaultVal = __getDefault(fallback);
                if (__isEmpty(this)) {
                    return defaultVal;
                }
                var result = originalFn.call(this, predicate);
                if (!result) {
                    return defaultVal;
                }
                return result;
            }
        }, {
            key: "elementAt",
            value: function elementAt(index) {
                __assertIndexInRange(this, index);
                return this.skip(index).first();
            }
        }, {
            key: "take",
            value: function take() {
                var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                __assertNumeric(count);
                if (count <= 0) {
                    return __Collection.empty;
                }
                var self = this;
                return new __Collection( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                    var i, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, val;

                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    i = 0;
                                    _iteratorNormalCompletion4 = true;
                                    _didIteratorError4 = false;
                                    _iteratorError4 = undefined;
                                    _context4.prev = 4;
                                    _iterator4 = self[Symbol.iterator]();

                                case 6:
                                    if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                                        _context4.next = 15;
                                        break;
                                    }

                                    val = _step4.value;
                                    _context4.next = 10;
                                    return val;

                                case 10:
                                    if (!(++i === count)) {
                                        _context4.next = 12;
                                        break;
                                    }

                                    return _context4.abrupt("break", 15);

                                case 12:
                                    _iteratorNormalCompletion4 = true;
                                    _context4.next = 6;
                                    break;

                                case 15:
                                    _context4.next = 21;
                                    break;

                                case 17:
                                    _context4.prev = 17;
                                    _context4.t0 = _context4["catch"](4);
                                    _didIteratorError4 = true;
                                    _iteratorError4 = _context4.t0;

                                case 21:
                                    _context4.prev = 21;
                                    _context4.prev = 22;

                                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                        _iterator4.return();
                                    }

                                case 24:
                                    _context4.prev = 24;

                                    if (!_didIteratorError4) {
                                        _context4.next = 27;
                                        break;
                                    }

                                    throw _iteratorError4;

                                case 27:
                                    return _context4.finish(24);

                                case 28:
                                    return _context4.finish(21);

                                case 29:
                                case "end":
                                    return _context4.stop();
                            }
                        }
                    }, _callee4, this, [[4, 17, 21, 29], [22,, 24, 28]]);
                }));
            }
        }, {
            key: "skip",
            value: function skip() {
                var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                __assertNumeric(count);
                if (count <= 0) {
                    return this;
                }
                return this.skipWhile(function (elem, index) {
                    return index < count;
                });
            }
        }, {
            key: "takeWhile",
            value: function takeWhile() {
                var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (elem, index) {
                    return true;
                };

                __assertFunction(predicate);
                var self = this;
                return new __Collection( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                    var index, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, val;

                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                        while (1) {
                            switch (_context5.prev = _context5.next) {
                                case 0:
                                    index = 0;
                                    _iteratorNormalCompletion5 = true;
                                    _didIteratorError5 = false;
                                    _iteratorError5 = undefined;
                                    _context5.prev = 4;
                                    _iterator5 = self[Symbol.iterator]();

                                case 6:
                                    if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                                        _context5.next = 17;
                                        break;
                                    }

                                    val = _step5.value;

                                    if (!predicate(val, index++)) {
                                        _context5.next = 13;
                                        break;
                                    }

                                    _context5.next = 11;
                                    return val;

                                case 11:
                                    _context5.next = 14;
                                    break;

                                case 13:
                                    return _context5.abrupt("break", 17);

                                case 14:
                                    _iteratorNormalCompletion5 = true;
                                    _context5.next = 6;
                                    break;

                                case 17:
                                    _context5.next = 23;
                                    break;

                                case 19:
                                    _context5.prev = 19;
                                    _context5.t0 = _context5["catch"](4);
                                    _didIteratorError5 = true;
                                    _iteratorError5 = _context5.t0;

                                case 23:
                                    _context5.prev = 23;
                                    _context5.prev = 24;

                                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                        _iterator5.return();
                                    }

                                case 26:
                                    _context5.prev = 26;

                                    if (!_didIteratorError5) {
                                        _context5.next = 29;
                                        break;
                                    }

                                    throw _iteratorError5;

                                case 29:
                                    return _context5.finish(26);

                                case 30:
                                    return _context5.finish(23);

                                case 31:
                                case "end":
                                    return _context5.stop();
                            }
                        }
                    }, _callee5, this, [[4, 19, 23, 31], [24,, 26, 30]]);
                }));
            }
        }, {
            key: "takeUntil",
            value: function takeUntil() {
                var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (elem, index) {
                    return false;
                };

                return this.takeWhile(function (elem, index) {
                    return !predicate(elem, index);
                });
            }
        }, {
            key: "skipWhile",
            value: function skipWhile() {
                var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (elem, index) {
                    return true;
                };

                __assertFunction(predicate);
                var self = this;
                return new __Collection( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                    var index, endSkip, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, val;

                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                        while (1) {
                            switch (_context6.prev = _context6.next) {
                                case 0:
                                    index = 0;
                                    endSkip = false;
                                    _iteratorNormalCompletion6 = true;
                                    _didIteratorError6 = false;
                                    _iteratorError6 = undefined;
                                    _context6.prev = 5;
                                    _iterator6 = self[Symbol.iterator]();

                                case 7:
                                    if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                                        _context6.next = 17;
                                        break;
                                    }

                                    val = _step6.value;

                                    if (!(!endSkip && predicate(val, index++))) {
                                        _context6.next = 11;
                                        break;
                                    }

                                    return _context6.abrupt("continue", 14);

                                case 11:
                                    endSkip = true;
                                    _context6.next = 14;
                                    return val;

                                case 14:
                                    _iteratorNormalCompletion6 = true;
                                    _context6.next = 7;
                                    break;

                                case 17:
                                    _context6.next = 23;
                                    break;

                                case 19:
                                    _context6.prev = 19;
                                    _context6.t0 = _context6["catch"](5);
                                    _didIteratorError6 = true;
                                    _iteratorError6 = _context6.t0;

                                case 23:
                                    _context6.prev = 23;
                                    _context6.prev = 24;

                                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                        _iterator6.return();
                                    }

                                case 26:
                                    _context6.prev = 26;

                                    if (!_didIteratorError6) {
                                        _context6.next = 29;
                                        break;
                                    }

                                    throw _iteratorError6;

                                case 29:
                                    return _context6.finish(26);

                                case 30:
                                    return _context6.finish(23);

                                case 31:
                                case "end":
                                    return _context6.stop();
                            }
                        }
                    }, _callee6, this, [[5, 19, 23, 31], [24,, 26, 30]]);
                }));
            }
        }, {
            key: "skipUntil",
            value: function skipUntil() {
                var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (elem, index) {
                    return false;
                };

                return this.skipWhile(function (elem, index) {
                    return !predicate(elem, index);
                });
            }
        }, {
            key: "first",
            value: function first() {
                var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (x) {
                    return true;
                };

                __assertFunction(predicate);
                __assertNotEmpty(this);
                return this.skipWhile(function (elem) {
                    return !predicate(elem);
                })[Symbol.iterator]().next().value;
            }
        }, {
            key: "firstOrDefault",
            value: function firstOrDefault() {
                var predicateOrConstructor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (x) {
                    return true;
                };
                var constructor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Object;

                return this.__resultOrDefault(this.first, predicateOrConstructor, constructor);
            }
        }, {
            key: "last",
            value: function last() {
                var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (x) {
                    return true;
                };

                __assertFunction(predicate);
                __assertNotEmpty(this);
                return this.reverse().first(predicate);
            }
        }, {
            key: "lastOrDefault",
            value: function lastOrDefault() {
                var predicateOrConstructor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (x) {
                    return true;
                };
                var constructor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Object;

                return this.__resultOrDefault(this.last, predicateOrConstructor, constructor);
            }
        }, {
            key: "single",
            value: function single() {
                var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (x) {
                    return true;
                };

                __assertFunction(predicate);
                __assertNotEmpty(this);
                var index = 0;
                var result = void 0;
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = this[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var val = _step7.value;

                        if (predicate(val)) {
                            result = val;
                            break;
                        }
                        index++;
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

                if (this.first(function (elem) {
                    return predicate(elem) && !__defaultEqualityCompareFn(elem, result);
                })) {
                    throw new Error('Sequence contains more than one element');
                }
                return result;
            }
        }, {
            key: "singleOrDefault",
            value: function singleOrDefault() {
                var predicateOrConstructor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (x) {
                    return true;
                };
                var constructor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Object;

                return this.__resultOrDefault(this.single, predicateOrConstructor, constructor);
            }
        }, {
            key: "defaultIfEmpty",
            value: function defaultIfEmpty(constructor) {
                if (!__isEmpty(this)) {
                    return this;
                }
                return new __Collection([__getDefault(constructor)]);
            }
            //#endregion
            //#region Concatenation

        }, {
            key: "concat",
            value: function concat(inner) {
                __assertIterable(inner);
                var outer = this;
                return new __Collection( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                    return regeneratorRuntime.wrap(function _callee7$(_context7) {
                        while (1) {
                            switch (_context7.prev = _context7.next) {
                                case 0:
                                    return _context7.delegateYield(outer, "t0", 1);

                                case 1:
                                    return _context7.delegateYield(inner, "t1", 2);

                                case 2:
                                case "end":
                                    return _context7.stop();
                            }
                        }
                    }, _callee7, this);
                }));
            }
        }, {
            key: "union",
            value: function union(inner) {
                var equalityCompareFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __defaultEqualityCompareFn;

                __assertIterable(inner);
                return this.concat(inner).distinct(equalityCompareFn);
            }
        }, {
            key: "join",
            value: function join(inner, outerKeySelector, innerKeySelector, resultSelectorFn) {
                var keyEqualityCompareFn = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : __defaultEqualityCompareFn;

                __assertIterable(inner);
                __assertFunction(outerKeySelector);
                __assertFunction(innerKeySelector);
                __assertFunction(resultSelectorFn);
                __assertFunction(keyEqualityCompareFn);
                var outer = this;
                return new __Collection( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                    var _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, outerValue, outerKey, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, innerValue, innerKey;

                    return regeneratorRuntime.wrap(function _callee8$(_context8) {
                        while (1) {
                            switch (_context8.prev = _context8.next) {
                                case 0:
                                    _iteratorNormalCompletion8 = true;
                                    _didIteratorError8 = false;
                                    _iteratorError8 = undefined;
                                    _context8.prev = 3;
                                    _iterator8 = outer[Symbol.iterator]();

                                case 5:
                                    if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
                                        _context8.next = 39;
                                        break;
                                    }

                                    outerValue = _step8.value;
                                    outerKey = outerKeySelector(outerValue);
                                    _iteratorNormalCompletion9 = true;
                                    _didIteratorError9 = false;
                                    _iteratorError9 = undefined;
                                    _context8.prev = 11;
                                    _iterator9 = inner[Symbol.iterator]();

                                case 13:
                                    if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
                                        _context8.next = 22;
                                        break;
                                    }

                                    innerValue = _step9.value;
                                    innerKey = innerKeySelector(innerValue);

                                    if (!keyEqualityCompareFn(outerKey, innerKey)) {
                                        _context8.next = 19;
                                        break;
                                    }

                                    _context8.next = 19;
                                    return resultSelectorFn(outerValue, innerValue);

                                case 19:
                                    _iteratorNormalCompletion9 = true;
                                    _context8.next = 13;
                                    break;

                                case 22:
                                    _context8.next = 28;
                                    break;

                                case 24:
                                    _context8.prev = 24;
                                    _context8.t0 = _context8["catch"](11);
                                    _didIteratorError9 = true;
                                    _iteratorError9 = _context8.t0;

                                case 28:
                                    _context8.prev = 28;
                                    _context8.prev = 29;

                                    if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                        _iterator9.return();
                                    }

                                case 31:
                                    _context8.prev = 31;

                                    if (!_didIteratorError9) {
                                        _context8.next = 34;
                                        break;
                                    }

                                    throw _iteratorError9;

                                case 34:
                                    return _context8.finish(31);

                                case 35:
                                    return _context8.finish(28);

                                case 36:
                                    _iteratorNormalCompletion8 = true;
                                    _context8.next = 5;
                                    break;

                                case 39:
                                    _context8.next = 45;
                                    break;

                                case 41:
                                    _context8.prev = 41;
                                    _context8.t1 = _context8["catch"](3);
                                    _didIteratorError8 = true;
                                    _iteratorError8 = _context8.t1;

                                case 45:
                                    _context8.prev = 45;
                                    _context8.prev = 46;

                                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                        _iterator8.return();
                                    }

                                case 48:
                                    _context8.prev = 48;

                                    if (!_didIteratorError8) {
                                        _context8.next = 51;
                                        break;
                                    }

                                    throw _iteratorError8;

                                case 51:
                                    return _context8.finish(48);

                                case 52:
                                    return _context8.finish(45);

                                case 53:
                                case "end":
                                    return _context8.stop();
                            }
                        }
                    }, _callee8, this, [[3, 41, 45, 53], [11, 24, 28, 36], [29,, 31, 35], [46,, 48, 52]]);
                }));
            }
        }, {
            key: "except",
            value: function except(inner) {
                __assertIterable(inner);
                if (!__isCollection(inner)) {
                    inner = new __Collection(inner);
                }
                var outer = this;
                return new __Collection( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                    var _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, val;

                    return regeneratorRuntime.wrap(function _callee9$(_context9) {
                        while (1) {
                            switch (_context9.prev = _context9.next) {
                                case 0:
                                    _iteratorNormalCompletion10 = true;
                                    _didIteratorError10 = false;
                                    _iteratorError10 = undefined;
                                    _context9.prev = 3;
                                    _iterator10 = outer[Symbol.iterator]();

                                case 5:
                                    if (_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done) {
                                        _context9.next = 13;
                                        break;
                                    }

                                    val = _step10.value;

                                    if (inner.contains(val)) {
                                        _context9.next = 10;
                                        break;
                                    }

                                    _context9.next = 10;
                                    return val;

                                case 10:
                                    _iteratorNormalCompletion10 = true;
                                    _context9.next = 5;
                                    break;

                                case 13:
                                    _context9.next = 19;
                                    break;

                                case 15:
                                    _context9.prev = 15;
                                    _context9.t0 = _context9["catch"](3);
                                    _didIteratorError10 = true;
                                    _iteratorError10 = _context9.t0;

                                case 19:
                                    _context9.prev = 19;
                                    _context9.prev = 20;

                                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                                        _iterator10.return();
                                    }

                                case 22:
                                    _context9.prev = 22;

                                    if (!_didIteratorError10) {
                                        _context9.next = 25;
                                        break;
                                    }

                                    throw _iteratorError10;

                                case 25:
                                    return _context9.finish(22);

                                case 26:
                                    return _context9.finish(19);

                                case 27:
                                case "end":
                                    return _context9.stop();
                            }
                        }
                    }, _callee9, this, [[3, 15, 19, 27], [20,, 22, 26]]);
                }));
            }
        }, {
            key: "zip",
            value: function zip(inner, resultSelectorFn) {
                __assertIterable(inner);
                __assertFunction(resultSelectorFn);
                var outer = this;
                return new __Collection( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                    var innerIterator, _iteratorNormalCompletion11, _didIteratorError11, _iteratorError11, _iterator11, _step11, outerVal, innerNext;

                    return regeneratorRuntime.wrap(function _callee10$(_context10) {
                        while (1) {
                            switch (_context10.prev = _context10.next) {
                                case 0:
                                    innerIterator = inner[Symbol.iterator]();
                                    _iteratorNormalCompletion11 = true;
                                    _didIteratorError11 = false;
                                    _iteratorError11 = undefined;
                                    _context10.prev = 4;
                                    _iterator11 = outer[Symbol.iterator]();

                                case 6:
                                    if (_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done) {
                                        _context10.next = 16;
                                        break;
                                    }

                                    outerVal = _step11.value;
                                    innerNext = innerIterator.next();

                                    if (!innerNext.done) {
                                        _context10.next = 11;
                                        break;
                                    }

                                    return _context10.abrupt("break", 16);

                                case 11:
                                    _context10.next = 13;
                                    return resultSelectorFn(outerVal, innerNext.value);

                                case 13:
                                    _iteratorNormalCompletion11 = true;
                                    _context10.next = 6;
                                    break;

                                case 16:
                                    _context10.next = 22;
                                    break;

                                case 18:
                                    _context10.prev = 18;
                                    _context10.t0 = _context10["catch"](4);
                                    _didIteratorError11 = true;
                                    _iteratorError11 = _context10.t0;

                                case 22:
                                    _context10.prev = 22;
                                    _context10.prev = 23;

                                    if (!_iteratorNormalCompletion11 && _iterator11.return) {
                                        _iterator11.return();
                                    }

                                case 25:
                                    _context10.prev = 25;

                                    if (!_didIteratorError11) {
                                        _context10.next = 28;
                                        break;
                                    }

                                    throw _iteratorError11;

                                case 28:
                                    return _context10.finish(25);

                                case 29:
                                    return _context10.finish(22);

                                case 30:
                                case "end":
                                    return _context10.stop();
                            }
                        }
                    }, _callee10, this, [[4, 18, 22, 30], [23,, 25, 29]]);
                }));
            }
        }, {
            key: "intersect",
            value: function intersect(inner) {
                var equalityCompareFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __defaultEqualityCompareFn;

                __assertIterable(inner);
                __assertFunction(equalityCompareFn);
                var self = this;
                return new __Collection( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                    var _this2 = this;

                    var innerCollection, _loop, _iteratorNormalCompletion12, _didIteratorError12, _iteratorError12, _iterator12, _step12, val;

                    return regeneratorRuntime.wrap(function _callee11$(_context12) {
                        while (1) {
                            switch (_context12.prev = _context12.next) {
                                case 0:
                                    innerCollection = __Collection.from(inner);
                                    _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(val) {
                                        return regeneratorRuntime.wrap(function _loop$(_context11) {
                                            while (1) {
                                                switch (_context11.prev = _context11.next) {
                                                    case 0:
                                                        if (!innerCollection.any(function (elem) {
                                                            return equalityCompareFn(val, elem);
                                                        })) {
                                                            _context11.next = 3;
                                                            break;
                                                        }

                                                        _context11.next = 3;
                                                        return val;

                                                    case 3:
                                                    case "end":
                                                        return _context11.stop();
                                                }
                                            }
                                        }, _loop, _this2);
                                    });
                                    _iteratorNormalCompletion12 = true;
                                    _didIteratorError12 = false;
                                    _iteratorError12 = undefined;
                                    _context12.prev = 5;
                                    _iterator12 = self[Symbol.iterator]();

                                case 7:
                                    if (_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done) {
                                        _context12.next = 13;
                                        break;
                                    }

                                    val = _step12.value;
                                    return _context12.delegateYield(_loop(val), "t0", 10);

                                case 10:
                                    _iteratorNormalCompletion12 = true;
                                    _context12.next = 7;
                                    break;

                                case 13:
                                    _context12.next = 19;
                                    break;

                                case 15:
                                    _context12.prev = 15;
                                    _context12.t1 = _context12["catch"](5);
                                    _didIteratorError12 = true;
                                    _iteratorError12 = _context12.t1;

                                case 19:
                                    _context12.prev = 19;
                                    _context12.prev = 20;

                                    if (!_iteratorNormalCompletion12 && _iterator12.return) {
                                        _iterator12.return();
                                    }

                                case 22:
                                    _context12.prev = 22;

                                    if (!_didIteratorError12) {
                                        _context12.next = 25;
                                        break;
                                    }

                                    throw _iteratorError12;

                                case 25:
                                    return _context12.finish(22);

                                case 26:
                                    return _context12.finish(19);

                                case 27:
                                case "end":
                                    return _context12.stop();
                            }
                        }
                    }, _callee11, this, [[5, 15, 19, 27], [20,, 22, 26]]);
                }));
            }
            //#endregion
            //#region Equality

        }, {
            key: "sequenceEqual",
            value: function sequenceEqual(second) {
                var equalityCompareFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __defaultEqualityCompareFn;

                if (!__isIterable(second)) {
                    return false;
                }
                var firstIterator = this[Symbol.iterator]();
                var secondIterator = second[Symbol.iterator]();
                var firstResult = void 0;
                var secondResult = void 0;
                do {
                    firstResult = firstIterator.next();
                    secondResult = secondIterator.next();
                    if (firstResult.done != secondResult.done) {
                        return false;
                    }
                    // only call the compare function if there are values
                    if (!firstResult.done && !equalityCompareFn(firstResult.value, secondResult.value)) {
                        return false;
                    }
                } while (!firstResult.done);
                return true;
            }
            //#endregion
            //#region Grouping
            /**
             * Get the matching key in the group for a given key and a key comparator or return the parameter itself if the key is not present yet.
             *
             * @param groupKeys Keys from the group.
             * @param key Key to check against.
             * @param keyComparator Custom key comparator.
             * @return Found key from grouping.
             */

        }, {
            key: "groupBy",
            value: function groupBy(keySelector) {
                var self = this;
                /**
                 * Checks whether or not a function is a key comparator.
                 * We need to differentiate between the key comparator and the result selector since both take two arguments.
                 *
                 * @param arg Function to be tested.
                 * @return If the given function is a key comparator.
                 */
                function isKeyComparator(arg) {
                    var result = __getParameterCount(arg) === 2;
                    var first = self.first();
                    try {
                        var key = keySelector(first);
                        // if this is a key comparator, it must return truthy values for equal values and falsy ones if they're different
                        result = result && arg(key, key) && !arg(key, {});
                    } catch (err) {
                        // if the function throws an error for values, it can't be a keyComparator
                        result = false;
                    }
                    return result;
                }
                /*
                 * GroupBy(keySelector)
                 */
                function groupByOneArgument(keySelector) {
                    return groupBy(keySelector, function (elem) {
                        return elem;
                    }, undefined, __defaultEqualityCompareFn);
                }
                /*
                 * GroupBy(keySelector, keyComparator)
                 * GroupBy(keySelector, elementSelector)
                 * GroupBy(keySelector, resultSelector)
                 */
                function groupByTwoArguments(keySelector, inner) {
                    var keyComparator = void 0,
                        elementSelector = void 0;
                    if (isKeyComparator(inner)) {
                        keyComparator = inner;
                        elementSelector = function elementSelector(elem) {
                            return elem;
                        };
                    } else {
                        keyComparator = __defaultEqualityCompareFn;
                        elementSelector = inner;
                    }
                    return groupByThreeArguments(keySelector, elementSelector, keyComparator);
                }
                /*
                 * GroupBy(keySelector, resultSelector, keyComparator)
                 * GroupBy(keySelector, elementSelector, keyComparator)
                 * GroupBy(keySelector, elementSelector, resultSelector)
                 */
                function groupByThreeArguments(keySelector, inner, third) {
                    var keyComparator = void 0,
                        elementSelector = void 0,
                        resultSelector = void 0;
                    if (isKeyComparator(third)) {
                        keyComparator = third;
                    } else {
                        resultSelector = third;
                    }
                    if (__getParameterCount(inner) === 2) {
                        resultSelector = inner;
                    } else {
                        elementSelector = inner;
                    }
                    if (!keyComparator) {
                        keyComparator = __defaultEqualityCompareFn;
                    }
                    if (!elementSelector) {
                        elementSelector = function elementSelector(elem) {
                            return elem;
                        };
                    }
                    return groupBy(keySelector, elementSelector, resultSelector, keyComparator);
                }
                /*
                 * This is the "basic" function to use. The others just transform their parameters to be used with this one.
                 */
                function groupBy(keySelector, elementSelector, resultSelector, keyComparator) {
                    __assertFunction(keySelector);
                    __assertFunction(elementSelector);
                    __assert(__isUndefined(resultSelector) || __isFunction(resultSelector), 'resultSelector must be undefined or function!');
                    __assertFunction(keyComparator);
                    var groups = new Map();
                    var result = void 0;
                    var _iteratorNormalCompletion13 = true;
                    var _didIteratorError13 = false;
                    var _iteratorError13 = undefined;

                    try {
                        for (var _iterator13 = self[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                            var val = _step13.value;

                            // Instead of checking groups.has we use our custom function since we want to treat some keys as equal even if they aren't for the Map
                            var key = __Collection.__getEqualKey(groups, keySelector(val), keyComparator);
                            var elem = elementSelector(val);
                            if (groups.has(key)) {
                                groups.get(key).push(elem);
                            } else {
                                groups.set(key, [elem]);
                            }
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

                    if (resultSelector) {
                        // If we want to select the final result with the resultSelector, we use the built-in Select function and retrieve a new Collection
                        result = __Collection.from(groups).select(function (g) {
                            return resultSelector.apply(undefined, _toConsumableArray(g));
                        });
                    } else {
                        // our result is just the groups -> return the Map
                        result = groups;
                    }
                    return result;
                }
                // the outer parameter of GroupBy is always the keySelector, so we have to differentiate the following arguments
                // and select the appropriate function
                var fn = void 0;

                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
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
        }, {
            key: "groupJoin",
            value: function groupJoin(inner, outerKeySelector, innerKeySelector, resultSelector) {
                var equalityCompareFn = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : __defaultEqualityCompareFn;

                __assertIterable(inner);
                __assertFunction(outerKeySelector);
                __assertFunction(innerKeySelector);
                __assertFunction(resultSelector);
                var groups = new Map();
                var outer = this;

                var _loop2 = function _loop2(outerVal) {
                    var outerKey = outerKeySelector(outerVal);
                    groups.set(outerVal, new __Collection( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
                        var _iteratorNormalCompletion16, _didIteratorError16, _iteratorError16, _iterator16, _step16, innerVal;

                        return regeneratorRuntime.wrap(function _callee13$(_context14) {
                            while (1) {
                                switch (_context14.prev = _context14.next) {
                                    case 0:
                                        _iteratorNormalCompletion16 = true;
                                        _didIteratorError16 = false;
                                        _iteratorError16 = undefined;
                                        _context14.prev = 3;
                                        _iterator16 = inner[Symbol.iterator]();

                                    case 5:
                                        if (_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done) {
                                            _context14.next = 13;
                                            break;
                                        }

                                        innerVal = _step16.value;

                                        if (!equalityCompareFn(outerKey, innerKeySelector(innerVal))) {
                                            _context14.next = 10;
                                            break;
                                        }

                                        _context14.next = 10;
                                        return innerVal;

                                    case 10:
                                        _iteratorNormalCompletion16 = true;
                                        _context14.next = 5;
                                        break;

                                    case 13:
                                        _context14.next = 19;
                                        break;

                                    case 15:
                                        _context14.prev = 15;
                                        _context14.t0 = _context14["catch"](3);
                                        _didIteratorError16 = true;
                                        _iteratorError16 = _context14.t0;

                                    case 19:
                                        _context14.prev = 19;
                                        _context14.prev = 20;

                                        if (!_iteratorNormalCompletion16 && _iterator16.return) {
                                            _iterator16.return();
                                        }

                                    case 22:
                                        _context14.prev = 22;

                                        if (!_didIteratorError16) {
                                            _context14.next = 25;
                                            break;
                                        }

                                        throw _iteratorError16;

                                    case 25:
                                        return _context14.finish(22);

                                    case 26:
                                        return _context14.finish(19);

                                    case 27:
                                    case "end":
                                        return _context14.stop();
                                }
                            }
                        }, _callee13, this, [[3, 15, 19, 27], [20,, 22, 26]]);
                    })));
                };

                var _iteratorNormalCompletion14 = true;
                var _didIteratorError14 = false;
                var _iteratorError14 = undefined;

                try {
                    for (var _iterator14 = outer[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                        var outerVal = _step14.value;

                        _loop2(outerVal);
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

                return new __Collection( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
                    var _iteratorNormalCompletion15, _didIteratorError15, _iteratorError15, _iterator15, _step15, _ref, _ref2, key, values;

                    return regeneratorRuntime.wrap(function _callee12$(_context13) {
                        while (1) {
                            switch (_context13.prev = _context13.next) {
                                case 0:
                                    _iteratorNormalCompletion15 = true;
                                    _didIteratorError15 = false;
                                    _iteratorError15 = undefined;
                                    _context13.prev = 3;
                                    _iterator15 = groups[Symbol.iterator]();

                                case 5:
                                    if (_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done) {
                                        _context13.next = 15;
                                        break;
                                    }

                                    _ref = _step15.value;
                                    _ref2 = _slicedToArray(_ref, 2);
                                    key = _ref2[0];
                                    values = _ref2[1];
                                    _context13.next = 12;
                                    return resultSelector(key, values);

                                case 12:
                                    _iteratorNormalCompletion15 = true;
                                    _context13.next = 5;
                                    break;

                                case 15:
                                    _context13.next = 21;
                                    break;

                                case 17:
                                    _context13.prev = 17;
                                    _context13.t0 = _context13["catch"](3);
                                    _didIteratorError15 = true;
                                    _iteratorError15 = _context13.t0;

                                case 21:
                                    _context13.prev = 21;
                                    _context13.prev = 22;

                                    if (!_iteratorNormalCompletion15 && _iterator15.return) {
                                        _iterator15.return();
                                    }

                                case 24:
                                    _context13.prev = 24;

                                    if (!_didIteratorError15) {
                                        _context13.next = 27;
                                        break;
                                    }

                                    throw _iteratorError15;

                                case 27:
                                    return _context13.finish(24);

                                case 28:
                                    return _context13.finish(21);

                                case 29:
                                case "end":
                                    return _context13.stop();
                            }
                        }
                    }, _callee12, this, [[3, 17, 21, 29], [22,, 24, 28]]);
                }));
            }
            //#endregion
            //#region Insert & Remove

        }, {
            key: "add",
            value: function add(value) {
                this.insert(value, this.count());
            }
        }, {
            key: "insert",
            value: function insert(value, index) {
                var oldValues = this.toArray();
                __assert(index >= 0 && index <= oldValues.length, 'Index is out of bounds!');
                this.__iterable = /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
                    return regeneratorRuntime.wrap(function _callee14$(_context15) {
                        while (1) {
                            switch (_context15.prev = _context15.next) {
                                case 0:
                                    return _context15.delegateYield(oldValues.slice(0, index), "t0", 1);

                                case 1:
                                    _context15.next = 3;
                                    return value;

                                case 3:
                                    return _context15.delegateYield(oldValues.slice(index, oldValues.length), "t1", 4);

                                case 4:
                                case "end":
                                    return _context15.stop();
                            }
                        }
                    }, _callee14, this);
                });
            }
        }, {
            key: "remove",
            value: function remove(value) {
                var values = this.toArray();
                var result = __removeFromArray(values, value);
                if (!result) {
                    return false;
                }
                this.__iterable = /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
                    return regeneratorRuntime.wrap(function _callee15$(_context16) {
                        while (1) {
                            switch (_context16.prev = _context16.next) {
                                case 0:
                                    return _context16.delegateYield(values, "t0", 1);

                                case 1:
                                case "end":
                                    return _context16.stop();
                            }
                        }
                    }, _callee15, this);
                });
                return true;
            }
            //#endregion
            //#region Math

        }, {
            key: "min",
            value: function min() {
                var mapFn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (x) {
                    return x;
                };

                __assertFunction(mapFn);
                __assertNotEmpty(this);
                return this.select(mapFn).aggregate(function (a, b) {
                    return a < b ? a : b;
                });
            }
        }, {
            key: "max",
            value: function max() {
                var mapFn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (x) {
                    return x;
                };

                __assertFunction(mapFn);
                __assertNotEmpty(this);
                return this.select(mapFn).aggregate(function (a, b) {
                    return a > b ? a : b;
                });
            }
        }, {
            key: "sum",
            value: function sum() {
                var mapFn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (x) {
                    return x;
                };

                __assertNotEmpty(this);
                return this.select(mapFn).aggregate(0, function (prev, curr) {
                    return prev + curr;
                });
            }
        }, {
            key: "average",
            value: function average() {
                var mapFn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (x) {
                    return x;
                };

                __assertNotEmpty(this);
                return this.sum(mapFn) / this.count();
            }
            //#endregion
            //#region Ordering

        }, {
            key: "order",
            value: function order() {
                var comparator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultComparator;

                return this.orderBy(function (x) {
                    return x;
                }, comparator);
            }
        }, {
            key: "orderDescending",
            value: function orderDescending() {
                var comparator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultComparator;

                return this.orderByDescending(function (x) {
                    return x;
                }, comparator);
            }
        }, {
            key: "orderBy",
            value: function orderBy(keySelector) {
                var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultComparator;

                __assertFunction(comparator);
                return new __OrderedCollection(this, __getComparatorFromKeySelector(keySelector, comparator));
            }
        }, {
            key: "orderByDescending",
            value: function orderByDescending(keySelector) {
                var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultComparator;

                return new __OrderedCollection(this, __getComparatorFromKeySelector(keySelector, function (a, b) {
                    return comparator(b, a);
                }));
            }
        }, {
            key: "shuffle",
            value: function shuffle() {
                return this.orderBy(function () {
                    return Math.floor(Math.random() * 3) - 1;
                } /* Returns -1, 0 or 1 */);
            }
            //#endregioning
            //#region Search

        }, {
            key: "indexOf",
            value: function indexOf(element) {
                var equalityCompareFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __defaultEqualityCompareFn;

                __assertFunction(equalityCompareFn);
                var i = 0;
                var _iteratorNormalCompletion17 = true;
                var _didIteratorError17 = false;
                var _iteratorError17 = undefined;

                try {
                    for (var _iterator17 = this[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                        var val = _step17.value;

                        if (equalityCompareFn(val, element)) {
                            return i;
                        }
                        i++;
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

                return -1;
            }
        }, {
            key: "lastIndexOf",
            value: function lastIndexOf(element) {
                var equalityCompareFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __defaultEqualityCompareFn;

                __assertFunction(equalityCompareFn);
                var i = 0;
                var lastIndex = -1;
                var _iteratorNormalCompletion18 = true;
                var _didIteratorError18 = false;
                var _iteratorError18 = undefined;

                try {
                    for (var _iterator18 = this[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
                        var val = _step18.value;

                        if (equalityCompareFn(val, element)) {
                            lastIndex = i;
                        }
                        i++;
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

                return lastIndex;
            }
        }, {
            key: "contains",
            value: function contains(elem) {
                var equalityCompareFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __defaultEqualityCompareFn;

                return !!~this.indexOf(elem, equalityCompareFn);
            }
        }, {
            key: "where",
            value: function where() {
                var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (elem, index) {
                    return true;
                };

                __assertFunction(predicate);
                var self = this;
                return new __Collection( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
                    var index, _iteratorNormalCompletion19, _didIteratorError19, _iteratorError19, _iterator19, _step19, val;

                    return regeneratorRuntime.wrap(function _callee16$(_context17) {
                        while (1) {
                            switch (_context17.prev = _context17.next) {
                                case 0:
                                    index = 0;
                                    _iteratorNormalCompletion19 = true;
                                    _didIteratorError19 = false;
                                    _iteratorError19 = undefined;
                                    _context17.prev = 4;
                                    _iterator19 = self[Symbol.iterator]();

                                case 6:
                                    if (_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done) {
                                        _context17.next = 15;
                                        break;
                                    }

                                    val = _step19.value;

                                    if (!predicate(val, index)) {
                                        _context17.next = 11;
                                        break;
                                    }

                                    _context17.next = 11;
                                    return val;

                                case 11:
                                    index++;

                                case 12:
                                    _iteratorNormalCompletion19 = true;
                                    _context17.next = 6;
                                    break;

                                case 15:
                                    _context17.next = 21;
                                    break;

                                case 17:
                                    _context17.prev = 17;
                                    _context17.t0 = _context17["catch"](4);
                                    _didIteratorError19 = true;
                                    _iteratorError19 = _context17.t0;

                                case 21:
                                    _context17.prev = 21;
                                    _context17.prev = 22;

                                    if (!_iteratorNormalCompletion19 && _iterator19.return) {
                                        _iterator19.return();
                                    }

                                case 24:
                                    _context17.prev = 24;

                                    if (!_didIteratorError19) {
                                        _context17.next = 27;
                                        break;
                                    }

                                    throw _iteratorError19;

                                case 27:
                                    return _context17.finish(24);

                                case 28:
                                    return _context17.finish(21);

                                case 29:
                                case "end":
                                    return _context17.stop();
                            }
                        }
                    }, _callee16, this, [[4, 17, 21, 29], [22,, 24, 28]]);
                }));
            }
        }, {
            key: "conditionalWhere",
            value: function conditionalWhere(condition, predicate) {
                if (condition) {
                    return this.where(predicate);
                } else {
                    return this;
                }
            }
        }, {
            key: "count",
            value: function count() {
                var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (elem) {
                    return true;
                };

                var count = 0;
                var filtered = this.where(predicate);
                var iterator = filtered[Symbol.iterator]();
                while (!iterator.next().done) {
                    count++;
                }
                return count;
            }
        }, {
            key: "any",
            value: function any() {
                var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

                if (__isEmpty(this)) {
                    return false;
                }
                if (!predicate) {
                    // since we checked before that the sequence is not empty
                    return true;
                }
                return !this.where(predicate)[Symbol.iterator]().next().done;
            }
        }, {
            key: "all",
            value: function all() {
                var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (elem) {
                    return true;
                };

                __assertFunction(predicate);
                // All is equal to the question if there's no element which does not match the predicate
                // 'all fruits are yellow' -> 'there is no fruit which is not yellow'
                return !this.any(function (x) {
                    return !predicate(x);
                });
            }
            //#endregion
            //#region Transformation

        }, {
            key: "aggregate",
            value: function aggregate(seedOrAccumulator) {
                var accumulator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                var resultTransformFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

                if (__isFunction(seedOrAccumulator) && !accumulator && !resultTransformFn) {
                    return __aggregateCollection(this.skip(1), this.first(), seedOrAccumulator, function (elem) {
                        return elem;
                    });
                } else if (!__isFunction(seedOrAccumulator) && __isFunction(accumulator) && !resultTransformFn) {
                    return __aggregateCollection(this, seedOrAccumulator, accumulator, function (elem) {
                        return elem;
                    });
                } else {
                    return __aggregateCollection(this, seedOrAccumulator, accumulator, resultTransformFn);
                }
            }
        }, {
            key: "select",
            value: function select() {
                var mapFn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (x) {
                    return x;
                };

                var self = this;
                var index = 0;
                return new __Collection( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
                    var _iteratorNormalCompletion20, _didIteratorError20, _iteratorError20, _iterator20, _step20, val;

                    return regeneratorRuntime.wrap(function _callee17$(_context18) {
                        while (1) {
                            switch (_context18.prev = _context18.next) {
                                case 0:
                                    _iteratorNormalCompletion20 = true;
                                    _didIteratorError20 = false;
                                    _iteratorError20 = undefined;
                                    _context18.prev = 3;
                                    _iterator20 = self[Symbol.iterator]();

                                case 5:
                                    if (_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done) {
                                        _context18.next = 13;
                                        break;
                                    }

                                    val = _step20.value;
                                    _context18.next = 9;
                                    return mapFn(val, index);

                                case 9:
                                    index++;

                                case 10:
                                    _iteratorNormalCompletion20 = true;
                                    _context18.next = 5;
                                    break;

                                case 13:
                                    _context18.next = 19;
                                    break;

                                case 15:
                                    _context18.prev = 15;
                                    _context18.t0 = _context18["catch"](3);
                                    _didIteratorError20 = true;
                                    _iteratorError20 = _context18.t0;

                                case 19:
                                    _context18.prev = 19;
                                    _context18.prev = 20;

                                    if (!_iteratorNormalCompletion20 && _iterator20.return) {
                                        _iterator20.return();
                                    }

                                case 22:
                                    _context18.prev = 22;

                                    if (!_didIteratorError20) {
                                        _context18.next = 25;
                                        break;
                                    }

                                    throw _iteratorError20;

                                case 25:
                                    return _context18.finish(22);

                                case 26:
                                    return _context18.finish(19);

                                case 27:
                                case "end":
                                    return _context18.stop();
                            }
                        }
                    }, _callee17, this, [[3, 15, 19, 27], [20,, 22, 26]]);
                }));
            }
        }, {
            key: "flatten",
            value: function flatten() {
                return this.selectMany(function (x) {
                    return x;
                });
            }
        }, {
            key: "selectMany",
            value: function selectMany(mapFn) {
                var resultSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (x, y) {
                    return y;
                };

                __assertFunction(mapFn);
                __assertFunction(resultSelector);
                var self = this;
                return new __Collection( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
                    var index, _iteratorNormalCompletion21, _didIteratorError21, _iteratorError21, _iterator21, _step21, current, mappedEntry, newIterable, _iteratorNormalCompletion22, _didIteratorError22, _iteratorError22, _iterator22, _step22, val;

                    return regeneratorRuntime.wrap(function _callee18$(_context19) {
                        while (1) {
                            switch (_context19.prev = _context19.next) {
                                case 0:
                                    index = 0;
                                    _iteratorNormalCompletion21 = true;
                                    _didIteratorError21 = false;
                                    _iteratorError21 = undefined;
                                    _context19.prev = 4;
                                    _iterator21 = self[Symbol.iterator]();

                                case 6:
                                    if (_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done) {
                                        _context19.next = 41;
                                        break;
                                    }

                                    current = _step21.value;
                                    mappedEntry = mapFn(current, index);
                                    newIterable = mappedEntry;

                                    if (!__isIterable(mappedEntry)) {
                                        newIterable = [mappedEntry];
                                    } else {
                                        newIterable = mappedEntry;
                                    }
                                    _iteratorNormalCompletion22 = true;
                                    _didIteratorError22 = false;
                                    _iteratorError22 = undefined;
                                    _context19.prev = 14;
                                    _iterator22 = newIterable[Symbol.iterator]()[Symbol.iterator]();

                                case 16:
                                    if (_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done) {
                                        _context19.next = 23;
                                        break;
                                    }

                                    val = _step22.value;
                                    _context19.next = 20;
                                    return resultSelector(current, val);

                                case 20:
                                    _iteratorNormalCompletion22 = true;
                                    _context19.next = 16;
                                    break;

                                case 23:
                                    _context19.next = 29;
                                    break;

                                case 25:
                                    _context19.prev = 25;
                                    _context19.t0 = _context19["catch"](14);
                                    _didIteratorError22 = true;
                                    _iteratorError22 = _context19.t0;

                                case 29:
                                    _context19.prev = 29;
                                    _context19.prev = 30;

                                    if (!_iteratorNormalCompletion22 && _iterator22.return) {
                                        _iterator22.return();
                                    }

                                case 32:
                                    _context19.prev = 32;

                                    if (!_didIteratorError22) {
                                        _context19.next = 35;
                                        break;
                                    }

                                    throw _iteratorError22;

                                case 35:
                                    return _context19.finish(32);

                                case 36:
                                    return _context19.finish(29);

                                case 37:
                                    index++;

                                case 38:
                                    _iteratorNormalCompletion21 = true;
                                    _context19.next = 6;
                                    break;

                                case 41:
                                    _context19.next = 47;
                                    break;

                                case 43:
                                    _context19.prev = 43;
                                    _context19.t1 = _context19["catch"](4);
                                    _didIteratorError21 = true;
                                    _iteratorError21 = _context19.t1;

                                case 47:
                                    _context19.prev = 47;
                                    _context19.prev = 48;

                                    if (!_iteratorNormalCompletion21 && _iterator21.return) {
                                        _iterator21.return();
                                    }

                                case 50:
                                    _context19.prev = 50;

                                    if (!_didIteratorError21) {
                                        _context19.next = 53;
                                        break;
                                    }

                                    throw _iteratorError21;

                                case 53:
                                    return _context19.finish(50);

                                case 54:
                                    return _context19.finish(47);

                                case 55:
                                case "end":
                                    return _context19.stop();
                            }
                        }
                    }, _callee18, this, [[4, 43, 47, 55], [14, 25, 29, 37], [30,, 32, 36], [48,, 50, 54]]);
                }));
            }
        }, {
            key: "distinct",
            value: function distinct() {
                var equalityCompareFn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __defaultEqualityCompareFn;

                __assertFunction(equalityCompareFn);
                return __removeDuplicates(this, equalityCompareFn);
            }
        }, {
            key: "toArray",
            value: function toArray() {
                return [].concat(_toConsumableArray(this));
            }
        }, {
            key: "toDictionary",
            value: function toDictionary(keySelector) {
                var elementSelectorOrKeyComparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                var keyComparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

                __assertFunction(keySelector);
                if (!elementSelectorOrKeyComparator && !keyComparator) {
                    // ToDictionary(keySelector)
                    return this.toDictionary(keySelector, function (elem) {
                        return elem;
                    }, __defaultEqualityCompareFn);
                } else if (!keyComparator && __getParameterCount(elementSelectorOrKeyComparator) === 1) {
                    // ToDictionary(keySelector, elementSelector)
                    return this.toDictionary(keySelector, elementSelectorOrKeyComparator, __defaultEqualityCompareFn);
                } else if (!keyComparator && __getParameterCount(elementSelectorOrKeyComparator) === 2) {
                    // ToDictionary(keySelector, keyComparator)
                    return this.toDictionary(keySelector, function (elem) {
                        return elem;
                    }, elementSelectorOrKeyComparator);
                }
                // ToDictionary(keySelector, elementSelector, keyComparator)
                __assertFunction(keyComparator);
                __assertFunction(elementSelectorOrKeyComparator);
                var usedKeys = [];
                var result = new Map();

                var _loop3 = function _loop3(value) {
                    var key = keySelector(value);
                    var elem = elementSelectorOrKeyComparator(value);
                    __assert(key != null, 'Key is not allowed to be null!');
                    __assert(!__Collection.from(usedKeys).any(function (x) {
                        return keyComparator(x, key);
                    }), "Key '" + key + "' is already in use!");
                    usedKeys.push(key);
                    result.set(key, elem);
                };

                var _iteratorNormalCompletion23 = true;
                var _didIteratorError23 = false;
                var _iteratorError23 = undefined;

                try {
                    for (var _iterator23 = this[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
                        var value = _step23.value;

                        _loop3(value);
                    }
                } catch (err) {
                    _didIteratorError23 = true;
                    _iteratorError23 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion23 && _iterator23.return) {
                            _iterator23.return();
                        }
                    } finally {
                        if (_didIteratorError23) {
                            throw _iteratorError23;
                        }
                    }
                }

                return result;
            }
        }, {
            key: "toLookup",
            value: function toLookup(keySelector) {
                var elementSelectorOrKeyComparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                var keyComparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

                __assertFunction(keySelector);
                if (!elementSelectorOrKeyComparator && !keyComparator) {
                    // ToLookup(keySelector)
                    return this.groupBy(keySelector);
                } else if (!keyComparator && __getParameterCount(elementSelectorOrKeyComparator) === 1) {
                    // ToLookup(keySelector, elementSelector)
                    return this.groupBy(keySelector, elementSelectorOrKeyComparator);
                } else if (!keyComparator && __getParameterCount(elementSelectorOrKeyComparator) === 2) {
                    // ToLookup(keySelector, keyComparator)
                    return this.groupBy(keySelector, elementSelectorOrKeyComparator);
                }
                // ToLookup(keySelector, elementSelector, keyComparator)
                __assertFunction(keyComparator);
                __assertFunction(elementSelectorOrKeyComparator);
                return this.groupBy(keySelector, elementSelectorOrKeyComparator, keyComparator);
            }
        }, {
            key: "reverse",
            value: function reverse() {
                var arr = this.toArray();
                return new __Collection( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
                    var i;
                    return regeneratorRuntime.wrap(function _callee19$(_context20) {
                        while (1) {
                            switch (_context20.prev = _context20.next) {
                                case 0:
                                    i = arr.length - 1;

                                case 1:
                                    if (!(i >= 0)) {
                                        _context20.next = 7;
                                        break;
                                    }

                                    _context20.next = 4;
                                    return arr[i];

                                case 4:
                                    i--;
                                    _context20.next = 1;
                                    break;

                                case 7:
                                case "end":
                                    return _context20.stop();
                            }
                        }
                    }, _callee19, this);
                }));
            }
        }, {
            key: "forEach",
            value: function forEach(fn) {
                __assertFunction(fn);
                var _iteratorNormalCompletion24 = true;
                var _didIteratorError24 = false;
                var _iteratorError24 = undefined;

                try {
                    for (var _iterator24 = this[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
                        var val = _step24.value;

                        fn(val);
                    }
                } catch (err) {
                    _didIteratorError24 = true;
                    _iteratorError24 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion24 && _iterator24.return) {
                            _iterator24.return();
                        }
                    } finally {
                        if (_didIteratorError24) {
                            throw _iteratorError24;
                        }
                    }
                }
            }
            //#endregion
            //#region Static

        }], [{
            key: "__getEqualKey",
            value: function __getEqualKey(groupKeys, key, keyComparator) {
                var _iteratorNormalCompletion25 = true;
                var _didIteratorError25 = false;
                var _iteratorError25 = undefined;

                try {
                    for (var _iterator25 = groupKeys.keys()[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
                        var groupKey = _step25.value;

                        if (keyComparator(groupKey, key)) {
                            return groupKey;
                        }
                    }
                } catch (err) {
                    _didIteratorError25 = true;
                    _iteratorError25 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion25 && _iterator25.return) {
                            _iterator25.return();
                        }
                    } finally {
                        if (_didIteratorError25) {
                            throw _iteratorError25;
                        }
                    }
                }

                return key;
            }
        }, {
            key: "from",
            value: function from(iterable) {
                return new __Collection(iterable);
            }
        }, {
            key: "range",
            value: function range(start, count) {
                __assertNumberBetween(count, 0, Infinity);
                return new __Collection( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
                    var i;
                    return regeneratorRuntime.wrap(function _callee20$(_context21) {
                        while (1) {
                            switch (_context21.prev = _context21.next) {
                                case 0:
                                    i = start;

                                case 1:
                                    if (!(i != count + start)) {
                                        _context21.next = 6;
                                        break;
                                    }

                                    _context21.next = 4;
                                    return i++;

                                case 4:
                                    _context21.next = 1;
                                    break;

                                case 6:
                                case "end":
                                    return _context21.stop();
                            }
                        }
                    }, _callee20, this);
                }));
            }
        }, {
            key: "repeat",
            value: function repeat(val, count) {
                __assertNumberBetween(count, 0, Infinity);
                return new __Collection( /*#__PURE__*/regeneratorRuntime.mark(function _callee21() {
                    var i;
                    return regeneratorRuntime.wrap(function _callee21$(_context22) {
                        while (1) {
                            switch (_context22.prev = _context22.next) {
                                case 0:
                                    i = 0;

                                case 1:
                                    if (!(i < count)) {
                                        _context22.next = 7;
                                        break;
                                    }

                                    _context22.next = 4;
                                    return val;

                                case 4:
                                    i++;
                                    _context22.next = 1;
                                    break;

                                case 7:
                                case "end":
                                    return _context22.stop();
                            }
                        }
                    }, _callee21, this);
                }));
            }
        }, {
            key: "empty",
            get: function get() {
                return new __Collection([]);
            }
        }]);

        return __Collection;
    }();
    /**
     * HeapElement class that also provides the element index for sorting.
     *
     * @private
     * @internal
     */


    var __HeapElement = function () {
        function __HeapElement(index, value) {
            _classCallCheck(this, __HeapElement);

            this.__index = index;
            this.__value = value;
        }
        /**
         * Creates or returns a heap element from the given data.
         * If <code>obj</code> is a HeapElement obj is returned, creates a HeapElement otherwise.
         *
         * @param index Current element index.
         * @param obj Element.
         * @return Created heap element or obj if it already is a heap object.
         */


        _createClass(__HeapElement, null, [{
            key: "__createHeapElement",
            value: function __createHeapElement(index, obj) {
                if (obj === undefined || obj instanceof __HeapElement) {
                    return obj;
                }
                return new __HeapElement(index, obj);
            }
        }]);

        return __HeapElement;
    }();
    /**
     * Partially sorted heap that contains the smallest element within root position.
     *
     * @private
     * @internal
     */
    // the name starts with just a single "_" so the export does not get removed because we need it for testing


    var _MinHeap = function () {
        /**
         * Creates the heap from the array of elements with the given comparator function.
         *
         * @param elements Array with elements to create the heap from. Will be modified in place for heap logic.
         * @param comparator Comparator function (same as the one for Array.sort()).
         */
        function _MinHeap(elements) {
            var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultComparator;

            _classCallCheck(this, _MinHeap);

            __assertArray(elements);
            __assertFunction(comparator);
            // we do not wrap elements here since the heapify function does that the moment it encounters elements
            this.__elements = elements;
            // create comparator that works on heap elements (it also ensures equal elements remain in original order)
            this.__comparator = function (a, b) {
                var res = comparator(a.__value, b.__value);
                if (res !== 0) {
                    return res;
                }
                return defaultComparator(a.__index, b.__index);
            };
            // create heap ordering
            this.__createHeap(this.__elements, this.__comparator);
        }
        /**
         * Places the element at the given position into the correct position within the heap.
         *
         * @param elements Array with elements used for the heap.
         * @param comparator Comparator function (same as the one for Array.sort()).
         * @param i Index of the element that will be placed to the correct position.
         */


        _createClass(_MinHeap, [{
            key: "__heapify",
            value: function __heapify(elements, comparator, i) {
                var right = 2 * (i + 1);
                var left = right - 1;
                var bestIndex = i;
                // wrap elements the moment we encounter them first
                elements[bestIndex] = __HeapElement.__createHeapElement(bestIndex, elements[bestIndex]);
                // check if the element is currently misplaced
                if (left < elements.length) {
                    elements[left] = __HeapElement.__createHeapElement(left, elements[left]);
                    if (comparator(elements[left], elements[bestIndex]) < 0) {
                        bestIndex = left;
                    }
                }
                if (right < elements.length) {
                    elements[right] = __HeapElement.__createHeapElement(right, elements[right]);
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
                    this.__heapify(elements, comparator, bestIndex);
                }
            }
            /**
             * Creates a heap from the given array using the given comparator.
             *
             * @param elements Array with elements used for the heap. Will be modified in place for heap logic.
             * @param comparator Comparator function (same as the one for Array.sort()).
             */

        }, {
            key: "__createHeap",
            value: function __createHeap(elements, comparator) {
                // special case: empty array
                if (elements.length === 0) {
                    // nothing to do here
                    return;
                }
                for (var i = Math.floor(elements.length / 2); i >= 0; i--) {
                    // do fancy stuff
                    this.__heapify(elements, comparator, i);
                }
            }
        }, {
            key: "__hasTopElement",
            value: function __hasTopElement() {
                return this.__elements.length > 0;
            }
        }, {
            key: "__getTopElement",
            value: function __getTopElement() {
                // special case: only one element left
                if (this.__elements.length === 1) {
                    return this.__elements.pop().__value;
                }
                var topElement = this.__elements[0];
                this.__elements[0] = this.__elements.pop();
                // do fancy stuff
                this.__heapify(this.__elements, this.__comparator, 0);
                return topElement.__value;
            }
        }, {
            key: Symbol.iterator,
            value: function value() {
                // keep matching heap instance
                var heap = this;
                return {
                    next: function next() {
                        if (heap.__hasTopElement()) {
                            return {
                                done: false,
                                value: heap.__getTopElement()
                            };
                        }
                        return {
                            done: true,
                            value: undefined
                        };
                    }
                };
            }
        }]);

        return _MinHeap;
    }();

    exports._MinHeap = _MinHeap;
    /**
     * @private
     * @internal
     */

    var __OrderedCollection = function (_Collection) {
        _inherits(__OrderedCollection, _Collection);

        function __OrderedCollection(iterableOrGenerator, comparator) {
            _classCallCheck(this, __OrderedCollection);

            __assertFunction(comparator);

            var _this3 = _possibleConstructorReturn(this, (__OrderedCollection.__proto__ || Object.getPrototypeOf(__OrderedCollection)).call(this, iterableOrGenerator));

            _this3.__comparator = comparator;
            return _this3;
        }

        _createClass(__OrderedCollection, [{
            key: "thenBy",
            value: function thenBy(keySelector) {
                var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultComparator;

                var currentComparator = this.__comparator;
                var additionalComparator = __getComparatorFromKeySelector(keySelector, comparator);
                var newComparator = function newComparator(a, b) {
                    var res = currentComparator(a, b);
                    if (res !== 0) {
                        return res;
                    }
                    return additionalComparator(a, b);
                };
                return new __OrderedCollection(this.__iterable, newComparator);
            }
        }, {
            key: "thenByDescending",
            value: function thenByDescending(keySelector) {
                var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultComparator;

                return this.thenBy(keySelector, function (a, b) {
                    return comparator(b, a);
                });
            }
        }, {
            key: Symbol.iterator,
            value: function value() {
                var self = this;
                var parentIterator = _get(__OrderedCollection.prototype.__proto__ || Object.getPrototypeOf(__OrderedCollection.prototype), Symbol.iterator, this).bind(this);
                return (/*#__PURE__*/regeneratorRuntime.mark(function _callee22() {
                        return regeneratorRuntime.wrap(function _callee22$(_context23) {
                            while (1) {
                                switch (_context23.prev = _context23.next) {
                                    case 0:
                                        return _context23.delegateYield(new _MinHeap([].concat(_toConsumableArray(_defineProperty({}, Symbol.iterator, parentIterator))), self.__comparator), "t0", 1);

                                    case 1:
                                    case "end":
                                        return _context23.stop();
                                }
                            }
                        }, _callee22, this);
                    })()
                );
            }
        }]);

        return __OrderedCollection;
    }(__Collection);

    exports.Collection = __Collection;
    exports.default = exports.Collection;
    /**
     * Extends the given prototype to have quick access to all collection methods.
     *
     * @param prototype Prototype to be patched.
     * @param exclude List of method names to exclude from patching.
     * @throws Will throw an error if a method would be overwritten.
     *
     * @see {@link extendNativeTypes} to extend Javascript's native iterables.
     */
    function extendIterablePrototype(prototype) {
        var exclude = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        // always exclude the constructor
        exclude.push("constructor");
        var ex = exports.Collection.from(exclude);
        // check for conflicts
        var patchProperties = [];
        var _iteratorNormalCompletion26 = true;
        var _didIteratorError26 = false;
        var _iteratorError26 = undefined;

        try {
            for (var _iterator26 = Object.getOwnPropertyNames(Object.getPrototypeOf(exports.Collection.empty))[Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
                var _key2 = _step26.value;

                if (!_key2.startsWith('_') && !ex.contains(_key2) && __isFunction(exports.Collection.empty[_key2])) {
                    if (_key2 in prototype) {
                        throw new Error("The method \"" + _key2 + "\" already exists on the \"" + (prototype.constructor && prototype.constructor.name) + "\" prototype. " + "Use the exclude parameter to patch without this method.");
                    } else {
                        patchProperties.push(_key2);
                    }
                }
            }
            // path prototype
        } catch (err) {
            _didIteratorError26 = true;
            _iteratorError26 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion26 && _iterator26.return) {
                    _iterator26.return();
                }
            } finally {
                if (_didIteratorError26) {
                    throw _iteratorError26;
                }
            }
        }

        var _loop4 = function _loop4(_key3) {
            prototype[_key3] = function () {
                var _collection$_key;

                var collection = exports.Collection.from(this);

                for (var _len2 = arguments.length, args = Array(_len2), _key4 = 0; _key4 < _len2; _key4++) {
                    args[_key4] = arguments[_key4];
                }

                return (_collection$_key = collection[_key3]).call.apply(_collection$_key, [collection].concat(args));
            };
        };

        var _iteratorNormalCompletion27 = true;
        var _didIteratorError27 = false;
        var _iteratorError27 = undefined;

        try {
            for (var _iterator27 = patchProperties[Symbol.iterator](), _step27; !(_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done); _iteratorNormalCompletion27 = true) {
                var _key3 = _step27.value;

                _loop4(_key3);
            }
        } catch (err) {
            _didIteratorError27 = true;
            _iteratorError27 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion27 && _iterator27.return) {
                    _iterator27.return();
                }
            } finally {
                if (_didIteratorError27) {
                    throw _iteratorError27;
                }
            }
        }
    }
    exports.extendIterablePrototype = extendIterablePrototype;
    /**
     * Extends the native collections to have quick access to all collection methods.
     *
     * This method extends the prototypes of Array, Map and Set.
     *
     * @see {@link extendIterablePrototype} to extend custom iterables.
     */
    function extendNativeTypes() {
        extendIterablePrototype(Array.prototype, ["concat", "forEach", "indexOf", "join", "lastIndexOf", "reverse"]);
        var originalJoin = Array.prototype.join;
        Array.prototype.join = function () {
            for (var _len3 = arguments.length, args = Array(_len3), _key5 = 0; _key5 < _len3; _key5++) {
                args[_key5] = arguments[_key5];
            }

            if (args.length == 4 || args.length == 5) {
                var _collection$join;

                var collection = exports.Collection.from(this);
                return (_collection$join = collection.join).call.apply(_collection$join, [collection].concat(args));
            }
            return originalJoin.call.apply(originalJoin, [this].concat(args));
        };
        var originalIndexOf = Array.prototype.indexOf;
        Array.prototype.indexOf = function () {
            for (var _len4 = arguments.length, args = Array(_len4), _key6 = 0; _key6 < _len4; _key6++) {
                args[_key6] = arguments[_key6];
            }

            if (args.length == 2 && __isFunction(args[1])) {
                var _collection$indexOf;

                var collection = exports.Collection.from(this);
                return (_collection$indexOf = collection.indexOf).call.apply(_collection$indexOf, [collection].concat(args));
            }
            return originalIndexOf.call.apply(originalIndexOf, [this].concat(args));
        };
        var originalLastIndexOf = Array.prototype.lastIndexOf;
        Array.prototype.lastIndexOf = function () {
            for (var _len5 = arguments.length, args = Array(_len5), _key7 = 0; _key7 < _len5; _key7++) {
                args[_key7] = arguments[_key7];
            }

            if (args.length == 2 && __isFunction(args[1])) {
                var _collection$lastIndex;

                var collection = exports.Collection.from(this);
                return (_collection$lastIndex = collection.lastIndexOf).call.apply(_collection$lastIndex, [collection].concat(args));
            }
            return originalLastIndexOf.call.apply(originalLastIndexOf, [this].concat(args));
        };
        extendIterablePrototype(Map.prototype, ["add", "forEach"]);
        extendIterablePrototype(Set.prototype, ["add", "forEach"]);
    }
    exports.extendNativeTypes = extendNativeTypes;
});