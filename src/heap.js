/**
 * HeapElement class that also provides the element index for sorting.
 */
let HeapElement = (function () {

    /**
     * Creates a new HeapElement.
     *
     * @param {number} index Element index.
     * @param {T}      value Element value.
     * @param {any}    <T>   Value type.
     */
    function HeapElement (index, value) {
        this.__index = index;
        this.__value = value;

        // for faster instance detection
        this.__isHeapElementInstance = true;
    }

    /**
     * Creates or returns a heap element from the given data.
     * If obj is a HeapElement obj is returned, creates a HeapElement otherwise.
     *
     * @param {number}           index Current element index.
     * @param {T|HeapElement<T>} obj   Element.
     * @param {any}              <T>   Value type.
     * @return {HeapElement<T>} Created heap element or obj if it already is a heap object.
     */
    HeapElement.CreateHeapElement = function (index, obj) {
        if (obj === undefined || obj.__isHeapElementInstance) {
            return obj;
        }
        return new HeapElement(index, obj);
    };

    return HeapElement;
})();

/*
 * Partially sorted heap that contains the smallest element within root position.
 */
let MinHeap = (function () {

    /**
     * Creates the heap from the array of elements with the given comparator function.
     *
     * @param {T[]}              elements   Array with elements to create the heap from.
     *                                      Will be modified in place for heap logic.
     * @param {(T, T) => number} comparator Comparator function (same as the one for Array.sort()).
     * @param {any}              <T>        Heap element type.
     */
    function MinHeap (elements, comparator = defaultComparator) {
        __assertArray(elements);
        __assertFunction(comparator);

        // we do not wrap elements here since the heapify function does that the moment it encounters elements
        this.elements = elements;

        // create comparator that works on heap elements (it also ensures equal elements remain in original order)
        this.comparator = (a, b) => {
            let res = comparator(a.__value, b.__value);

            if (res !== 0) {
                return res;
            }

            return defaultComparator(a.__index, b.__index);
        };

        // create heap ordering
        createHeap(this.elements, this.comparator);
    }

    /**
     * Places the element at the given position into the correct position within the heap.
     *
     * @param {T}                elements   Array with elements used for the heap.
     * @param {(T, T) => number} comparator Comparator function (same as the one for Array.sort()).
     * @param {number}           i          Index of the element that will be placed to the correct position.
     * @param {any}              <T>        Heap element type.
     */
    function heapify (elements, comparator, i) {
        let right     = 2 * (i + 1);
        let left      = right - 1;
        let bestIndex = i;

        // wrap elements the moment we encouter them first
        elements[bestIndex] = HeapElement.CreateHeapElement(bestIndex, elements[bestIndex]);

        // check if the element is currently misplaced
        if (left < elements.length) {
            elements[left] = HeapElement.CreateHeapElement(left, elements[left]);
            if (comparator(elements[left], elements[bestIndex]) < 0) {
                bestIndex = left;
            }
        }
        if (right < elements.length) {
            elements[right] = HeapElement.CreateHeapElement(right, elements[right]);
            if (comparator(elements[right], elements[bestIndex]) < 0) {
                bestIndex = right;
            }
        }

        // if the element is misplaced, swap elements and continue until we get the right position
        if (bestIndex !== i) {
            let tmp = elements[i];
            elements[i] = elements[bestIndex];
            elements[bestIndex] = tmp;

            // let misplaced elements "bubble up" to get heap properties
            heapify(elements, comparator, bestIndex);
        }
    }

    /**
     * Creates a heap from the given array using the given comparator.
     *
     * @param {T[]}              elements   Array with elements used for the heap.
     *                                      Will be modified in place for heap logic.
     * @param {(T, T) => number} comparator Comparator function (same as the one for Array.sort()).
     * @param {any}              <T>        Heap element type.
     */
    function createHeap (elements, comparator) {

        // sepecial case: empty array
        if (elements.length === 0) {

            // nothing to do here
            return;
        }

        for (let i = Math.floor(elements.length / 2); i >= 0; i--) {

            // do fancy stuff
            heapify(elements, comparator, i);
        }
    }

    /**
     * Checks if the heap contains at least one element.
     *
     * @return {boolean} If the heap contains elements or not.
     */
    MinHeap.prototype.hasTopElement = function () {
        return this.elements.length > 0;
    };

    /**
     * Gets and removes the top element from the heap.
     * This method performs a bit of reordering to keep heap properties.
     *
     * @param {any} <T> Heap element type.
     *
     * @return {T} Top element from heap.
     */
    MinHeap.prototype.getTopElement = function () {

        // special case: only one element left
        if (this.elements.length === 1) {
            return this.elements.pop().__value;
        }

        let topElement = this.elements[0];
        let tmp = this.elements.pop();
        this.elements[0] = tmp;

        // do fancy stuff
        heapify(this.elements, this.comparator, 0);

        return topElement.__value;
    };

    /**
     * Creates an iterator for this heap instance.
     *
     * @return {Iterator} Iterator for the heap.
     */
    MinHeap.prototype[Symbol.iterator] = function () {

        // keep matching heap instance
        let heap = this;
        return {
            next: function () {
                if (heap.hasTopElement()) {
                    return {
                        done:  false,
                        value: heap.getTopElement()
                    };
                }
                return {
                    done: true
                };
            }
        }
    };

    return MinHeap;
})();

__export({ MinHeap })
