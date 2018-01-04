/**
 * @private
 */
class __AssertionError extends Error {
    constructor(expected: string, got: any) {
        super(`Expected ${expected}, got ${got}!`);
    }
}

/**
 * @private
 */
function __assert(condition: boolean, ...args: any[]): void {
    if (!condition) {
        if (args.length === 2) {
            throw new __AssertionError(args[0], args[1]);
        } else {
            throw new Error(args[0]);
        }
    }
}

/**
 * @private
 */
function __assertFunction(param: Function): void {
    __assert(__isFunction(param), 'function', param);
}

/**
 * @private
 */
function __assertArray<T>(param: Array<T>): void {
    __assert(__isArray(param), 'array', param);
}

/**
 * @private
 */
function __assertNotEmpty(self: any): void {
    __assert(!__isEmpty(self), 'Sequence is empty!');
}

/**
 * @private
 */
function __assertIterable<T>(obj: Iterable<T>): void {
    __assert(__isIterable(obj), 'iterable', obj);
}

/**
 * @private
 */
function __assertCollection<T>(obj: __Collection<T>): void {
    __assert(__isCollection(obj), 'collection', obj);
}

/**
 * @private
 */
function __assertNumeric(obj: number): void {
    __assert(__isNumeric(obj), 'numeric value', obj);
}

/**
 * @private
 */
function __assertNumberBetween(num: number, min: number, max: number = Infinity): void {
    __assertNumeric(num);
    __assert(num >= min && num <= max, `Number must be between ${min} and ${max}!`);
}

/**
 * @private
 */
function __assertIndexInRange<T>(self: __Collection<T>, index: number): void {
    __assertCollection(self);
    __assert(__isNumeric(index), 'number', index);
    __assert(index >= 0 && index < self.count(), 'Index is out of bounds');
}
