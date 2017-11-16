import {__toJSON} from "./utils";

export function __defaultEqualityCompareFn<T>(first: T, second: T): boolean {
    return __toJSON(first) === __toJSON(second)
}

/**
 * Default comparator implementation that uses the "<" operator.
 * Returns values as specified by the comparator function fir Array.sort().
 *
 * @param {T} a Element "a" to be compared.
 * @param {T} b Element "b" to be compared.
 *
 * @return {number} Returns -1 if "a" is smaller than "b",
 *                  returns  1 if "b" is smaller than "a",
 *                  returns  0 if they are equal.
 */
export function __defaultComparator<T>(a: T, b: T): number {
    if (a < b) {
        return -1;
    }
    if (b < a) {
        return 1;
    }
    return 0;
}
