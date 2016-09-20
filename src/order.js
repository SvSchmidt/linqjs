// TODO: change implementation to use iterators!

function Order() {
    return this.OrderBy(defaultComparator);
}

function OrderCompare() {
    return this.sort(defaultComparator);
}

function OrderBy(comparator) {
    __assertFunction(comparator);
    let heap = new MinHeap(this, comparator);
    return getArrayFromIterable(heap);
}

function OrderDescending() {
    return this.OrderByDescending(defaultComparator);
}

function OrderByDescending(comparator) {
    __assertFunction(comparator);
    let heap = new MaxHeap(this, comparator);
    return getArrayFromIterable(heap);
}

__export({ Order, OrderCompare, OrderBy, OrderDescending, OrderByDescending })