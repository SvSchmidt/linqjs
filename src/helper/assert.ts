import {__Collection} from "../internal/Collection";
import {_isArray, _isCollection, _isEmpty, _isFunction, _isIterable, _isNumeric} from "./is";

/**
 * @private
 * @internal
 */
export class __AssertionError extends Error {
    constructor(expected: string, got: any) {
        super(`Expected ${expected}, got ${got}!`);
    }
}

/**
 * @private
 * @internal
 */
export function __assert(condition: boolean, ...args: any[]): void {
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
 * @internal
 */
export function __assertFunction(param: Function): void {
    __assert(_isFunction(param), 'function', param);
}

/**
 * @private
 * @internal
 */
export function __assertArray<T>(param: Array<T>): void {
    __assert(_isArray(param), 'array', param);
}

/**
 * @private
 * @internal
 */
export function __assertNotEmpty(self: any): void {
    __assert(!_isEmpty(self), 'Sequence is empty!');
}

/**
 * @private
 * @internal
 */
export function __assertIterable<T>(obj: Iterable<T>): void {
    __assert(_isIterable(obj), 'iterable', obj);
}

/**
 * @private
 * @internal
 */
function __assertCollection<T>(obj: __Collection<T>): void {
    __assert(_isCollection(obj), 'collection', obj);
}

/**
 * @private
 * @internal
 */
export function __assertNumeric(obj: number): void {
    __assert(_isNumeric(obj), 'numeric value', obj);
}

/**
 * @private
 * @internal
 */
export function __assertNumberBetween(num: number, min: number, max: number = Infinity): void {
    __assertNumeric(num);
    __assert(num >= min && num <= max, `Number must be between ${min} and ${max}!`);
}

/**
 * @private
 * @internal
 */
export function __assertIndexInRange<T>(self: __Collection<T>, index: number): void {
    __assertCollection(self);
    __assert(_isNumeric(index), 'number', index);
    __assert(index >= 0 && index < self.count(), 'Index is out of bounds');
}
