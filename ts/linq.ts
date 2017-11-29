export const Collection: CollectionStatic = __Collection;
export default Collection;

/**
 * Patches the given prototype to have quick access to all collection methods.
 *
 * @param prototype Prototype to be patched.
 */
export function extendIterablePrototype(prototype: any): void {
    for (let key of Object.keys(__Collection.prototype)) {
        if (!key.startsWith('_') && __isFunction((<any>__Collection).prototype[key])) {
            prototype[key] = function (...args: any[]): any {
                let collection: any = __Collection.From(this);
                return collection[key].call(collection, ...args);
            }
        }
    }
}

// patch prototypes
extendIterablePrototype((<any>window).Array.prototype);
interface Array<T> extends Collection<T> {}

extendIterablePrototype((<any>window).Set.prototype);
interface Set<T> extends Collection<T> {}

extendIterablePrototype((<any>window).Map.prototype);
interface Map<K, V> extends Collection<[K, V]> {}
