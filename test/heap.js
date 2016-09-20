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

const MaxHeap = Array.prototype.MaxHeap;
const MinHeap = Array.prototype.MinHeap;
const DefaultComparator = Array.prototype.DefaultComparator;

function generateRandomNumberList() {
    function getRandomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    const length = getRandomNumber(0, maxValue);
    var result = [];
    for (var i = 0; i < length; i++) {
        result.push(getRandomNumber(-1 * maxValue, maxValue));
    }
    return result;
}

describe('heap.js', function () {
    describe('DefaultComparator', function () {
        const tests = [
                [12,9],
                [1,2],
                [[],[]],
                [{},{}],
                [function (a) {}, function (a,b) {}],
            ];
        it('should produce the same results as the "<", ">" & "==" operators', function () {
            for (var values of tests) {
                var a = values[0];
                var b = values[1];

                if (a < b) {
                    expect(DefaultComparator(a, b)).to.be.below(0);
                    expect(DefaultComparator(b, a)).to.be.above(0);
                }
                if (a == b) {
                    expect(DefaultComparator(a, b)).to.be.equal(0);
                    expect(DefaultComparator(b, a)).to.be.equal(0);
                }
                if (a > b) {
                    expect(DefaultComparator(a, b)).to.be.above(0);
                    expect(DefaultComparator(b, a)).to.be.below(0);
                }
            }
        })
    })

    describe('MaxHeap', function () {
        it ('should sort the array', function () {
            for (var i; i < maxRepeat; i++) {
                const list = generateRandomNumberList();

                var sorted = list.slice(0);
                sorted.sort(DefaultComparator);

                expect([...(new MaxHeap(list, DefaultComparator))]).to.be.deep.equal(sorted);
            }

            expect([...(new MaxHeap([], DefaultComparator))]).to.be.deep.equal([]);
            expect([...(new MaxHeap([42], DefaultComparator))]).to.be.deep.equal([42]);
        })
    })

    describe('MinHeap', function () {
        it ('should sort the array in descending order', function () {
            for (var i; i < maxRepeat; i++) {
                const list = generateRandomNumberList();

                var sorted = list.slice(0);
                sorted.sort(DefaultComparator);
                sorted = sorted.reverse()

                expect([...(new MinHeap(list, DefaultComparator))]).to.be.deep.equal(sorted);
            }
            expect([...(new MinHeap([], DefaultComparator))]).to.be.deep.equal([]);
            expect([...(new MinHeap([42], DefaultComparator))]).to.be.deep.equal([42]);
        })
    })
})