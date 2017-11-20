import {Collection} from "../Collection";
import {__getParameterCount, __isNative} from "./utils";

export function __isArray<T>(obj: Array<T> | any): obj is Array<T> {
    return obj instanceof ([]).constructor;
}

export function __isFunction(obj: any): obj is Function {
    return typeof obj === 'function';
}

export function __isNumeric(n: any): n is number {
    return !isNaN(parseFloat(n));
}

export function __isEmpty<T>(iterable: Iterable<T>): boolean {
    return iterable[Symbol.iterator]().next().done;
}

export function __isIterable<T>(obj: Iterable<T> | any): obj is Iterable<T> {
    return (Symbol.iterator in Object(obj));
}

export function __isString(obj: any): obj is string {
    return typeof obj === 'string';
}

export function __isCollection<T>(obj: Collection<T> | any): obj is Collection<T> {
    return obj instanceof Collection;
}

export function __isGenerator<T>(obj: (() => Iterator<T>) | any): obj is () => Iterator<T> {
    return obj instanceof (function* (): any {
    }).constructor;
}

export function __isUndefined(obj: any): obj is undefined {
    return typeof obj === typeof undefined;
}

export function __isPredicate<T>(obj: ((v: T) => boolean) | any): obj is (v: T) => boolean {
    return !__isNative(obj) && __isFunction(obj) && __getParameterCount(obj) == 1;
}
