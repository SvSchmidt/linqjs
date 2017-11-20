import {__assertArray, __assertFunction, __assertIterable, __assertNotEmpty} from "./assert";
import {Collection} from "../Collection";
import {__defaultEqualityCompareFn} from "./default";

export function __toJSON(obj: any): string {
    return JSON.stringify(obj)
}

export function __assign<T, S>(target: T, source: S): T & S {
    return Object.assign({}, target, source);
}

export function __paramOrValue<P, V>(param: P, value: V): P | V {
    return typeof param === 'undefined'
        ? value
        : param
}

export function __aggregateCollection<T, V, R>(coll: Collection<T>, seed: V, accumulator: (v: V, t: T) => V, resultTransformFn: (v: V) => R): R {
    __assertFunction(accumulator);
    __assertFunction(resultTransformFn);
    __assertNotEmpty(coll);

    return resultTransformFn([<any>seed].concat(coll).reduce(accumulator))
}

export function __removeDuplicates<T>(coll: Collection<T>, equalityCompareFn: (a: T, b: T) => boolean = __defaultEqualityCompareFn): Collection<T> {
    __assertIterable(coll);
    __assertFunction(equalityCompareFn);

    const previous: Array<T> = [];

    return new Collection(function* () {
        outer: for (let val of coll) {
            for (let prev of previous) {
                if (equalityCompareFn(val, prev)) {
                    continue outer;
                }
            }

            previous.push(val);

            yield val
        }
    })
}

export function __removeFromArray<T>(arr: Array<T>, value: T): boolean {
    __assertArray(arr);

    let elementsBefore: Array<T> = [];
    let elementFound: boolean;
    let current: T;

    // remove all elements from the array (shift) and push them into a temporary variable until the desired element was found
    while ((current = arr.shift()) && !(elementFound = __defaultEqualityCompareFn(current, value))) {
        elementsBefore.push(current)
    }

    // add the temporary values back to the array (to the front)
    // -> unshift modifies the original array instead of returning a new one
    arr.unshift(...elementsBefore);

    return elementFound;
}

const __nativeConstructors = [Object, Number, Boolean, String, Symbol];

export function __isNative(obj: any): boolean {
    return /native code/.test(Object(obj).toString()) || !!~__nativeConstructors.indexOf(obj)
}

export function __getDefault(constructorOrValue: any = Object): any {
    if (constructorOrValue && __isNative(constructorOrValue) && typeof constructorOrValue === 'function') {
        let defaultValue = constructorOrValue();

        if (defaultValue instanceof Object || constructorOrValue === Date) {
            return null
        } else {
            return defaultValue
        }
    }

    return constructorOrValue
}

export function __getParameterCount(fn: Function): number {
    __assertFunction(fn);

    return fn.length
}

export function __getComparatorFromKeySelector<T, K>(selector: ((e: T) => K) | string, comparator: (a: K, b: K) => number = defaultComparator): (a: T, b: T) => number {
    if (isFunction(selector)) {
        return new Function('comparator', 'keySelectorFn', 'a', 'b', `return comparator(keySelectorFn(a), keySelectorFn(b))`).bind(null, comparator, selector);
    } else if (isString(selector)) {
        if (!(selector.startsWith('[') || selector.startsWith('.'))) {
            selector = `.${selector}`;
        }

        return new Function('comparator', 'a', 'b', `return comparator(a${selector}, b${selector})`).bind(null, comparator);
    }
}