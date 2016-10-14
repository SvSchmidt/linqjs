/**
 * Orders the sequence by the numeric representation of the values ascending.
 * The default comparator is used to compare values.
 *
 * @method
 * @memberof Collection
 * @instance
 * @example
[1,7,9234,132,345,12,356,1278,809953,345,2].Order().ToArray()

// -> [1, 2, 7, 12, 132, 345, 345, 356, 1278, 9234, 809953]
 * @return {OrderedCollection} Ordered collection.
 *//**
 * Orders the sequence by the numeric representation of the values ascending.
 * A custom comparator is used to compare values.
 *
 * @method
 * @memberof Collection
 * @instance
 * @param {Function} comparator A comparator of the form (a, b) => number to compare two values
 * @return {OrderedCollection} Ordered collection.
 */
function Order(comparator = defaultComparator) {
  return this.OrderBy(x => x, comparator);
}

/**
 * Orders the sequence by the numeric representation of the values descending.
 * The default comparator is used to compare values.
 *
 * @method
 * @memberof Collection
 * @instance
 * @example
[1,7,9234,132,345,12,356,1278,809953,345,2].OrderDescending().ToArray()

// -> [809953, 9234, 1278, 356, 345, 345, 132, 12, 7, 2, 1]
 * @return {OrderedCollection} Ordered collection.
 *//**
 * Orders the sequence by the numeric representation of the values descending.
 * A custom comparator is used to compare values.
 *
 * @method
 * @memberof Collection
 * @instance
 * @param {Function} comparator A comparator of the form (a, b) => number to compare two values
 * @return {OrderedCollection} Ordered collection.
 */
function OrderDescending(comparator = defaultComparator) {
  return this.OrderByDescending(x => x, comparator);
}

/**
 * Orders the sequence by the appropriate property selected by keySelector ascending.
 * The default comparator is used to compare values.
 * @method
 * @memberof Collection
 * @instance
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.orderby(v=vs.110).aspx
 * @example
const pets = [
 {
   Name: 'Barley',
   Age: 8,
 },
 {
   Name: 'Booots',
   Age: 4,
 },
 {
   Name: 'Whiskers',
   Age: 1,
 }
]

pets.OrderBy(x => x.Age).ToArray()
// -> [ { Name: "Whiskers", "Age": 1 }, { Name: "Booots", Age: 4}, { Name: "Barley", Age: 8 } ]
 * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
 * @return {OrderedCollection} Ordered collection.
 *//**
 * Orders the sequence by the appropriate property selected by keySelector ascending.
 * A custom comparator is used to compare values.
 * @method
 * @memberof Collection
 * @instance
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.orderby(v=vs.110).aspx
 * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
 * @param {Function} comparator A comparator of the form (a, b) => number to compare two values
 * @return {OrderedCollection} Ordered collection.
 */
function OrderBy (keySelector, comparator = defaultComparator) {
  __assertFunction(comparator)

  return new OrderedCollection(this, GetComparatorFromKeySelector(keySelector, comparator), MinHeap)
}

/**
 * Orders the sequence by the appropriate property selected by keySelector ascending.
 * The default comparator is used to compare values.
 * @method
 * @memberof Collection
 * @instance
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.orderbydescending(v=vs.110).aspx
 * @example
const pets = [
 {
   Name: 'Barley',
   Age: 8,
 },
 {
   Name: 'Booots',
   Age: 4,
 },
 {
   Name: 'Whiskers',
   Age: 1,
 }
]

pets.OrderByDescending(x => x.Age).ToArray()
// -> [ { Name: "Barley", Age: 8 }, { Name: "Booots", Age: 4}, { Name: "Whiskers", "Age": 1 }, ]
 * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
 * @return {OrderedCollection} Ordered collection.
 *//**
 * Orders the sequence by the appropriate property selected by keySelector ascending.
 * A custom comparator is used to compare values.
 * @method
 * @memberof Collection
 * @instance
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.orderbydescending(v=vs.110).aspx
 * @param {Function|String} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string
 * @param {Function} comparator A comparator of the form (a, b) => number to compare two values
 * @return {OrderedCollection} Ordered collection.
 */
function OrderByDescending (keySelector, comparator = defaultComparator)  {
    return new OrderedCollection(this, GetComparatorFromKeySelector(keySelector, (a, b) => comparator(b, a)))
}

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
