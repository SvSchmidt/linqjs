const maxValue = 100000;
const maxLength = 50;
const maxRepeat = 100;

describe('order', function () {
    const pets = [
        {
            Name: 'Barley',
            Age: 8,
        },
        {
            Name: 'Boots',
            Age: 1,
        },
        {
            Name: 'Whiskers',
            Age: 1,
        },
        {
            Name: 'Fluffy',
            Age: 2,
        },
        {
            Name: 'Donald',
            Age: 4,
        },
        {
            Name: 'Snickers',
            Age: 13,
        }
    ].select(pet => ({Name: pet.Name, Age: pet.Age, NameLength: pet.Name.length})).toArray()

    describe('OrderBy', function () {
        describe('OrderBy(keySelector)', function () {
            it('should order a collection ascending by the values extracted using keySelector, comparing with the default comparator', function () {
                expect(pets.orderBy(x => x.Age).select(x => x.Age).toArray()).to.be.deep.equal([1, 1, 2, 4, 8, 13])
            })

            it('should also accept the keySelector as a string', function () {
                expect(pets.orderBy('Age').select(x => x.Age).toArray()).to.be.deep.equal(pets.orderBy(x => x.Age).select(x => x.Age).toArray())
            })
            it('should accept the keySelector as a string with bracket notation', function () {
                expect(pets.orderBy('["Age"]').select(x => x.Age).toArray()).to.be.deep.equal(pets.orderBy(x => x.Age).select(x => x.Age).toArray())
            })
            it('should accept the keySelector as a string starting with a dot', function () {
                expect(pets.orderBy('.Age').select(x => x.Age).toArray()).to.be.deep.equal(pets.orderBy(x => x.Age).select(x => x.Age).toArray())
            })
            it('should throw an assertion error for the invalid keySelector', function () {
                expect(() => pets.orderBy({foo: "bar"}).select(x => x.Age).toArray()).to.throw(Error);
            })
        })
    })

    describe('OrderByDescending', function () {
        describe('OrderByDescending(keySelector)', function () {
            it('should order a collection descending by the values extracted using keySelector, comparing with the default comparator', function () {
                expect(pets.orderByDescending(x => x.Age).select(x => x.Age).toArray()).to.be.deep.equal([13, 8, 4, 2, 1, 1])
            })

            it('should also accept the keySelector as a string', function () {
                expect(pets.orderByDescending('Age').select(x => x.Age).toArray()).to.be.deep.equal(pets.orderByDescending(x => x.Age).select(x => x.Age).toArray())
            })
            it('should throw an assertion error for the invalid keySelector', function () {
                expect(() => pets.orderByDescending({foo: "bar"}).select(x => x.Age).toArray()).to.throw(Error);
            })
        })
    })

    describe('ThenBy', function () {
        describe('OrderBy.ThenBy', function () {
            it('should order values considered equal in the first sorting ascending by the values extracted using a keySelector keeping the order of the non-equal values', function () {
                const res = pets.orderBy(x => x.NameLength).thenBy(x => x.Age).toArray()

                expect(res.select(x => x.NameLength).toArray()).to.be.deep.equal([5, 6, 6, 6, 8, 8])
                expect(res.select(x => x.Age).toArray()).to.be.deep.equal([1, 2, 4, 8, 1, 13])
            })
        })

        describe('OrderByDescending.ThenBy', function () {
            it('should order values considered equal in the first sorting ascending by the values extracted using a keySelector keeping the order of the non-equal values', function () {
                const res = pets.orderByDescending(x => x.NameLength).thenBy(x => x.Age).toArray()

                expect(res.select(x => x.NameLength).toArray()).to.be.deep.equal([8, 8, 6, 6, 6, 5])
                expect(res.select(x => x.Age).toArray()).to.be.deep.equal([1, 13, 2, 4, 8, 1])
            })
        })

        it('should throw an assertion error for the invalid keySelector', function () {
            expect(() => pets.orderByDescending(x => x.NameLength).thenBy({foo: "bar"}).select(x => x.Age).toArray()).to.throw(Error);
        })
    })

    describe('ThenByDescending', function () {
        describe('OrderBy.ThenByDescending', function () {
            it('should order values considered equal in the first sorting ascending by the values extracted using a keySelector keeping the order of the non-equal values', function () {
                const res = pets.orderBy(x => x.NameLength).thenByDescending(x => x.Age).toArray()

                expect(res.select(x => x.NameLength).toArray()).to.be.deep.equal([5, 6, 6, 6, 8, 8])
                expect(res.select(x => x.Age).toArray()).to.be.deep.equal([1, 8, 4, 2, 13, 1])
            })
        })

        describe('OrderByDescending.ThenByDescending', function () {
            it('should order values considered equal in the first sorting ascending by the values extracted using a keySelector keeping the order of the non-equal values', function () {
                const res = pets.orderByDescending(x => x.NameLength).thenByDescending(x => x.Age).toArray()

                expect(res.select(x => x.NameLength).toArray()).to.be.deep.equal([8, 8, 6, 6, 6, 5])
                expect(res.select(x => x.Age).toArray()).to.be.deep.equal([13, 1, 8, 4, 2, 1])
            })
        })

        it('should throw an assertion error for the invalid keySelector', function () {
            expect(() => pets.orderByDescending(x => x.NameLength).thenByDescending({foo: "bar"}).select(x => x.Age).toArray()).to.throw(Error);
        })
    })

    describe('OrderDescending', function () {
        const arr = [3, 7, 9, 3, 1, 2, 35, 7, 4, 9]
        const sortedDesc = [35, 9, 9, 7, 7, 4, 3, 3, 2, 1]

        describe('OrderDescending()', function () {
            it('should order a sequence by their natural values descending using the default comparator', function () {
                expect(arr.orderDescending().toArray()).to.be.deep.equal(sortedDesc)
                expect(sortedDesc.orderDescending().toArray()).to.be.deep.equal(sortedDesc)
            })
        })
    })

    describe('Order', function () {
        describe('Order()', function () {
            const arr = [35, 9, 9, 7, 7, 4, 3, 3, 2, 1]
            const sortedAsc = [1, 2, 3, 3, 4, 7, 7, 9, 9, 35]

            it('should order a sequence by their natural values ascending using the default comparator', function () {
                expect(arr.order().toArray()).to.be.deep.equal(sortedAsc)
                expect(sortedAsc.order().toArray()).to.be.deep.equal(sortedAsc)
            })
        })
    })

    describe('Shuffle', function () {
        it('should shuffle a sequence and contain all possible permutations if repeated often enough', function () {
            /*
            We're going to shuffle the same array 1000 times and make sure that every possible permutation (3! = 6) is included in the result
            This test may fail by times but that's okay
            */
            const arr = [1, 2, 3]
            const permutations = [[2, 1, 3], [2, 3, 1], [3, 1, 2], [1, 3, 2], [1, 2, 3], [3, 2, 1]]
            let outcomes = []

            for (let i = 0; i < 1000; i++) {
                outcomes.push(JSON.stringify(arr.shuffle().toArray()))
            }

            for (let p of permutations) {
                expect(outcomes).to.include(JSON.stringify(p))
            }
        })
    })
})
