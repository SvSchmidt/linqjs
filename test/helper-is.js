describe('helper/is', function () {

    function stringifyValue(value, indent) {
        indent = indent || '';
        if (typeof value === 'function' || typeof value === 'symbol' || typeof value === 'number') {
            return value.toString();
        }
        if (value === undefined) {
            return 'undefined';
        }
        if (Array.isArray(value)) {
            const buffer = ['[\n'];
            for (const element of value) {
                buffer.push(indent, '  ', stringifyValue(element, indent + '    '), ',\n');
            }
            buffer.push(indent, ']');
            return buffer.join('');
        }
        if (typeof value === 'object' && value != null) {
            const buffer = ['Object(', value.constructor.name, '): {\n'];
            for (const key in value) {
                buffer.push(indent, '  ', key, ': ', stringifyValue(value[key], indent + '    '), ',\n');
            }
            buffer.push(indent, '}');
            return buffer.join('');
        }
        return JSON.stringify(value);
    }

    function* naturalNumberGenerator() {
        let i = 0;
        while (true) yield i++;
    }

    const functionValues = [() => {}, new Function(), function () { return 42;}];
    const numericValues = [0, 1, -1, Infinity, -Infinity, Number.MIN_VALUE, Number.MAX_VALUE, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
    for (let i = 0; i < 10; i++) {
        numericValues.push(Math.random() * (Number.MAX_SAFE_INTEGER - Number.MIN_SAFE_INTEGER) + Number.MIN_SAFE_INTEGER);
    }
    const nonNumericNumberValues = [-NaN, NaN];
    const emptyIterableValues = [[], new Array(0), Collection.empty, Collection.from([]), new Map()];
    const stringValues = ['foo', 'bar', 'baz', 'Gandalf', 'Thorin', 'Frodo', '9'];
    const iterableValues = [[1, 2, 3], stringValues, [9], [9, ...functionValues], ['9']];
    const collectionValues = [Collection.empty, Collection.from([]), Collection.from(naturalNumberGenerator)];
    const generatorValues = [function* () {}, naturalNumberGenerator];
    const predicateValues = [x => true, x => x > 42, function (x) { return false; }];
    const nativeValues = [Math.floor, parseFloat];
    const arrayValues = [[], functionValues, numericValues, nonNumericNumberValues, emptyIterableValues, stringValues, collectionValues, generatorValues, predicateValues, nativeValues];

    describe('_isArray', function () {
        it('should give true for array values', function () {
            for (const value of arrayValues) {
                expect(linq._isArray(value), 'Value: ' + stringifyValue(value)).to.be.true;
            }
        });
        it('should give false for non array values', function () {
            for (const value of [...functionValues, ...numericValues, ...nonNumericNumberValues, Collection.Empty, Collection.from([]), ...stringValues, ...collectionValues, ...generatorValues, ...predicateValues, ...nativeValues]) {
                expect(linq._isArray(value), 'Value: ' + stringifyValue(value)).to.be.false;
            }
        });
    });

    describe('_isFunction', function () {
        it('should give true for function values', function () {
            for (const value of [...functionValues, ...generatorValues, ...predicateValues, Math.floor, parseFloat]) {
                expect(linq._isFunction(value), 'Value: ' + stringifyValue(value)).to.be.true;
            }
        });
        it('should give false for non function values', function () {
            for (const value of [...numericValues, ...nonNumericNumberValues, ...emptyIterableValues, ...iterableValues, ...stringValues, ...collectionValues, Symbol.iterator, ...arrayValues]) {
                expect(linq._isFunction(value), 'Value: ' + stringifyValue(value)).to.be.false;
            }
        });
    });

    describe('_isNumeric', function () {
        it('should give true for numeric values', function () {
            for (const value of numericValues) {
                expect(linq._isNumeric(value), 'Value: ' + stringifyValue(value)).to.be.true;
            }
        });
        it('should give false for NaN values', function () {
            for (const value of nonNumericNumberValues) {
                expect(linq._isNumeric(value), 'Value: ' + stringifyValue(value)).to.be.false;
            }
        });
        it('should give false for non numeric values', function () {
            for (const value of [...functionValues, ...emptyIterableValues, ...iterableValues, ...stringValues, ...collectionValues, ...generatorValues, ...predicateValues, ...nativeValues, ...arrayValues]) {
                expect(linq._isNumeric(value), 'Value: ' + stringifyValue(value)).to.be.false;
            }
        });
    });

    describe('_isEmpty', function () {
        it('should give true for empty iterable values', function () {
            for (const value of [...emptyIterableValues]) {
                expect(linq._isEmpty(value), 'Value: ' + stringifyValue(value)).to.be.true;
            }
        });
        it('should give false for non-empty iterable values', function () {
            for (const value of [...functionValues, ...numericValues, ...nonNumericNumberValues, ...iterableValues, ...stringValues, ...generatorValues, ...predicateValues, ...nativeValues]) {
                expect(linq._isEmpty(value), 'Value: ' + stringifyValue(value)).to.be.false;
            }
        });
    });

    describe('_isIterable', function () {
        it('should give true for iterable values', function () {
            for (const value of [...emptyIterableValues, ...iterableValues, ...stringValues, ...collectionValues, ...arrayValues]) {
                expect(linq._isIterable(value), 'Value: ' + stringifyValue(value)).to.be.true;
            }
        });
        it('should give false for non iterable values', function () {
            for (const value of [...functionValues, ...numericValues, ...nonNumericNumberValues, ...generatorValues, ...predicateValues, ...nativeValues]) {
                expect(linq._isIterable(value), 'Value: ' + stringifyValue(value)).to.be.false;
            }
        });
    });

    describe('_isString', function () {
        it('should give true for string values', function () {
            for (const value of stringValues) {
                expect(linq._isString(value), 'Value: ' + stringifyValue(value)).to.be.true;
            }
        });
        it('should give false for non string values', function () {
            for (const value of [...functionValues, ...numericValues, ...nonNumericNumberValues, ...emptyIterableValues, ...iterableValues, ...collectionValues, ...generatorValues, ...predicateValues, ...nativeValues, ...arrayValues]) {
                expect(linq._isString(value), 'Value: ' + stringifyValue(value)).to.be.false;
            }
        });
    });

    describe('_isCollection', function () {
        it('should give true for collection values', function () {
            for (const value of [Collection.empty, Collection.from([]), ...collectionValues]) {
                expect(linq._isCollection(value), 'Value: ' + stringifyValue(value)).to.be.true;
            }
        });
        it('should give false for non collection values', function () {
            for (const value of [...functionValues, ...numericValues, ...nonNumericNumberValues, ...iterableValues, ...stringValues, ...generatorValues, ...predicateValues, ...nativeValues, ...arrayValues]) {
                expect(linq._isCollection(value), 'Value: ' + stringifyValue(value)).to.be.false;
            }
        });
    });

    describe('_isGenerator', function () {
        it('should give true for generator values', function () {
            for (const value of generatorValues) {
                expect(linq._isGenerator(value), 'Value: ' + stringifyValue(value)).to.be.true;
            }
        });
        it('should give false for non generator values', function () {
            for (const value of [...functionValues, ...numericValues, ...nonNumericNumberValues, ...emptyIterableValues, ...iterableValues, ...stringValues, ...collectionValues, ...predicateValues, ...nativeValues, ...arrayValues]) {
                expect(linq._isGenerator(value), 'Value: ' + stringifyValue(value)).to.be.false;
            }
        });
    });

    describe('_isUndefined', function () {
        it('should give true for undefined', function () {
            expect(linq._isUndefined(undefined), 'Value: undefined').to.be.true;
        });
        it('should give false for null', function () {
            expect(linq._isUndefined(null), 'Value: null').to.be.false;
        });
        it('should give false for defined values', function () {
            for (const value of [...functionValues, ...numericValues, ...nonNumericNumberValues, ...emptyIterableValues, ...iterableValues, ...stringValues, ...collectionValues, ...generatorValues, ...predicateValues, ...nativeValues, ...arrayValues]) {
                expect(linq._isUndefined(value), 'Value: ' + stringifyValue(value)).to.be.false;
            }
        });
    });

    describe('_isPredicate', function () {
        it('should give true for predicate values', function () {
            for (const value of predicateValues) {
                expect(linq._isPredicate(value), 'Value: ' + stringifyValue(value)).to.be.true;
            }
        });
        it('should give false for non-predicate values', function () {
            for (const value of [...functionValues, ...numericValues, ...nonNumericNumberValues, ...emptyIterableValues, ...iterableValues, ...stringValues, ...collectionValues, ...generatorValues, ...nativeValues, ...arrayValues]) {
                expect(linq._isPredicate(value), 'Value: ' + stringifyValue(value)).to.be.false;
            }
        });
    });

    describe('_isNative', function () {
        it('should give true for native values', function () {
            for (const value of nativeValues) {
                expect(linq._isNative(value), 'Value: ' + stringifyValue(value)).to.be.true;
            }
        });
        it('should give false for non-native values', function () {
            for (const value of [...functionValues, ...numericValues, ...nonNumericNumberValues, ...emptyIterableValues, ...iterableValues, ...stringValues, ...collectionValues, ...generatorValues, ...predicateValues, ...arrayValues]) {
                expect(linq._isNative(value), 'Value: ' + stringifyValue(value)).to.be.false;
            }
        });
    });
});

