/**
 * Default comparator implementation that uses the "<" operator.
 * Retuns values as specified by the comparator function fir Array.sort().
 * 
 * @param  {T}  a   Element "a" to be compared.
 * @param  {T}  b   Element "b" to be compared.
 * @param {any} <T> Element type.
 *
 * @return {number} Returns -1 if "a" is smaller than "b",
 *                  returns  1 if "b" is smaller than "a",
 *                  returns  0 if they are equal.
 */
let DefaultComparator = (a, b) => {
    if (a < b) {
        return -1;
    }
    if (b < a) {
        return 1;
    }
    return 0;
};

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
    function MinHeap(elements, comparator = DefaultComparator) {
        __assertArray(elements);
        __assertFunction(comparator);

        this.comparator = comparator;
        this.elements   = elements;

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
    function heapify(elements, comparator, i) {
        let right     = 2 * (i + 1);
        let left      = right - 1;
        let bestIndex = i;

        // check if the element is currently misplaced
        if (left < elements.length && comparator(elements[left], elements[bestIndex]) < 0) {
            bestIndex = left;
        }
        if (right < elements.length && comparator(elements[right], elements[bestIndex]) < 0) {
            bestIndex = right;
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
    function createHeap(elements, comparator) {
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
            return this.elements.pop();
        }

        let topElement = this.elements[0];
        let tmp = this.elements.pop();
        this.elements[0] = tmp;

        // do fancy stuff
        heapify(this.elements, this.comparator, 0);
    
        return topElement;
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

/*
 * Partially sorted heap that contains the largest element within root position.
 */
let MaxHeap = (function () {
    
    /**
     * Creates the heap from the array of elements with the given comparator function.
     * 
     * @param {T[]}               elements   Array with elements to create the heap from.
     *                                       Will be modified in place for heap logic.
     * @param {(T, T) => boolean} comparator Comparator function (same as the one for Array.sort()).
     * @param {any}               <T>        Heap element type.
     */
    function MaxHeap(elements, comparator = DefaultComparator) {
        __assertArray(elements);
        __assertFunction(comparator);

        // simply negate the result of the comparator function so we get reverse ordering within the heap
        MinHeap.apply(this, [elements, function (a, b) { return -1 * comparator(a, b); }]);
    }

    // inheritance stuff (we don't want to implement stuff twice)
    MaxHeap.prototype = Object.create(MinHeap.prototype);
    MaxHeap.prototype.constructor = MaxHeap;

    return MaxHeap;
})()

__export({ DefaultComparator, MinHeap, MaxHeap })