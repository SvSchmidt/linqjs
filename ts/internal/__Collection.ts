class __Collection<T> implements Collection<T> {

    //#region Constructor

    public constructor(iterableOrGenerator: Iterable<T> | (() => Iterator<T>)) {
        __assert(__isIterable(iterableOrGenerator) || __isGenerator(iterableOrGenerator), 'Parameter must be iterable or generator!');
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

        if (__isEmpty(this)) {
            return defaultVal;
        }

        let result = originalFn.call(this, predicate);

        if (!result) {
            return defaultVal;
        }

        return result;
    }

    public ElementAt(index: number): T {
        __assertIndexInRange(this, index);

        return this.Skip(index).Take(1).ToArray()[0];
    }

    public Take(count: number = 0): Collection<T> {
        __assertNumeric(count);

        if (count <= 0) {
            return __Collection.Empty;
        }

        const self: this = this;

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

    public Skip(count: number = 0): Collection<T> {
        __assertNumeric(count);

        if (count <= 0) {
            return this;
        }

        return this.SkipWhile((elem: T, index: number) => index < count);
    }

    public TakeWhile(predicate: any = (elem: T, index: number) => true) {
        __assertFunction(predicate);

        const self: this = this;

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

    public TakeUntil(predicate = (elem: T, index: number) => false) {
        return this.TakeWhile((elem: T, index: number) => !predicate(elem, index))
    }

    public SkipWhile(predicate = (elem: T, index: number) => true) {
        __assertFunction(predicate);

        const self: this = this;

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

    public SkipUntil(predicate = (elem: T, index: number) => false) {
        return this.SkipWhile((elem: T, index: number) => !predicate(elem, index))
    }

    public First(predicate = (x: T) => true): T {
        __assertFunction(predicate);
        __assertNotEmpty(this);

        return this.SkipWhile(elem => !predicate(elem)).Take(1).ToArray()[0];
    }

    public FirstOrDefault<V>(predicateOrConstructor: ((e: T) => boolean) | T = (x: T) => true, constructor: V = <any>Object): T | V {
        return this.__resultOrDefault(this.First, predicateOrConstructor, <any>constructor);
    }

    public Last(predicate = (x: any) => true): T {
        __assertFunction(predicate);
        __assertNotEmpty(this);

        return this.Reverse().First(predicate);
    }

    public LastOrDefault<V>(predicateOrConstructor = (x: any) => true, constructor: V = <any>Object): T | V {
        return this.__resultOrDefault(this.Last, predicateOrConstructor, constructor);
    }

    public Single(predicate = (x: any) => true): T {
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

        if (this.First(elem => predicate(elem) && !__defaultEqualityCompareFn(elem, result))) {
            throw new Error('Sequence contains more than one element');
        }

        return result;
    }

    public SingleOrDefault<V>(predicateOrConstructor: any = (x: any) => true, constructor: V = <any>Object): T | V {
        return this.__resultOrDefault(this.Single, predicateOrConstructor, constructor);
    }

    public DefaultIfEmpty<V>(constructor: V): this | Collection<V> {
        if (!__isEmpty(this)) {
            return this;
        }

        return new __Collection([__getDefault(constructor)]);
    }

    //#endregion

    //#region Concatenation

    public Concat(inner: Iterable<T>): Collection<T> {
        __assertIterable(inner);

        const outer = this;

        return new __Collection(function* () {
            yield* outer;
            yield* inner;
        });
    }

    public Union(inner: Iterable<T>, equalityCompareFn: any = __defaultEqualityCompareFn): Collection<T> {
        __assertIterable(inner);

        return this.Concat(inner).Distinct(equalityCompareFn);
    }

    public Join<U, K, V>(inner: Iterable<U>, outerKeySelector: (e: T) => K, innerKeySelector: (e: U) => K, resultSelectorFn: (a: T, b: U) => V, keyEqualityCompareFn = __defaultEqualityCompareFn): Collection<V> {
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

    public Except(inner: Iterable<T>): Collection<T> {
        __assertIterable(inner);

        if (!__isCollection(inner)) {
            inner = new __Collection(inner);
        }

        const outer = this;

        return new __Collection(function* () {
            for (let val of outer) {
                if (!(<Collection<T>>inner).Contains(val)) {
                    yield val;
                }
            }
        });
    }

    public Zip<U, V>(inner: Iterable<U>, resultSelectorFn: (a: T, b: U) => V): Collection<V> {
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

    public Intersect(inner: Iterable<T>, equalityCompareFn: any = __defaultEqualityCompareFn): Collection<T> {
        __assertIterable(inner);
        __assertFunction(equalityCompareFn);

        const self = this;

        return new __Collection(function* () {
            const innerCollection = __Collection.From(inner);

            for (let val of self) {
                if (innerCollection.Any((elem: any) => equalityCompareFn(val, elem))) {
                    yield val;
                }
            }
        })
    }

    //#endregion

    //#region Equality

    public SequenceEqual(second: Iterable<T>, equalityCompareFn: any = __defaultEqualityCompareFn): boolean {
        if (!__isIterable(second)) {
            return false;
        }

        const first: Array<T> = this.ToArray();
        second = __Collection.From(second).ToArray();

        if (first.length !== (<Array<T>>second).length) {
            return false;
        }

        for (let i = 0; i < first.length; i++) {
            let firstVal = first[i];
            let secondVal = (<Array<T>>second)[i];

            if (!equalityCompareFn(firstVal, secondVal)) {
                return false;
            }
        }

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

    public GroupBy<K>(keySelector: (e: T) => K, ...args: Array<Function>): any {

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
            try {

                // if this is a key comparator, it must return truthy values for equal values and falsy ones if they're different
                result = result && arg(1, 1) && !arg(1, 2);
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
            return groupBy(keySelector, elem => elem, undefined, __defaultEqualityCompareFn);
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

            return groupByThreeArguments(keySelector, elementSelector, keyComparator);
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
                result = __Collection.From(groups).Select((g: any) => (<Function>resultSelector)(...g));
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

    public GroupJoin<K, V>(inner: Iterable<T>, outerKeySelector: (e: T) => K, innerKeySelector: (e: T) => K, resultSelector: (key: K, values: Array<T>) => V, equalityCompareFn = __defaultEqualityCompareFn): Collection<V> {
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
                yield resultSelector(key, values.ToArray());
            }
        });
    }

    //#endregion

    //#region Insert & Remove

    public Add(value: T): void {
        this.Insert(value, this.Count());
    }

    public Insert(value: T, index: number): void {
        __assert(index >= 0 && index <= this.Count(), 'Index is out of bounds!');

        const oldValues = this.ToArray();

        this.__iterable = function* () {
            yield* oldValues.slice(0, index);
            yield value;
            yield* oldValues.slice(index, oldValues.length);
        };
    }

    public Remove(value: T): boolean {
        let values = this.ToArray();
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

    public Min(mapFn = (x: any) => x): number {
        __assertFunction(mapFn);
        __assertNotEmpty(this);

        return Math.min.apply(null, this.Select(mapFn).ToArray());
    }

    public Max(mapFn = (x: any) => x): number {
        __assertFunction(mapFn);
        __assertNotEmpty(this);

        return Math.max.apply(null, this.Select(mapFn).ToArray());
    }

    public Sum(mapFn = (x: any) => x): number {
        __assertNotEmpty(this);

        return this.Select(mapFn).Aggregate(0, (prev, curr) => prev + curr);
    }

    public Average(mapFn = (x: any) => x): number {
        __assertNotEmpty(this);

        return this.Sum(mapFn) / this.Count();
    }

    //#endregion

    //#region Ordering

    public Order(comparator: any = __defaultComparator): OrderedCollection<T> {
        return this.OrderBy((x: any) => x, comparator);
    }

    public OrderDescending(comparator: any = __defaultComparator): OrderedCollection<T> {
        return this.OrderByDescending((x: any) => x, comparator);
    }

    public OrderBy(keySelector: any, comparator = __defaultComparator): OrderedCollection<T> {
        __assertFunction(comparator);

        return new __OrderedCollectionImpl(this, __getComparatorFromKeySelector(keySelector, comparator));
    }

    public OrderByDescending(keySelector: any, comparator = __defaultComparator): OrderedCollection<T> {
        return new __OrderedCollectionImpl(this, __getComparatorFromKeySelector(keySelector, (a: any, b: any) => comparator(b, a)));
    }

    public Shuffle(): Collection<T> {
        return this.OrderBy(() => Math.floor(Math.random() * 3) - 1 /* Returns -1, 0 or 1 */);
    }

    //#endregioning

    //#region Search

    public IndexOf(element: T, equalityCompareFn: any = __defaultEqualityCompareFn): number {
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

    public LastIndexOf(element: T, equalityCompareFn: any = __defaultEqualityCompareFn): number {
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

    public Contains(elem: T, equalityCompareFn: any = __defaultEqualityCompareFn): boolean {
        return !!~this.IndexOf(elem, equalityCompareFn);
    }

    public Where(predicate = (elem: any, index: number) => true): Collection<T> {
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

    public ConditionalWhere(condition: boolean, predicate: any) {
        if (condition) {
            return this.Where(predicate);
        } else {
            return this;
        }
    }

    public Count(predicate = (elem: any) => true): number {
        let count = 0;
        let filtered = this.Where(predicate);

        while (!filtered[Symbol.iterator]().next().done) {
            count++;
        }

        return count;
    }

    public Any(predicate: any = null): boolean {
        if (__isEmpty(this)) {
            return false;
        }

        if (!predicate) {

            // since we checked before that the sequence is not empty
            return true;
        }

        return !this.Where(predicate)[Symbol.iterator]().next().done;
    }

    public All(predicate: ((e: T) => boolean) = elem => true): boolean {
        __assertFunction(predicate);

        // All is equal to the question if there's no element which does not match the predicate
        // 'all fruits are yellow' -> 'there is no fruit which is not yellow'
        return !this.Any((x: any) => !predicate(x));
    }

    //#endregion

    //#region Transformation

    public Aggregate(seedOrAccumulator: any, accumulator: any = null, resultTransformFn: any = null): any {
        const values = this.ToArray();

        if (typeof seedOrAccumulator === 'function' && !accumulator && !resultTransformFn) {
            return __aggregateCollection(__Collection.From(values.slice(1, values.length)), values.slice(0, 1)[0], seedOrAccumulator, (elem: any) => elem);
        } else if (typeof seedOrAccumulator !== 'function' && typeof accumulator === 'function' && !resultTransformFn) {
            return __aggregateCollection(__Collection.From(values), seedOrAccumulator, accumulator, (elem: any) => elem);
        } else {
            return __aggregateCollection(__Collection.From(values), seedOrAccumulator, accumulator, resultTransformFn);
        }
    }

    public Select(mapFn: any = (x: any) => x): Collection<any> {
        const self = this;

        let index = 0;

        return new __Collection(function* () {
            for (let val of self) {
                yield mapFn(val, index);
                index++;
            }
        });
    }

    public Flatten(): Collection<any> {
        return this.SelectMany((x: any) => x);
    }

    public SelectMany(mapFn: any, resultSelector = (x: any, y: any) => y): Collection<any> {
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

    public Distinct(equalityCompareFn: any = __defaultEqualityCompareFn): Collection<T> {
        __assertFunction(equalityCompareFn);

        return __removeDuplicates(this, equalityCompareFn);
    }

    public ToArray(): Array<T> {
        return [...this];
    }

    public ToDictionary(keySelector: any, elementSelectorOrKeyComparator: any = null, keyComparator: any = null): Map<any, any> {
        __assertFunction(keySelector);

        if (!elementSelectorOrKeyComparator && !keyComparator) {

            // ToDictionary(keySelector)
            return this.ToDictionary(keySelector, (elem: any) => elem, __defaultEqualityCompareFn);
        } else if (!keyComparator && __getParameterCount(elementSelectorOrKeyComparator) === 1) {

            // ToDictionary(keySelector, elementSelector)
            return this.ToDictionary(keySelector, elementSelectorOrKeyComparator, __defaultEqualityCompareFn);
        } else if (!keyComparator && __getParameterCount(elementSelectorOrKeyComparator) === 2) {

            // ToDictionary(keySelector, keyComparator)
            return this.ToDictionary(keySelector, (elem: any) => elem, elementSelectorOrKeyComparator);
        }

        // ToDictionary(keySelector, elementSelector, keyComparator)

        __assertFunction(keyComparator);
        __assertFunction(elementSelectorOrKeyComparator);

        let usedKeys = [];
        let result = new Map();
        const input = this.ToArray();
        for (let value of input) {
            let key = keySelector(value);
            let elem = elementSelectorOrKeyComparator(value);

            __assert(key != null, 'Key is not allowed to be null!');
            __assert(!__Collection.From(usedKeys).Any((x: any) => keyComparator(x, key)), `Key '${key}' is already in use!`);

            usedKeys.push(key);
            result.set(key, elem);
        }

        return result;
    }

    public ToJSON(): string {
        return __toJSON(this.ToArray());
    }

    public Reverse(): Collection<T> {
        const arr = this.ToArray();

        return new __Collection(function* () {
            for (let i = arr.length - 1; i >= 0; i--) {
                yield arr[i];
            }
        });
    }

    public ForEach(fn: (e: T) => void): void {
        __assertFunction(fn);

        for (let val of this) {
            fn(val);
        }
    }

    //#endregion

    //#region Static

    public static From<T>(iterable: Iterable<T>): Collection<T> {
        return new __Collection(iterable);
    }

    public static Range(start: number, count: number): Collection<number> {
        __assertNumberBetween(count, 0, Infinity);

        return new __Collection(function* () {
            let i = start;
            while (i != count + start) {
                yield i++;
            }
        });
    }

    public static Repeat<T>(val: T, count: number): Collection<T> {
        __assertNumberBetween(count, 0, Infinity);

        return new __Collection(function* () {
            for (let i = 0; i < count; i++) {
                yield val;
            }
        });
    }

    public static get Empty(): Collection<any> {
        return new __Collection([]);
    }

    //#endregion
}