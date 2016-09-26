// TODO: change implementation to use iterators!

function Order() {
  return this.OrderBy(DefaultComparator);
}

function OrderCompare() {
  return this.sort(DefaultComparator);
}

function OrderDescending() {
  return this.OrderByDescending(DefaultComparator);
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
    return new OrderedLinqCollection(this.ToArray(), comparator, MinHeap);
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
    return new OrderedLinqCollection(this.ToArray(), comparator, MaxHeap);
};

__export({ Order, OrderCompare, OrderBy, OrderDescending, OrderByDescending })
