import {Collection} from "../Collection";
import {__isArray, __isCollection, __isEmpty, __isFunction, __isIterable, __isNumeric} from "./is";

/**
 * @internal
 */
export class AssertionError extends Error {

    /**
     * @internal
     */
    constructor(expected: string, got: any) {
        super(`Expected ${expected}, got ${got}!`);
    }
}

/**
 * @internal
 */
export function __assert(condition: boolean, ...args: any[]): void {
    if (!condition) {
        if (args.length === 1) {
            throw new Error(args[0]);
        } else if (args.length === 2) {
            throw new AssertionError(args[0], args[1]);
        }
    }
}

/**
 * @internal
 */
export function __assertFunction(param: Function): void {
    __assert(__isFunction(param), 'function', param);
}

/**
 * @internal
 */
export function __assertArray<T>(param: Array<T>): void {
    __assert(__isArray(param), 'array', param);
}

/**
 * @internal
 */
export function __assertNotEmpty(self: any): void {
    __assert(!__isEmpty(self), 'Sequence is empty!');
}

/**
 * @internal
 */
export function __assertIterable<T>(obj: Iterable<T>): void {
    __assert(__isIterable(obj), 'iterable', obj);
}

/**
 * @internal
 */
export function __assertCollection<T>(obj: Collection<T>): void {
    __assert(__isCollection(obj), 'collection', obj);
}

/**
 * @internal
 */
export function __assertNumeric(obj: number): void {
    __assert(__isNumeric(obj), 'numeric value', obj);
}

/**
 * @internal
 */
export function __assertNumberBetween(num: number, min: number, max: number = Infinity): void {
    __assertNumeric(num);
    __assert(num >= min && num <= max, `Number must be between ${min} and ${max}!`);
}

/**
 * @internal
 */
export function __assertIndexInRange<T>(self: Collection<T>, index: number): void {
    __assertCollection(self);
    __assert(__isNumeric(index), 'number', index);
    __assert(index >= 0 && index < self.Count(), 'Index is out of bounds');
}
