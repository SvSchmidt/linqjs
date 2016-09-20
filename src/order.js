// TODO: change implementation to use iterators!

function Order() {
    return this.OrderBy(DefaultComparator);
}

function OrderCompare() {
    return this.sort(DefaultComparator);
}

function OrderBy(comparator) {
    __assertFunction(comparator);
    let heap = new MinHeap(this, comparator);
    return [...heap];
}

function OrderDescending() {
    return this.OrderByDescending(DefaultComparator);
}

function OrderByDescending(comparator) {
    __assertFunction(comparator);
    let heap = new MaxHeap(this, comparator);
    return [...heap];
}

__export({ Order, OrderCompare, OrderBy, OrderDescending, OrderByDescending })