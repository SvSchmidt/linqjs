const maxValue  = 1000000;
const maxLenght = 1000;
const maxRepeat = 10;

function generateRandomNumberList() {
    function getRandomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    const length = getRandomNumber(0, maxLenght);
    var result = [];
    for (var i = 0; i < length; i++) {
        result.push(getRandomNumber(-1 * maxValue, maxValue));
    }
    return result;
}

describe('heap.js', function () {
    describe('defaultComparator', function () {
        const tests = [
                [12,9],
                [1,2],
                [[],[]],
                [{},{}],
                [function (a) {}, function (a,b) {}],
            ];
        it('should produce the same results as the "<", ">" & "==" operators', function () {
            const MinHeap = Collection.prototype.MinHeap;
            const defaultComparator = Collection.prototype.defaultComparator;

            for (var values of tests) {
                var a = values[0];
                var b = values[1];

                if (a < b) {
                    expect(defaultComparator(a, b)).to.be.below(0);
                    expect(defaultComparator(b, a)).to.be.above(0);
                }
                if (a == b) {
                    expect(defaultComparator(a, b)).to.be.equal(0);
                    expect(defaultComparator(b, a)).to.be.equal(0);
                }
                if (a > b) {
                    expect(defaultComparator(a, b)).to.be.above(0);
                    expect(defaultComparator(b, a)).to.be.below(0);
                }
            }
        })
    })

    describe('MinHeap', function () {
        it ('should sort the array in descending order', function () {
            const MinHeap = Collection.prototype.MinHeap;
            const defaultComparator = Collection.prototype.defaultComparator;

            for (var i; i < maxRepeat; i++) {
                const list = generateRandomNumberList();

                var sorted = list.slice(0);
                sorted.sort(defaultComparator);

                expect([...(new MinHeap(list, defaultComparator))]).to.be.deep.equal(sorted);
            }
        });
        it ('should order "equal" elements by original index', function () {
            const MinHeap = Collection.prototype.MinHeap;
            const defaultComparator = Collection.prototype.defaultComparator;

            const testComparator = (a, b) => defaultComparator(a.a, b.a);
            const tests = [
                {
                    input:  [{a: 1, b: 1}, {a: 1, b: 2}],
                    output: [{a: 1, b: 1}, {a: 1, b: 2}],
                },
                {
                    input:  [{a: 1, b: 2}, {a: 1, b: 1}],
                    output: [{a: 1, b: 2}, {a: 1, b: 1}],
                }
            ];
            for (var test of tests) {
                expect([...(new MinHeap(test.input, testComparator))]).to.be.deep.equal(test.output);
            }
        });
        it ('should return the empty array', function () {
            const MinHeap = Collection.prototype.MinHeap;
            const defaultComparator = Collection.prototype.defaultComparator;

            expect([...(new MinHeap([], defaultComparator))]).to.be.deep.equal([]);
        });
        it ('should return the array with one element', function () {
            const MinHeap = Collection.prototype.MinHeap;
            const defaultComparator = Collection.prototype.defaultComparator;

            expect([...(new MinHeap([42], defaultComparator))]).to.be.deep.equal([42]);
        });
    })
})
