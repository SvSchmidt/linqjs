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
export declare function defaultComparator<T>(a: T, b: T): number;
/**
 * Represents a collection of iterable values.
 */
export interface BasicCollection<T> extends Iterable<T> {
    /**
     * Returns the element at the given index.
     *
     * @see https://msdn.microsoft.com/en-us/library/bb299233(v=vs.110).aspx
     *
     * @param index Element index.
     * @return The element at the given index.
     */
    elementAt(index: number): T;
    /**
     * Returns count elements of the sequence starting from the beginning as a new Collection.
     *
     * @see https://msdn.microsoft.com/en-us/library/bb503062(v=vs.110).aspx
     *
     * @param count Number of elements to be returned.
     * @return Collection with the first <code>count</code> elements.
     */
    take(count: number): BasicCollection<T>;
    /**
     * Skips count elements of the sequence and returns the remaining sequence.
     *
     * @see https://msdn.microsoft.com/en-us/library/bb358985(v=vs.110).aspx
     *
     * @param count Number of elements to skip.
     * @return Collection without the first <code>count</code> elements.
     */
    skip(count: number): BasicCollection<T>;
    /**
     * Takes elements from the beginning of a sequence while the predicate yields true.
     *
     * Example:
     * <pre>
     * const girls = [
     *   { name: 'Julia', isHot: true },
     *   { name: 'Sarah', isHot: true },
     *   { name: 'Maude', isHot: false },
     * ];
     *
     * girls.takeWhile(g => g.isHot).toArray();
     * // -> [ { name: 'Julia', isHot: true },  { name: 'Sarah', isHot: true } ]
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.takewhile(v=vs.110).aspx
     *
     * @param predicate The predicate.
     * @return The filtered collection.
     */
    takeWhile(predicate: (elem: T) => boolean): BasicCollection<T>;
    /**
     * Takes elements from the beginning of a sequence while the predicate yields true.
     * The index of the element can be used in the logic of the predicate function.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.takewhile(v=vs.110).aspx
     *
     * @param  predicate The predicate.
     * @return The filtered collection.
     */
    takeWhile(predicate: (elem: T, index: number) => boolean): BasicCollection<T>;
    /**
     * Takes elements from the beginning of a sequence until the predicate yields true.
     * takeUntil behaves like calling takeWhile with a negated predicate.
     *
     * Example:
     * <pre>
     * const girls = [
     *   { name: 'Julia', isHot: true },
     *   { name: 'Sarah', isHot: true },
     *   { name: 'Maude', isHot: false },
     * ];
     *
     * girls.takeUntil(g => !g.isHot).toArray();
     * // -> [ { name: 'Julia', isHot: true },  { name: 'Sarah', isHot: true } ]
     * </pre>
     *
     * @param  predicate The predicate of the form elem => boolean
     * @return The filtered collection.
     */
    takeUntil(predicate: (elem: T) => boolean): BasicCollection<T>;
    /**
     * Takes elements from the beginning of a sequence until the predicate yields true.
     * The index of the element can be used in the logic of the predicate function.
     * takeUntil behaves like calling takeWhile with a negated predicate.
     *
     * @param predicate The predicate function.
     * @return The filtered collection.
     */
    takeUntil(predicate: (elem: T, index: number) => boolean): BasicCollection<T>;
    /**
     * Skips elements in the sequence while the predicate yields true and returns the remaining sequence.
     *
     * Example:
     * <pre>
     * const numbers = [1, 3, 7, 9, 12, 13, 14, 15];
     * numbers.skipWhile(x => x % 2 === 1).toArray();
     * // -> [12, 13, 14, 15]
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.skipwhile(v=vs.110).aspx
     *
     * @param predicate The predicate function.
     * @return The filtered collection.
     */
    skipWhile(predicate: (elem: T) => boolean): BasicCollection<T>;
    /**
     * Skips elements in the sequence while the predicate yields true and returns the remaining sequence.
     * The index of the element can be used in the logic of the predicate function.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.skipwhile(v=vs.110).aspx
     *
     * @param predicate The predicate function.
     * @return The filtered collection.
     */
    skipWhile(predicate: (elem: T, index: number) => boolean): BasicCollection<T>;
    /**
     * Skips elements from the beginning of a sequence until the predicate yields true.
     * skipUntil behaves like calling skipWhile with a negated predicate.
     *
     * Example:
     * <pre>
     * const people = [
     *   { name: 'Gandalf', race: 'istari' },
     *   { name: 'Thorin', race: 'dwarfs' },
     *   { name: 'Frodo', race: 'hobbit' },
     *   { name: 'Samweis', race: 'hobbit' },
     *   { name: 'Pippin', race: 'hobbit' },
     * ];
     *
     * people.skipUntil(p => p.race === 'hobbit').select(x => x.name).toArray();
     * // -> ['Frodo', 'Samweis', 'Pippin'];
     * </pre>
     *
     * @param predicate The predicate function.
     * @return The filtered collection.
     */
    skipUntil(predicate: (elem: T) => boolean): BasicCollection<T>;
    /**
     * Takes elements from the beginning of a sequence until the predicate yields true.
     * The index of the element can be used in the logic of the predicate function.
     * skipUntil behaves like calling skipWhile with a negated predicate.
     *
     * @param predicate The predicate function.
     * @return The filtered collection.
     */
    skipUntil(predicate: (elem: T, index: number) => boolean): BasicCollection<T>;
    /**
     * Returns the first element in a sequence.
     *
     * Example:
     * <pre>
     * [1, 2, 3].first();
     * // -> 1
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.first(v=vs.110).aspx
     *
     * @throws Will throw an error if the sequence is empty.
     * @return The first element of the collection.
     */
    first(): T;
    /**
     * Returns the first element in a sequence that matches the given predicate.
     *
     * Example:
     * <pre>
     * [1, 2, 3, 4].first(x => x % 2 === 0);
     * // -> 2
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.first(v=vs.110).aspx
     *
     * @throws Will throw an error if the sequence is empty.
     * @param predicate The predicate function.
     * @return The first element that matches the specified condition.
     */
    first(predicate: (v: T) => boolean): T;
    /**
     * Returns the first element in a sequence or a default value if the sequence is empty.
     * The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...).
     *
     * Example:
     * <pre>
     * [].firstOrDefault();
     * // -> null
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.firstordefault(v=vs.110).aspx
     *
     * @return The first element or a default value.
     */
    firstOrDefault(): T | null;
    /**
     * Returns the first element in a sequence or a default value if the sequence is empty.
     * The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...).
     *
     * Example:
     * <pre>
     * [].firstOrDefault(Number);
     * // -> 0
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.firstordefault(v=vs.110).aspx
     *
     * @param constructor Default value type.
     * @return The first element or a default value.
     */
    firstOrDefault<V>(constructor: V): T | V;
    /**
     * Returns the first element in a sequence that matches the predicate or a default value if no such element is found.
     * The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...).
     *
     * Example:
     * <pre>
     * [1, 2, 3].firstOrDefault(x => x > 5);
     * // -> null
     * [1, 2, 3].firstOrDefault(x => x > 5, 6);
     * // -> 6
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.firstordefault(v=vs.110).aspx
     *
     * @param predicate The predicate function.
     * @param constructor Default value type.
     * @return The first element that matches the specified condition or a default value.
     */
    firstOrDefault<V>(predicate: (e: T) => boolean, constructor: V): T | V;
    /**
     * Returns the last element in a sequence.
     *
     * Example:
     * <pre>
     * [1, 2, 3].last();
     * // -> 3
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.last(v=vs.110).aspx
     *
     * @throws Will throw an error if the sequence is empty.
     * @return The last element from the collection.
     */
    last(): T;
    /**
     * Returns the last element in a sequence that matches the given predicate.
     *
     * Example:
     * <pre>
     * [1, 2, 3, 4].last(x => x % 2 === 0);
     * // -> 4
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.last(v=vs.110).aspx
     *
     * @throws Will throw an error if the sequence is empty.
     * @param predicate The predicate function.
     * @return The last element from the collection that matches the given predicate.
     */
    last(predicate: (e: T) => boolean): T;
    /**
     * Returns the last element in a sequence or a default value if the sequence is empty.
     * The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...).
     *
     * Example
     * <pre>
     * [].lastOrDefault();
     * // -> null
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.lastordefault(v=vs.110).aspx
     *
     * @return The last element of the collection or a default value.
     */
    lastOrDefault(): T | null;
    /**
     * Returns the last element in a sequence or a default value if the sequence is empty.
     * The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...).
     *
     * Example
     * <pre>
     * [].lastOrDefault(Number);
     * // -> 0
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.lastordefault(v=vs.110).aspx
     *
     * @param constructor Default value type.
     * @return The last element of the collection or a default value.
     */
    lastOrDefault<V>(constructor: V): T | V;
    /**
     * Returns the last element in a sequence that matches the predicate or a default value if no such element is found.
     * The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...).
     *
     * Example:
     * <pre>
     * [1, 2, 3].lastOrDefault(x => x > 5);
     * // -> null
     * [1, 2, 3].lastOrDefault(x => x > 5, 6);
     * // -> 6
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.lastordefault(v=vs.110).aspx
     *
     * @param predicate The predicate function.
     * @param constructor Default value type.
     * @return The last element of the collection that matches the given predicate or a default value.
     */
    lastOrDefault<V>(predicate: (e: T) => boolean, constructor: V): T | V;
    /**
     * Returns a single value of a sequence.
     * Throws an error if there's not exactly one element.
     *
     * Example:
     * <pre>
     * [1, 2, 3].single();
     * // -> Error
     * [1].single();
     * // -> 1
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.single(v=vs.110).aspx
     *
     * @throws Will throw an error if the sequence is empty or there's more than one element.
     * @return The first and only element of the collection.
     */
    single(): T;
    /**
     * Returns a single, specific value of a sequence matching the predicate.
     * Throws an error if there's not exactly one such element.
     *
     * Example:
     * <pre>
     * [1, 2, 3].single(x => x % 2 === 0);
     * // -> 2
     * [1, 2, 3].single(x => x < 3);
     * // -> Error
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.single(v=vs.110).aspx
     *
     * @throws Will throw an error if the sequence is empty or there's more than one element matching the predicate.
     * @param  predicate The predicate function.
     * @return The first and only element of the collection that matches the given predicate.
     */
    single(predicate: (e: T) => boolean): T;
    /**
     * Returns a single element of a sequence or a default value if the sequence is empty.
     * Will throw an error if there's more than one element.
     * The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...).
     *
     * Example:
     * <pre>
     * [1, 2, 3].singleOrDefault();
     * // -> Error
     * [].singleOrDefault();
     * // -> null
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.singleordefault(v=vs.110).aspx
     *
     * @return The first and only value of the collection or a default value.
     */
    singleOrDefault(): T | null;
    /**
     * Returns a single element of a sequence or a default value if the sequence is empty.
     * Will throw an error if there's more than one element.
     * The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...).
     *
     * Example:
     * <pre>
     * [1, 2, 3].singleOrDefault(Number);
     * // -> Error
     * [].singleOrDefault(Number);
     * // -> 1
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.singleordefault(v=vs.110).aspx
     *
     * @param constructor Default value type.
     * @return The first and only value of the collection or a default value.
     */
    singleOrDefault<V>(constructor: V): T | V;
    /**
     * Returns a single, specific element of a sequence matching the predicate or a default value if no such element is found.
     * Will throw an error if there's more than one such element.
     * The default value is determined by a provided constructor (e.g. Number) or the value itself (e.g. an object, a value...).
     *
     * Example:
     * <pre>
     * [1, 2, 3].singleOrDefault(x => x > 5)
     * // -> null
     * [1, 2, 3].singleOrDefault(x => x > 5, 6)
     * // -> 6
     * [1, 2, 3].singleOrDefault(x => x > 1, 6)
     * // -> Error
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.singleordefault(v=vs.110).aspx
     *
     * @param predicate The predicate function.
     * @param constructor Default value type.
     * @return The first and only value of the collection or a default value.
     */
    singleOrDefault<V>(predicate: (e: T) => boolean, constructor: V): T | V;
    /**
     * Returns the sequence or a new sequence containing the provided default value if it is empty.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.defaultifempty(v=vs.110).aspx
     *
     * @param constructor The default value type.
     * @return This collection or a new one containing a default value of the given type.
     */
    defaultIfEmpty<V>(constructor: V): BasicCollection<T> | BasicCollection<V>;
    /**
     * Concatenates two sequences.
     *
     * Example:
     * <pre>
     * [1, 2, 3].concat([4, 5, 6]).toArray();
     * // -> [1, 2, 3, 4, 5, 6]
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/bb302894(v=vs.110).aspx
     *
     * @param inner The inner sequence to concat with the outer one.
     * @return A new collection with elements from both collections.
     */
    concat(inner: Iterable<T>): BasicCollection<T>;
    /**
     * Concatenates two sequences and removes duplicate values (produces the set union).
     *
     * Example:
     * <pre>
     * [1, 2, 3].union([1, 4, 5, 6]).toArray();
     * // -> [1, 2, 3, 4, 5, 6]
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.union(v=vs.110).aspx
     *
     * @param inner The sequence to create the set union with.
     * @return The set union of the two collections.
     */
    union(inner: Iterable<T>): BasicCollection<T>;
    /**
     * Concatenates two sequences and removes duplicate values (produces the set union).
     * A custom equality comparator is used to compare values for equality.
     *
     * @param inner The sequence to create the set union with.
     * @param equalityCompareFn A function to determine whether or not two values are considered equal.
     * @return The set union of the two collections.
     */
    union(inner: Iterable<T>, equalityCompareFn: (a: T, b: T) => boolean): BasicCollection<T>;
    /**
     * Correlates the elements of two sequences based on matching keys.
     *
     * @see https://msdn.microsoft.com/en-us/library/bb534675(v=vs.110).aspx
     *
     * @param inner The inner sequence to join with the outer one.
     * @param outerKeySelector A selector fn to extract the key from the outer sequence.
     * @param innerKeySelector A selector fn to extract the key from the inner sequence.
     * @param resultSelectorFn A fn to transform the pairings into the result
     * @return A new collection with the results.
     */
    join<U, K, V>(inner: Iterable<U>, outerKeySelector: (e: T) => K, innerKeySelector: (e: U) => K, resultSelectorFn: (a: T, b: U) => V): BasicCollection<V>;
    /**
     * Correlates the elements of two sequences based on matching keys.
     *
     * @see https://msdn.microsoft.com/en-us/library/bb534675(v=vs.110).aspx
     *
     * @param inner The inner sequence to join with the outer one.
     * @param outerKeySelector A selector fn to extract the key from the outer sequence.
     * @param innerKeySelector A selector fn to extract the key from the inner sequence.
     * @param resultSelectorFn A function to transform the pairings into the result.
     * @param keyEqualityCompareFn Optional fn to compare the keys.
     * @return A new collection with the results.
     */
    join<U, K, V>(inner: Iterable<U>, outerKeySelector: (e: T) => K, innerKeySelector: (e: U) => K, resultSelectorFn: (a: T, b: U) => V, keyEqualityCompareFn: (a: K, b: K) => boolean): BasicCollection<V>;
    /**
     * Returns the element of the sequence that do not appear in inner.
     *
     * Example:
     * <pre>
     * const people = [
     *   'Sven', 'Julia', 'Tobi', 'Sarah', 'George', 'Jorge', 'Jon'
     * ];
     * const peopleIHate = ['George', 'Jorge'];
     * const peopleILike = people.except(peopleIHate);
     * peopleILike.toArray();
     * // -> ['Sven', 'Julia', 'Tobi', 'Sarah', 'Jon']
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/bb300779(v=vs.110).aspx
     *
     * @param inner The second sequence to get exceptions from.
     * @return A new Collection with the values of outer without the ones in inner.
     */
    except(inner: Iterable<T>): BasicCollection<T>;
    /**
     * Applies a function to the elements of two sequences, producing a sequence of the results.
     *
     * Example:
     * <pre>
     * const numbers = [1, 2, 3, 4];
     * const words = ["one", "two", "three"];
     *
     * const numbersAndWords = numbers.zip(words, (outer, inner) => outer + " " + inner);
     * numbersAndWords.forEach(x => console.log(x));
     * // Outputs:
     * // "1 one"
     * // "2 two"
     * // "3 three"
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/dd267698(v=vs.110).aspx
     *
     * @param inner The collection to zip with.
     * @param resultSelectorFn A function to produce the output sequence.
     * @return A new collection with the results.
     */
    zip<U, V>(inner: Iterable<U>, resultSelectorFn: (a: T, b: U) => V): BasicCollection<V>;
    /**
     * Produces the set intersection of two sequences. The default equality comparator is used to compare values.
     *
     * Example:
     * <pre>
     * [44, 26, 92, 30, 71, 38].intersect([39, 59, 83, 47, 26, 4, 30]).toArray();
     * // -> [26, 30]
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.sequenceequal(v=vs.110).aspx
     *
     * @param inner The sequence to get the intersection from.
     * @return A collection containing the intersection.
     */
    intersect(inner: Iterable<T>): BasicCollection<T>;
    /**
     * Produces the set intersection of two sequences. A provided equality comparator is used to compare values.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.sequenceequal(v=vs.110).aspx
     *
     * @param inner The sequence to get the intersection from.
     * @param equalityCompareFn A function to compare the values.
     * @return A collection containing the intersection.
     */
    intersect(inner: Iterable<T>, equalityCompareFn: (a: T, b: T) => boolean): BasicCollection<T>;
    /**
     * Compares two sequences for equality. Returns true if they have equal length and the equality compare function
     * returns true for each element in the sequence in correct order. The default equality comparator is used.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.sequenceequal(v=vs.110).aspx
     *
     * @param second The sequence to compare with.
     * @return If the two sequences are equal.
     */
    sequenceEqual(second: Iterable<T>): boolean;
    /**
     * Compares two sequences for equality. Returns true if they have equal length and the equality compare function
     * returns true for each element in the sequence in correct order. A custom comparator function is provided.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.sequenceequal(v=vs.110).aspx
     *
     * @param second The sequence to compare with.
     * @param equalityCompareFn A function to compare the values.
     * @return If the two sequences are equal.
     */
    sequenceEqual(second: Iterable<T>, equalityCompareFn: (a: T, b: T) => boolean): boolean;
    /**
     * Groups a sequence using the keys selected from the members using the keySelector.
     *
     * Example:
     * <pre>
     * ['Sven', 'Mouse'].groupBy(x => x[0]);
     * // Map {"S" => ["Sven"], "M" => ["Mouse"]}
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.groupby(v=vs.110).aspx
     *
     * @param keySelector A function to select grouping keys from the sequence members.
     * @return The grouped sequence as a Map.
     */
    groupBy<V>(keySelector: (e: T) => V): Map<V, Array<T>>;
    /**
     * Groups a sequence using the keys selected from the members using the keySelector.
     * The keys are compared using keyComparator.
     *
     * Example:
     * <pre>
     * ['4', 4, '5'].groupBy(x => x, (outer, inner) => parseInt(outer) === parseInt(inner));
     * // Map {"4" => ["4", 4], "5" => ["5"]}
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.groupby(v=vs.110).aspx
     *
     * @param keySelector A function to select grouping keys from the sequence members.
     * @param keyComparator A function if keys are considered equal.
     * @return The grouped sequence as a Map.
     */
    groupBy<V>(keySelector: (e: T) => V, keyComparator: (a: V, b: V) => boolean): Map<V, Array<T>>;
    /**
     * Groups a sequence using the keys selected from the members using the keySelector.
     * Each group member is projected to a single value (e.g. a property) using the elementSelector.
     *
     * Example:
     * <pre>
     * [{ name: 'Sven', age: 23 }, { name: 'jon', age: 20 }].groupBy(x => x.age, x => x.name);
     * // Map {23 => ["Sven"], 20 => ["jon"]}
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.groupby(v=vs.110).aspx
     *
     * @param keySelector A function to select grouping keys from the sequence members.
     * @param elementSelector A function to map each group member to a specific value.
     * @return The grouped sequence as a Map.
     */
    groupBy<K, V>(keySelector: (e: T) => K, elementSelector: (e: T) => V): Map<K, Array<V>>;
    /**
     * Groups a sequence using the keys selected from the members using the keySelector.
     * The resultSelector is used to project each resulting group to a single value (e.g. an object with aggregated properties).
     *
     * Example:
     * <pre>
     * [
     *   { name: 'Sven', age: 23 },
     *   { name: 'julia', age: 23 },
     *   { name: 'jon', age: 20 }
     * ].groupBy(x => x.age, (age, persons) => ({ age, persons: persons.map(p => p.name).join('&') })).toArray();
     * // [ { age:23, persons: "Sven&julia" }, { age: 20, persons: "jon" } ]
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.groupby(v=vs.110).aspx
     *
     * @param keySelector A function to select grouping keys from the sequence members.
     * @param resultSelector A function to select a final result from each group.
     * @return The grouped sequence with projected results as a new Collection.
     */
    groupBy<K, V>(keySelector: (e: T) => K, resultSelector: (key: K, groupValues: Array<T>) => V): BasicCollection<V>;
    /**
     * Groups a sequence using the keys selected from the members using the keySelector. Keys are compared using the specified keyComparator.
     * The resultSelector is used to project each resulting group to a single value (e.g. an object with aggregated properties).
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.groupby(v=vs.110).aspx
     *
     * @param keySelector A function to select grouping keys from the sequence members.
     * @param resultSelector A function of the form (key, groupMembers) => any to select a final result from each group.
     * @param keyComparator A function of the form (outer, inner) => bool to check if keys are considered equal.
     * @return The grouped sequence with projected results as a new Collection.
     */
    groupBy<K, V>(keySelector: (e: T) => K, resultSelector: (key: K, groupValues: Array<T>) => V, keyComparator: (a: K, b: K) => boolean): BasicCollection<V>;
    /**
     * Groups a sequence using the keys selected from the members using the keySelector. Keys are compared using the specified keyComparator.
     * Each group member is projected to a single value (e.g. a property) using the elementSelector.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.groupby(v=vs.110).aspx
     *
     * @param keySelector A function to select grouping keys from the sequence members.
     * @param elementSelector A function to map each group member to a specific value.
     * @param keyComparator A function to check if keys are considered equal.
     * @return The grouped sequence as a Map.
     */
    groupBy<K, V>(keySelector: (e: T) => K, elementSelector: (e: T) => V, keyComparator: (a: K, b: K) => boolean): Map<K, Array<V>>;
    /**
     * Groups a sequence using the keys selected from the members using the keySelector.
     * Each group member is projected to a single value (e.g. a property) using the elementSelector.
     * The resultSelector is used to project each resulting group to a single value (e.g. an object with aggregated properties).
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.groupby(v=vs.110).aspx
     *
     * @param keySelector A function to select grouping keys from the sequence members.
     * @param elementSelector A function to map each group member to a specific value.
     * @param resultSelector A function to select a final result from each group.
     * @return The grouped sequence with projected results as a new Collection.
     */
    groupBy<K, V>(keySelector: (e: T) => K, elementSelector: (e: T) => V, resultSelector: (key: K, groupValues: Array<T>) => V): BasicCollection<V>;
    /**
     * Groups a sequence using the keys selected from the members using the keySelector. The keys are compared using the keyComparator.
     * Each group member is projected to a single value (e.g. a property) using the elementSelector.
     * The resultSelector is used to project each resulting group to a single value (e.g. an object with aggregated properties).
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.groupby(v=vs.110).aspx
     *
     * @param keySelector A function to select grouping keys from the sequence members.
     * @param elementSelector A function to map each group member to a specific value.
     * @param resultSelector A function to select a final result from each group.
     * @param keyComparator A function to check if keys are considered equal.
     * @return The grouped sequence with projected results as a new Collection.
     * @
     */
    groupBy<K, V>(keySelector: (e: T) => K, elementSelector: (e: T) => V, resultSelector: (key: K, groupValues: Array<T>) => V, keyComparator: (a: K, b: K) => boolean): BasicCollection<V>;
    /**
     * Correlates the elements of two sequences based on equality of keys and groups the results.
     * The default equality comparator is used to compare keys.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.groupjoin(v=vs.110).aspx
     *
     * @param inner The values to join with this Collection.
     * @param outerKeySelector A function to extract the grouping keys from the outer Collection.
     * @param innerKeySelector A function to extract the grouping keys from the inner Collection.
     * @param resultSelector A function of the form (key, values) => any to select the final result from each grouping.
     * @return A collection with the grouped values.
     */
    groupJoin<K, V>(inner: Iterable<T>, outerKeySelector: (e: T) => K, innerKeySelector: (e: T) => K, resultSelector: (key: K, values: BasicCollection<T>) => V): BasicCollection<V>;
    /**
     * Correlates the elements of two sequences based on equality of keys and groups the results.
     * The provided custom keyComparator is used to compare keys.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.groupjoin(v=vs.110).aspx
     *
     * @param inner The values to join with this Collection.
     * @param outerKeySelector A function to extract the grouping keys from the outer Collection.
     * @param innerKeySelector A function to extract the grouping keys from the inner Collection.
     * @param resultSelector A function to select the final result from each grouping.
     * @param keyComparator A function to compare keys for equality.
     * @return A collection with the grouped values.
     */
    groupJoin<K, V>(inner: Iterable<T>, outerKeySelector: (e: T) => K, innerKeySelector: (e: T) => K, resultSelector: (key: K, values: BasicCollection<T>) => V, keyComparator: (a: K, b: K) => boolean): BasicCollection<V>;
    /**
     * Adds an element to the end of the sequence.
     *
     * @see https://msdn.microsoft.com/en-us/library/3wcytfd1(v=vs.110).aspx
     *
     * @param value The value to add to the sequence.
     */
    add(value: T): void;
    /**
     * Inserts an element to the specified index of the sequence.
     *
     * Example:
     * <pre>
     * let coll = Collection.from([1, 2, 3]);
     * coll.contains(4); // -> false
     * coll.insert(4, 0);
     * coll.contains(4); // -> true
     * coll.toArray(); // [4, 1, 2, 3]
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/sey5k5z4(v=vs.110).aspx
     *
     * @param value The value to add.
     * @param index The index to add the value to.
     */
    insert(value: T, index: number): void;
    /**
     * Removes an element from the sequence.
     *
     * @param value The value to remove.
     * @return True if the element was removed, false if not (or the element was not found).
     */
    remove(value: T): boolean;
    /**
     * Returns the minimum of the numbers contained in the sequence. Transforms the values using a map function before.
     *
     * Example:
     * <pre>
     * [1, 2, 3].min();
     * // -> 1
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.min(v=vs.110).aspx
     *
     * @throws Throws an error if the sequence is empty.
     * @return The minimum number of the sequence.
     */
    min(): number;
    /**
     * Returns the minimum of the numbers contained in the sequence.
     *
     * Example:
     * <pre>
     * [2, 3, 5].min(x => x * 2);
     * // -> 4
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.min(v=vs.110).aspx
     *
     * @throws Throws an error if the sequence is empty.
     * @param mapFn A function to use to transform each value before getting the minimum.
     * @return The minimum number of the sequence.
     */
    min(mapFn: (x: T) => number): number;
    /**
     * Returns the maximum of the numbers contained in the sequence.
     *
     * Example:
     * <pre>
     * [1, 2, 3].max();
     * // -> 3
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.max(v=vs.110).aspx
     *
     * @throws Throws an error if the sequence is empty.
     * @return The maximum number of the sequence.
     */
    max(): number;
    /**
     * Returns the max of the numbers contained in the sequence. Transforms the values using a map function before.
     *
     * Example:
     * <pre>
     * [2, 3, 5].max(x => x * 2)
     * // -> 10
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.max(v=vs.110).aspx
     *
     * @throws Throws an error if the sequence is empty.
     * @param mapFn A function to use to transform each value before getting the maximum.
     * @return The maximum number of the sequence.
     */
    max(mapFn: (x: T) => number): number;
    /**
     * Returns the sum of the numbers contained in the sequence.
     *
     * Example:
     * <pre>
     * [1, 2, 3].sum();
     * // -> 6
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.sum(v=vs.110).aspx
     *
     * @return The sum of all numbers in the sequence.
     */
    sum(): number;
    /**
     * Returns the sum of the numbers contained in the sequence. Transforms the values using a map function before.
     *
     * Example:
     * <pre>
     * [2, 3, 5].sum(x => x * 2);
     * // -> 20
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.sum(v=vs.110).aspx
     *
     * @throws Throws an error if the sequence is empty.
     * @param mapFn A function to use to transform each value before calculating the sum.
     * @return The sum of all numbers in the sequence.
     */
    sum(mapFn: (x: T) => number): number;
    /**
     * Returns the average of the numbers contained in the sequence.
     *
     * Example:
     * <pre>
     * [1, 2, 3].average();
     * // -> 2
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.average(v=vs.110).aspx
     *
     * @throws Throws an error if the sequence is empty.
     * @return The average of the sequence.
     */
    average(): number;
    /**
     * Returns the average of the numbers contained in the sequence. Transforms the values using a map function before.
     *
     * Example:
     * <pre>
     * [2, 3, 5].average(x => x * 2);
     * // -> 6.666666667
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.average(v=vs.110).aspx
     * @throws Throws an error if the sequence is empty.
     * @param mapFn A function to use to transform each value before calculating the average.
     * @return The average of the sequence.
     */
    average(mapFn: (x: T) => number): number;
    /**
     * Orders the sequence by the numeric representation of the values ascending.
     * The default comparator is used to compare values.
     *
     * Example:
     * <pre>
     * [1,7,9234,132,345,12,356,1278,809953,345,2].order().toArray();
     * // -> [1, 2, 7, 12, 132, 345, 345, 356, 1278, 9234, 809953]
     * </pre>
     *
     * @return Ordered collection.
     */
    order(): OrderedCollection<T>;
    /**
     * Orders the sequence by the numeric representation of the values ascending.
     * A custom comparator is used to compare values.
     *
     * @param comparator A comparator to compare two values.
     * @return Ordered collection.
     */
    order(comparator: (a: T, b: T) => number): OrderedCollection<T>;
    /**
     * Orders the sequence by the numeric representation of the values descending.
     * The default comparator is used to compare values.
     *
     * Example:
     * <pre>
     * [1,7,9234,132,345,12,356,1278,809953,345,2].orderDescending().toArray();
     * // -> [809953, 9234, 1278, 356, 345, 345, 132, 12, 7, 2, 1]
     * </pre>
     *
     * @return Ordered collection.
     */
    orderDescending(): OrderedCollection<T>;
    /**
     * Orders the sequence by the numeric representation of the values descending.
     * A custom comparator is used to compare values.
     *
     * @param comparator A comparator to compare two values.
     * @return Ordered collection.
     */
    orderDescending(comparator: (a: T, b: T) => number): OrderedCollection<T>;
    /**
     * Orders the sequence by the appropriate property selected by keySelector ascending.
     * The default comparator is used to compare values.
     *
     * Example:
     * <pre>
     * const pets = [
     *   {
     *     Name: 'Barley',
     *     Age: 8,
     *   },
     *   {
     *     Name: 'Boots',
     *     Age: 4,
     *   },
     *   {
     *     Name: 'Whiskers',
     *     Age: 1,
     *   }
     * ];
     * pets.orderBy(x => x.Age).toArray();
     * // -> [ { Name: "Whiskers", "Age": 1 }, { Name: "Boots", Age: 4}, { Name: "Barley", Age: 8 } ]
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.orderby(v=vs.110).aspx
     *
     * @param keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string.
     * @return Ordered collection.
     */
    orderBy<K>(keySelector: ((e: T) => K) | string): OrderedCollection<T>;
    /**
     * Orders the sequence by the appropriate property selected by keySelector ascending.
     * A custom comparator is used to compare values.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.orderby(v=vs.110).aspx
     *
     * @param keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string.
     * @param comparator A comparator to compare two values.
     * @return Ordered collection.
     */
    orderBy<K>(keySelector: ((e: T) => K) | string, comparator: (a: K, b: K) => number): OrderedCollection<T>;
    /**
     * Orders the sequence by the appropriate property selected by keySelector ascending.
     * The default comparator is used to compare values.
     *
     * Example:
     * <pre>
     * const pets = [
     *   {
     *     Name: 'Barley',
     *     Age: 8,
     *   },
     *   {
     *     Name: 'Boots',
     *     Age: 4,
     *   },
     *   {
     *     Name: 'Whiskers',
     *     Age: 1,
     *   }
     * ];
     * pets.orderByDescending(x => x.Age).toArray();
     * // -> [ { Name: "Barley", Age: 8 }, { Name: "Boots", Age: 4}, { Name: "Whiskers", "Age": 1 }, ]
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.orderbydescending(v=vs.110).aspx
     *
     * @param keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string.
     * @return Ordered collection.
     */
    orderByDescending<K>(keySelector: ((e: T) => K) | string): OrderedCollection<T>;
    /**
     * Orders the sequence by the appropriate property selected by keySelector ascending.
     * A custom comparator is used to compare values.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.orderbydescending(v=vs.110).aspx
     *
     * @param keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string.
     * @param comparator A comparator to compare two values.
     * @return Ordered collection.
     */
    orderByDescending<K>(keySelector: ((e: T) => K) | string, comparator: (a: K, b: K) => number): OrderedCollection<T>;
    /**
     * Orders a sequence by random (produces a possible permutation of the sequence) and returns the shuffled elements as a new collection.
     *
     * @return The shuffled collection.
     */
    shuffle(): BasicCollection<T>;
    /**
     * Returns the index of the first occurrence of the given element in the sequence or -1 if it was not found.
     *
     * Example:
     * <pre>
     * [1, 2, 3].indexOf(2);
     * // -> 1
     * [1, 2, 3].indexOf(4);
     * // -> -1
     * </pre>
     *
     * @param element The element to get the index for.
     * @return Index of the given element.
     */
    indexOf(element: T): number;
    /**
     * Returns the index of the first occurrence of the given element in the sequence or -1 if it was not found.
     * A provided equality compare function is used to specify equality.
     *
     * @param element The element to get the index for.
     * @param equalityCompareFn A function to determine whether or not two values are considered equal.
     * @return Index of the given element.
     */
    indexOf(element: T, equalityCompareFn: (a: T, b: T) => boolean): number;
    /**
     * Returns the index of the last occurrence of the given element in the sequence or -1 if it was not found.
     *
     * Example:
     * <pre>
     * [1, 2, 3, 1, 4, 7, 1].lastIndexOf(1);
     * // -> 6
     * [1, 2, 3].lastIndexOf(4);
     * // -> -1
     * </pre>
     *
     * @param element The element to get the last index for.
     * @return last index of the given element.
     */
    lastIndexOf(element: T): number;
    /**
     * Returns the index of the last occurrence of the given element in the sequence or -1 if it was not found.
     * A provided equality compare function is used to specify equality.
     *
     * @param element The element to get the last index for.
     * @param equalityCompareFn A function to determine whether or not two values are considered equal.
     * @return last index of the given element.
     */
    lastIndexOf(element: T, equalityCompareFn: (a: T, b: T) => boolean): number;
    /**
     * Returns true if the sequence contains the specified element, false if not.
     *
     * Example:
     * <pre>
     * [1, 2, 3].contains(2);
     * // -> true
     * [1, 2, 3].contains(4);
     * // -> false
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.contains(v=vs.110).aspx
     *
     * @param element The element to check.
     * @return If the given element is contained.
     */
    contains(element: T): boolean;
    /**
     * contains - Returns true if the sequence contains the specified element, false if not.
     * A provided equality compare function is used to specify equality.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.contains(v=vs.110).aspx
     *
     * @param element The element to check.
     * @param equalityCompareFn A function of the form (first, second) => Boolean to determine whether or not two values are considered equal
     * @return If the given element is contained.
     */
    contains(element: T, equalityCompareFn: (a: T, b: T) => boolean): boolean;
    /**
     * Filters a sequence based on a predicate function.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.where(v=vs.110).aspx
     *
     * @param predicate A function to filter the sequence.
     * @return The filtered collection.
     */
    where(predicate: (e: T) => boolean): BasicCollection<T>;
    /**
     * Filters a sequence based on a predicate function. The index of the element is used in the predicate function.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.where(v=vs.110).aspx
     *
     * @param predicate A function to filter the sequence.
     * @return The filtered collection.
     */
    where(predicate: (element: T, index: number) => boolean): BasicCollection<T>;
    /**
     * Filters a sequence based on a predicate function if the condition is true.
     *
     * @param condition A condition to get checked before filtering the sequence.
     * @param predicate A function to filter the sequence.
     * @return The filtered collection or the original sequence if condition was falsy.
     */
    conditionalWhere(condition: boolean, predicate: (e: T) => boolean): BasicCollection<T>;
    /**
     * Filters a sequence based on a predicate function if the condition is true. The index of the element is used in the predicate function.
     *
     * @param condition A condition to get checked before filtering the sequence.
     * @param predicate A function to filter the sequence.
     * @return The filtered collection or the original sequence if condition was falsy.
     */
    conditionalWhere(condition: boolean, predicate: (element: T, index: number) => boolean): BasicCollection<T>;
    /**
     * Returns the length of the sequence.
     *
     * Example:
     * <pre>
     * [1, 2, 3, 4, 5].count();
     * // -> 5
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.count(v=vs.110).aspx
     *
     * @return Number of elements in this collection.
     */
    count(): number;
    /**
     * Returns the number of elements in the sequence matching the predicate.
     *
     * Example:
     * <pre>
     * [1, 2, 3, 4, 5].count(x => x > 2);
     * // -> 3
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.count(v=vs.110).aspx
     *
     * @param predicate The predicate.
     * @return Number of elements in this collection.
     */
    count(predicate: (e: T) => boolean): number;
    /**
     * Returns true if the sequence contains at least one element, false if it is empty.
     *
     * Example:
     * <pre>
     * [1, 2, 3].any();
     * // -> true
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/bb337697(v=vs.110).aspx
     *
     * @return If the collection contains any elements.
     */
    any(): boolean;
    /**
     * Returns true if at least one element of the sequence matches the predicate or false if no element matches.
     *
     * Example:
     * <pre>
     * [1, 2, 3].any(x => x > 1);
     * // -> true
     * [1, 2, 3].any(x => x > 5);
     * // -> false
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/bb337697(v=vs.110).aspx
     *
     * @param predicate A predicate function to test elements against.
     * @return If the collection contains any elements that match the given predicate.
     */
    any(predicate: (e: T) => boolean): boolean;
    /**
     * Returns true if all elements in the sequence match the predicate.
     *
     * Example:
     * <pre>
     * [1, 2, 3, 4, 5, 6].all(x => x > 3);
     * // -> false
     * [2, 4, 6, 8, 10, 12].all(x => x % 2 === 0);
     * // -> true
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/bb548541(v=vs.110).aspx
     *
     * @param predicate A predicate function to test elements against.
     * @return If all elements in the collection match the given predicate.
     */
    all(predicate: ((e: T) => boolean)): boolean;
    /**
     * Applies a accumulator function to a sequence.
     *
     * Example:
     * <pre>
     * const sentence = "the quick brown fox jumps over the lazy dog";
     * const words = sentence.split(' ');
     * const reversed = words.aggregate((workingSentence, next) => next + " " + workingSentence);
     * // --> "dog lazy the over jumps fox brown quick the"
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.aggregate(v=vs.110).aspx
     *
     * @param accumulator The accumulator function.
     * @return The result of the accumulation.
     */
    aggregate(accumulator: (accumulated: T, next: T) => T): T;
    /**
     * Applies a accumulator function to a sequence. Starts with seed.
     *
     * Example:
     * <pre>
     * [1, 2, 3].aggregate(0, (prev, curr) => prev + curr);
     * // -> 6 (this example is equal to [1, 2, 3].sum())
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.aggregate(v=vs.110).aspx
     *
     * @param seed The starting value of the accumulation.
     * @param accumulator The accumulator function.
     * @return The result of the accumulation.
     */
    aggregate<V>(seed: V, accumulator: (accumulated: V, next: T) => V): V;
    /**
     * Applies a accumulator function to a sequence. Starts with seed and transforms the result using resultTransformFn.
     *
     * Example:
     * <pre>
     * const fruits = ["apple", "mango", "orange", "passionfruit", "grape"];
     * const longestName = fruits.aggregate('banana',
     *     (longest, next) => next.length > longest.length ? next : longest,
     *     fruit => fruit.toUpperCase());
     * // -> "PASSIONFRUIT"
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.aggregate(v=vs.110).aspx
     *
     * @param seed The starting value of the accumulation.
     * @param accumulator The accumulator function.
     * @param resultTransformFn A function to transform the result.
     * @return The result of the accumulation.
     */
    aggregate<V, R>(seed: V, accumulator: (accumulated: V, next: T) => V, resultTransformFn: (v: V) => R): R;
    /**
     * Projects each member of the sequence into a new form.
     *
     * Example:
     * <pre>
     * const petOwners = [
     *   { Name: 'Higa, Sidney', Pets: ['Scruffy', 'Sam'] },
     *   { Name: 'Ashkenazi, Ronen', Pets: ['Walker', 'Sugar'] },
     *   { Name: 'Price, Vernette', Pets: ['Scratches', 'Diesel'] },
     * ];
     *
     * petOwners.select(x => x.Name).toArray();
     * // -> ['Higa, Sidney', 'Ashkenazi, Ronen', 'Price, Vernette']
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.select(v=vs.110).aspx
     *
     * @param mapFn The function to use to map each element of the sequence.
     * @return A new collection with mapped values.
     */
    select<V>(mapFn: (e: T) => V): BasicCollection<V>;
    /**
     * Projects each member of the sequence into a new form. The index of the source element can be used in the mapFn.
     *
     * Example:
     * <pre>
     * [1, 2, 3].select((x, i) => x + i).toArray();
     * // -> [1, 3, 5]
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.select(v=vs.110).aspx
     *
     * @param mapFn The function to use to map each element of the sequence.
     * @return A new collection with mapped values.
     */
    select<V>(mapFn: (element: T, index: number) => V): BasicCollection<V>;
    /**
     * Flattens a sequence meaning reducing the level of nesting by one.
     *
     * Example:
     * <pre>
     * [1, 2, 3, [4, 5, 6,]]].flatten().toArray();
     * // -> [1, 2, 3, 4, 5, 6,]
     * </pre>
     *
     * @return A new, flattened Collection.
     */
    flatten(): BasicCollection<any>;
    /**
     * Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
     *
     * Example:
     * <pre>
     * const petOwners = [
     *   { Name: 'Higa, Sidney', Pets: ['Scruffy', 'Sam'] },
     *   { Name: 'Ashkenazi, Ronen', Pets: ['Walker', 'Sugar'] },
     *   { Name: 'Price, Vernette', Pets: ['Scratches', 'Diesel'] },
     * ];
     *
     * const pets = petOwners.selectMany(petOwner => petOwner.Pets).toArray());
     * // -> ['Scruffy', 'Sam', 'Walker', 'Sugar', 'Scratches', 'Diesel']
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.selectmany(v=vs.110).aspx
     *
     * @param mapFn The function to use to map each element of the sequence.
     * @return The mapped and flattened collection.
     */
    selectMany<V>(mapFn: (element: T) => Array<V> | V): BasicCollection<V>;
    /**
     * Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
     * The index of the source element can be used in the mapFn.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.selectmany(v=vs.110).aspx
     *
     * @param mapFn The function to use to map each element of the sequence.
     * @return The mapped and flattened collection.
     */
    selectMany<V>(mapFn: (element: T, index: number) => Array<V> | V): BasicCollection<V>;
    /**
     * Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
     * Invokes a resultSelector function on each element of the sequence.
     *
     * Example:
     * <pre>
     * const petOwners = [
     *   { Name: 'Higa, Sidney', Pets: ['Scruffy', 'Sam'] },
     *   { Name: 'Ashkenazi, Ronen', Pets: ['Walker', 'Sugar'] },
     *   { Name: 'Price, Vernette', Pets: ['Scratches', 'Diesel'] },
     * ];
     * petOwners.selectMany(
     *     petOwner => petOwner.Pets,
     *     (owner, petName) => ({ owner, petName })
     *   ).select(ownerAndPet => ({
     *     owner: ownerAndPet.owner.Name,
     *     pet: ownerAndPet.petName,
     *   }))
     *   .take(2)
     *   .toArray();
     *
     * // -> [
     * //  { owner: "Higa, Sidney", pet: "Scruffy"},
     * //  { owner: "Higa, Sidney", pet: "Sam"}
     * // ]
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.selectmany(v=vs.110).aspx
     *
     * @param mapFn The function to use to map each element of the sequence.
     * @param resultSelector a function to map the result Value.
     * @return The mapped and flattened collection.
     */
    selectMany<V, R>(mapFn: (element: T) => Array<V> | V, resultSelector: (v: V) => R): BasicCollection<R>;
    /**
     * Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
     * Invokes a resultSelector function on each element of the sequence. The index of the source element can be used in the mapFn.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.selectmany(v=vs.110).aspx
     *
     * @param mapFn The function to use to map each element of the sequence.
     * @param resultSelector a function to map the result Value.
     * @return The mapped and flattened collection.
     */
    selectMany<V, R>(mapFn: (element: T, index: number) => Array<V> | V, resultSelector: (v: V) => R): BasicCollection<R>;
    /**
     * Returns the distinct elements from a sequence using the default equality compare function.
     *
     * Example:
     * <pre>
     * [1, 2, 3, 3, 4, 7, 9, 9, 12].distinct().toArray();
     * // -> [1, 2, 3, 4, 7, 9, 12]
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.distinct(v=vs.110).aspx
     *
     * @return A new collection with distinct elements.
     */
    distinct(): BasicCollection<T>;
    /**
     * Returns the distinct elements from a sequence using a provided equality compare function.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.distinct(v=vs.110).aspx
     *
     * @param equalityCompareFn The function determining if the values are equal.
     * @return A new collection with distinct elements.
     */
    distinct(equalityCompareFn: (a: T, b: T) => boolean): BasicCollection<T>;
    /**
     * Enforces immediate evaluation of the whole Collection and returns an array of the result.
     *
     * @see https://msdn.microsoft.com/en-us/library/bb298736(v=vs.110).aspx
     *
     * @return An array containing the elements from the collection.
     */
    toArray(): Array<T>;
    /**
     * Enforces immediate evaluation of the whole Collection and returns a Map (dictionary) of the results.
     * The key is defined by the keySelector.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.todictionary(v=vs.110).aspx
     *
     * @param keySelector The function to use to retrieve the key from the Collection.
     * @return The created dictionary.
     */
    toDictionary<K>(keySelector: (e: T) => K): Map<K, T>;
    /**
     * Enforces immediate evaluation of the whole Collection and returns a Map (dictionary) of the results.
     * The key is defined by the keySelector and each element is transformed using the elementSelector.
     *
     * Example:
     * <pre>
     * const pets = [
     *   { name: 'miez', species: 'cat' },
     *   { name: 'wuff', species: 'dog' },
     *   { name: 'leo', species: 'cat' },
     *   { name: 'flipper', species: 'dolphin' }
     * ];
     * pets.toDictionary(pet => pet.name, pet => pet.species);
     * // -> Map {"miez" => "cat", "wuff" => "dog", "leo" => "cat", "flipper" => "dolphin"}
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.todictionary(v=vs.110).aspx
     *
     * @param keySelector The function to use to retrieve the key from the Collection.
     * @param elementSelector A function to map each element to a specific value, e.g. to properties.
     * @return The created dictionary.
     */
    toDictionary<K, V>(keySelector: (e: T) => K, elementSelector: (e: T) => V): Map<K, V>;
    /**
     * Enforces immediate evaluation of the whole Collection and returns a Map (dictionary) of the results.
     * The key is defined by the keySelector. The keys are compared using the keyComparator. Duplicate keys throw an error.
     *
     * Example:
     * <pre>
     * const pets = [
     *   { name: 'miez', species: 'cat' },
     *   { name: 'wuff', species: 'dog' },
     *   { name: 'leo', species: 'cat' },
     *   { name: 'flipper', species: 'dolphin' }
     * ];
     * pets.toDictionary(p => p.name, p => p.species, (a, b) => a.length === b.length);
     * // -> error since cat and dog have 3 chars each and considered equal
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.todictionary(v=vs.110).aspx
     *
     * @param keySelector The function to use to retrieve the key from the Collection.
     * @param keyComparator A function specifying whether or not two keys are equal.
     * @return The created dictionary.
     */
    toDictionary<K>(keySelector: (e: T) => K, keyComparator: (a: K, b: K) => boolean): Map<K, T>;
    /**
     * Enforces immediate evaluation of the whole Collection and returns a Map (dictionary) of the results.
     * The key is defined by the keySelector and each element is transformed using the elementSelector.
     * The keys are compared using the keyComparator. Duplicate keys throw an error.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.todictionary(v=vs.110).aspx
     *
     * @param keySelector The function to use to retrieve the key from the Collection.
     * @param elementSelector A function to map each element to a specific value, e.g. to properties.
     * @param keyComparator A function of the form (a, b) => bool specifying whether or not two keys are equal.
     * @return The created dictionary.
     */
    toDictionary<K, V>(keySelector: (e: T) => K, elementSelector: (e: T) => V, keyComparator: (a: K, b: K) => boolean): Map<K, V>;
    /**
     * Returns a new sequence with the elements of the original one in reverse order
     * This method should be considered slow since the collection must get enumerated once.
     *
     * @see https://msdn.microsoft.com/en-us/library/bb358497(v=vs.110).aspx
     *
     * @return A new collection in reversed order.
     */
    reverse(): BasicCollection<T>;
    /**
     * Invokes a function for each value of the Collection.
     *
     * Example:
     * <pre>
     * [1, 2, 3].forEach(x => console.log(x));
     * // Output:
     * // 1
     * // 2
     * // 3
     * </pre>
     *
     * @param fn Function to be invoked.
     */
    forEach(fn: (e: T) => void): void;
}
/**
 * Ordered collection of iterable values.
 */
export interface OrderedCollection<T> extends BasicCollection<T> {
    /**
     * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
     * The default comparator is used to compare values.
     *
     * Example:
     * <pre>
     * const pets = [
     *   {
     *     Name: 'Barley',
     *     Age: 8,
     *   },
     *   {
     *     Name: 'Boots',
     *     Age: 1,
     *   },
     *   {
     *     Name: 'Whiskers',
     *     Age: 1,
     *   },
     *   {
     *     Name: 'Fluffy',
     *     Age: 2,
     *   },
     *   {
     *     Name: 'Donald',
     *     Age: 4,
     *   },
     *   {
     *     Name: 'Snickers',
     *     Age: 13,
     *   }
     * ];
     *
     * pets.orderBy(x => x.Name.length).thenBy(x => x.Age).select(x => x.Name).toArray();
     * // -> ["Boots", "Fluffy", "Donald", "Barley", "Whiskers", "Snickers"]
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.thenby(v=vs.110).aspx
     *
     * @param keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string.
     * @return Ordered collection.
     */
    thenBy<K>(keySelector: ((e: T) => K) | string): OrderedCollection<T>;
    /**
     * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
     * A custom comparator is used to compare values.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.thenby(v=vs.110).aspx
     *
     * @param keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string.
     * @param comparator A comparator function.
     * @return Ordered collection.
     */
    thenBy<K>(keySelector: ((e: T) => K) | string, comparator: (a: K, b: K) => number): OrderedCollection<T>;
    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order according to a key.
     * The default comparator is used to compare values.
     *
     * Example:
     * <pre>
     * const pets = [
     *   {
     *     Name: 'Barley',
     *     Age: 8,
     *   },
     *   {
     *     Name: 'Boots',
     *     Age: 1,
     *   },
     *   {
     *     Name: 'Whiskers',
     *     Age: 1,
     *   },
     *   {
     *     Name: 'Fluffy',
     *     Age: 2,
     *   },
     *   {
     *     Name: 'Donald',
     *     Age: 4,
     *   },
     *   {
     *     Name: 'Snickers',
     *     Age: 13,
     *   }
     * ];
     *
     * pets.orderBy(x => x.Name.length).thenBy(x => x.Age).select(x => x.Name).toArray();
     * // -> ["Boots", "Barley", "Donald", "Fluffy", "Snickers", "Whiskers"]
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.thenbydescending(v=vs.110).aspx
     *
     * @param keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string.
     * @return Ordered collection.
     */
    thenByDescending<K>(keySelector: ((e: T) => K) | string): OrderedCollection<T>;
    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order according to a key.
     * A custom comparator is used to compare values.
     *
     * @see https://msdn.microsoft.com/en-us/library/system.linq.enumerable.thenbydescending(v=vs.110).aspx
     *
     * @param keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string.
     * @param comparator A comparator function.
     * @return Ordered collection.
     */
    thenByDescending<K>(keySelector: ((e: T) => K) | string, comparator: (a: K, b: K) => number): OrderedCollection<T>;
}
export interface CollectionStatic {
    /**
     * Creates a new collection from the given iterable.
     *
     * @return The created collection.
     */
    from<T>(iterable: Iterable<T>): BasicCollection<T>;
    /**
     * Creates a sequence of count values starting with start including.
     *
     * @param start The value to start with, e.g. 1.
     * @param count The amount of numbers to generate from start.
     * @return A new collection with the number range.
     */
    range(start: number, count: number): BasicCollection<number>;
    /**
     * Generates a sequence that consists of count times val.
     *
     * Example:
     * <pre>
     * Collection.repeat('na', 10).toArray().join(' ') + ' BATMAN!';
     * // -> 'na na na na na na na na na na BATMAN!'
     * </pre>
     *
     * @see https://msdn.microsoft.com/en-us/library/bb348899(v=vs.110).aspx
     *
     * @param val The value to repeat.
     * @param count Number of repetitions.
     * @return The created collection.
     */
    repeat<T>(val: T, count: number): BasicCollection<T>;
    /**
     * empty collection.
     */
    empty: BasicCollection<any>;
}
export declare const Collection: CollectionStatic;
export default Collection;
/**
 * Extends the given prototype to have quick access to all collection methods.
 *
 * @param prototype Prototype to be patched.
 * @param exclude List of method names to exclude from patching.
 * @throws Will throw an error if a method would be overwritten.
 *
 * @see {@link extendNativeTypes} to extend Javascript's native iterables.
 */
export declare function extendIterablePrototype(prototype: any, exclude?: string[]): void;
/**
 * Extends the native collections to have quick access to all collection methods.
 *
 * This method extends the prototypes of Array, Map and Set.
 *
 * @see {@link extendIterablePrototype} to extend custom iterables.
 */
export declare function extendNativeTypes(): void;
