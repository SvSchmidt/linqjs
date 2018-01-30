import {BasicCollection} from "./BasicCollection";

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