import {Collection} from "./Collection";
import {__assertFunction} from "./helper/assert";
import {MinHeap} from "./MinHeap";
import {__getComparatorFromKeySelector} from "./helper/utils";
import {__defaultComparator} from "./helper/default";

/**
 * Ordered collection of iterable values.
 */
export class OrderedCollection<T> extends Collection<T> {

    /**
     * @internal
     */
    private __comparator: (a: T, b: T) => number;

    /**
     * @internal
     */
    public constructor(iterableOrGenerator: Iterable<T> | (() => Iterator<T>), comparator: (a: T, b: T) => number) {
        __assertFunction(comparator);
        super(iterableOrGenerator);
        this.__comparator = comparator;
    }

    /**
     * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
     * The default comparator is used to compare values.
     *
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
     * @param {((e: T) => K) | string} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string.
     * @returns {OrderedCollection<T>} Ordered collection.
     */
    public ThenBy<K>(keySelector: ((e: T) => K) | string): OrderedCollection<T>;

    /**
     * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
     * A custom comparator is used to compare values.
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.thenby(v=vs.110).aspx
     * @param {((e: T) => K) | string} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string.
     * @param {(a: K, b: K) => number} comparator A comparator of the form (a, b) => number to compare two values.
     * @returns {OrderedCollection<T>} Ordered collection.
     */
    public ThenBy<K>(keySelector: ((e: T) => K) | string, comparator: (a: K, b: K) => number): OrderedCollection<T>;

    /**
     * @internal
     */
    public ThenBy(keySelector: any, comparator = __defaultComparator) {
        const currentComparator = this.__comparator;
        const additionalComparator = __getComparatorFromKeySelector(keySelector, comparator);

        const newComparator = (a: any, b: any) => {
            const res = currentComparator(a, b);

            if (res !== 0) {
                return res;
            }

            return additionalComparator(a, b);
        };

        return new OrderedCollection(this.__iterable, newComparator);
    };

    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order according to a key.
     * The default comparator is used to compare values.
     *
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
     * @param {((e: T) => K) | string} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string.
     * @returns {OrderedCollection<T>} Ordered collection.
     */
    public ThenByDescending<K>(keySelector: ((e: T) => K) | string): OrderedCollection<T>;

    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order according to a key.
     * A custom comparator is used to compare values.
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.thenbydescending(v=vs.110).aspx
     * @param {((e: T) => K) | string} keySelector A function which maps to a property or value of the objects to be compared or the property selector as a string.
     * @param {(a: K, b: K) => number} comparator A comparator of the form (a, b) => number to compare two values.
     * @returns {OrderedCollection<T>} Ordered collection.
     */
    public ThenByDescending<K>(keySelector: ((e: T) => K) | string, comparator: (a: K, b: K) => number): OrderedCollection<T>;

    /**
     * @internal
     */
    public ThenByDescending(keySelector: any, comparator = __defaultComparator) {
        return this.ThenBy(keySelector, (a, b) => comparator(b, a));
    }

    public [Symbol.iterator]() {
        const self = this;

        return function* () {
            yield* new MinHeap(self.ToArray(), self.__comparator);
        }();
    }
}