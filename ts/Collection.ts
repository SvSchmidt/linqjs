import {__isEmpty, __isFunction, __isGenerator, __isIterable, __isPredicate} from "./helper/is";
import {__assert, __assertFunction, __assertIndexInRange, __assertNotEmpty, __assertNumeric} from "./helper/assert";
import {__getDefault, __isNative} from "./helper/utils";

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
    public ElementAt (index: number): T {
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
    public Take (count: number = 0): Collection<T> {
        __assertNumeric(count);

        if (count <= 0) {
            return Collection.Empty;
        }

        const self: this = this;

        return new Collection(function * () {
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
    public Skip (count: number = 0): Collection<T> {
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
    public  TakeWhile (predicate: (elem: T) => boolean): Collection<T>;

    /**
     * TakeWhile - Takes elements from the beginning of a sequence while the predicate yields true. The index of the element can be used in the logic of the predicate function.
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.takewhile(v=vs.110).aspx
     * @param  {Function} predicate The predicate of the form (elem, index) => boolean
     * @return {Collection}
     */
    public  TakeWhile (predicate: (elem: T, index: number) => boolean): Collection<T>;
    public  TakeWhile (predicate: Function = (elem: T, index: number) => true): Collection<T> {
        __assertFunction(predicate);

        const self: this = this;

        return new Collection(function * () {
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
    public  TakeUntil (predicate: (elem: T) => boolean): Collection<T>;
     /**
     * TakeUntil - Takes elements from the beginning of a sequence until the predicate yields true. The index of the element can be used in the logic of the predicate function.
     * TakeUntil behaves like calling TakeWhile with a negated predicate.
     *
     * @param  {Function} predicate The predicate of the form (elem, index) => boolean
     * @return {Collection}
     */
     public  TakeUntil (predicate: (elem: T, index: number) => boolean): Collection<T>;
     public  TakeUntil (predicate: Function = (elem: T, index: number) => false): Collection<T> {
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
    public SkipWhile (predicate: (elem: T) => boolean): Collection<T>;
     /**
     * SkipWhile - Skips elements in the sequence while the predicate yields true and returns the remaining sequence. The index of the element
     * can be used in the logic of the predicate function.
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.skipwhile(v=vs.110).aspx
     * @param  {type} predicate The predicate of the form (elem, index) => boolean
     * @return {Collection}
     */
     public SkipWhile (predicate: (elem: T, index: number) => boolean): Collection<T>;
    public SkipWhile (predicate: Function = (elem: T, index: number) => true): Collection<T> {
        __assertFunction(predicate);

        const self: this = this;

        return new Collection(function * () {
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
    public SkipUntil (predicate: (elem: T) => boolean): Collection<T>;
     /**
     * SkipUntil - Takes elements from the beginning of a sequence until the predicate yields true. The index of the element can be used in the logic of the predicate function.
     * SkipUntil behaves like calling SkipWhile with a negated predicate.
     *
     * @param  {Function} predicate The predicate of the form (elem, index) => boolean
     * @return {Collection}
     */
     public SkipUntil (predicate: (elem: T, index: number) => boolean): Collection<T>;
    public SkipUntil (predicate: Function = (elem: T, index: number) => false):Collection<T> {
        return this.SkipWhile((elem:T, index: number) => !predicate(elem, index))
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
    public First (): T;
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
    public First (predicate: (v: T) => boolean): T;
    public First (predicate: Function = (x: T) => true): T {
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
    public FirstOrDefault<V> (constructor: V): T | V;
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
    public FirstOrDefault<V> (predicate: (e: T) => boolean, constructor: V): T | V;
    public FirstOrDefault<V> (predicateOrConstructor: ((e: T) => boolean) | T = (x: T) => true, constructor: V = <any>Object): T | V {
        return this.__resultOrDefault(this.First, predicateOrConstructor, <any>constructor);
    }

    // TODO @gerriet-hinrichs

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
     *//**
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
    function Last (predicate = x => true) {
        __assertFunction(predicate)
        __assertNotEmpty(this)

        return this.Reverse().First(predicate)
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
     *//**
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
    function LastOrDefault (predicateOrConstructor = x => true, constructor = Object) {
        return resultOrDefault(this, Last, predicateOrConstructor, constructor)
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
     *//**
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
    function Single (predicate = x => true) {
        __assertFunction(predicate)
        __assertNotEmpty(this)

        let index = 0
        let result

        for (let val of this.__getIterator()) {
            if (predicate(val)) {
                result = val
                break
            }

            index++
        }

        if (this.First(elem => predicate(elem) && !defaultEqualityCompareFn(elem, result))) {
            throw new Error('Sequence contains more than one element')
        }

        return result
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
     *//**
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
    function SingleOrDefault (predicateOrConstructor = x => true, constructor = Object) {
        return resultOrDefault(this, Single, predicateOrConstructor, constructor)
    }

    /**
     * DefaultIfEmpty - Returns a new sequence containing the provided constructors default if the sequence is empty or the sequence itself if not
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.defaultifempty(v=vs.110).aspx
     * @method
     * @memberof Collection
     * @instance
     * @variation (constructor)
     * @param {Function} constructor A native constructor to get the default for, e.g. Number
     * @return {Collection}
     *//**
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
    function DefaultIfEmpty (constructorOrValue) {
        if (!isEmpty(this)) {
            return this
        }

        return [getDefault(constructorOrValue)]
    }

    //#endregion
}