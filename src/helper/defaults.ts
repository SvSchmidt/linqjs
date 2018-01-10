/**
 * @private
 * @internal
 */
export function __defaultEqualityCompareFn<T>(first: T, second: T): boolean {
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
export function defaultComparator<T>(a: T, b: T): number {
    if (a < b) {
        return -1;
    }
    if (b < a) {
        return 1;
    }
    return 0;
}
