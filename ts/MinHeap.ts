import {__assertArray, __assertFunction} from "./helper/assert";
import {__defaultComparator} from "./helper/default";

/**
 * HeapElement class that also provides the element index for sorting.
 *
 * @internal
 */
class HeapElement<T> {

    /**
     * @internal
     */
    public __index: number;

    /**
     * @internal
     */
    public __value: T;

    /**
     * @internal
     */
    public constructor(index: number, value: T) {
        this.__index = index;
        this.__value = value;
    }

    /**
     * Creates or returns a heap element from the given data.
     * If obj is a HeapElement obj is returned, creates a HeapElement otherwise.
     *
     * @internal
     * @param {number}           index Current element index.
     * @param {HeapElement<T> | T} obj   Element.
     * @return {HeapElement<T>} Created heap element or obj if it already is a heap object.
     */
    public static __createHeapElement<T>(index: number, obj: HeapElement<T> | T): HeapElement<T> {
        if (obj === undefined || obj instanceof HeapElement) {
            return <HeapElement<T>>obj;
        }
        return new HeapElement(index, obj);
    }
}

/**
 * Partially sorted heap that contains the smallest element within root position.
 */
export class MinHeap<T> implements Iterable<T> {

    /**
     * @internal
     */
    private __elements: Array<HeapElement<T>>;

    /**
     * @internal
     */
    private __comparator: (a: HeapElement<T>, b: HeapElement<T>) => number;

    /**
     * Creates the heap from the array of elements with the given comparator function.
     *
     * @param {Array<T>} elements Array with elements to create the heap from. Will be modified in place for heap logic.
     * @param {(a: T, b: T) => number} comparator Comparator function (same as the one for Array.sort()).
     */
    public constructor(elements: Array<T>, comparator: (a: T, b: T) => number = __defaultComparator) {
        __assertArray(elements);
        __assertFunction(comparator);

        // we do not wrap elements here since the heapify function does that the moment it encounters elements
        this.__elements = <any>elements;

        // create comparator that works on heap elements (it also ensures equal elements remain in original order)
        this.__comparator = (a, b) => {
            let res = comparator(a.__value, b.__value);

            if (res !== 0) {
                return res;
            }

            return __defaultComparator(a.__index, b.__index);
        };

        // create heap ordering
        this.__createHeap(this.__elements, this.__comparator);
    }

    /**
     * Places the element at the given position into the correct position within the heap.
     *
     * @internal
     * @param {Array<HeapElement<T>> | Array<T>} elements Array with elements used for the heap.
     * @param {(a: HeapElement<T>, b: HeapElement<T>) => number} comparator Comparator function (same as the one for Array.sort()).
     * @param {number} i Index of the element that will be placed to the correct position.
     */
    private __heapify(elements: Array<HeapElement<T>> | Array<T>, comparator: (a: HeapElement<T>, b: HeapElement<T>) => number, i: number): void {
        let right = 2 * (i + 1);
        let left = right - 1;
        let bestIndex = i;

        // wrap elements the moment we encouter them first
        elements[bestIndex] = HeapElement.__createHeapElement(bestIndex, elements[bestIndex]);

        // check if the element is currently misplaced
        if (left < elements.length) {
            elements[left] = HeapElement.__createHeapElement(left, elements[left]);
            if (comparator(<any>elements[left], <any>elements[bestIndex]) < 0) {
                bestIndex = left;
            }
        }
        if (right < elements.length) {
            elements[right] = HeapElement.__createHeapElement(right, elements[right]);
            if (comparator(<any>elements[right], <any>elements[bestIndex]) < 0) {
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
     * @internal
     * @param {Array<HeapElement<T>> | Array<T>} elements Array with elements used for the heap. Will be modified in place for heap logic.
     * @param {(a: HeapElement<T>, b: HeapElement<T>) => number} comparator Comparator function (same as the one for Array.sort()).
     */
    private __createHeap(elements: Array<HeapElement<T>> | Array<T>, comparator: (a: HeapElement<T>, b: HeapElement<T>) => number): void {

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

    /**
     * @internal
     */
    private __hasTopElement(): boolean {
        return this.__elements.length > 0;
    }

    /**
     * @internal
     */
    private __getTopElement(): T {

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

    public [Symbol.iterator](): Iterator<T> {

        // keep matching heap instance
        let heap = this;
        return {
            next: function (): IteratorResult<T> {
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
        }
    }
}
