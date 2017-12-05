class __AssertionError extends Error {
    constructor(expected: string, got: any) {
        super(`Expected ${expected}, got ${got}!`);
    }
}

function __assert(condition: boolean, ...args: any[]): void {
    if (!condition) {
        if (args.length === 1) {
            throw new Error(args[0]);
        } else if (args.length === 2) {
            throw new __AssertionError(args[0], args[1]);
        }
    }
}

function __assertFunction(param: Function): void {
    __assert(__isFunction(param), 'function', param);
}

function __assertArray<T>(param: Array<T>): void {
    __assert(__isArray(param), 'array', param);
}

function __assertNotEmpty(self: any): void {
    __assert(!__isEmpty(self), 'Sequence is empty!');
}

function __assertIterable<T>(obj: Iterable<T>): void {
    __assert(__isIterable(obj), 'iterable', obj);
}

function __assertCollection<T>(obj: __Collection<T>): void {
    __assert(__isCollection(obj), 'collection', obj);
}

function __assertNumeric(obj: number): void {
    __assert(__isNumeric(obj), 'numeric value', obj);
}

function __assertNumberBetween(num: number, min: number, max: number = Infinity): void {
    __assertNumeric(num);
    __assert(num >= min && num <= max, `Number must be between ${min} and ${max}!`);
}

function __assertIndexInRange<T>(self: __Collection<T>, index: number): void {
    __assertCollection(self);
    __assert(__isNumeric(index), 'number', index);
    __assert(index >= 0 && index < self.Count(), 'Index is out of bounds');
}