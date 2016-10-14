/**
 * Aggregate - applies a accumulator function to a sequence
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @variation (accumulator)
 * @param {Function} accumulator The accumulator function of the form (prev, current) => any
 * @example
 const sentence = "the quick brown fox jumps over the lazy dog"
 const words = sentence.split(' ')
 const reversed = words.Aggregate((workingSentence, next) => next + " " + workingSentence)
 // --> "dog lazy the over jumps fox brown quick the"
 * @return {any} the result of the accumulation
 *//**
 * Aggregate - applies a accumulator function to a sequence. Starts with seed.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @variation (seed, accumulator)
 * @param {any} seed The starting value of the accumulation
 * @param {Function} accumulator The accumulator function of the form (prev, current) => any
 * @example
[1, 2, 3].Aggregate(0, (prev, curr) => prev + curr)
// -> 6 (this example is equal to [1, 2, 3].Sum())
 * @return {any} the result of the accumulation
 *//**
 * Aggregate - applies a accumulator function to a sequence. Starts with seed and transforms the result using resultTransformFn.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @variation (seed, accumulator, resultTransformFn)
 * @param {any} seed The starting value of the accumulation
 * @param {Function} accumulator The accumulator function of the form (prev, current) => any
 * @param {Function} resultTransformFn A function to transform the result
 * @example
const fruits = ["apple", "mango", "orange", "passionfruit", "grape"]
const longestName = fruits.Aggregate('banana',
   (longest, next) => next.length > longest.length ? next : longest,
   fruit => fruit.toUpperCase())
// -> "PASSIONFRUIT"
 * @return {any} the result of the accumulation
 */
function Aggregate (seedOrAccumulator, accumulator, resultTransformFn) {
  const values = this.ToArray()

  if (typeof seedOrAccumulator === 'function' && !accumulator && !resultTransformFn) {
    return aggregateCollection(values.slice(1, values.length), values.slice(0, 1)[0], seedOrAccumulator, elem => elem)
  } else if (typeof seedOrAccumulator !== 'function' && typeof accumulator === 'function' && !resultTransformFn) {
    return aggregateCollection(values, seedOrAccumulator, accumulator, elem => elem)
  } else {
    return aggregateCollection(values, seedOrAccumulator, accumulator, resultTransformFn)
  }
}


/**
* Select - Projects each member of the sequence into a new form
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.select(v=vs.110).aspx
* @memberof Collection
* @instance
* @method
* @variation (elem => any)
* @param {Function} mapFn The function to use to map each element of the sequence, has the form elem => any
* @example
const petOwners = [
  { Name: 'Higa, Sidney', Pets: ['Scruffy', 'Sam'] },
  { Name: 'Ashkenazi, Ronen', Pets: ['Walker', 'Sugar'] },
  { Name: 'Price, Vernette', Pets: ['Scratches', 'Diesel'] },
]

petOwners.Select(x => x.Name).ToArray()
// -> ['Higa, Sidney', 'Ashkenazi, Ronen', 'Price, Vernette']
* @return {Collection}
*//**
* Select - Projects each member of the sequence into a new form. The index of the source element can be used in the mapFn.
*
* @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.select(v=vs.110).aspx
* @memberof Collection
* @instance
* @method
* @variation ((elem, index) => any)
* @param {Function} mapFn The function to use to map each element of the sequence, has the form (elem, index) => any
* @example
[1, 2, 3].Select((x, i) => x + i).ToArray()
// -> [1, 3, 5]
* @return {Collection}
*/
function Select (mapFn = x => x) {
  const self = this

  let index = 0

  return new Collection(function * () {
    for (let val of self.getIterator()) {
      yield mapFn(val, index)
      index ++
    }
  })
}

/**
 * Flatten - Flattens a sequence meaning reducing the level of nesting by one
 *
 * @memberof Collection
 * @instance
 * @method
 * @example
[1, 2, 3, [4, 5, 6,]]].Flatten().ToArray()
// -> [1, 2, 3, 4, 5, 6,]
 * @return {Collection}  A new, flattened Collection
 */
function Flatten () {
  return this.SelectMany(x => x)
}

/**
 * SelectMany - Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.selectmany(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @variation (elem => any)
 * @example
const petOwners = [
 { Name: 'Higa, Sidney', Pets: ['Scruffy', 'Sam'] },
 { Name: 'Ashkenazi, Ronen', Pets: ['Walker', 'Sugar'] },
 { Name: 'Price, Vernette', Pets: ['Scratches', 'Diesel'] },
]

const pets = petOwners.SelectMany(petOwner => petOwner.Pets).ToArray())
// -> ['Scruffy', 'Sam', 'Walker', 'Sugar', 'Scratches', 'Diesel']
 * @param {Function} mapFn The function to use to map each element of the sequence, has the form elem => any
 * @return {Collection}
 *//**
 * SelectMany - Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
 * The index of the source element can be used in the mapFn.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.selectmany(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @variation ((elem, index) => any)
 * @param {Function} mapFn The function to use to map each element of the sequence, has the form (elem, index) => any
 * @return {Collection}
 *//**
 * SelectMany - Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
 * Invokes a resultSelector function on each element of the sequence.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.selectmany(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @variation (elem => any, resultSelector)
 * @example
const petOwners = [
  { Name: 'Higa, Sidney', Pets: ['Scruffy', 'Sam'] },
  { Name: 'Ashkenazi, Ronen', Pets: ['Walker', 'Sugar'] },
  { Name: 'Price, Vernette', Pets: ['Scratches', 'Diesel'] },
]
petOwners.SelectMany(
    petOwner => petOwner.Pets,
    (owner, petName) => ({ owner, petName })
  ).Select(ownerAndPet => ({
     owner: ownerAndPet.owner.Name,
     pet: ownerAndPet.petName,
  }))
  .Take(2)
  .ToArray()

// -> [
//  { owner: "Higa, Sidney", pet: "Scruffy"},
//  { owner: "Higa, Sidney", pet: "Sam"}
// ]
 * @param {Function} mapFn The function to use to map each element of the sequence, has the form elem => any
 * @param {Function} resultSelector a function of the form (sourceElement, element) => any to map the result Value
 * @return {Collection}
 *//**
 * SelectMany - Projects each element of a sequence using mapFn and flattens the resulting sequences into one sequence.
 * Invokes a resultSelector function on each element of the sequence. The index of the source element can be used in the mapFn.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.selectmany(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @variation ((elem, index) => any, resultSelector)
 * @param {Function} mapFn The function to use to map each element of the sequence, has the form (elem, index) => any
 * @param {Function} resultSelector a function of the form (sourceElement, element) => any to map the result Value
 * @return {Collection}
 */
function SelectMany (mapFn, resultSelector = (x, y) => y) {
  __assertFunction(mapFn)
  __assertFunction(resultSelector)

  const iter = this.getIterator()

  return new Collection(function * () {
    let index = 0

    for (let current of iter) {
      let mappedEntry = mapFn(current, index)
      let newIter = mappedEntry

      if (!isIterable(mappedEntry)) {
        newIter = [mappedEntry]
      } else {
        newIter = mappedEntry
      }

      for (let val of newIter[Symbol.iterator]()) {
        yield resultSelector(current, val)
      }

      index++
    }
  })
}

/**
 * Distinct - Returns the distinct elemens from a sequence using the default equality compare function
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.distinct(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @example
[1, 2, 3, 3, 4, 7, 9, 9, 12].Distinct().ToArray()
// -> [1, 2, 3, 4, 7, 9, 12]
 * @return {Collection}
 *//**
 * Distinct - Returns the distinct elemens from a sequence using a provided equality compare function
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.distinct(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @param {Function} equalityCompareFn The function of the form (first, second) => boolean determining if the values are equal
 * @return {Collection}
 */
function Distinct (equalityCompareFn = defaultEqualityCompareFn) {
  __assertFunction(equalityCompareFn)

  return removeDuplicates(this, equalityCompareFn)
}

/**
 * ToArray - Enforces immediate evaluation of the whole Collection and returns an array of the result
 *
 * @see https://msdn.microsoft.com/de-de/library/bb298736(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @return {Array}
 */
function ToArray () {
  return [...this.getIterator()]
}

/**
 * ToDictionary - Enforces immediate evaluation of the whole Collcetion and returns a Map (dictionary) of the results.
 * The key is defined by the keySelector.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.todictionary(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @param {Function} keySelector The function to use to retrieve the key from the Collection
 * @return {Map}
 *//**
 * ToDictionary - Enforces immediate evaluation of the whole Collcetion and returns a Map (dictionary) of the results.
 * The key is defined by the keySelector and each element is transformed using the elementSelector.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.todictionary(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @example
const pets = [
{ name: 'miez', species: 'cat' },
{ name: 'wuff', species: 'dog' },
{ name: 'leo', species: 'cat' },
{ name: 'flipper', species: 'dolphin' }
]
pets.ToDictionary(pet => pet.name, pet => pet.species)
// -> Map {"miez" => "cat", "wuff" => "dog", "leo" => "cat", "flipper" => "dolphin"}
 * @param {Function} keySelector The function to use to retrieve the key from the Collection
 * @param {Function} elementSelector A function to map each element to a specific value, e.g. to properties
 * @return {Map}
 *//**
 * ToDictionary - Enforces immediate evaluation of the whole Collcetion and returns a Map (dictionary) of the results.
 * The key is defined by the keySelector. The keys are compared using the keyComparer. Duplicate keys throw an error.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.todictionary(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @example
const pets = [
{ name: 'miez', species: 'cat' },
{ name: 'wuff', species: 'dog' },
{ name: 'leo', species: 'cat' },
{ name: 'flipper', species: 'dolphin' }
]
pets.ToDictionary(p => p.name, p => p.species, (a, b) => a.length === b.length)
// -> error since cat and dog have 3 chars each and considered equal
 * @param {Function} keySelector The function to use to retrieve the key from the Collection
 * @param {Function} keyComparer A function of the form (a, b) => bool specifying whether or not two keys are equal
 * @return {Map}
 *//**
 * ToDictionary - Enforces immediate evaluation of the whole Collcetion and returns a Map (dictionary) of the results.
 * The key is defined by the keySelector and each element is transformed using the elementSelector.
 * The keys are compared using the keyComparer. Duplicate keys throw an error.
 *
 * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.todictionary(v=vs.110).aspx
 * @memberof Collection
 * @instance
 * @method
 * @param {Function} keySelector The function to use to retrieve the key from the Collection
 * @param {Function} elementSelector A function to map each element to a specific value, e.g. to properties
 * @param {Function} keyComparer A function of the form (a, b) => bool specifying whether or not two keys are equal
 * @return {Map}
 */
function ToDictionary (keySelector, elementSelectorOrKeyComparer, keyComparer) {
  __assertFunction(keySelector)

  if (!elementSelectorOrKeyComparer && !keyComparer) {
    // ToDictionary(keySelector)
    return this.ToDictionary(keySelector, elem => elem, defaultEqualityCompareFn)
  } else if (!keyComparer && getParameterCount(elementSelectorOrKeyComparer) === 1) {
    // ToDictionary(keySelector, elementSelector)
    return this.ToDictionary(keySelector, elementSelectorOrKeyComparer, defaultEqualityCompareFn)
  } else if (!keyComparer && getParameterCount(elementSelectorOrKeyComparer) === 2) {
    // ToDictionary(keySelector, keyComparer)
    return this.ToDictionary(keySelector, elem => elem, elementSelectorOrKeyComparer)
  }

  // ToDictionary(keySelector, elementSelector, keyComparer)

  __assertFunction(keyComparer)
  __assertFunction(elementSelectorOrKeyComparer)

  let usedKeys = []
  let result = new Map()
  const input = this.ToArray()
  const elementSelector = elementSelectorOrKeyComparer

  for (let value of input) {
    let key = keySelector(value)
    let elem = elementSelector(value)

    __assert(key != null, 'Key is not allowed to be null!')
    __assert(!usedKeys.Any(x => keyComparer(x, key)), `Key '${key}' is already in use!`)

    usedKeys.push(key)
    result.set(key, elem)
  }

  return result
}

/**
 * ToJSON - Returns the representation of the sequence in javascript object notation (JSON)
 *
 * @instance
 * @method
 * @memberof Collection
 * @return {string}
 */
 function ToJSON () {
   return toJSON(this.ToArray())
 }

/**
 * Reverse - Returns a new sequence with the elements of the original one in reverse order
 * This method should be considered inperformant since the collection must get enumerated once
 *
 * @see https://msdn.microsoft.com/de-de/library/bb358497(v=vs.110).aspx
 * @method
 * @instance
 * @memberof Collection
 * @return {Collection}
 */
function Reverse () {
  const arr = this.ToArray()

  return new Collection(function * () {
    for (let i = arr.length - 1; i >= 0; i--) {
      yield arr[i]
    }
  })
}

/**
 * ForEach - Invokes a function for each value of the Collection
 *
 * @method
 * @instance
 * @memberof Collection
 * @example
[1, 2, 3].ForEach(x => console.log(x))
// Output:
1
2
3
 * @param  {Function} fn
 * @return {void}
 */
function ForEach (fn) {
  __assertFunction(fn)

  for (let val of this.getIterator()) {
    fn(val)
  }
}

__export({ Aggregate, Distinct, Select, SelectMany, Flatten, Reverse, ToArray, ToDictionary, ToJSON, ForEach })
