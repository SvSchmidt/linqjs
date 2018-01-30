describe('Module', function () {
    describe('ExtendIterablePrototype', function () {
        it('should throw an error if a property would be overwritten', function () {
            const foo = {prototype: {select: () => true}}
            const originalSelect = foo.prototype.select;

            expect(() => linq.extendIterablePrototype(foo.prototype)).to.throw(Error)
            expect(foo.prototype.select).to.be.equal(originalSelect)
        })
    })
})