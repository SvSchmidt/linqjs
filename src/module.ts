export const Collection: CollectionStatic = __Collection;
export default Collection;

/**
 * Patches the given prototype to have quick access to all collection methods.
 *
 * @param prototype Prototype to be patched.
 */
export function extendIterablePrototype(prototype: any): void {
    for (let key of Object.getOwnPropertyNames(Object.getPrototypeOf(Collection.Empty))) {
        if (!key.startsWith('_') && __isFunction((<any>Collection.Empty)[key])) {
            prototype[key] = function (...args: any[]): any {
                let collection: any = Collection.from(this);
                return collection[key].call(collection, ...args);
            }
        }
    }
}
