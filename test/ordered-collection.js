'use strict';

const expect = require('chai').expect

if (process.env.IS_COVERAGE) {
    describe('Test coverage', function () {
        it('should generate instrumentation', function (done) {
              require('child_process').exec('$(npm root)/.bin/jscoverage dist coverage/dist', done)
        });

        it('should load coverage module', function () {
            require('../coverage/dist/linq.js').install()
        });
    });
} else {
    require('../dist/linq').install()
}

const maxValue  = 100000;
const maxLength = 100;
const maxRepeat = 10;

function generateRandomNumberObjectList() {
    function getRandomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    const length = getRandomNumber(0, maxLength) / 5;
    var result = [];

    for (var i = 0; i < length; i++) {
        result.push({
            a: getRandomNumber(-1 * maxValue, maxValue),
            b: getRandomNumber(-1 * maxValue, maxValue),
            c: getRandomNumber(-1 * maxValue, maxValue),
            d: getRandomNumber(-1 * maxValue, maxValue),
            e: getRandomNumber(-1 * maxValue, maxValue),
        });
    }

    for (var i = 0; i < length; i++) {
        const a = getRandomNumber(-1 * maxValue, maxValue);
        result.push({
            a: a,
            b: getRandomNumber(-1 * maxValue, maxValue),
            c: getRandomNumber(-1 * maxValue, maxValue),
            d: getRandomNumber(-1 * maxValue, maxValue),
            e: getRandomNumber(-1 * maxValue, maxValue),
        });
    }

    for (var i = 0; i < length; i++) {
        const a = getRandomNumber(-1 * maxValue, maxValue);
        const b = getRandomNumber(-1 * maxValue, maxValue);
        result.push({
            a: a,
            b: b,
            c: getRandomNumber(-1 * maxValue, maxValue),
            d: getRandomNumber(-1 * maxValue, maxValue),
            e: getRandomNumber(-1 * maxValue, maxValue),
        });
    }

    for (var i = 0; i < length; i++) {
        const a = getRandomNumber(-1 * maxValue, maxValue);
        const b = getRandomNumber(-1 * maxValue, maxValue);
        const c = getRandomNumber(-1 * maxValue, maxValue);
        result.push({
            a: a,
            b: b,
            c: c,
            d: getRandomNumber(-1 * maxValue, maxValue),
            e: getRandomNumber(-1 * maxValue, maxValue),
        });
    }

    for (var i = 0; i < length; i++) {
        const a = getRandomNumber(-1 * maxValue, maxValue);
        const b = getRandomNumber(-1 * maxValue, maxValue);
        const c = getRandomNumber(-1 * maxValue, maxValue);
        const d = getRandomNumber(-1 * maxValue, maxValue);
        result.push({
            a: a,
            b: b,
            c: c,
            d: d,
            e: getRandomNumber(-1 * maxValue, maxValue),
        });
    }

    return result;
}

describe('ordered-collection.js', function () {
    describe('GetComparatorFromKeySelector', function () {
        const tests = [
            [{a: 12}, {a: 9}, 'a'],
            [{a: 12}, {a: 9}, 'b'],
            [{['foo bar baz']: 1}, {['foo bar baz']: 2}, '["foo bar baz"]'],
            [9, 3, ''],
        ];
        it('should generate a comparator that produces the same results as the "<", ">" & "==" operators', function () {
            const Linq = Collection.prototype.Linq;
            const GetComparatorFromKeySelector = Collection.prototype.GetComparatorFromKeySelector;
            const OrderedLinqCollection = Collection.prototype.OrderedLinqCollection;

            for (let [a, b, selector] of tests) {
                var comparator = GetComparatorFromKeySelector(selector);

                if (comparator(a, b) < 0) {
                    expect(comparator(b, a)).to.be.above(0);
                }
                if (comparator(a, b) == 0) {
                    expect(comparator(b, a)).to.be.equal(0);
                }
                if (comparator(a, b) > 0) {
                    expect(comparator(b, a)).to.be.below(0);
                }
            }
        })
    })

    describe('OrderedLinqCollection', function () {
        describe('OrderBy', function () {
            it('should order the collection properly', function () {
                const Linq = Collection.prototype.Linq;
                const GetComparatorFromKeySelector = Collection.prototype.GetComparatorFromKeySelector;
                const OrderedLinqCollection = Collection.prototype.OrderedLinqCollection;

                const comparatorA = GetComparatorFromKeySelector('a');
                const comparatorB = GetComparatorFromKeySelector('b');
                const comparatorC = GetComparatorFromKeySelector('c');
                const comparatorD = GetComparatorFromKeySelector('d');

                const comparatorFull = function (a, b) {
                    return comparatorA(a, b) || comparatorB(a, b) || comparatorC(a, b) || comparatorD(a, b);
                };

                for (var i = 0; i < maxRepeat; i++) {
                    const list = generateRandomNumberObjectList();

                    var sorted = list.slice(0);
                    sorted.sort(comparatorA);

                    expect(Linq(list).OrderBy(comparatorA).ToArray()).to.be.deep.equal(sorted);
                }
            })

            it('should order the collection properly by the provided key selector', function () {
                const Linq = Array.prototype.Linq;
                const GetComparatorFromKeySelector = Array.prototype.GetComparatorFromKeySelector;
                const OrderedLinqCollection = Array.prototype.OrderedLinqCollection;

                const comparatorA = GetComparatorFromKeySelector('a');

                for (var i = 0; i < maxRepeat; i++) {
                    const list = generateRandomNumberObjectList();

                    var sorted = list.slice(0);
                    sorted.sort(comparatorA);

                    expect(Linq(list).OrderBy('a').ToArray()).to.be.deep.equal(sorted);
                }
            })
        })

        describe('OrderBy.ThenBy', function () {
            it('should order the collection with respect to subelements properly', function () {
                const Linq = Collection.prototype.Linq;
                const GetComparatorFromKeySelector = Collection.prototype.GetComparatorFromKeySelector;
                const OrderedLinqCollection = Collection.prototype.OrderedLinqCollection;

                const comparatorA = GetComparatorFromKeySelector('a');
                const comparatorB = GetComparatorFromKeySelector('b');
                const comparatorC = GetComparatorFromKeySelector('c');
                const comparatorD = GetComparatorFromKeySelector('d');

                const comparatorFull = function (a, b) {
                    return comparatorA(a, b) || comparatorB(a, b) || comparatorC(a, b) || comparatorD(a, b);
                };

                for (var i = 0; i < maxRepeat; i++) {
                    const list = generateRandomNumberObjectList();

                    var sorted = list.slice(0);
                    sorted.sort(comparatorFull);

                    const collection = Linq(list)
                            .OrderBy(comparatorA)
                            .ThenBy(comparatorB)
                            .ThenBy(comparatorC)
                            .ThenBy(comparatorD);

                    expect(collection.ToArray()).to.be.deep.equal(sorted);
                }
            })
        })

        describe('OrderByDescending', function () {
            it('shoult order the collection properly by descending order', function () {
                const Linq = Collection.prototype.Linq;
                const GetComparatorFromKeySelector = Collection.prototype.GetComparatorFromKeySelector;
                const OrderedLinqCollection = Collection.prototype.OrderedLinqCollection;

                const comparatorA = GetComparatorFromKeySelector('a');
                const comparatorB = GetComparatorFromKeySelector('b');
                const comparatorC = GetComparatorFromKeySelector('c');
                const comparatorD = GetComparatorFromKeySelector('d');

                const comparatorFull = function (a, b) {
                    return comparatorA(a, b) || comparatorB(a, b) || comparatorC(a, b) || comparatorD(a, b);
                };

                for (var i = 0; i < maxRepeat; i++) {
                    const list = generateRandomNumberObjectList();

                    var sorted = list.slice(0);
                    sorted.sort(comparatorFull);

                    const collection = Linq(list)
                            .OrderBy('a')
                            .ThenBy('b')
                            .ThenBy('c')
                            .ThenBy('d');

                    expect(collection.ToArray()).to.be.deep.equal(sorted);
                }
            })
        })

        describe('OrderByDescending', function () {
            it('should order the collection properly by descending order', function () {
                const Linq = Array.prototype.Linq;
                const GetComparatorFromKeySelector = Array.prototype.GetComparatorFromKeySelector;
                const OrderedLinqCollection = Array.prototype.OrderedLinqCollection;

                const comparatorA = GetComparatorFromKeySelector('a');

                for (var i = 0; i < maxRepeat; i++) {
                    const list = generateRandomNumberObjectList();

                    var sorted = list.slice(0);
                    sorted.sort((a, b) => -1 * comparatorA(a, b));

                    expect(Linq(list).OrderByDescending(comparatorA).ToArray()).to.be.deep.equal(sorted);
                }
            })
            it('should order the collection properly by descending order by the provided key selector', function () {
                const Linq = Array.prototype.Linq;
                const GetComparatorFromKeySelector = Array.prototype.GetComparatorFromKeySelector;
                const OrderedLinqCollection = Array.prototype.OrderedLinqCollection;

                const comparatorA = GetComparatorFromKeySelector('a');

                for (var i = 0; i < maxRepeat; i++) {
                    const list = generateRandomNumberObjectList();

                    var sorted = list.slice(0);
                    sorted.sort((a, b) => -1 * comparatorA(a, b));

                    expect(Linq(list).OrderByDescending('a').ToArray()).to.be.deep.equal(sorted);
                }
            })
        })

        describe('OrderByDescending.ThenBy', function () {
            it('should order the collection with respect to subelements properly by descending order', function () {
                const Linq = Collection.prototype.Linq;
                const GetComparatorFromKeySelector = Collection.prototype.GetComparatorFromKeySelector;
                const OrderedLinqCollection = Collection.prototype.OrderedLinqCollection;

                const comparatorA = GetComparatorFromKeySelector('a');
                const comparatorB = GetComparatorFromKeySelector('b');
                const comparatorC = GetComparatorFromKeySelector('c');
                const comparatorD = GetComparatorFromKeySelector('d');

                const comparatorFull = function (a, b) {
                    return comparatorA(a, b) || comparatorB(a, b) || comparatorC(a, b) || comparatorD(a, b);
                };

                for (var i = 0; i < maxRepeat; i++) {
                    const list = generateRandomNumberObjectList();

                    var sorted = list.slice(0);
                    sorted.sort((a, b) => -1 * comparatorFull(a, b));

                    const collection = Linq(list)
                            .OrderByDescending(comparatorA)
                            .ThenBy(comparatorB)
                            .ThenBy(comparatorC)
                            .ThenBy(comparatorD);

                    expect(collection.ToArray()).to.be.deep.equal(sorted);
                }
            })
            it('should order the collection with respect to subelements properly by descending order and the provided key selector', function () {
                const Linq = Array.prototype.Linq;
                const GetComparatorFromKeySelector = Array.prototype.GetComparatorFromKeySelector;
                const OrderedLinqCollection = Array.prototype.OrderedLinqCollection;

                const comparatorA = GetComparatorFromKeySelector('a');
                const comparatorB = GetComparatorFromKeySelector('b');
                const comparatorC = GetComparatorFromKeySelector('c');
                const comparatorD = GetComparatorFromKeySelector('d');

                const comparatorFull = function (a, b) {
                    return comparatorA(a, b) || comparatorB(a, b) || comparatorC(a, b) || comparatorD(a, b);
                };

                for (var i = 0; i < maxRepeat; i++) {
                    const list = generateRandomNumberObjectList();

                    var sorted = list.slice(0);
                    sorted.sort((a, b) => -1 * comparatorFull(a, b));

                    const collection = Linq(list)
                            .OrderByDescending('a')
                            .ThenBy('b')
                            .ThenBy('c')
                            .ThenBy('d');

                    expect(collection.ToArray()).to.be.deep.equal(sorted);
                }
            })
        })
    })
})
