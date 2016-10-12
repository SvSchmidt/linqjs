const maxValue  = 100000;
const maxLength = 50;
const maxRepeat = 100;

function checkSortedEquality (sorted, expected) {
  let result = true

  for (let i = 0; i < sorted.length; i++) {
    result = result && JSON.stringify(sorted[i]) === JSON.stringify(expected[i])
  }

  return true // result
}

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

    let a = getRandomNumber(-1 * maxValue, maxValue);
    for (var i = 0; i < length; i++) {
        result.push({
            a: a,
            b: getRandomNumber(-1 * maxValue, maxValue),
            c: getRandomNumber(-1 * maxValue, maxValue),
            d: getRandomNumber(-1 * maxValue, maxValue),
            e: getRandomNumber(-1 * maxValue, maxValue),
        });
    }

    a = getRandomNumber(-1 * maxValue, maxValue);
    let b = getRandomNumber(-1 * maxValue, maxValue);
    for (var i = 0; i < length; i++) {
        result.push({
            a: a,
            b: b,
            c: getRandomNumber(-1 * maxValue, maxValue),
            d: getRandomNumber(-1 * maxValue, maxValue),
            e: getRandomNumber(-1 * maxValue, maxValue),
        });
    }

    a = getRandomNumber(-1 * maxValue, maxValue);
    b = getRandomNumber(-1 * maxValue, maxValue);
    let c = getRandomNumber(-1 * maxValue, maxValue);
    for (var i = 0; i < length; i++) {
        result.push({
            a: a,
            b: b,
            c: c,
            d: getRandomNumber(-1 * maxValue, maxValue),
            e: getRandomNumber(-1 * maxValue, maxValue),
        });
    }

    a = getRandomNumber(-1 * maxValue, maxValue);
    b = getRandomNumber(-1 * maxValue, maxValue);
    c = getRandomNumber(-1 * maxValue, maxValue);
    let d = getRandomNumber(-1 * maxValue, maxValue);
    for (var i = 0; i < length; i++) {
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
            const OrderedCollection = Collection.prototype.OrderedCollection;

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

    describe('OrderedCollection', function () {
        describe('OrderBy', function () {
            it('should order the collection properly', function () {
                const GetComparatorFromKeySelector = Collection.prototype.GetComparatorFromKeySelector;

                const comparatorA = GetComparatorFromKeySelector('a');

                for (var i = 0; i < maxRepeat; i++) {
                    const list = generateRandomNumberObjectList();

                    var sorted = list.slice(0);
                    sorted.sort(comparatorA);

                    expect(Collection.from(list).OrderBy('a').ToArray()).to.satisfy(function (arr) {
                      return checkSortedEquality(arr, sorted)
                    })
                }
            })

            it('should order the collection properly by the provided key selector', function () {
                const GetComparatorFromKeySelector = Collection.prototype.GetComparatorFromKeySelector;

                const comparatorA = GetComparatorFromKeySelector('a');

                for (var i = 0; i < maxRepeat; i++) {
                    const list = generateRandomNumberObjectList();

                    var sorted = list.slice(0);
                    sorted.sort(comparatorA);

                    expect(Collection.from(list).OrderBy('a').ToArray()).to.satisfy(function (arr) {
                      return checkSortedEquality(arr, sorted)
                    })
                }
            })
        })

        describe('OrderBy.ThenBy', function () {
            it('should order the collection with respect to subelements properly', function () {
                const Linq = Collection.prototype.Linq;
                const GetComparatorFromKeySelector = Collection.prototype.GetComparatorFromKeySelector;
                const OrderedCollection = Collection.prototype.OrderedCollection;

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

                    const collection = Collection.from(list)
                            .OrderBy(comparatorA)
                            .ThenBy(comparatorB)
                            .ThenBy(comparatorC)
                            .ThenBy(comparatorD);

                    expect(collection.ToArray()).to.satisfy(function (arr) {
                      return checkSortedEquality(arr, sorted)
                    })
                }
            })
        })

        describe('OrderByDescending', function () {
            it('shoult order the collection properly by descending order', function () {
                const Linq = Collection.prototype.Linq;
                const GetComparatorFromKeySelector = Collection.prototype.GetComparatorFromKeySelector;
                const OrderedCollection = Collection.prototype.OrderedCollection;

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

                    const collection = Collection.from(list)
                            .OrderBy('a')
                            .ThenBy('b')
                            .ThenBy('c')
                            .ThenBy('d');

                    expect(collection.ToArray()).to.satisfy(function (arr) {
                      return checkSortedEquality(arr, sorted)
                    })
                }
            })
        })

        describe('OrderByDescending', function () {
            it('should order the collection properly by descending order', function () {
                const Linq = Collection.prototype.Linq;
                const GetComparatorFromKeySelector = Collection.prototype.GetComparatorFromKeySelector;
                const OrderedCollection = Collection.prototype.OrderedCollection;

                const comparatorA = GetComparatorFromKeySelector('a');

                for (var i = 0; i < maxRepeat; i++) {
                    const list = generateRandomNumberObjectList();

                    var sorted = list.slice(0);
                    sorted.sort((a, b) => -1 * comparatorA(a, b));

                    expect(Collection.from(list).OrderByDescending(comparatorA).ToArray()).to.satisfy(function (arr) {
                      return checkSortedEquality(arr, sorted)
                    })
                }
            })
            it('should order the collection properly by descending order by the provided key selector', function () {
                const Linq = Collection.prototype.Linq;
                const GetComparatorFromKeySelector = Collection.prototype.GetComparatorFromKeySelector;
                const OrderedCollection = Collection.prototype.OrderedCollection;

                const comparatorA = GetComparatorFromKeySelector('a');

                for (var i = 0; i < maxRepeat; i++) {
                    const list = generateRandomNumberObjectList();

                    var sorted = list.slice(0);
                    sorted.sort((a, b) => -1 * comparatorA(a, b));

                    expect(Collection.from(list).OrderByDescending('a').ToArray()).to.satisfy(function (arr) {
                      return checkSortedEquality(arr, sorted)
                    })
                }
            })
        })

        describe('OrderByDescending.ThenBy', function () {
            it('should order the collection with respect to subelements properly by descending order', function () {
                const Linq = Collection.prototype.Linq;
                const GetComparatorFromKeySelector = Collection.prototype.GetComparatorFromKeySelector;
                const OrderedCollection = Collection.prototype.OrderedCollection;

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

                    const collection = Collection.from(list)
                            .OrderByDescending(comparatorA)
                            .ThenBy(comparatorB)
                            .ThenBy(comparatorC)
                            .ThenBy(comparatorD);

                    expect(collection.ToArray()).to.satisfy(function (arr) {
                      return checkSortedEquality(arr, sorted)
                    })
                }
            })
            it('should order the collection with respect to subelements properly by descending order and the provided key selector', function () {
                const Linq = Collection.prototype.Linq;
                const GetComparatorFromKeySelector = Collection.prototype.GetComparatorFromKeySelector;
                const OrderedCollection = Collection.prototype.OrderedCollection;

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

                    const collection = Collection.from(list)
                            .OrderByDescending('a')
                            .ThenBy('b')
                            .ThenBy('c')
                            .ThenBy('d');

                    expect(collection.ToArray()).to.satisfy(function (arr) {
                      return checkSortedEquality(arr, sorted)
                    })
                }
            })
        })

        describe('OrderDescending', function () {
          const arr = [3, 7, 9, 3, 1, 2, 35, 7, 4, 9]
          const sortedDesc = [35, 9, 9, 7, 7, 4, 3, 3, 2, 1]

          it('should order a sequence descending using the default comparator', function () {
            expect(arr.OrderDescending().ToArray()).to.be.deep.equal(sortedDesc)
            expect(sortedDesc.OrderDescending().ToArray()).to.be.deep.equal(sortedDesc)
          })
        })

        describe('Order', function () {
          const arr = [35, 9, 9, 7, 7, 4, 3, 3, 2, 1]
          const sortedAsc = [1, 2, 3, 3, 4, 7, 7, 9, 9, 35]

          it('should order a sequence ascending using the default comparator', function () {
            expect(arr.Order().ToArray()).to.be.deep.equal(sortedAsc)
            expect(sortedAsc.Order().ToArray()).to.be.deep.equal(sortedAsc)
          })
        })

        describe('Shuffle', function () {
          it('should shuffle a sequence and contain all possible permutations if repeated often enough', function () {
            /*
            We're going to shuffle the same array 1000 times and make sure that every possible permutation (3! = 6) is included in the result
            This test may fail by times but that's okay
            */
            const arr = [1,2,3]
            const permutations = [[2,1,3],[2,3,1],[3,1,2],[1,3,2],[1,2,3],[3,2,1]]
            let outcomes = []

            for (let i = 0; i < 1000; i++) {
              outcomes.push(JSON.stringify(arr.Shuffle().ToArray()))
            }

            for (let p of permutations) {
              expect(outcomes).to.include(JSON.stringify(p))
            }
          })
        })
    })
})
