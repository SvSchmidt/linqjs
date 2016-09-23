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

describe('collection.js', function () {
    describe('Collection', function () {
        it('should create a new Collection collection for enumerables', function () {
            expect(Collection.from([])).to.be.instanceof(Collection);
            expect(Collection.from([1,2,3,4,5])).to.be.instanceof(Collection);

            expect(Collection.from(new Set([]))).to.be.instanceof(Collection);
            expect(Collection.from(new Set([1,2,3,4,5]))).to.be.instanceof(Collection);

            expect(Collection.from(new Map([]))).to.be.instanceof(Collection);
            expect(Collection.from(new Map([[1,2],[3,4],[5,6]]))).to.be.instanceof(Collection);
        })

        it('should throw an error for non-enumerables', function () {
            expect(function () { Collection.from({}) }).to.throw(Error);
            expect(function () { Collection.from(null) }).to.throw(Error);
            expect(function () { Collection.from(undefined) }).to.throw(Error);
        })
    })

    describe('Collection', function () {
        it('should be iterable', function () {
            expect(function () { [...Collection.from([1,2,3])] }).not.to.throw(Error);
            expect([...Collection.from([1,2,3])]).to.be.deep.equal([1,2,3]);
        })

        it('should not iterate twice', function () {
            const collection = Collection.from([1,2,3]);

            expect(function () { [...collection] }).not.to.throw(Error);
        })

        describe('ToArray', function () {
            const arrays = [
                [1,2,4],
                [2,8,7,3],
                [""],
                [],
                [{},{a: 2},{}]
            ];
            it ('should properly generate an array', function () {
                for (var array of arrays) {
                    expect(Collection.from(array).ToArray()).to.be.deep.equal(array);
                }
            })
        })
    })
})
