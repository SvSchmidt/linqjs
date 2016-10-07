// TODO: change implementation to use iterators!

function Order() {
  return this.OrderBy(defaultComparator);
}

function OrderDescending() {
  return this.OrderByDescending(defaultComparator);
}

/**
 * Orderes this linq collection using the given comparator.
 *
 * @param {(T, T) => boolean} comparator Comparator to be used.
 * @param {any}               <T>        Element type.
 * @return {OrderedLinqCollection<T>} Ordered collection.
 */
function OrderBy (comparator) {
    if (isString(comparator)) {
        comparator = GetComparatorFromKeySelector(comparator);
    }
    __assertFunction(comparator);
    return new OrderedLinqCollection(this, comparator, MinHeap);
};

/**
 * Orderes this linq collection in descending order using the given comparator.
 *
 * @param {(T, T) => boolean} comparator Comparator to be used.
 * @param {any}               <T>        Element type.
 * @return {OrderedLinqCollection<T>} Ordered collection.
 */
function OrderByDescending (comparator) {
    if (isString(comparator)) {
        comparator = GetComparatorFromKeySelector(comparator);
    }
    __assertFunction(comparator);
    return new OrderedLinqCollection(this, comparator, MaxHeap);
};

/**
 * Shuffle - Orders a sequence by random (produces a possible permutation of the sequence) and returns the shuffled elements as a new collection
 *
 * @instance
 * @memberof Collection
 * @method
 * @return {Collection}
 */
function Shuffle () {
  return this.OrderBy(() => Math.floor(Math.random() * 3) - 1 /* Returns -1, 0 or 1 */)
}

__export({ Order, OrderBy, OrderDescending, OrderByDescending, Shuffle })
