import {BasicCollection} from "../BasicCollection";
import {__aggregateCollection, __getComparatorFromKeySelector, __getDefault, __getParameterCount, __removeDuplicates, __removeFromArray} from "../helper/utils";
import {__defaultEqualityCompareFn, defaultComparator} from "../helper/defaults";
import {__isCollection, __isEmpty, __isFunction, __isGenerator, __isIterable, __isPredicate, __isUndefined} from "../helper/is";
import {__assert, __assertFunction, __assertIndexInRange, __assertIterable, __assertNotEmpty, __assertNumberBetween, __assertNumeric} from "../helper/assert";
import {OrderedCollection} from "../OrderedCollection";
import {__OrderedCollection} from "./OrderedCollection";

/**
 * @private
 * @internal
 */
export class __Collection<T> implements BasicCollection<T> {

    //#region Constructor

    public constructor(iterableOrGenerator: Iterable<T> | (() => Iterator<T>)) {
        __assert(__isIterable(iterableOrGenerator) || __isGenerator(iterableOrGenerator), 'iterable or generator', iterableOrGenerator);
        this.__iterable = iterableOrGenerator;
    }

    //#endregion

    //#region Iterable

    protected __iterable: Iterable<T> | (() => Iterator<T>) = null;

    public [Symbol.iterator](): Iterator<T> {
        const iterable: Iterable<T> | (() => Iterator<T>) = this.__iterable;

        if (__isGenerator(iterable)) {
            return iterable();
        } else {
            return function* () {
                yield* iterable;
            }();
        }
    }

    //#endregion

    //#region Access

    private __resultOrDefault<V>(originalFn: (p: ((v: T) => boolean)) => T, predicateOrDefault: ((v: T) => boolean) | V = x => true, fallback: V = <any>Object): T | V {
        let predicate: (v: T) => boolean;

        if (__isPredicate(predicateOrDefault)) {
            predicate = predicateOrDefault;
        } else {
            predicate = x => true;
            fallback = predicateOrDefault;
        }

        __assertFunction(predicate);

        const defaultVal: T = __getDefault(fallback);

        if (__isEmpty(<__Collection<T>>this)) {
            return defaultVal;
        }

        let result = originalFn.call(this, predicate);

        if (!result) {
            return defaultVal;
        }

        return result;
    }

    public elementAt(index: number): T {
        __assertIndexInRange(<__Collection<T>>this, index);

        return this.skip(index).first();
    }

    public take(count: number = 0): __Collection<T> {
        __assertNumeric(count);

        if (count <= 0) {
            return __Collection.empty;
        }

        const self = this;

        return new __Collection(function* () {
            let i: number = 0;
            for (let val of self) {
                yield val;

                if (++i === count) {
                    break;
                }
            }
        });
    }

    public skip(count: number = 0): __Collection<T> {
        __assertNumeric(count);

        if (count <= 0) {
            return <__Collection<T>>this;
        }

        return this.skipWhile((elem: T, index: number) => index < count);
    }

    public takeWhile(predicate: any = (elem: T, index: number) => true) {
        __assertFunction(predicate);

        const self = this;

        return new __Collection(function* () {
            let index: number = 0;

            for (let val of self) {
                if (predicate(val, index++)) {
                    yield val;
                } else {
                    break;
                }
            }
        });
    }

    public takeUntil(predicate = (elem: T, index: number) => false) {
        return this.takeWhile((elem: T, index: number) => !predicate(elem, index))
    }

    public skipWhile(predicate = (elem: T, index: number) => true) {
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

    public skipUntil(predicate = (elem: T, index: number) => false) {
        return this.skipWhile((elem: T, index: number) => !predicate(elem, index))
    }

    public first(predicate = (x: T) => true): T {
        __assertFunction(predicate);
        __assertNotEmpty(this);

        return (<Iterator<T>>this.skipWhile(elem => !predicate(elem))[Symbol.iterator]()).next().value;
    }

    public firstOrDefault<V>(predicateOrConstructor: ((e: T) => boolean) | T = (x: T) => true, constructor: V = <any>Object): T | V {
        return this.__resultOrDefault(this.first, predicateOrConstructor, <any>constructor);
    }

    public last(predicate = (x: any) => true): T {
        __assertFunction(predicate);
        __assertNotEmpty(this);

        return this.reverse().first(predicate);
    }

    public lastOrDefault<V>(predicateOrConstructor = (x: any) => true, constructor: V = <any>Object): T | V {
        return this.__resultOrDefault(this.last, predicateOrConstructor, constructor);
    }

    public single(predicate = (x: any) => true): T {
        __assertFunction(predicate);
        __assertNotEmpty(this);

        let index: number = 0;
        let result: T;

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

    public singleOrDefault<V>(predicateOrConstructor: any = (x: any) => true, constructor: V = <any>Object): T | V {
        return this.__resultOrDefault(this.single, predicateOrConstructor, constructor);
    }

    public defaultIfEmpty<V>(constructor: V): __Collection<T> | __Collection<V> {
        if (!__isEmpty(<__Collection<T>>this)) {
            return <__Collection<T>>this;
        }

        return new __Collection([<V>__getDefault(constructor)]);
    }

    //#endregion

    //#region Concatenation

    public concat(inner: Iterable<T>): __Collection<T> {
        __assertIterable(inner);

        const outer = <__Collection<T>>this;

        return new __Collection(function* () {
            yield* outer;
            yield* inner;
        });
    }

    public union(inner: Iterable<T>, equalityCompareFn: any = __defaultEqualityCompareFn): __Collection<T> {
        __assertIterable(inner);

        return this.concat(inner).distinct(equalityCompareFn);
    }

    public join<U, K, V>(inner: Iterable<U>, outerKeySelector: (e: T) => K, innerKeySelector: (e: U) => K, resultSelectorFn: (a: T, b: U) => V, keyEqualityCompareFn = __defaultEqualityCompareFn): __Collection<V> {
        __assertIterable(inner);
        __assertFunction(outerKeySelector);
        __assertFunction(innerKeySelector);
        __assertFunction(resultSelectorFn);
        __assertFunction(<Function>keyEqualityCompareFn);

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

    public except(inner: Iterable<T>): __Collection<T> {
        __assertIterable(inner);

        if (!__isCollection(inner)) {
            inner = new __Collection(inner);
        }

        const outer = this;

        return new __Collection(function* () {
            for (let val of outer) {
                if (!(<__Collection<T>>inner).contains(val)) {
                    yield val;
                }
            }
        });
    }

    public zip<U, V>(inner: Iterable<U>, resultSelectorFn: (a: T, b: U) => V): __Collection<V> {
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

    public intersect(inner: Iterable<T>, equalityCompareFn: any = __defaultEqualityCompareFn): __Collection<T> {
        __assertIterable(inner);
        __assertFunction(equalityCompareFn);

        const self = this;

        return new __Collection(function* () {
            const innerCollection = __Collection.from(inner);

            for (let val of self) {
                if (innerCollection.any((elem: any) => equalityCompareFn(val, elem))) {
                    yield val;
                }
            }
        })
    }

    //#endregion

    //#region Equality

    public sequenceEqual(second: Iterable<T>, equalityCompareFn: any = __defaultEqualityCompareFn): boolean {
        if (!__isIterable(second)) {
            return false;
        }

        const firstIterator: Iterator<T> = this[Symbol.iterator]();
        const secondIterator: Iterator<T> = second[Symbol.iterator]();
        let firstResult: IteratorResult<T>;
        let secondResult: IteratorResult<T>;
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
    private static __getEqualKey<V, T>(groupKeys: Map<V, T>, key: V, keyComparator: (a: V, b: V) => boolean): V {
        for (let groupKey of groupKeys.keys()) {
            if (keyComparator(groupKey, key)) {
                return groupKey;
            }
        }

        return key;
    }

    public groupBy<K>(keySelector: (e: T) => K, ...args: Array<Function>): any {

        const self = this;

        /**
         * Checks whether or not a function is a key comparator.
         * We need to differentiate between the key comparator and the result selector since both take two arguments.
         *
         * @param arg Function to be tested.
         * @return If the given function is a key comparator.
         */
        function isKeyComparator(arg: Function): arg is (a: K, b: K) => boolean {
            let result = __getParameterCount(arg) === 2;
            const first = self.first();

            try {
                const key = keySelector(first);

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
        function groupByOneArgument<K>(keySelector: (e: T) => K): Map<K, Array<T>> {
            return groupBy(keySelector, elem => elem, undefined, <(a: any, b: any) => boolean>__defaultEqualityCompareFn);
        }

        /*
         * GroupBy(keySelector, keyComparator)
         * GroupBy(keySelector, elementSelector)
         * GroupBy(keySelector, resultSelector)
         */
        function groupByTwoArguments<K>(keySelector: (e: T) => K, inner: Function): Map<K, any> {
            let keyComparator, elementSelector;

            if (isKeyComparator(inner)) {
                keyComparator = inner;
                elementSelector = (elem: any) => elem;
            } else {
                keyComparator = __defaultEqualityCompareFn;
                elementSelector = inner;
            }

            return groupByThreeArguments(keySelector, elementSelector, <Function>keyComparator);
        }

        /*
         * GroupBy(keySelector, resultSelector, keyComparator)
         * GroupBy(keySelector, elementSelector, keyComparator)
         * GroupBy(keySelector, elementSelector, resultSelector)
         */
        function groupByThreeArguments<K>(keySelector: (e: T) => K, inner: Function, third: Function): Map<K, any> {
            let keyComparator, elementSelector, resultSelector;

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
                elementSelector = (elem: any) => elem;
            }

            return groupBy(keySelector, <any>elementSelector, <any>resultSelector, <any>keyComparator);
        }

        /*
         * This is the "basic" function to use. The others just transform their parameters to be used with this one.
         */
        function groupBy<K, V>(keySelector: (e: T) => K, elementSelector: (e: T) => V, resultSelector: (key: K, groupValues: Array<T>) => V, keyComparator: (a: K, b: K) => boolean): any {
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
                } else {
                    groups.set(key, [elem]);
                }
            }

            if (resultSelector) {

                // If we want to select the final result with the resultSelector, we use the built-in Select function and retrieve a new Collection
                result = __Collection.from(groups).select((g: any) => (<Function>resultSelector)(...g));
            } else {

                // our result is just the groups -> return the Map
                result = groups;
            }

            return result;
        }

        // the outer parameter of GroupBy is always the keySelector, so we have to differentiate the following arguments
        // and select the appropriate function
        let fn: Function;
        switch (args.length) {
            case 0:
                fn = <Function>groupByOneArgument;
                break;
            case 1:
                fn = <Function>groupByTwoArguments;
                break;
            case 2:
                fn = <Function>groupByThreeArguments;
                break;
            case 3:
                fn = <Function>groupBy;
                break;
            default:
                throw new Error('GroupBy parameter count can not be greater than 4!');
        }

        return fn(keySelector, ...args);
    }

    public groupJoin<K, V>(inner: Iterable<T>, outerKeySelector: (e: T) => K, innerKeySelector: (e: T) => K, resultSelector: (key: K, values: BasicCollection<T>) => V, equalityCompareFn = __defaultEqualityCompareFn): __Collection<V> {
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

    public add(value: T): void {
        this.insert(value, this.count());
    }

    public insert(value: T, index: number): void {
        const oldValues = this.toArray();

        __assert(index >= 0 && index <= oldValues.length, 'Index is out of bounds!');

        this.__iterable = function* () {
            yield* oldValues.slice(0, index);
            yield value;
            yield* oldValues.slice(index, oldValues.length);
        };
    }

    public remove(value: T): boolean {
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

    public min(mapFn = (x: any) => x): number {
        __assertFunction(mapFn);
        __assertNotEmpty(this);

        return this.select(mapFn).aggregate((a: number, b: number) => a < b ? a : b);
    }

    public max(mapFn = (x: any) => x): number {
        __assertFunction(mapFn);
        __assertNotEmpty(this);

        return this.select(mapFn).aggregate((a: number, b: number) => a > b ? a : b);
    }

    public sum(mapFn = (x: any) => x): number {
        __assertNotEmpty(this);

        return this.select(mapFn).aggregate(0, (prev: any, curr: any) => prev + curr);
    }

    public average(mapFn = (x: any) => x): number {
        __assertNotEmpty(this);

        return this.sum(mapFn) / this.count();
    }

    //#endregion

    //#region Ordering

    public order(comparator: any = defaultComparator): OrderedCollection<T> {
        return this.orderBy((x: any) => x, comparator);
    }

    public orderDescending(comparator: any = defaultComparator): OrderedCollection<T> {
        return this.orderByDescending((x: any) => x, comparator);
    }

    public orderBy(keySelector: any, comparator = defaultComparator): OrderedCollection<T> {
        __assertFunction(<Function>comparator);

        return new __OrderedCollection(<__Collection<T>>this, __getComparatorFromKeySelector(keySelector, <(a: T, b: T) => number>comparator));
    }

    public orderByDescending(keySelector: any, comparator = defaultComparator): OrderedCollection<T> {
        return new __OrderedCollection(<__Collection<T>>this, __getComparatorFromKeySelector(keySelector, (a: any, b: any) => comparator(b, a)));
    }

    public shuffle(): __Collection<T> {
        return <any>this.orderBy(() => Math.floor(Math.random() * 3) - 1 /* Returns -1, 0 or 1 */);
    }

    //#endregioning

    //#region Search

    public indexOf(element: T, equalityCompareFn: any = __defaultEqualityCompareFn): number {
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

    public lastIndexOf(element: T, equalityCompareFn: any = __defaultEqualityCompareFn): number {
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

    public contains(elem: T, equalityCompareFn: any = __defaultEqualityCompareFn): boolean {
        return !!~this.indexOf(elem, equalityCompareFn);
    }

    public where(predicate = (elem: any, index: number) => true): __Collection<T> {
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

    public conditionalWhere(condition: boolean, predicate: any): __Collection<T> {
        if (condition) {
            return this.where(predicate);
        } else {
            return <__Collection<T>>this;
        }
    }

    public count(predicate = (elem: any) => true): number {
        let count = 0;
        let filtered = this.where(predicate);

        let iterator = filtered[Symbol.iterator]();
        while (!iterator.next().done) {
            count++;
        }

        return count;
    }

    public any(predicate: any = null): boolean {
        if (__isEmpty(<__Collection<T>>this)) {
            return false;
        }

        if (!predicate) {

            // since we checked before that the sequence is not empty
            return true;
        }

        return !this.where(predicate)[Symbol.iterator]().next().done;
    }

    public all(predicate: ((e: T) => boolean) = elem => true): boolean {
        __assertFunction(predicate);

        // All is equal to the question if there's no element which does not match the predicate
        // 'all fruits are yellow' -> 'there is no fruit which is not yellow'
        return !this.any((x: any) => !predicate(x));
    }

    //#endregion

    //#region Transformation

    public aggregate(seedOrAccumulator: any, accumulator: any = null, resultTransformFn: any = null): any {
        if (__isFunction(seedOrAccumulator) && !accumulator && !resultTransformFn) {
            return __aggregateCollection(this.skip(1), this.first(), seedOrAccumulator, (elem: any) => elem);
        } else if (!__isFunction(seedOrAccumulator) && __isFunction(accumulator) && !resultTransformFn) {
            return __aggregateCollection(<__Collection<T>>this, seedOrAccumulator, accumulator, (elem: any) => elem);
        } else {
            return __aggregateCollection(<__Collection<T>>this, seedOrAccumulator, accumulator, resultTransformFn);
        }
    }

    public select(mapFn: any = (x: any) => x): __Collection<any> {
        const self = this;

        let index = 0;

        return new __Collection(function* () {
            for (let val of self) {
                yield mapFn(val, index);
                index++;
            }
        });
    }

    public flatten(): __Collection<any> {
        return this.selectMany((x: any) => x);
    }

    public selectMany(mapFn: any, resultSelector = (x: any, y: any) => y): __Collection<any> {
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
                } else {
                    newIterable = mappedEntry;
                }

                for (let val of newIterable[Symbol.iterator]()) {
                    yield resultSelector(current, val);
                }

                index++;
            }
        });
    }

    public distinct(equalityCompareFn: any = __defaultEqualityCompareFn): __Collection<T> {
        __assertFunction(equalityCompareFn);

        return __removeDuplicates(<__Collection<T>>this, equalityCompareFn);
    }

    public toArray(): Array<T> {
        return [...this];
    }

    public toDictionary(keySelector: any, elementSelectorOrKeyComparator: any = null, keyComparator: any = null): Map<any, any> {
        __assertFunction(keySelector);

        if (!elementSelectorOrKeyComparator && !keyComparator) {

            // ToDictionary(keySelector)
            return this.toDictionary(keySelector, (elem: any) => elem, __defaultEqualityCompareFn);
        } else if (!keyComparator && __getParameterCount(elementSelectorOrKeyComparator) === 1) {

            // ToDictionary(keySelector, elementSelector)
            return this.toDictionary(keySelector, elementSelectorOrKeyComparator, __defaultEqualityCompareFn);
        } else if (!keyComparator && __getParameterCount(elementSelectorOrKeyComparator) === 2) {

            // ToDictionary(keySelector, keyComparator)
            return this.toDictionary(keySelector, (elem: any) => elem, elementSelectorOrKeyComparator);
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
            __assert(!__Collection.from(usedKeys).any((x: any) => keyComparator(x, key)), `Key '${key}' is already in use!`);

            usedKeys.push(key);
            result.set(key, elem);
        }

        return result;
    }

    public toLookup(keySelector: any, elementSelectorOrKeyComparator: any = null, keyComparator: any = null): Map<any, Array<any>> {
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


    public reverse(): __Collection<T> {
        const arr = this.toArray();

        return new __Collection(function* () {
            for (let i = arr.length - 1; i >= 0; i--) {
                yield arr[i];
            }
        });
    }

    public forEach(fn: (e: T) => void): void {
        __assertFunction(fn);

        for (let val of this) {
            fn(val);
        }
    }

    //#endregion

    //#region Static

    public static from<T>(iterable: Iterable<T>): __Collection<T> {
        return new __Collection(iterable);
    }

    public static range(start: number, count: number): __Collection<number> {
        __assertNumberBetween(count, 0, Infinity);

        return new __Collection(function* () {
            let i = start;
            while (i != count + start) {
                yield i++;
            }
        });
    }

    public static repeat<T>(val: T, count: number): __Collection<T> {
        __assertNumberBetween(count, 0, Infinity);

        return new __Collection(function* () {
            for (let i = 0; i < count; i++) {
                yield val;
            }
        });
    }

    public static get empty(): __Collection<any> {
        return new __Collection([]);
    }

    //#endregion
}
