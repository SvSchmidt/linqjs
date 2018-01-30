import {BasicCollection} from "./BasicCollection";

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