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

const Linq = Array.prototype.Linq;
const LinqCollection = Array.prototype.LinqCollection;

describe('collection.js', function () {

    describe('Linq', function () {
        it('should create a new linq collection for enumerables', function () {
            expect(Linq([])).to.be.instanceof(LinqCollection);
            expect(Linq([1,2,3,4,5])).to.be.instanceof(LinqCollection);
        
            expect(Linq(new Set([]))).to.be.instanceof(LinqCollection);
            expect(Linq(new Set([1,2,3,4,5]))).to.be.instanceof(LinqCollection);
      
            expect(Linq(new Map([]))).to.be.instanceof(LinqCollection);
            expect(Linq(new Map([[1,2],[3,4],[5,6]]))).to.be.instanceof(LinqCollection);
        })

        it('should throw an error for non-enumerables', function () {
            expect(function () { Linq({}) }).to.throw(Error);
            expect(function () { Linq(null) }).to.throw(Error);
            expect(function () { Linq(undefined) }).to.throw(Error);
        })
    })

    describe('LinqCollection', function () {
        it('should be iterable', function () {
            expect(function () { [...Linq([1,2,3])] }).not.to.throw(Error);
            expect([...Linq([1,2,3])]).to.be.deep.equal([1,2,3]);
        })

        it('should not iterate twice', function () {
            const collection = Linq([1,2,3]);
        
            expect(function () { [...collection] }).not.to.throw(Error);
            expect(function () { [...collection] }).to.throw(Error);
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
                    expect(Linq(array).ToArray()).to.be.deep.equal(array);
                }
            })
        })
    })
})