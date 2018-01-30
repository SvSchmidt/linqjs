describe('Insert/Remove', function () {
    describe('Add', function () {
        it('should return a new collection containing the value at the end', function () {
            let coll = Collection.from([1, 2, 3])

            coll.add(4)
            expect(coll.count()).to.be.equal(4)
            expect(coll.elementAt(3)).to.be.equal(4)

            coll.add(5)
            expect(coll.count()).to.be.equal(5)
            expect(coll.elementAt(4)).to.be.equal(5)
        })
    })

    describe('Insert', function () {
        it('should add values to any index of the array', function () {
            let coll = Collection.from([1, 2, 3])

            coll.insert(4, 0)
            expect(coll.toArray()).to.be.deep.equal([4, 1, 2, 3])

            coll.insert(5, 2)
            expect(coll.toArray()).to.be.deep.equal([4, 1, 5, 2, 3])
        })

        it('should throw an error if the index is out of bounds', function () {
            expect(function () {
                [].insert(1, 100)
            }).to.throw(Error)
        })
    })

    describe('Add/Insert', function () {
        it('should modify the original array and return void', function () {
            expect([].add(1)).to.be.undefined
            expect([].insert(1, 0)).to.be.undefined
        })
    })

    describe('Remove', function () {
        it('should remove an element from the array modifying the original array', function () {
            let pets = Collection.from([
                'miez',
                'wuff',
                'leo',
                'flipper'
            ])

            expect(pets.remove('miez')).to.be.true
            expect(pets.count()).to.be.equal(3)

            expect(pets.remove(4)).to.be.false
            expect(pets.count()).to.be.equal(3)

            expect(pets.remove('leo')).to.be.true
            expect(pets.count()).to.be.equal(2)

            expect(pets.remove('wuff')).to.be.true
            expect(pets.count()).to.be.equal(1)

            expect(pets.remove('wuff')).to.be.false
            expect(pets.count()).to.be.equal(1)

            expect(pets.remove('flipper')).to.be.true
            expect(pets.count()).to.be.equal(0)

            expect([].remove(1)).to.be.false
        })
    })
})
