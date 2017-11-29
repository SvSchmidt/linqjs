function __isArray<T>(obj: Array<T> | any): obj is Array<T> {
    return obj instanceof ([]).constructor;
}

function __isFunction(obj: any): obj is Function {
    return typeof obj === 'function';
}

function __isNumeric(n: any): n is number {
    return !isNaN(parseFloat(n));
}

function __isEmpty<T>(iterable: Iterable<T>): boolean {
    return iterable[Symbol.iterator]().next().done;
}

function __isIterable<T>(obj: Iterable<T> | any): obj is Iterable<T> {
    return (Symbol.iterator in Object(obj));
}

function __isString(obj: any): obj is string {
    return typeof obj === 'string';
}

function __isCollection<T>(obj: Collection<T> | any): obj is Collection<T> {
    return obj instanceof __Collection;
}

function __isGenerator<T>(obj: (() => Iterator<T>) | any): obj is () => Iterator<T> {
    return obj instanceof (function* (): any {
    }).constructor;
}

function __isUndefined(obj: any): obj is undefined {
    return typeof obj === typeof undefined;
}

function __isPredicate<T>(obj: ((v: T) => boolean) | any): obj is (v: T) => boolean {
    return !__isNative(obj) && __isFunction(obj) && __getParameterCount(obj) == 1;
}