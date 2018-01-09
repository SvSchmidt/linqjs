describe('Transformation', function () {
    describe('Aggregate', function () {
        it('should aggregate the elements in the array using an aggregator function', function () {
            const sentence = "the quick brown fox jumps over the lazy dog"
            const words = sentence.split(' ')
            const reversed = words.aggregate((workingSentence, next) => next + " " + workingSentence)
            expect(reversed).to.be.equal('dog lazy the over jumps fox brown quick the')

            expect([1, 2, 3, 4, 5].aggregate((result, next) => result + next)).to.be.equal(15)
        })

        it('should accept the starting value as first parameter', function () {
            const ints = [4, 8, 8, 3, 9, 0, 7, 8, 2]
            const even = ints.aggregate(0, (total, next) => next % 2 === 0 ? total + 1 : total)
            expect(even).to.be.equal(6)
        })

        it('should accept the starting value as first and a transformator function as third parameter', function () {
            const fruits = ["apple", "mango", "orange", "passionfruit", "grape"]
            const longestName = fruits.aggregate('banana',
                (longest, next) => next.length > longest.length ? next : longest,
                // Return the final result as an upper case string.
                fruit => fruit.toUpperCase())

            expect(longestName).to.be.equal('PASSIONFRUIT')
        })
    })

    describe('Distinct', function () {
        it('should return the distinct values of an array using the default equality comparer', function () {
            expect([1, 2, 3, 4, 5, 6, 6, 7, 1, 2].distinct().toArray()).to.be.deep.equal([1, 2, 3, 4, 5, 6, 7])
        })

        it('should accept a custom equality compare function and return the distinct values', function () {
            const pets = [
                {name: 'miez', species: 'cat'},
                {name: 'wuff', species: 'dog'},
                {name: 'leo', species: 'cat'},
                {name: 'flipper', species: 'dolphin'}
            ]

            expect(pets.distinct((a, b) => a.species === b.species).toArray()).to.be.deep.equal([
                {name: 'miez', species: 'cat'},
                {name: 'wuff', species: 'dog'},
                {name: 'flipper', species: 'dolphin'}
            ])

            expect([1, 2, 3, 4].distinct((a, b) => a % 2 === b % 2).toArray()).to.be.deep.equal([1, 2])
            expect([].distinct().toArray()).to.be.deep.equal([])
            expect([].distinct((a, b) => a % 2 === b % 2).toArray()).to.be.deep.equal([])
        })
    })

    describe('ToDictionary', function () {
        const pets = [
            {name: 'miez', species: 'cat'},
            {name: 'wuff', species: 'dog'},
            {name: 'leo', species: 'cat'},
            {name: 'flipper', species: 'dolphin'}
        ]

        it('should have the overload ToDictionary(keySelector)', function () {
            const petDict = pets.toDictionary(p => p.name)
            expect(petDict instanceof Map).to.be.true
            expect(petDict.has('miez')).to.be.true
            expect(petDict.get('leo')).to.be.deep.equal({name: 'leo', species: 'cat'})
        })

        it('should have the overload ToDictionary(keySelector, elementSelector)', function () {
            const petDict = pets.toDictionary(p => p.name, p => p.species)
            expect(petDict instanceof Map).to.be.true
            expect(petDict.has('miez')).to.be.true
            expect(petDict.get('leo')).to.be.equal('cat')
            expect(petDict.get('miez')).to.be.equal('cat')
        })

        it('should have the overload ToDictionary(keySelector, keyComparer)', function () {
            // because of a.length === b.length 'cat' equals 'dog' -> error since the key is in use
            expect(function () {
                pets.toDictionary(p => p.species, (a, b) => a.length === b.length)
            }).to.throw(Error)
            expect(function () {
                pets.toDictionary(p => p.name, (a, b) => a.length === b.length)
            }).to.throw(Error)
            expect(function () {
                pets.skip(2).toDictionary(p => p.name, (a, b) => a.length === b.length)
            }).not.to.throw(Error)
        })

        it('should have the overload ToDictionary(keySelector, elementSelector, keyComparer)', function () {
            // because of a.length === b.length 'cat' equals 'dog' -> error since the key is in use
            expect(function () {
                pets.toDictionary(p => p.species, p => p.name, (a, b) => a.length === b.length)
            }).to.throw(Error)
            expect(function () {
                pets.toDictionary(p => p.name, p => p.species, (a, b) => a.length === b.length)
            }).to.throw(Error)
            expect(pets.skip(2).toDictionary(p => p.name, p => p.species, (a, b) => a.length === b.length).get('leo')).to.be.equal('cat')
            expect(pets.skip(2).toDictionary(p => p.name, p => p.species, (a, b) => a.length === b.length).get('flipper')).to.be.equal('dolphin')
            expect(pets.skip(2).toDictionary(p => p.name, p => p.species, (a, b) => a.length === b.length).has('miez')).to.be.false
        })
    })

    describe('ToLookup', function () {
        const pets = [
            {name: 'miez', species: 'cat'},
            {name: 'wuff', species: 'dog'},
            {name: 'leo', species: 'cat'},
            {name: 'flipper', species: 'dolphin'}
        ]

        it('should have the overload ToLookup(keySelector)', function () {
            const petLookup = pets.toLookup(p => p.species)
            expect(petLookup instanceof Map).to.be.true
            expect(petLookup.has('cat')).to.be.true
            expect(petLookup.has('dog')).to.be.true
            expect(petLookup.has('dolphin')).to.be.true

            // each lookup value is a collection of all values with that key
            expect(petLookup.get('cat') instanceof Collection);

            expect(petLookup.get('dolphin').first()).to.be.deep.equal({name: 'flipper', species: 'dolphin'})

            expect(petLookup.get('cat').count()).to.be.equal(2)
        })

        it('should have the overload ToLookup(keySelector, elementSelector)', function () {
            const petLookup = pets.toLookup(p => p.species, p => p.name)

            expect(petLookup.has('cat')).to.be.true
            expect(petLookup.has('dog')).to.be.true
            expect(petLookup.has('dolphin')).to.be.true

            expect(petLookup.get('cat').count()).to.be.equal(2)

            expect(petLookup.get('cat').toArray()).to.be.deep.equal(['miez', 'leo'])
        })

        it('should have the overload ToLookup(keySelector, keyComparer)', function () {
            const petLookup = pets.toLookup(p => p.species, (a, b) => a.length === b.length)

            // because of a.length === b.length 'cat' equals 'dog'
            expect(petLookup.has('cat')).to.be.true
            expect(petLookup.has('dog')).to.be.false
            expect(petLookup.get('cat').count()).to.be.equal(3)
        })

        it('should have the overload ToLookup(keySelector, elementSelector, keyComparer)', function () {
            const petLookup = pets.toLookup(p => p.species, p => p.name, (a, b) => a.length === b.length);

            // because of a.length === b.length 'cat' equals 'dog'
            expect(petLookup.has('cat')).to.be.true
            expect(petLookup.has('dog')).to.be.false
            expect(petLookup.get('cat').count()).to.be.equal(3)

            expect(petLookup.get('cat').toArray()).to.be.deep.equal(['miez', 'wuff', 'leo'])
        })
    })

    describe('Reverse', function () {
        const pets = [
            {name: 'miez', species: 'cat'},
            {name: 'wuff', species: 'dog'},
            {name: 'leo', species: 'cat'},
            {name: 'flipper', species: 'dolphin'}
        ]
        const fruits = ["apple", "mango", "orange", "passionfruit", "grape"]

        it('should return a new sequence with the elements of the original one in reverse order', function () {
            expect(fruits.reverse().toArray()).to.be.deep.equal(['grape', 'passionfruit', 'orange', 'mango', 'apple'])
            expect(Collection.from(pets).reverse().first()).to.be.deep.equal(pets.last())
            expect([1, 2, 3].reverse().toArray()).to.be.deep.equal([3, 2, 1])
        })

        it('should return the original sequence if Reverse is called twice', function () {
            expect(pets.reverse().reverse().toArray()).to.be.deep.equal(pets)
        })
    })

    describe('Flatten', function () {
        it('should flatten a sequence', function () {
            expect([1, 2, 3, [4, 5, 6]].flatten().toArray()).to.be.deep.equal([1, 2, 3, 4, 5, 6])
        })
    })

    describe('Select', function () {
        it('should transform each element to a new form', function () {
            const petOwners = [
                {Name: 'Higa, Sidney', Pets: ['Scruffy', 'Sam']},
                {Name: 'Ashkenazi, Ronen', Pets: ['Walker', 'Sugar']},
                {Name: 'Price, Vernette', Pets: ['Scratches', 'Diesel']},
            ]

            expect(petOwners.select(x => x.Name).toArray()).to.be.deep.equal(['Higa, Sidney', 'Ashkenazi, Ronen', 'Price, Vernette'])
            expect([1, 2, 3].select(x => 2 * x).toArray()).to.be.deep.equal([2, 4, 6])
        })

        it('should accept the index in the mapFn', function () {
            expect([1, 2, 3].select((x, i) => x + i).toArray()).to.be.deep.equal([1, 3, 5])
        })
    })

    describe('SelectMany', function () {
        const petOwners = [
            {Name: 'Higa, Sidney', Pets: ['Scruffy', 'Sam']},
            {Name: 'Ashkenazi, Ronen', Pets: ['Walker', 'Sugar']},
            {Name: 'Price, Vernette', Pets: ['Scratches', 'Diesel']},
        ]

        describe('SelectMany(mapFn)', function () {
            it('should map each value in the sequence using mapFn and flatten the result', function () {
                expect(petOwners.selectMany(petOwner => petOwner.Pets).toArray()).to.be.deep.equal(['Scruffy', 'Sam', 'Walker', 'Sugar', 'Scratches', 'Diesel'])
            })

            it('should allow to use the index of the element to project the result', function () {
                expect(petOwners.selectMany((petOwner, index) =>
                    petOwner.Pets.select(pet => index + pet)).toArray()).to.be.deep.equal(['0Scruffy', '0Sam', '1Walker', '1Sugar', '2Scratches', '2Diesel'])
            })
        })

        describe('SelectMany(mapFn, resultSelector)', function () {
            it('should map each value in the sequence using mapFn and flatten the result. A resultSelector function is invoked on each output value.', function () {
                const result = petOwners.selectMany(petOwner => petOwner.Pets,
                    (owner, petName) => ({owner, petName}))
                    .select(ownerAndPet => ({
                        owner: ownerAndPet.owner.Name,
                        pet: ownerAndPet.petName,
                    }))
                    .take(2)
                    .toArray()
                const expected = [{"owner": "Higa, Sidney", "pet": "Scruffy"}, {"owner": "Higa, Sidney", "pet": "Sam"}]

                expect(result).to.be.deep.equal(expected)
            })
        })
    })
})
