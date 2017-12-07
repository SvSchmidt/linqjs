/**
 * @private
 */
class __OrderedCollection<T> extends __Collection<T> implements OrderedCollection<T> {

    private __comparator: (a: T, b: T) => number;

    public constructor(iterableOrGenerator: Iterable<T> | (() => Iterator<T>), comparator: (a: T, b: T) => number) {
        __assertFunction(comparator);
        super(iterableOrGenerator);
        this.__comparator = comparator;
    }

    public ThenBy(keySelector: any, comparator = defaultComparator) {
        const currentComparator = this.__comparator;
        const additionalComparator = __getComparatorFromKeySelector(keySelector, comparator);

        const newComparator = (a: any, b: any) => {
            const res = currentComparator(a, b);

            if (res !== 0) {
                return res;
            }

            return additionalComparator(a, b);
        };

        return new __OrderedCollection(this.__iterable, newComparator);
    };

    public ThenByDescending(keySelector: any, comparator = defaultComparator) {
        return this.ThenBy(keySelector, (a, b) => comparator(b, a));
    }

    public [Symbol.iterator]() {
        let self = this;
        let parentIterator = super[Symbol.iterator].bind(this);
        return function* () {
            yield* new __MinHeap([...{[Symbol.iterator]: parentIterator}], self.__comparator);
        }();
    }
}