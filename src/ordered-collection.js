/*
 * Ordered linq collection.
 */
let OrderedLinqCollection = (function () {

    /**
     * Creates a new ordered linq collection using the given comparator and heap for sorting.
     *
     * @param {Iterable<T>}       iterable        Datasource for this collection.
     * @param {(T, T) => boolean} comparator      Comparator for sorting.
     * @param {MinHeap|MaxHeap}   heapConstructor Heap implementation for sorting.
     * @param {any}               <T>             Element type.
     */
    function OrderedLinqCollection(iterable, comparator, heapConstructor) {
        __assertIterable(iterable);
        __assertFunction(comparator);
        __assertFunction(heapConstructor);
        Collection.apply(this, [iterable]);

        this.__comparator      = comparator;
        this.__heapConstructor = heapConstructor;
    }

    /**
     * Specifies further sorting by the given comparator for equal elements.
     *
     * @param {(T, T) => boolean} additionalComparator Comparator for sorting.
     * @param {any}               <T>                  Element type.
     * @return {OrderedLinqCollection<T>} Created ordered linq collection.
     */
    OrderedLinqCollection.prototype.ThenBy = function (additionalComparator) {
        if (isString(additionalComparator)) {
            additionalComparator = GetComparatorFromKeySelector(additionalComparator);
        }

        __assertFunction(additionalComparator);

        // build new comparator function when not yet iterated
        let currentComparator = this.__comparator;
        this.__comparator = (a, b) => {
            let res = currentComparator(a, b);
            if (res !== 0) {
                return res;
            }
            return additionalComparator(a, b);
        };
        return this;
    };

    OrderedLinqCollection.prototype.getIterator = function () {
      const _self = this

      return function * () {
        yield* Reflect.construct(_self.__heapConstructor, [[..._self.iterable], _self.__comparator])
      }()
    }

    return OrderedLinqCollection;
})();

/**
 * Creates a comparator function from the given selector string.
 * The selector string has to be in same format as within javascript code.
 *
 * @param  {string} selector Javascript code selector string.
 * @return {(any, any) => boolean} Created comparator function.
 */
function GetComparatorFromKeySelector(selector) {
    __assertString(selector);
    if (selector === '') {
        return Collection.prototype.DefaultComparator;
    }
    if (!(selector.startsWith('[') || selector.startsWith('.'))) {
        selector = `.${selector}`;
    }
    let result;
    eval(`result = function (a, b) { return Collection.prototype.DefaultComparator(a${selector}, b${selector}) }`);
    return result;
}

__export({ GetComparatorFromKeySelector, OrderedLinqCollection })
