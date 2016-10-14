/**
 * OrderedCollection - Represents an ordered collection of iterable values
 * providing additional methods to order an already ordered collection a second time keeping the order of non-equal elements
 *
 * @class
 * @param  {Iterable|GeneratorFunction} iterableOrGenerator A iterable to create a collection of, e.g. an array or a generator function
 * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
 */
let OrderedCollection = (function () {
    function OrderedCollection (iterableOrGenerator, comparator) {
        __assertFunction(comparator)

        Collection.apply(this, [iterableOrGenerator])

        this.__comparator = comparator
    }

    /**
     * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
     * The default comparator is used to compare values.
     *
     * @method
     * @memberof OrderedCollection
     * @instance
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.thenby(v=vs.110).aspx
     * @example
const pets = [
   {
     Name: 'Barley',
     Age: 8,
   },
   {
     Name: 'Boots',
     Age: 1,
   },
   {
     Name: 'Whiskers',
     Age: 1,
   },
   {
     Name: 'Fluffy',
     Age: 2,
   },
   {
     Name: 'Donald',
     Age: 4,
   },
   {
     Name: 'Snickers',
     Age: 13,
   }
 ]

 pets.OrderBy(x => x.Name.length).ThenBy(x => x.Age).Select(x => x.Name).ToArray()
 // -> ["Boots", "Fluffy", "Donald", "Barley", "Whiskers", "Snickers"]
     * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
     * @return {OrderedCollection} Ordered collection.
     *//**
     * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
     * A custom comparator is used to compare values.
     *
     * @method
     * @memberof OrderedCollection
     * @instance
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.thenby(v=vs.110).aspx
     * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
     * @param {Function} comparator A comparator of the form (a, b) => number to compare two values
     * @return {OrderedCollection} Ordered collection.
     */
    OrderedCollection.prototype.ThenBy = function (keySelector, comparator = defaultComparator) {
      const currentComparator = this.__comparator
      const additionalComparator = GetComparatorFromKeySelector(keySelector, comparator)

      const newComparator = (a, b) => {
        const res = currentComparator(a, b)

        if (res !== 0) {
          return res
        }

        return additionalComparator(a, b)
      }

      const self = this

      return new OrderedCollection(this.getIterator(), newComparator)
    };

    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order according to a key.
     * The default comparator is used to compare values.
     *
     * @method
     * @memberof OrderedCollection
     * @instance
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.thenbydescending(v=vs.110).aspx
     * @example
const pets = [
   {
     Name: 'Barley',
     Age: 8,
   },
   {
     Name: 'Boots',
     Age: 1,
   },
   {
     Name: 'Whiskers',
     Age: 1,
   },
   {
     Name: 'Fluffy',
     Age: 2,
   },
   {
     Name: 'Donald',
     Age: 4,
   },
   {
     Name: 'Snickers',
     Age: 13,
   }
 ]

 pets.OrderBy(x => x.Name.length).ThenBy(x => x.Age).Select(x => x.Name).ToArray()
 // -> ["Boots", "Barley", "Donald", "Fluffy", "Snickers", "Whiskers"]
     * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
     * @return {OrderedCollection} Ordered collection.
     *//**
     * Performs a subsequent ordering of the elements in a sequence in descending order according to a key.
     * A custom comparator is used to compare values.
     *
     * @method
     * @memberof OrderedCollection
     * @instance
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.thenbydescending(v=vs.110).aspx
     * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
     * @param {Function} comparator A comparator of the form (a, b) => number to compare two values
     * @return {OrderedCollection} Ordered collection.
     */
    OrderedCollection.prototype.ThenByDescending = function (keySelector, comparator = defaultComparator) {
      return this.ThenBy(keySelector, (a, b) => comparator(b, a))
    }

    OrderedCollection.prototype.getIterator = function () {
      const _self = this

      return function * () {
        yield* Reflect.construct(MinHeap, [[..._self.iterable], _self.__comparator])
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
