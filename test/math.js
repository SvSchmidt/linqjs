describe('Mathematics', function () {
    const pets = [
        {
            Name: 'Barley',
            Age: 8,
        },
        {
            Name: 'Boots',
            Age: 4,
        },
        {
            Name: 'Whiskers',
            Age: 1,
        }
    ];

    describe('Min', function () {
        it('should work for collections with just one element', function () {
            expect([42].min()).to.be.equal(42)
        })

        it('should return the minimum of the array', function () {
            expect([1, 2, 3, 4, 5].min()).to.be.equal(1)
        })

        it('should be able to transform the values using a mapFn and then return the minimum', function () {
            expect([1, 2, 3, 4, 5].min(x => x + 3)).to.be.equal(4)

            /*
              Spec: https://msdn.microsoft.com/de-de/library/bb534961(v=vs.110).aspx
            */
            expect(pets.min(pet => pet.Age)).to.be.equal(1)
        })

        it('should throw an error if the array is empty', function () {
            expect(function () {
                [].min()
            }).to.throw(Error)
        })
    })

    describe('Max', function () {
        it('should work for collections with just one element', function () {
            expect([42].max()).to.be.equal(42)
        })

        it('should return the maximum of the array', function () {
            expect([1, 2, 3, 4, 5].max()).to.be.equal(5)
        })

        it('should be able to transform the values using a mapFn and then return the maximum', function () {
            expect([1, 2, 3, 4, 5].max(x => x + 3)).to.be.equal(8)

            /*
              Spec: https://msdn.microsoft.com/de-de/library/bb549404(v=vs.110).aspx
            */
            expect(pets.max(pet => pet.Age + pet.Name.length)).to.be.equal(14)
        })

        it('should throw an error if the array is empty', function () {
            expect(function () {
                [].max()
            }).to.throw(Error)
        })
    })

    describe('Average', function () {
        it('should return the average of the array values', function () {
            expect([1, 2, 3, 4, 5].average()).to.be.equal(3)
        })

        it('should be able to transform the values using a mapFn and then return the sum', function () {
            expect([1, 2, 3, 4, 5].average(x => 2 * x)).to.be.equal(6)
            expect(pets.average(pet => pet.Age)).to.be.equal(4.333333333333333)
        })

        it('should throw an error if the array is empty', function () {
            expect(function () {
                [].average()
            }).to.throw(Error)
        })
    })

    describe('Sum', function () {
        it('should return the sum of the array values', function () {
            expect([1, 2, 3, 4, 5].sum()).to.be.equal(15)
        })

        it('should be able to transform the values using a mapFn and then return the sum', function () {
            expect([1, 2, 3, 4, 5].sum(x => 2 * x)).to.be.equal(30)
            expect(pets.sum(pet => pet.Age)).to.be.equal(13)
        })

        it('should throw an error if the array is empty', function () {
            expect(function () {
                [].sum()
            }).to.throw(Error)
        })
    })
})
