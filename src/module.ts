import {CollectionStatic} from "./CollectionStatic";
import {__Collection} from "./internal/Collection";
import {__isFunction} from "./helper/is";

export const Collection: CollectionStatic = __Collection;
export default Collection;

/**
 * Extends the given prototype to have quick access to all collection methods.
 *
 * @param prototype Prototype to be patched.
 * @param exclude List of method names to exclude from patching.
 * @throws Will throw an error if a method would be overwritten.
 *
 * @see {@link extendNativeTypes} to extend Javascript's native iterables.
 */
export function extendIterablePrototype(prototype: any, exclude: string[] = []): void {

    // always exclude the constructor
    exclude.push("constructor");
    let ex = Collection.from(exclude);

    // check for conflicts
    let patchProperties: string[] = [];
    for (let key of Object.getOwnPropertyNames(Object.getPrototypeOf(Collection.empty))) {
        if (!key.startsWith('_') && !ex.contains(key) && __isFunction((<any>Collection.empty)[key])) {
            if (key in prototype) {
                throw new Error(`The method "${key}" already exists on the "${prototype.constructor && prototype.constructor.name}" prototype. ` +
                    `Use the exclude parameter to patch without this method.`);
            } else {
                patchProperties.push(key);
            }
        }
    }

    // path prototype
    for (let key of patchProperties) {
        prototype[key] = function (...args: any[]): any {
            let collection: any = Collection.from(this);
            return collection[key].call(collection, ...args);
        };
    }
}

/**
 * Extends the native collections to have quick access to all collection methods.
 *
 * This method extends the prototypes of Array, Map and Set.
 *
 * @see {@link extendIterablePrototype} to extend custom iterables.
 */
export function extendNativeTypes() {
    extendIterablePrototype(Array.prototype, ["concat", "forEach", "indexOf", "join", "lastIndexOf", "reverse"]);

    const originalJoin = Array.prototype.join;
    Array.prototype.join = function (...args: any[]): any {
        if (args.length == 4 || args.length == 5) {
            let collection: any = Collection.from(this);
            return collection.join.call(collection, ...args);
        }
        return originalJoin.call(this, ...args);
    };

    const originalIndexOf = Array.prototype.indexOf;
    Array.prototype.indexOf = function (...args: any[]): any {
        if (args.length == 2 && __isFunction(args[1])) {
            let collection: any = Collection.from(this);
            return collection.indexOf.call(collection, ...args);
        }
        return originalIndexOf.call(this, ...args);
    };

    const originalLastIndexOf = Array.prototype.lastIndexOf;
    Array.prototype.lastIndexOf = function (...args: any[]): any {
        if (args.length == 2 && __isFunction(args[1])) {
            let collection: any = Collection.from(this);
            return collection.lastIndexOf.call(collection, ...args);
        }
        return originalLastIndexOf.call(this, ...args);
    };

    extendIterablePrototype(Map.prototype, ["add", "forEach"]);

    extendIterablePrototype(Set.prototype, ["add", "forEach"]);
}
