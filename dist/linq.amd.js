define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @private
     * @internal
     */
    class __AssertionError extends Error {
        constructor(expected, got) {
            super(`Expected ${expected}, got ${got}!`);
        }
    }
    /**
     * @private
     * @internal
     */
    function __assert(condition, ...args) {
        if (!condition) {
            if (args.length === 2) {
                throw new __AssertionError(args[0], args[1]);
            }
            else {
                throw new Error(args[0]);
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
    function __assertNumberBetween(num, min, max = Infinity) {
        __assertNumeric(num);
        __assert(num >= min && num <= max, `Number must be between ${min} and ${max}!`);
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
        return (Symbol.iterator in Object(obj));
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
        return obj instanceof (function* () {
        }).constructor;
    }
    /**
     * @private
     * @internal
     */
    function __isUndefined(obj) {
        return typeof obj === typeof undefined;
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
    const __nativeConstructors = [Object, Number, Boolean, String, Symbol];
    /**
     * @private
     * @internal
     */
    function __isNative(obj) {
        return /native code/.test(Object(obj).toString()) || !!~__nativeConstructors.indexOf(obj);
    }
    /**
     * @private
     * @internal
     */
    function __aggregateCollection(coll, seed, accumulator, resultTransformFn) {
        __assertFunction(accumulator);
        __assertFunction(resultTransformFn);
        let value = seed;
        for (let element of coll) {
            value = accumulator(value, element);
        }
        return resultTransformFn(value);
    }
    /**
     * @private
     * @internal
     */
    function __removeDuplicates(coll, equalityCompareFn = __defaultEqualityCompareFn) {
        __assertIterable(coll);
        __assertFunction(equalityCompareFn);
        const previous = [];
        return new __Collection(function* () {
            outer: for (let val of coll) {
                for (let prev of previous) {
                    if (equalityCompareFn(val, prev)) {
                        continue outer;
                    }
                }
                previous.push(val);
                yield val;
            }
        });
    }
    /**
     * @private
     * @internal
     */
    function __removeFromArray(arr, value) {
        __assertArray(arr);
        let elementsBefore = [];
        let elementFound;
        let current;
        // remove all elements from the array (shift) and push them into a temporary variable until the desired element was found
        while ((current = arr.shift()) && !(elementFound = __defaultEqualityCompareFn(current, value))) {
            elementsBefore.push(current);
        }
        // add the temporary values back to the array (to the front)
        // -> unshift modifies the original array instead of returning a new one
        arr.unshift(...elementsBefore);
        return elementFound;
    }
    /**
     * @private
     * @internal
     */
    function __getDefault(constructorOrValue = Object) {
        if (constructorOrValue && __isNative(constructorOrValue) && typeof constructorOrValue === 'function') {
            let defaultValue = constructorOrValue();
            if (defaultValue instanceof Object || constructorOrValue === Date) {
                return null;
            }
            else {
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
    function __getComparatorFromKeySelector(selector, comparator = defaultComparator) {
        if (__isFunction(selector)) {
            return (new Function('comparator', 'keySelectorFn', 'a', 'b', `return comparator(keySelectorFn(a), keySelectorFn(b))`).bind(null, comparator, selector));
        }
        else if (__isString(selector)) {
            if (!(selector.startsWith('[') || selector.startsWith('.'))) {
                selector = `.${selector}`;
            }
            return (new Function('comparator', 'a', 'b', `return comparator(a${selector}, b${selector})`).bind(null, comparator));
        }
        throw new __AssertionError("string or function", selector);
    }
    /**
     * @private
     * @internal
     */
    class __Collection {
        //#region Constructor
        constructor(iterableOrGenerator) {
            //#endregion
            //#region Iterable
            this.__iterable = null;
            __assert(__isIterable(iterableOrGenerator) || __isGenerator(iterableOrGenerator), 'iterable or generator', iterableOrGenerator);
            this.__iterable = iterableOrGenerator;
        }
        [Symbol.iterator]() {
            const iterable = this.__iterable;
            if (__isGenerator(iterable)) {
                return iterable();
            }
            else {
                return function* () {
                    yield* iterable;
                }();
            }
        }
        //#endregion
        //#region Access
        __resultOrDefault(originalFn, predicateOrDefault = x => true, fallback = Object) {
            let predicate;
            if (__isPredicate(predicateOrDefault)) {
                predicate = predicateOrDefault;
            }
            else {
                predicate = x => true;
                fallback = predicateOrDefault;
            }
            __assertFunction(predicate);
            const defaultVal = __getDefault(fallback);
            if (__isEmpty(this)) {
                return defaultVal;
            }
            let result = originalFn.call(this, predicate);
            if (!result) {
                return defaultVal;
            }
            return result;
        }
        elementAt(index) {
            __assertIndexInRange(this, index);
            return this.skip(index).first();
        }
        take(count = 0) {
            __assertNumeric(count);
            if (count <= 0) {
                return __Collection.empty;
            }
            const self = this;
            return new __Collection(function* () {
                let i = 0;
                for (let val of self) {
                    yield val;
                    if (++i === count) {
                        break;
                    }
                }
            });
        }
        skip(count = 0) {
            __assertNumeric(count);
            if (count <= 0) {
                return this;
            }
            return this.skipWhile((elem, index) => index < count);
        }
        takeWhile(predicate = (elem, index) => true) {
            __assertFunction(predicate);
            const self = this;
            return new __Collection(function* () {
                let index = 0;
                for (let val of self) {
                    if (predicate(val, index++)) {
                        yield val;
                    }
                    else {
                        break;
                    }
                }
            });
        }
        takeUntil(predicate = (elem, index) => false) {
            return this.takeWhile((elem, index) => !predicate(elem, index));
        }
        skipWhile(predicate = (elem, index) => true) {
            __assertFunction(predicate);
            const self = this;
            return new __Collection(function* () {
                let index = 0;
                let endSkip = false;
                for (let val of self) {
                    if (!endSkip && predicate(val, index++)) {
                        continue;
                    }
                    endSkip = true;
                    yield val;
                }
            });
        }
        skipUntil(predicate = (elem, index) => false) {
            return this.skipWhile((elem, index) => !predicate(elem, index));
        }
        first(predicate = (x) => true) {
            __assertFunction(predicate);
            __assertNotEmpty(this);
            return this.skipWhile(elem => !predicate(elem))[Symbol.iterator]().next().value;
        }
        firstOrDefault(predicateOrConstructor = (x) => true, constructor = Object) {
            return this.__resultOrDefault(this.first, predicateOrConstructor, constructor);
        }
        last(predicate = (x) => true) {
            __assertFunction(predicate);
            __assertNotEmpty(this);
            return this.reverse().first(predicate);
        }
        lastOrDefault(predicateOrConstructor = (x) => true, constructor = Object) {
            return this.__resultOrDefault(this.last, predicateOrConstructor, constructor);
        }
        single(predicate = (x) => true) {
            __assertFunction(predicate);
            __assertNotEmpty(this);
            let index = 0;
            let result;
            for (let val of this) {
                if (predicate(val)) {
                    result = val;
                    break;
                }
                index++;
            }
            if (this.first(elem => predicate(elem) && !__defaultEqualityCompareFn(elem, result))) {
                throw new Error('Sequence contains more than one element');
            }
            return result;
        }
        singleOrDefault(predicateOrConstructor = (x) => true, constructor = Object) {
            return this.__resultOrDefault(this.single, predicateOrConstructor, constructor);
        }
        defaultIfEmpty(constructor) {
            if (!__isEmpty(this)) {
                return this;
            }
            return new __Collection([__getDefault(constructor)]);
        }
        //#endregion
        //#region Concatenation
        concat(inner) {
            __assertIterable(inner);
            const outer = this;
            return new __Collection(function* () {
                yield* outer;
                yield* inner;
            });
        }
        union(inner, equalityCompareFn = __defaultEqualityCompareFn) {
            __assertIterable(inner);
            return this.concat(inner).distinct(equalityCompareFn);
        }
        join(inner, outerKeySelector, innerKeySelector, resultSelectorFn, keyEqualityCompareFn = __defaultEqualityCompareFn) {
            __assertIterable(inner);
            __assertFunction(outerKeySelector);
            __assertFunction(innerKeySelector);
            __assertFunction(resultSelectorFn);
            __assertFunction(keyEqualityCompareFn);
            const outer = this;
            return new __Collection(function* () {
                for (let outerValue of outer) {
                    const outerKey = outerKeySelector(outerValue);
                    for (let innerValue of inner) {
                        const innerKey = innerKeySelector(innerValue);
                        if (keyEqualityCompareFn(outerKey, innerKey)) {
                            yield resultSelectorFn(outerValue, innerValue);
                        }
                    }
                }
            });
        }
        except(inner) {
            __assertIterable(inner);
            if (!__isCollection(inner)) {
                inner = new __Collection(inner);
            }
            const outer = this;
            return new __Collection(function* () {
                for (let val of outer) {
                    if (!inner.contains(val)) {
                        yield val;
                    }
                }
            });
        }
        zip(inner, resultSelectorFn) {
            __assertIterable(inner);
            __assertFunction(resultSelectorFn);
            const outer = this;
            return new __Collection(function* () {
                const innerIterator = inner[Symbol.iterator]();
                for (let outerVal of outer) {
                    const innerNext = innerIterator.next();
                    if (innerNext.done) {
                        break;
                    }
                    yield resultSelectorFn(outerVal, innerNext.value);
                }
            });
        }
        intersect(inner, equalityCompareFn = __defaultEqualityCompareFn) {
            __assertIterable(inner);
            __assertFunction(equalityCompareFn);
            const self = this;
            return new __Collection(function* () {
                const innerCollection = __Collection.from(inner);
                for (let val of self) {
                    if (innerCollection.any((elem) => equalityCompareFn(val, elem))) {
                        yield val;
                    }
                }
            });
        }
        //#endregion
        //#region Equality
        sequenceEqual(second, equalityCompareFn = __defaultEqualityCompareFn) {
            if (!__isIterable(second)) {
                return false;
            }
            const firstIterator = this[Symbol.iterator]();
            const secondIterator = second[Symbol.iterator]();
            let firstResult;
            let secondResult;
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
        static __getEqualKey(groupKeys, key, keyComparator) {
            for (let groupKey of groupKeys.keys()) {
                if (keyComparator(groupKey, key)) {
                    return groupKey;
                }
            }
            return key;
        }
        groupBy(keySelector, ...args) {
            const self = this;
            /**
             * Checks whether or not a function is a key comparator.
             * We need to differentiate between the key comparator and the result selector since both take two arguments.
             *
             * @param arg Function to be tested.
             * @return If the given function is a key comparator.
             */
            function isKeyComparator(arg) {
                let result = __getParameterCount(arg) === 2;
                const first = self.first();
                try {
                    const key = keySelector(first);
                    // if this is a key comparator, it must return truthy values for equal values and falsy ones if they're different
                    result = result && arg(key, key) && !arg(key, {});
                }
                catch (err) {
                    // if the function throws an error for values, it can't be a keyComparator
                    result = false;
                }
                return result;
            }
            /*
             * GroupBy(keySelector)
             */
            function groupByOneArgument(keySelector) {
                return groupBy(keySelector, elem => elem, undefined, __defaultEqualityCompareFn);
            }
            /*
             * GroupBy(keySelector, keyComparator)
             * GroupBy(keySelector, elementSelector)
             * GroupBy(keySelector, resultSelector)
             */
            function groupByTwoArguments(keySelector, inner) {
                let keyComparator, elementSelector;
                if (isKeyComparator(inner)) {
                    keyComparator = inner;
                    elementSelector = (elem) => elem;
                }
                else {
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
                let keyComparator, elementSelector, resultSelector;
                if (isKeyComparator(third)) {
                    keyComparator = third;
                }
                else {
                    resultSelector = third;
                }
                if (__getParameterCount(inner) === 2) {
                    resultSelector = inner;
                }
                else {
                    elementSelector = inner;
                }
                if (!keyComparator) {
                    keyComparator = __defaultEqualityCompareFn;
                }
                if (!elementSelector) {
                    elementSelector = (elem) => elem;
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
                let groups = new Map();
                let result;
                for (let val of self) {
                    // Instead of checking groups.has we use our custom function since we want to treat some keys as equal even if they aren't for the Map
                    const key = __Collection.__getEqualKey(groups, keySelector(val), keyComparator);
                    const elem = elementSelector(val);
                    if (groups.has(key)) {
                        groups.get(key).push(elem);
                    }
                    else {
                        groups.set(key, [elem]);
                    }
                }
                if (resultSelector) {
                    // If we want to select the final result with the resultSelector, we use the built-in Select function and retrieve a new Collection
                    result = __Collection.from(groups).select((g) => resultSelector(...g));
                }
                else {
                    // our result is just the groups -> return the Map
                    result = groups;
                }
                return result;
            }
            // the outer parameter of GroupBy is always the keySelector, so we have to differentiate the following arguments
            // and select the appropriate function
            let fn;
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
            return fn(keySelector, ...args);
        }
        groupJoin(inner, outerKeySelector, innerKeySelector, resultSelector, equalityCompareFn = __defaultEqualityCompareFn) {
            __assertIterable(inner);
            __assertFunction(outerKeySelector);
            __assertFunction(innerKeySelector);
            __assertFunction(resultSelector);
            let groups = new Map();
            const outer = this;
            for (let outerVal of outer) {
                const outerKey = outerKeySelector(outerVal);
                groups.set(outerVal, new __Collection(function* () {
                    for (let innerVal of inner) {
                        if (equalityCompareFn(outerKey, innerKeySelector(innerVal))) {
                            yield innerVal;
                        }
                    }
                }));
            }
            return new __Collection(function* () {
                for (let [key, values] of groups) {
                    yield resultSelector(key, values);
                }
            });
        }
        //#endregion
        //#region Insert & Remove
        add(value) {
            this.insert(value, this.count());
        }
        insert(value, index) {
            const oldValues = this.toArray();
            __assert(index >= 0 && index <= oldValues.length, 'Index is out of bounds!');
            this.__iterable = function* () {
                yield* oldValues.slice(0, index);
                yield value;
                yield* oldValues.slice(index, oldValues.length);
            };
        }
        remove(value) {
            let values = this.toArray();
            const result = __removeFromArray(values, value);
            if (!result) {
                return false;
            }
            this.__iterable = function* () {
                yield* values;
            };
            return true;
        }
        //#endregion
        //#region Math
        min(mapFn = (x) => x) {
            __assertFunction(mapFn);
            __assertNotEmpty(this);
            return this.select(mapFn).aggregate((a, b) => a < b ? a : b);
        }
        max(mapFn = (x) => x) {
            __assertFunction(mapFn);
            __assertNotEmpty(this);
            return this.select(mapFn).aggregate((a, b) => a > b ? a : b);
        }
        sum(mapFn = (x) => x) {
            __assertNotEmpty(this);
            return this.select(mapFn).aggregate(0, (prev, curr) => prev + curr);
        }
        average(mapFn = (x) => x) {
            __assertNotEmpty(this);
            return this.sum(mapFn) / this.count();
        }
        //#endregion
        //#region Ordering
        order(comparator = defaultComparator) {
            return this.orderBy((x) => x, comparator);
        }
        orderDescending(comparator = defaultComparator) {
            return this.orderByDescending((x) => x, comparator);
        }
        orderBy(keySelector, comparator = defaultComparator) {
            __assertFunction(comparator);
            return new __OrderedCollection(this, __getComparatorFromKeySelector(keySelector, comparator));
        }
        orderByDescending(keySelector, comparator = defaultComparator) {
            return new __OrderedCollection(this, __getComparatorFromKeySelector(keySelector, (a, b) => comparator(b, a)));
        }
        shuffle() {
            return this.orderBy(() => Math.floor(Math.random() * 3) - 1 /* Returns -1, 0 or 1 */);
        }
        //#endregioning
        //#region Search
        indexOf(element, equalityCompareFn = __defaultEqualityCompareFn) {
            __assertFunction(equalityCompareFn);
            let i = 0;
            for (let val of this) {
                if (equalityCompareFn(val, element)) {
                    return i;
                }
                i++;
            }
            return -1;
        }
        lastIndexOf(element, equalityCompareFn = __defaultEqualityCompareFn) {
            __assertFunction(equalityCompareFn);
            let i = 0;
            let lastIndex = -1;
            for (let val of this) {
                if (equalityCompareFn(val, element)) {
                    lastIndex = i;
                }
                i++;
            }
            return lastIndex;
        }
        contains(elem, equalityCompareFn = __defaultEqualityCompareFn) {
            return !!~this.indexOf(elem, equalityCompareFn);
        }
        where(predicate = (elem, index) => true) {
            __assertFunction(predicate);
            const self = this;
            return new __Collection(function* () {
                let index = 0;
                for (let val of self) {
                    if (predicate(val, index)) {
                        yield val;
                    }
                    index++;
                }
            });
        }
        conditionalWhere(condition, predicate) {
            if (condition) {
                return this.where(predicate);
            }
            else {
                return this;
            }
        }
        count(predicate = (elem) => true) {
            let count = 0;
            let filtered = this.where(predicate);
            let iterator = filtered[Symbol.iterator]();
            while (!iterator.next().done) {
                count++;
            }
            return count;
        }
        any(predicate = null) {
            if (__isEmpty(this)) {
                return false;
            }
            if (!predicate) {
                // since we checked before that the sequence is not empty
                return true;
            }
            return !this.where(predicate)[Symbol.iterator]().next().done;
        }
        all(predicate = elem => true) {
            __assertFunction(predicate);
            // All is equal to the question if there's no element which does not match the predicate
            // 'all fruits are yellow' -> 'there is no fruit which is not yellow'
            return !this.any((x) => !predicate(x));
        }
        //#endregion
        //#region Transformation
        aggregate(seedOrAccumulator, accumulator = null, resultTransformFn = null) {
            if (__isFunction(seedOrAccumulator) && !accumulator && !resultTransformFn) {
                return __aggregateCollection(this.skip(1), this.first(), seedOrAccumulator, (elem) => elem);
            }
            else if (!__isFunction(seedOrAccumulator) && __isFunction(accumulator) && !resultTransformFn) {
                return __aggregateCollection(this, seedOrAccumulator, accumulator, (elem) => elem);
            }
            else {
                return __aggregateCollection(this, seedOrAccumulator, accumulator, resultTransformFn);
            }
        }
        select(mapFn = (x) => x) {
            const self = this;
            let index = 0;
            return new __Collection(function* () {
                for (let val of self) {
                    yield mapFn(val, index);
                    index++;
                }
            });
        }
        flatten() {
            return this.selectMany((x) => x);
        }
        selectMany(mapFn, resultSelector = (x, y) => y) {
            __assertFunction(mapFn);
            __assertFunction(resultSelector);
            const self = this;
            return new __Collection(function* () {
                let index = 0;
                for (let current of self) {
                    let mappedEntry = mapFn(current, index);
                    let newIterable = mappedEntry;
                    if (!__isIterable(mappedEntry)) {
                        newIterable = [mappedEntry];
                    }
                    else {
                        newIterable = mappedEntry;
                    }
                    for (let val of newIterable[Symbol.iterator]()) {
                        yield resultSelector(current, val);
                    }
                    index++;
                }
            });
        }
        distinct(equalityCompareFn = __defaultEqualityCompareFn) {
            __assertFunction(equalityCompareFn);
            return __removeDuplicates(this, equalityCompareFn);
        }
        toArray() {
            return [...this];
        }
        toDictionary(keySelector, elementSelectorOrKeyComparator = null, keyComparator = null) {
            __assertFunction(keySelector);
            if (!elementSelectorOrKeyComparator && !keyComparator) {
                // ToDictionary(keySelector)
                return this.toDictionary(keySelector, (elem) => elem, __defaultEqualityCompareFn);
            }
            else if (!keyComparator && __getParameterCount(elementSelectorOrKeyComparator) === 1) {
                // ToDictionary(keySelector, elementSelector)
                return this.toDictionary(keySelector, elementSelectorOrKeyComparator, __defaultEqualityCompareFn);
            }
            else if (!keyComparator && __getParameterCount(elementSelectorOrKeyComparator) === 2) {
                // ToDictionary(keySelector, keyComparator)
                return this.toDictionary(keySelector, (elem) => elem, elementSelectorOrKeyComparator);
            }
            // ToDictionary(keySelector, elementSelector, keyComparator)
            __assertFunction(keyComparator);
            __assertFunction(elementSelectorOrKeyComparator);
            let usedKeys = [];
            let result = new Map();
            for (let value of this) {
                let key = keySelector(value);
                let elem = elementSelectorOrKeyComparator(value);
                __assert(key != null, 'Key is not allowed to be null!');
                __assert(!__Collection.from(usedKeys).any((x) => keyComparator(x, key)), `Key '${key}' is already in use!`);
                usedKeys.push(key);
                result.set(key, elem);
            }
            return result;
        }
        toLookup(keySelector, elementSelectorOrKeyComparator = null, keyComparator = null) {
            __assertFunction(keySelector);
            if (!elementSelectorOrKeyComparator && !keyComparator) {
                // ToLookup(keySelector)
                return this.groupBy(keySelector);
            }
            else if (!keyComparator && __getParameterCount(elementSelectorOrKeyComparator) === 1) {
                // ToLookup(keySelector, elementSelector)
                return this.groupBy(keySelector, elementSelectorOrKeyComparator);
            }
            else if (!keyComparator && __getParameterCount(elementSelectorOrKeyComparator) === 2) {
                // ToLookup(keySelector, keyComparator)
                return this.groupBy(keySelector, elementSelectorOrKeyComparator);
            }
            // ToLookup(keySelector, elementSelector, keyComparator)
            __assertFunction(keyComparator);
            __assertFunction(elementSelectorOrKeyComparator);
            return this.groupBy(keySelector, elementSelectorOrKeyComparator, keyComparator);
        }
        reverse() {
            const arr = this.toArray();
            return new __Collection(function* () {
                for (let i = arr.length - 1; i >= 0; i--) {
                    yield arr[i];
                }
            });
        }
        forEach(fn) {
            __assertFunction(fn);
            for (let val of this) {
                fn(val);
            }
        }
        //#endregion
        //#region Static
        static from(iterable) {
            return new __Collection(iterable);
        }
        static range(start, count) {
            __assertNumberBetween(count, 0, Infinity);
            return new __Collection(function* () {
                let i = start;
                while (i != count + start) {
                    yield i++;
                }
            });
        }
        static repeat(val, count) {
            __assertNumberBetween(count, 0, Infinity);
            return new __Collection(function* () {
                for (let i = 0; i < count; i++) {
                    yield val;
                }
            });
        }
        static get empty() {
            return new __Collection([]);
        }
    }
    /**
     * HeapElement class that also provides the element index for sorting.
     *
     * @private
     * @internal
     */
    class __HeapElement {
        constructor(index, value) {
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
        static __createHeapElement(index, obj) {
            if (obj === undefined || obj instanceof __HeapElement) {
                return obj;
            }
            return new __HeapElement(index, obj);
        }
    }
    /**
     * Partially sorted heap that contains the smallest element within root position.
     *
     * @private
     * @internal
     */
    // the name starts with just a single "_" so the export does not get removed because we need it for testing
    class _MinHeap {
        /**
         * Creates the heap from the array of elements with the given comparator function.
         *
         * @param elements Array with elements to create the heap from. Will be modified in place for heap logic.
         * @param comparator Comparator function (same as the one for Array.sort()).
         */
        constructor(elements, comparator = defaultComparator) {
            __assertArray(elements);
            __assertFunction(comparator);
            // we do not wrap elements here since the heapify function does that the moment it encounters elements
            this.__elements = elements;
            // create comparator that works on heap elements (it also ensures equal elements remain in original order)
            this.__comparator = (a, b) => {
                let res = comparator(a.__value, b.__value);
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
        __heapify(elements, comparator, i) {
            let right = 2 * (i + 1);
            let left = right - 1;
            let bestIndex = i;
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
                let tmp = elements[i];
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
        __createHeap(elements, comparator) {
            // special case: empty array
            if (elements.length === 0) {
                // nothing to do here
                return;
            }
            for (let i = Math.floor(elements.length / 2); i >= 0; i--) {
                // do fancy stuff
                this.__heapify(elements, comparator, i);
            }
        }
        __hasTopElement() {
            return this.__elements.length > 0;
        }
        __getTopElement() {
            // special case: only one element left
            if (this.__elements.length === 1) {
                return this.__elements.pop().__value;
            }
            let topElement = this.__elements[0];
            this.__elements[0] = this.__elements.pop();
            // do fancy stuff
            this.__heapify(this.__elements, this.__comparator, 0);
            return topElement.__value;
        }
        [Symbol.iterator]() {
            // keep matching heap instance
            let heap = this;
            return {
                next: function () {
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
    }
    exports._MinHeap = _MinHeap;
    /**
     * @private
     * @internal
     */
    class __OrderedCollection extends __Collection {
        constructor(iterableOrGenerator, comparator) {
            __assertFunction(comparator);
            super(iterableOrGenerator);
            this.__comparator = comparator;
        }
        thenBy(keySelector, comparator = defaultComparator) {
            const currentComparator = this.__comparator;
            const additionalComparator = __getComparatorFromKeySelector(keySelector, comparator);
            const newComparator = (a, b) => {
                const res = currentComparator(a, b);
                if (res !== 0) {
                    return res;
                }
                return additionalComparator(a, b);
            };
            return new __OrderedCollection(this.__iterable, newComparator);
        }
        ;
        thenByDescending(keySelector, comparator = defaultComparator) {
            return this.thenBy(keySelector, (a, b) => comparator(b, a));
        }
        [Symbol.iterator]() {
            let self = this;
            let parentIterator = super[Symbol.iterator].bind(this);
            return function* () {
                yield* new _MinHeap([...{ [Symbol.iterator]: parentIterator }], self.__comparator);
            }();
        }
    }
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
    function extendIterablePrototype(prototype, exclude = []) {
        // always exclude the constructor
        exclude.push("constructor");
        let ex = exports.Collection.from(exclude);
        // check for conflicts
        let patchProperties = [];
        for (let key of Object.getOwnPropertyNames(Object.getPrototypeOf(exports.Collection.empty))) {
            if (!key.startsWith('_') && !ex.contains(key) && __isFunction(exports.Collection.empty[key])) {
                if (key in prototype) {
                    throw new Error(`The method "${key}" already exists on the "${prototype.constructor && prototype.constructor.name}" prototype. ` +
                        `Use the exclude parameter to patch without this method.`);
                }
                else {
                    patchProperties.push(key);
                }
            }
        }
        // path prototype
        for (let key of patchProperties) {
            prototype[key] = function (...args) {
                let collection = exports.Collection.from(this);
                return collection[key].call(collection, ...args);
            };
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
        const originalJoin = Array.prototype.join;
        Array.prototype.join = function (...args) {
            if (args.length == 4 || args.length == 5) {
                let collection = exports.Collection.from(this);
                return collection.join.call(collection, ...args);
            }
            return originalJoin.call(this, ...args);
        };
        const originalIndexOf = Array.prototype.indexOf;
        Array.prototype.indexOf = function (...args) {
            if (args.length == 2 && __isFunction(args[1])) {
                let collection = exports.Collection.from(this);
                return collection.indexOf.call(collection, ...args);
            }
            return originalIndexOf.call(this, ...args);
        };
        const originalLastIndexOf = Array.prototype.lastIndexOf;
        Array.prototype.lastIndexOf = function (...args) {
            if (args.length == 2 && __isFunction(args[1])) {
                let collection = exports.Collection.from(this);
                return collection.lastIndexOf.call(collection, ...args);
            }
            return originalLastIndexOf.call(this, ...args);
        };
        extendIterablePrototype(Map.prototype, ["add", "forEach"]);
        extendIterablePrototype(Set.prototype, ["add", "forEach"]);
    }
    exports.extendNativeTypes = extendNativeTypes;
});
