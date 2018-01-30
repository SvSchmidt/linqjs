describe('iteration', function () {
    describe('ForEach', function () {
        it('should invoke a function for each value of the Collection', function () {
            let called = 0;
            Collection.from([1, 2, 3, 4, 5, 6]).forEach(elem => called++)
            expect(called).to.be.equal(6)

            let sum = 0;
            Collection.from([1, 2, 3, 4, 5, 6]).forEach(elem => sum += elem)
            expect(sum).to.be.equal(21)
        })
    })

    describe('Chained functions', function () {
        it('should return the correct outcome when partially iterated (e.g. for non-emptyness checks)', function () {
            expect(Collection.from([1, 2, 3, 4, 5])
                .where(x => x % 2 === 0)
                .select(x => 2 * x)
                .first()).to.be.equal(4)
        })
    })
})
