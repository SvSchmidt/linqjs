/**
 * @private
 */
function __isArray<T>(obj: Array<T> | any): obj is Array<T> {
    return obj instanceof ([]).constructor;
}

/**
 * @private
 */
function __isFunction(obj: any): obj is Function {
    return typeof obj === 'function';
}

/**
 * @private
 */
function __isNumeric(n: any): n is number {
    return !isNaN(parseFloat(n));
}

/**
 * @private
 */
function __isEmpty<T>(iterable: Iterable<T>): boolean {
    return iterable[Symbol.iterator]().next().done;
}

/**
 * @private
 */
function __isIterable<T>(obj: Iterable<T> | any): obj is Iterable<T> {
    return (Symbol.iterator in Object(obj));
}

/**
 * @private
 */
function __isString(obj: any): obj is string {
    return typeof obj === 'string';
}

/**
 * @private
 */
function __isCollection<T>(obj: __Collection<T> | any): obj is __Collection<T> {
    return obj instanceof __Collection;
}

/**
 * @private
 */
function __isGenerator<T>(obj: (() => Iterator<T>) | any): obj is () => Iterator<T> {
    return obj instanceof (function* (): any {
    }).constructor;
}

/**
 * @private
 */
function __isUndefined(obj: any): obj is undefined {
    return typeof obj === typeof undefined;
}

/**
 * @private
 */
function __isPredicate<T>(obj: ((v: T) => boolean) | any): obj is (v: T) => boolean {
    return !__isNative(obj) && __isFunction(obj) && __getParameterCount(obj) == 1;
}

/**
 * @private
 */
const __nativeConstructors = [Object, Number, Boolean, String, Symbol];

/**
 * @private
 */
function __isNative(obj: any): boolean {
    return /native code/.test(Object(obj).toString()) || !!~__nativeConstructors.indexOf(obj);
}
