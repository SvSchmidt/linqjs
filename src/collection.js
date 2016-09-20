/*
 * Basic collection for lazy linq operations.
 */
let LinqCollection = (function () {

    /**
     * Creates a new LinqCollection from the given iterable.
     * 
     * @param {Iterable<T>} iterable Datasource for this collection.
     * @param {any}         <T>      Element type.
     */
    function LinqCollection(iterable) {
        __assertIterable(iterable);
        this._source            = iterable;
        this.__startedIterating = false;
        this.__iterationIndex   = 0;
    }

    /**
     * Hook function that will be called once before iterating.
     */
    LinqCollection.prototype._initialize = function _initialize() {
        this.__sourceIterator = this._source[Symbol.iterator]();
    };

    /**
     * Internal iterator.next() method.
     * 
     * @param {any} <T> Element type.
     * @return {IterationElement<T>} Next element when iterating.
     */
    LinqCollection.prototype._next = function _next() {
        return this.__sourceIterator.next();
    };

    /**
     * Internal function that ensures the _initialize() hook is invoked once.
     * This function also adds the iteration index to the result of _next().
     * 
     * @param {any} <T> Element type.
     * @return {IterationElement<T>} Next element when iterating.
     */
    LinqCollection.prototype.__wrappedNext = function __wrappedNext() {
        if (!this.__startedIterating) {
            this.__startedIterating = true;
            this._initialize();
        }
        let result = this._next();
        if (!result.done) {
            result.index = this.__iterationIndex;
            this.__iterationIndex++;
        }
        return result;
    };

    /**
     * Creates an array from this collection.
     * Iterates once over its elements.
     * 
     * @param {any} <T> Element type.
     * @return {T[]} Array with elements from this collection.
     */
    LinqCollection.prototype.ToArray = function toArray() {
        return [...this];
    };

    /**
     * Returns wheather iteration has started or not.
     * If iteration has not been started yet, _initialize() has not yet been called.
     *
     * @return {boolean}
     */
    LinqCollection.prototype.StartedIterating = function StartedIterating() {
        return this.__startedIterating;
    };

    /**
     * Provides an iterator for this collection.
     * 
     * @param {any} <T> Element type.
     * @return {Iterator<T>} Iterator for this collection.
     */
    LinqCollection.prototype[Symbol.iterator] = function () {
        __assertIterationNotStarted(this);
        return {
            next: () => this.__wrappedNext(),
        };
    };

    return LinqCollection;
})();

/**
 * Creates a LinqCollection from the given iterable.
 * 
 * @param {Iterable<T>} iterable Datasource for the collection.
 * @param {any}         <T>      Element type.
 * @return {LinqCollection<T>} Created LinqCollection.
 */
function Linq(iterable) {
    __assertIterable(iterable);
    return new LinqCollection(iterable);
}

__export({ LinqCollection, Linq })