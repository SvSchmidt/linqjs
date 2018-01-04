describe('Collection static methods', function () {
    describe('Collection.from(iterable)', function () {
        it('should behave the same as new Collection(iterable)', function () {
            expect(Collection.from([1, 2, 3])).to.be.deep.equal(new Collection([1, 2, 3]))
        })
    })

    describe('Collection.From(any)', function () {
        it('should throw an error for non-iterable arguments', function () {
            expect(() => Collection.from(1)).to.throw(Error)
            expect(() => Collection.from({})).to.throw(Error)
            expect(() => Collection.from(undefined)).to.throw(Error)
            expect(() => Collection.from(true).to.throw(Error))
        })
    })

    describe('Collection.Range(start, count)', function () {
        it('should return a new Collection of count numbers from start including', function () {
            expect(Collection.range(1, 5).toArray()).to.be.deep.equal([1, 2, 3, 4, 5])
            expect(Collection.range(-5, 5).toArray()).to.be.deep.equal([-5, -4, -3, -2, -1])

            const squares = Collection.range(1, 5).select(x => x * x)
            expect(squares.toArray()).to.be.deep.equal([1, 4, 9, 16, 25])

            const even = Collection.range(1, 10).where(x => x % 2 === 0)
            expect(even.toArray()).to.be.deep.equal([2, 4, 6, 8, 10])
        })

        it('should throw an error if count < 0', function () {
            expect(function () {
                Collection.range(0, -1)
            }).to.throw(Error)
            expect(function () {
                Collection.range(-1, -1)
            }).to.throw(Error)
        })

        it('should return an empty collection for count = 0', function () {
            expect(Collection.range(0, 0).toArray()).to.be.deep.equal([])
            expect(Collection.range(10, 0).toArray()).to.be.deep.equal([])
        })
    })

    describe('Collection.Repeat(val, count)', function () {
        it('should return a Collection of count times val', function () {
            expect(Collection.repeat('na', 10).toArray().join(' ') + ' BATMAN!').to.be.equal('na na na na na na na na na na BATMAN!')
        })

        it('should return an empty collection if count = 0', function () {
            expect(Collection.repeat('foo', 0).toArray()).to.have.length(0)
        })

        it('should throw an error if count < 0', function () {
            expect(function () {
                Collection.repeat('foo', -1)
            }).to.throw(Error)
        })
    })
})

describe('Collection static properties', function () {
    describe('Collection.Empty', function () {
        it('should be an empty Collection', function () {
            expect(Collection.empty.toArray()).to.be.deep.equal([])
        })

        it('should have no setter and therefore prohibit overwriting its value', function () {
            Collection.Empty = null
            expect(Collection.empty).not.to.be.null
        })
    })
})
