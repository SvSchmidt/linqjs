import {__isEmpty, __isFunction, __isGenerator, __isIterable, __isPredicate} from "./helper/is";
import {
    __assert, __assertFunction, __assertIndexInRange, __assertIterable, __assertNotEmpty,
    __assertNumeric
} from "./helper/assert";
import {__getDefault, __isNative, __removeFromArray} from "./helper/utils";
import {__defaultEqualityCompareFn} from "./helper/default";

/**
 * Collection - Represents a collection of iterable values
 *
 * @class
 * @param  {Iterable|GeneratorFunction} iterableOrGenerator A iterable to create a collection of, e.g. an array or a generator function
 */
export class Collection<T> implements Iterable<T> {

    //#region Constructor

    public constructor(iterableOrGenerator: Iterable<T> | (() => Iterator<T>)) {
        __assert(__isIterable(iterableOrGenerator) || __isGenerator(iterableOrGenerator), 'Parameter must be iterable or generator!');
        this.__iterable = iterableOrGenerator;
    }

    //#endregion

    //#region Iterable

    private __iterable: Iterable<T> | (() => Iterator<T>) = null;

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

    private __resultOrDefault(originalFn: (p: ((v: T) => boolean)) => T, predicateOrDefault: ((v: T) => boolean) | T = x => true, fallback: T = <any>Object): T {
        let predicate: (v: T) => boolean;

        if (__isPredicate(predicateOrDefault)) {
            predicate = predicateOrDefault;
        } else {
            predicate = x => true;
            fallback = predicateOrDefault;
        }

        __assertFunction(predicate);

        const defaultVal: T = __getDefault(fallback);

        if (__isEmpty(this)) {
            return defaultVal;
        }

        let result = originalFn.call(this, predicate);

        if (!result) {
            return defaultVal;
        }

        return result;
    }

    /**
     *  ElementAt - Returns the element at the given index
     *
     * @see https://msdn.microsoft.com/de-de/library/bb299233(v=vs.110).aspx
     * @param {number} index
     * @returns {T} The element at the given index
     */
    public ElementAt(index: number): T {
        __assertIndexInRange(this, index);

        return this.Skip(index).Take(1).ToArray()[0];
    }

    /**
     * Take - Returns count elements of the sequence starting from the beginning as a new Collection
     *
     * @see https://msdn.microsoft.com/de-de/library/bb503062(v=vs.110).aspx
     * @param  {Number} count = 0 number of elements to be returned
     * @return {Collection}
     */
    public Take(count: number = 0): Collection<T> {
        __assertNumeric(count);

        if (count <= 0) {
            return Collection.Empty;
        }

        const self: this = this;

        return new Collection(function* () {
            let i: number = 0;
            for (let val of self) {
                yield val;

                if (++i === count) {
                    break;
                }
            }
        });
    }

    /**
     * Skip - Skips count elements of the sequence and returns the remaining sequence
     *
     * @see https://msdn.microsoft.com/de-de/library/bb358985(v=vs.110).aspx
     * @param  {Number} count=0 amount of elements to skip
     * @return {Collection}
     */
    public Skip(count: number = 0): Collection<T> {
        __assertNumeric(count);

        if (count <= 0) {
            return this;
        }

        return this.SkipWhile((elem, index) => index < count);
    }

    /**
     * TakeWhile - Takes elements from the beginning of a sequence while the predicate yields true
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.takewhile(v=vs.110).aspx
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
     */
    public TakeWhile(predicate: (elem: T) => boolean): Collection<T>;

    /**
     * TakeWhile - Takes elements from the beginning of a sequence while the predicate yields true. The index of the element can be used in the logic of the predicate function.
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.takewhile(v=vs.110).aspx
     * @param  {Function} predicate The predicate of the form (elem, index) => boolean
     * @return {Collection}
     */
    public TakeWhile(predicate: (elem: T, index: number) => boolean): Collection<T>;
    public TakeWhile(predicate: Function = (elem: T, index: number) => true): Collection<T> {
        __assertFunction(predicate);

        const self: this = this;

        return new Collection(function* () {
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

    /**
     * TakeUntil - Takes elements from the beginning of a sequence until the predicate yields true. TakeUntil behaves like calling TakeWhile with a negated predicate.
     *
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
     */
    public TakeUntil(predicate: (elem: T) => boolean): Collection<T>;
    /**
     * TakeUntil - Takes elements from the beginning of a sequence until the predicate yields true. The index of the element can be used in the logic of the predicate function.
     * TakeUntil behaves like calling TakeWhile with a negated predicate.
     *
     * @param  {Function} predicate The predicate of the form (elem, index) => boolean
     * @return {Collection}
     */
    public TakeUntil(predicate: (elem: T, index: number) => boolean): Collection<T>;
    public TakeUntil(predicate: Function = (elem: T, index: number) => false): Collection<T> {
        return this.TakeWhile((elem: T, index: number) => !predicate(elem, index))
    }

    /**
     * SkipWhile - Skips elements in the sequence while the predicate yields true and returns the remaining sequence
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.skipwhile(v=vs.110).aspx
     * @example
     const numbers = [1, 3, 7, 9, 12, 13, 14, 15]

     numbers.SkipWhile(x => x % 2 === 1).ToArray()
     // -> [12, 13, 14, 15]
     * @param  {type} predicate The predicate of the form elem => boolean
     * @return {Collection}
     */
    public SkipWhile(predicate: (elem: T) => boolean): Collection<T>;
    /**
     * SkipWhile - Skips elements in the sequence while the predicate yields true and returns the remaining sequence. The index of the element
     * can be used in the logic of the predicate function.
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.skipwhile(v=vs.110).aspx
     * @param  {type} predicate The predicate of the form (elem, index) => boolean
     * @return {Collection}
     */
    public SkipWhile(predicate: (elem: T, index: number) => boolean): Collection<T>;
    public SkipWhile(predicate: Function = (elem: T, index: number) => true): Collection<T> {
        __assertFunction(predicate);

        const self: this = this;

        return new Collection(function* () {
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

    /**
     * SkipUntil - Skips elements from the beginning of a sequence until the predicate yields true. SkipUntil behaves like calling SkipWhile with a negated predicate.
     *
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
     */
    public SkipUntil(predicate: (elem: T) => boolean): Collection<T>;
    /**
     * SkipUntil - Takes elements from the beginning of a sequence until the predicate yields true. The index of the element can be used in the logic of the predicate function.
     * SkipUntil behaves like calling SkipWhile with a negated predicate.
     *
     * @param  {Function} predicate The predicate of the form (elem, index) => boolean
     * @return {Collection}
     */
    public SkipUntil(predicate: (elem: T, index: number) => boolean): Collection<T>;
    public SkipUntil(predicate: Function = (elem: T, index: number) => false): Collection<T> {
        return this.SkipWhile((elem: T, index: number) => !predicate(elem, index))
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
     */
    public First(): T;
    /**
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
    public First(predicate: (v: T) => boolean): T;
    public First(predicate: Function = (x: T) => true): T {
        __assertFunction(predicate);
        __assertNotEmpty(this);

        return this.SkipWhile(elem => !predicate(elem)).Take(1).ToArray()[0];
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
     */
    public FirstOrDefault(): T | null;
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
     */
    public FirstOrDefault<V>(constructor: V): T | V;
    /**
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
    public FirstOrDefault<V>(predicate: (e: T) => boolean, constructor: V): T | V;
    public FirstOrDefault<V>(predicateOrConstructor: ((e: T) => boolean) | T = (x: T) => true, constructor: V = <any>Object): T | V {
        return this.__resultOrDefault(this.First, predicateOrConstructor, <any>constructor);
    }

    /**
     * Last - Returns the last element in a sequence
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.last(v=vs.110).aspx
     * @throws Will throw an error if the sequence is empty
     * @example
     [1, 2, 3].Last()
     // -> 3
     * @return {any}
     */
    public Last(): T;
    /**
     * Last - Returns the last element in a sequence that matches the given predicate
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.last(v=vs.110).aspx
     * @throws Will throw an error if the sequence is empty
     * @param  {Function} predicate The predicate of the form elem => Boolean
     * @example
     [1, 2, 3, 4].Last(x => x % 2 === 0)
     // -> 4
     * @return {any}
     */
    public Last(predicate: (e: T) => boolean): T;
    public Last(predicate: Function = x => true): T {
        __assertFunction(predicate);
        __assertNotEmpty(this);

        return this.Reverse().First(predicate);
    }

    /**
     * LastOrDefault - Returns the last element in a sequence or a default value if the sequence is empty.
     * The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...)
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.lastordefault(v=vs.110).aspx
     * @example
     [].FirstOrDefault()
     // -> null
     [].FirstOrDefault(Number)
     // -> 0
     * @return {any}
     */
    public LastOrDefault(): T | null;
    /**
     * LastOrDefault - Returns the last element in a sequence or a default value if the sequence is empty.
     * The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...)
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.lastordefault(v=vs.110).aspx
     * @example
     [].FirstOrDefault()
     // -> null
     [].FirstOrDefault(Number)
     // -> 0
     * @return {any}
     */
    public LastOrDefault<V>(constructor: V): T | V;
    /**
     * LastOrDefault - Returns the last element in a sequence that matches the predicate or a default value if no such element is found.
     * The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...)
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.lastordefault(v=vs.110).aspx
     * @param  {Function} predicate The predicate of the form elem => Boolean
     * @example
     [1, 2, 3].LastOrDefault(x => x > 5)
     // -> null
     [1, 2, 3].LastOrDefault(x => x > 5, 6)
     // -> 6
     * @return {any}
     */
    public LastOrDefault<V>(predicate: (e: T) => boolean, constructor: V): T | V;
    public LastOrDefault<V>(predicateOrConstructor: Function | V = x => true, constructor: V = Object): T | V {
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
     */
    public Single(): T;
    /**
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
    public Single(predicate = (e: T) => boolean): T;
    public Single(predicate: Function = x => true): T {
        __assertFunction(predicate);
        __assertNotEmpty(this);

        let index: number = 0;
        let result: T;

        for (let val of this.__getIterator()) {
            if (predicate(val)) {
                result = val;
                break;
            }

            index++;
        }

        if (this.First(elem => predicate(elem) && !defaultEqualityCompareFn(elem, result))) {
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
     */
    public SingleOrDefault(): T | null;
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
     */
    public SingleOrDefault<V>(constructor: V): T | V;
    /**
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
    public SingleOrDefault<V>(predicate: (e: T) => boolean, constructor: V): T | V;
    public SingleOrDefault<V>(predicateOrConstructor: Function | V = x => true, constructor: V = Object): T | V {
        return resultOrDefault(this, Single, predicateOrConstructor, constructor);
    }

    /**
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
    public DefaultIfEmpty<V>(constructor: V): this | Collection<V> {
        if (!isEmpty(this)) {
            return this
        }

        return [getDefault(constructor)]
    }

    //#endregion

    //#region Concatenation

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
    public Concat(inner: Iterable<T>): Collection<T> {
        __assertIterable(inner);

        const outer = this;

        return new Collection(function* () {
            yield* outer.getIterator();
            yield* inner;
        });
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
     */
    public Union(inner: Iterable<T>): Collection<T>;
    /**
     * Union - Concatenates two sequences and removes duplicate values (produces the set union).
     * A custom equality comparator is used to compare values for equality.
     *
     * @method
     * @memberof Collection
     * @instance
     * @param {Function} equalityCompareFn A function of the form (first, second) => Boolean to determine whether or not two values are considered equal
     * @return {Number}
     */
    public Union(inner: Iterable<T>, equalityCompareFn: (a: T, b: T) => boolean): Collection<T>;
    public Union(inner: Iterable<T>, equalityCompareFn: Function = defaultEqualityCompareFn): Collection<T> {
        __assertIterable(inner);

        return this.Concat(inner).Distinct(equalityCompareFn);
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
    public Join<U, K, V>(inner: Iterable<U>, outerKeySelector: (e: T) => K, innerKeySelector: (e: U) => K, resultSelectorFn: (a: T, b: U) => V): Collection<V>;
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
    public Join<U, K, V>(inner: Iterable<U>, outerKeySelector: (e: T) => K, innerKeySelector: (e: U) => K, resultSelectorFn: (a: T, b: U) => V, keyEqualityCompareFn: (a: K, b: K) => boolean): Collection<V>;
    public Join<U, K, V>(inner: Iterable<U>, outerKeySelector: (e: T) => K, innerKeySelector: (e: U) => K, resultSelectorFn: (a: T, b: U) => V, keyEqualityCompareFn: Function = __defaultEqualityCompareFn): Collection<V> {
        __assertIterable(inner);
        __assertFunction(outerKeySelector);
        __assertFunction(innerKeySelector);
        __assertFunction(resultSelectorFn);
        __assertFunction(keyEqualityCompareFn);

        const outer = this;

        return new Collection(function* () {
            for (let outerValue of outer.getIterator()) {
                const outerKey = outerKeySelector(outerValue);

                for (let innerValue of inner[Symbol.iterator]()) {
                    const innerKey = innerKeySelector(innerValue);

                    if (keyEqualityCompareFn(outerKey, innerKey)) {
                        yield resultSelectorFn(outerValue, innerValue);
                    }
                }
            }
        });
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
    public Except(inner: Iterable<T>): Collection<T> {
        __assertIterable(inner);

        if (!isCollection(inner)) {
            inner = new Collection(inner);
        }

        const outer = this;

        return new Collection(function* () {
            for (let val of outer.getIterator()) {
                if (!inner.Contains(val)) {
                    yield val;
                }
            }
        });
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
    public Zip<U, V>(inner: Iterable<U>, resultSelectorFn: (a: T, b: U) => V): Collection<V> {
        __assertIterable(inner);
        __assertFunction(resultSelectorFn);

        const outer = this;

        return new Collection(function* () {
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
     */
    public Intersect(inner: Iterable<T>): Collection<T>;
    /**
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
    public Intersect(inner: Iterable<T>, equalityCompareFn: (a: T, b: T) => boolean): Collection<T>;
    public Intersect(inner: Iterable<T>, equalityCompareFn: Function = defaultEqualityCompareFn): Collection<T> {
        __assertIterable(inner);
        __assertFunction(equalityCompareFn);

        return new Collection(function* () {
            const innerIter = [...inner];

            for (let val of this) {
                if (innerIter.Any(elem => equalityCompareFn(val, elem))) {
                    yield val;
                }
            }
        })
    }

    //#endregion

    //#region Equality

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
     */
    public SequenceEqual(second: Iterable<T>): boolean;
    /**
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
    public SequenceEqual(second: Iterable<T>, equalityCompareFn: (a: T, b: T) => boolean): boolean;
    public SequenceEqual(second: Iterable<T>, equalityCompareFn: Function = defaultEqualityCompareFn): boolean {
        if (!isIterable(second)) {
            return false;
        }

        const first = this.ToArray();
        second = second.ToArray();

        if (first.length !== second.length) {
            return false;
        }

        for (let i = 0; i < first.length; i++) {
            let firstVal = first[i];
            let secondVal = second[i];

            if (!equalityCompareFn(firstVal, secondVal)) {
                return false;
            }
        }

        return true;
    }

    //#endregion

    //#region Grouping

    /**
     * __getEqualKey - Get the matching key in the group for a given key and a keyComparer or return the parameter itself if the key is not present yet
     */
    private __getEqualKey<V>(groups: Map<V, T>, key: V, keyComparer: (a: V, b: V) => boolean): V {
        for (let groupKey of groups.keys()) {
            if (keyComparer(groupKey, key)) {
                return groupKey;
            }
        }

        return key;
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
     */
    public GroupBy<V>(keySelector: (e: T) => V): Map<V, Array<T>>;

    /**
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
     */
    public GroupBy<V>(keySelector: (e: T) => V, keyComparer: (a: V, b: V) => boolean): Map<V, Array<T>>;

    /**
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
     */
    public GroupBy<K, V>(keySelector: (e: T) => K, elementSelector: (e: T) => V): Map<K, Array<V>>;

    /**
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
     */
    public GroupBy<K, V>(keySelector: (e: T) => K, resultSelector: (key: K, groupValues: Array<T>) => V): Map<K, V>;

    /**
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
     */
    public GroupBy<K, V>(keySelector: (e: T) => K, resultSelector: (key: K, groupValues: Array<T>) => V, keyComparer: (a: K, b: K) => boolean): Map<K, V>;

    /**
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
     */
    public GroupBy<K, V>(keySelector: (e: T) => K, elementSelector: (e: T) => V, keyComparer: (a: K, b: K) => boolean): Map<K, Array<V>>;

    /**
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
     */
    public GroupBy<K, V>(keySelector: (e: T) => K, elementSelector: (e: T) => V, resultSelector: (key: K, groupValues: Array<T>) => V): Map<K, V>;

    /**
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
    public GroupBy<K, V>(keySelector: (e: T) => K, elementSelector: (e: T) => V, resultSelector: (key: K, groupValues: Array<T>) => V, keyComparer: (a: K, b: K) => boolean): Map<K, V>;
    public GroupBy<K>(keySelector: (e: T) => K, ...args: Array<Function>): Map<K, any> {

        /**
         * isKeyComparer - Checks whether or not a function is a keyComparer. We need to differentiate between the keyComparer and the resultSelector
         * since both take two arguments.
         */
        function isKeyComparer(arg: Function): arg is (a: K, b: K) => boolean {
            let result = getParameterCount(arg) === 2;
            try {
                // if this is a key comparer, it must return truthy values for equal values and falsy ones if they're different
                result = result && arg(1, 1) && !arg(1, 2);
            } catch (err) {
                // if the function throws an error for values, it can't be a keyComparer
                result = false;
            }

            return result;
        }

        /*
        GroupBy(keySelector)
        */
        function groupByOneArgument<K>(keySelector: (e: T) => K): Map<K, Array<T>> {
            return groupBy(keySelector, elem => elem, undefined, defaultEqualityCompareFn);
        }

        /*
        GroupBy(keySelector, keyComparer)
        GroupBy(keySelector, elementSelector)
        GroupBy(keySelector, resultSelector)
        */
        function groupByTwoArguments<K>(keySelector: (e: T) => K, inner: Function): Map<K, any> {
            let keyComparer, elementSelector;

            if (isKeyComparer(inner)) {
                keyComparer = inner;
                elementSelector = elem => elem;
            } else {
                keyComparer = defaultEqualityCompareFn;
                elementSelector = inner;
            }

            return groupByThreeArguments(keySelector, elementSelector, keyComparer);
        }

        /*
        GroupBy(keySelector, resultSelector, keyComparer)
        GroupBy(keySelector, elementSelector, keyComparer)
        GroupBy(keySelector, elementSelector, resultSelector)
        */
        function groupByThreeArguments<K>(keySelector: (e: T) => K, inner: Function, third: Function): Map<K, any> {
            let keyComparer, elementSelector, resultSelector;

            if (isKeyComparer(third)) {
                keyComparer = third;
            } else {
                resultSelector = third;
            }

            if (getParameterCount(inner) === 2) {
                resultSelector = inner;
            } else {
                elementSelector = inner;
            }

            if (!keyComparer) {
                keyComparer = defaultEqualityCompareFn;
            }

            if (!elementSelector) {
                elementSelector = elem => elem;
            }

            return groupBy(keySelector, elementSelector, resultSelector, keyComparer);
        }

        /**
         * This is the "basic" function to use. The others just transform their parameters to be used with this one.
         */
        function groupBy<k, V>(keySelector: (e: T) => K, elementSelector: (e: T) => V, resultSelector: (key: K, groupValues: Array<T>) => V, keyComparer: (a: K, b: K) => boolean): Map<K, V> {
            __assertFunction(keySelector);
            __assertFunction(elementSelector);
            __assert(isUndefined(resultSelector) || isFunction(resultSelector), 'resultSelector must be undefined or function!');
            __assertFunction(keyComparer);

            let groups = new Map();
            let result;

            for (let val of this) {
                // Instead of checking groups.has we use our custom function since we want to treat some keys as equal even if they aren't for the Map
                const key = this.__getEqualKey(groups, keySelector(val), keyComparer);
                const elem = elementSelector(val);

                if (groups.has(key)) {
                    groups.get(key).push(elem);
                } else {
                    groups.set(key, [elem]);
                }
            }

            if (resultSelector) {
                // If we want to select the final result with the resultSelector, we use the built-in Select function and retrieve a new Collection
                result = groups.ToArray().Select(g => resultSelector(...g));
            } else {
                // our result is just the grouos -> return the Map
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
     */
    public GroupJoin<K, V>(inner: Iterable<T>, outerKeySelector: (e: T) => K, innerKeySelector: (e: T) => K, resultSelector: (key: K, values: Array<T>) => V): Collection<V>;

    /**
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
    public GroupJoin<K, V>(inner: Iterable<T>, outerKeySelector: (e: T) => K, innerKeySelector: (e: T) => K, resultSelector: (key: K, values: Array<T>) => V, keyComparer: (a: K, b: k) => boolean): Collection<V>;
    public GroupJoin<K, V>(inner: Iterable<T>, outerKeySelector: (e: T) => K, innerKeySelector: (e: T) => K, resultSelector: (key: K, values: Array<T>) => V, equalityCompareFn: Function = defaultEqualityCompareFn): Collection<V> {
        __assertIterable(inner);
        __assertFunction(outerKeySelector);
        __assertFunction(innerKeySelector);
        __assertFunction(resultSelector);

        let groups = new Map();
        const outer = this;

        for (let outerVal of outer.getIterator()) {
            const outerKey = outerKeySelector(outerVal);

            groups.set(outerVal, new Collection(function* () {
                for (let innerVal of inner[Symbol.iterator]()) {
                    if (equalityCompareFn(outerKey, innerKeySelector(innerVal))) {
                        yield innerVal;
                    }
                }
            }));
        }

        return new Collection(function* () {
            for (let [key, values] of groups) {
                yield resultSelector(key, values.ToArray());
            }
        });
    }

    //#endregion

    //#region Insert & Remove

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
    public Add(value: T): void {
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
    public Insert(value: T, index: number): void {
        __assert(index >= 0 && index <= this.Count(), 'Index is out of bounds!');

        const oldIter = this.ToArray();

        this.iterable = function* () {
            yield* oldIter.slice(0, index);
            yield value;
            yield* oldIter.slice(index, oldIter.length);
        };
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
    public Remove(value: T): boolean {
        let values = this.ToArray();
        const result = __removeFromArray(values, value);

        if (!result) {
            return false;
        }

        this.iterable = function* () {
            yield* values;
        };

        return true;
    }

    //#endregion

    //#region Math

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
     */
    public Min(): number;
    /**
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
    public Min(mapFn: (x: T) => number): number;
    public Min(mapFn: Function = x => x): number {
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
     */
    public Max(): number;
    /**
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
    public Max(mapFn: (x: T) => number): number;
    public Max(mapFn: Function = x => x): number {
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
     */
    public Sum(): number;
    /**
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
    public Sum(mapFn: (x: T) => number): number;
    public Sum(mapFn: Function = x => x): number {
        __assertNotEmpty(this);

        return this.Select(mapFn).Aggregate(0, (prev, curr) => prev + curr);
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
     */
    public Average(): number;
    /**
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
    public Average(mapFn: (x: T) => number): number;
    public Average(mapFn: Function = x => x): number {
        __assertNotEmpty(this);

        return this.Sum(mapFn) / this.Count();
    }

    //#endregion


}