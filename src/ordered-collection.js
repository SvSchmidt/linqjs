/*
 * Ordered linq collection.
 */
let OrderedCollection = (function () {

    /**
     * Creates a new ordered linq collection using the given comparator and heap for sorting.
     *
     * @param {Iterable<T>}       iterable        Datasource for this collection.
     * @param {(T, T) => boolean} comparator      Comparator for sorting.
     * @param {MinHeap|MaxHeap}   heapConstructor Heap implementation for sorting.
     * @param {any}               <T>             Element type.
     */
    function OrderedCollection (iterable, comparator, heapConstructor) {
        __assertIterable(iterable)
        __assertFunction(comparator)
        __assertFunction(heapConstructor)

        Collection.apply(this, [iterable])

        this.__comparator = comparator
        this.__heapConstructor = heapConstructor
    }

    /**
     * Specifies further sorting by the given comparator for equal elements.
     *
     * @param {(T, T) => boolean} additionalComparator Comparator for sorting.
     * @param {any}               <T>                  Element type.
     * @return {OrderedCollection<T>} Created ordered linq collection.
     */
    OrderedCollection.prototype.ThenBy = function (keySelector, comparator = defaultComparator) {
      const currentComparator = this.__comparator
      const additionalComparator = GetComparatorFromKeySelector(keySelector, comparator)

      const factor = this.__heapConstructor === MaxHeap ? -1 : 1

      const newComparator = (a, b) => {
        const res = factor * currentComparator(a, b)

        if (res !== 0) {
          return res
        }

        return additionalComparator(a, b)
      }

      const self = this

      return new Collection(function * () {
        const arr = self.ToArray()

        yield* mergeSort(arr, newComparator)
      })
    };

    OrderedCollection.prototype.ThenByDescending = function (keySelector, comparator = defaultComparator) {
      return this.ThenBy(keySelector, (a, b) => comparator(b, a))
    }

    OrderedCollection.prototype.getIterator = function () {
      const _self = this

      return function * () {
        yield* Reflect.construct(_self.__heapConstructor, [[..._self.iterable], _self.__comparator])
      }()
    }

    return OrderedCollection;
})();

/**
 * Creates a comparator function from the given selector string or selector function.
 * The selector can either be a string which can be mapped to a property (e.g. Age) or a function to get the ordering key, e.g. person => person.Age
 *
 * @param  {String|Function} selector
 * @return {Function} Created comparator function of the form (first, second) => Number.
 */
function GetComparatorFromKeySelector(selector, comparator = defaultComparator) {
    if (isFunction(selector)) {
      return new Function('comparator', 'keySelectorFn', 'a', 'b', `return comparator(keySelectorFn(a), keySelectorFn(b))`).bind(null, comparator, selector)
    } else if (isString(selector)) {
      if (!(selector.startsWith('[') || selector.startsWith('.'))) {
          selector = `.${selector}`
      }

      return new Function('comparator', 'a', 'b', `return comparator(a${selector}, b${selector})`).bind(null, comparator)
    }
}

__export({ GetComparatorFromKeySelector, OrderedCollection })
