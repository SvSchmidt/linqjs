import {__Collection} from "../internal/Collection";
import {__getParameterCount} from "./utils";

/**
 * @private
 * @internal
 */
export function _isArray<T>(obj: Array<T> | any): obj is Array<T> {
    return obj instanceof Array;
}

/**
 * @private
 * @internal
 */
export function _isFunction(obj: any): obj is Function {
    return typeof obj === 'function';
}

/**
 * @private
 * @internal
 */
export function _isNumeric(n: any): n is number {
    return typeof n === 'number' && !isNaN(n);
}

/**
 * @private
 * @internal
 */
export function _isEmpty<T>(iterable: Iterable<T>): boolean {
    return _isIterable(iterable) && iterable[Symbol.iterator]().next().done;
}

/**
 * @private
 * @internal
 */
export function _isIterable<T>(obj: Iterable<T> | any): obj is Iterable<T> {
    return (Symbol.iterator in Object(obj));
}

/**
 * @private
 * @internal
 */
export function _isString(obj: any): obj is string {
    return typeof obj === 'string';
}

/**
 * @private
 * @internal
 */
export function _isCollection<T>(obj: __Collection<T> | any): obj is __Collection<T> {
    return obj instanceof __Collection;
}

/**
 * @private
 * @internal
 */
export function _isGenerator<T>(obj: (() => Iterator<T>) | any): obj is () => Iterator<T> {
    return obj instanceof (function* (): any {
    }).constructor;
}

/**
 * @private
 * @internal
 */
export function _isUndefined(obj: any): obj is undefined {
    return typeof obj === typeof undefined;
}

/**
 * @private
 * @internal
 */
export function _isPredicate<T>(obj: ((v: T) => boolean) | any): obj is (v: T) => boolean {
    return !_isNative(obj) && _isFunction(obj) && __getParameterCount(obj) == 1;
}

/**
 * @private
 * @internal
 */
const __nativeConstructors = [Object, Number, Boolean, String, Symbol];

/**
 * @private
 * @internal
 */
export function _isNative(obj: any): boolean {
    return (typeof obj === 'function' && /native code/.test(Object(obj).toString())) || !!~__nativeConstructors.indexOf(obj);
}
