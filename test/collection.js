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
