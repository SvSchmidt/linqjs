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

const maxValue  = 1000000;
const maxRepeat = 10;

function generateRandomNumberObjectList() {
    function getRandomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    const length = getRandomNumber(0, maxValue);
    var result = [];
    for (var i = 0; i < length; i++) {
        result.push({
            a: getRandomNumber(-1 * maxValue, maxValue),
            b: getRandomNumber(-1 * maxValue, maxValue),
            c: getRandomNumber(-1 * maxValue, maxValue),
            d: getRandomNumber(-1 * maxValue, maxValue),
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
            const Linq = Array.prototype.Linq;
            const GetComparatorFromKeySelector = Array.prototype.GetComparatorFromKeySelector;
            const OrderedLinqCollection = Array.prototype.OrderedLinqCollection;

            for (var values of tests) {
                var a = values[0];
                var b = values[1];
                var selector = values[2];
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
            it('shoult order the collection properly', function () {
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

                for (var i; i < maxRepeat; i++) {
                    const list = generateRandomNumberObjectList();

                    var sorted = list.slice(0);
                    sorted.sort(comparatorA);

                    expect(Linq(list).OrderBy(comparatorA).ToArray()).to.be.deep.equal(sorted);
                }
            })
        })

        describe('OrderBy.ThenBy', function () {
            it('should order the collection with respect to subelements properly', function () {
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

                for (var i; i < maxRepeat; i++) {
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

                for (var i; i < maxRepeat; i++) {
                    const list = generateRandomNumberObjectList();

                    var sorted = list.slice(0);
                    sorted.sort(comparatorA);
                    sorted = sorted.reverse();

                    expect(Linq(list).OrderBy(comparatorA).ToArray()).to.be.deep.equal(sorted);
                }
            })
        })

        describe('OrderByDescending.ThenBy', function () {
            it('should order the collection with respect to subelements properly by descending order', function () {
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

                for (var i; i < maxRepeat; i++) {
                    const list = generateRandomNumberObjectList();

                    var sorted = list.slice(0);
                    sorted.sort(comparatorFull);
                    sorted = sorted.reverse();

                    const collection = Linq(list)
                            .OrderBy(comparatorA)
                            .ThenBy(comparatorB)
                            .ThenBy(comparatorC)
                            .ThenBy(comparatorD);

                    expect(collection.ToArray()).to.be.deep.equal(sorted);
                }
            })
        })
    })
})