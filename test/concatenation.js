describe('Concatenation', function () {
    describe('Concat', function () {
        it('should concatenate two arrays', function () {
            expect([1, 2, 3].concat([4, 5, 6]).toArray()).to.be.deep.equal([1, 2, 3, 4, 5, 6])
        })

        it('should keep duplicates', function () {
            expect([1, 2, 3].concat([2, 3, 4]).toArray()).to.be.deep.equal([1, 2, 3, 2, 3, 4])
        })
    })

    describe('Union', function () {
        it('should concatenate and remove duplicates', function () {
            expect([1, 2, 3].union([2, 3, 4]).toArray()).to.be.deep.equal([1, 2, 3, 4])
        })

        it('should accept a function to define which entries are equal', function () {
            const petsA = [
                {name: 'miez', species: 'cat'},
                {name: 'wuff', species: 'dog'}
            ];

            const petsB = [
                {name: 'leo', species: 'cat'},
                {name: 'flipper', specices: 'dolphin'}
            ];

            expect(petsA.union(petsB, (a, b) => a.species === b.species).count()).to.be.equal(3) // miez and leo are assumed equal
            expect([1, 2, 3, 4].union([6, 8, 9], (a, b) => a % 2 === b % 2).count()).to.be.equal(2) // [1, 2]
        })
    })

    describe('Join', function () {
        const magnus = {Name: 'Hedlund, Magnus'}
        const terry = {Name: 'Adams, Terry'}
        const charlotte = {Name: 'Weiss, Charlotte'}
        const people = [magnus, terry, charlotte]

        const barley = {Name: 'Barley', Owner: terry}
        const boots = {Name: 'Boots', Owner: terry}
        const whiskers = {Name: 'Whiskers', Owner: charlotte}
        const daisy = {Name: 'Daisy', Owner: magnus}
        const pets = [barley, boots, whiskers, daisy]

        it('should join two sequences and transform the pairs using a resultSelector', function () {
            const query =
                people.join(pets,
                    person => person,
                    pet => pet.Owner,
                    (person, pet) => {
                        return {OwnerName: person.Name, Pet: pet.Name}
                    })
            const expectedResults = [
                'Hedlund, Magnus - Daisy',
                'Adams, Terry - Barley',
                'Adams, Terry - Boots',
                'Weiss, Charlotte - Whiskers',
            ]

            const query2 =
                pets.join(people,
                    pet => pet.Owner,
                    person => person,
                    (pet, person) => {
                        return {OwnerName: person.Name, Pet: pet.Name}
                    })

            const expectedResults2 = [
                'Adams, Terry - Barley',
                'Adams, Terry - Boots',
                'Weiss, Charlotte - Whiskers',
                'Hedlund, Magnus - Daisy',
            ]

            expect(query.count()).to.be.equal(4)
            expect(query2.count()).to.be.equal(4)

            let index = 0
            for (let pair of query) {
                expect(`${pair.OwnerName} - ${pair.Pet}`).to.be.deep.equal(expectedResults[index])
                index++
            }

            index = 0
            for (let pair of query2) {
                expect(`${pair.OwnerName} - ${pair.Pet}`).to.be.deep.equal(expectedResults2[index])
                index++
            }
        })

        it('should accept an optional keyEqualityCompareFn to compare the keys', function () {
            const keyEqualityCompareFn = (a, b) => a === b

            const query =
                people.join(pets,
                    person => person,
                    pet => pet.Owner,
                    (person, pet) => {
                        return {OwnerName: person.Name, Pet: pet.Name}
                    },
                    keyEqualityCompareFn)

            const expectedResults = [
                'Hedlund, Magnus - Daisy',
                'Adams, Terry - Barley',
                'Adams, Terry - Boots',
                'Weiss, Charlotte - Whiskers',
            ]

            let index = 0
            for (let pair of query) {
                expect(`${pair.OwnerName} - ${pair.Pet}`).to.be.deep.equal(expectedResults[index])
                index++
            }
        })
    })

    describe('Except', function () {
        it('should return the elements of first sequence that do not appear in second', function () {
            const numbers1 = [2.0, 2.1, 2.2, 2.3, 2.4, 2.5]
            const numbers2 = [2.2]

            const onlyInFirstSet = numbers1.except(numbers2);

            expect(onlyInFirstSet.toArray()).to.be.deep.equal([2.0, 2.1, 2.3, 2.4, 2.5])
        })

        it('should also work with collections', function () {
            const numbers1 = [2.0, 2.1, 2.2, 2.3, 2.4, 2.5]
            const numbers2 = Collection.from([2.2])

            const onlyInFirstSet = numbers1.except(numbers2);

            expect(onlyInFirstSet.toArray()).to.be.deep.equal([2.0, 2.1, 2.3, 2.4, 2.5])
        })
    })

    describe('Zip', function () {
        it('should apply a function to the elements of two sequences and return a common result', function () {
            const numbers = [1, 2, 3, 4]
            const words = ["one", "two", "three"]

            const numbersAndWords = numbers.zip(words, (first, second) => first + " " + second)
            const expectedResult = ['1 one', '2 two', '3 three']

            let i = 0
            for (let val of numbersAndWords.toArray()) {
                expect(val).to.be.equal(expectedResult[i])
                i++
            }
        })
    })

    describe('Intersect(second, equalityCompareFn)', function () {
        it('should produce the set intersection of two sequences', function () {
            expect([44, 26, 92, 30, 71, 38].intersect([39, 59, 83, 47, 26, 4, 30]).toArray()).to.be.deep.equal([26, 30])
            expect(Collection.from('hello world').intersect(Collection.from('strawberry')).toArray()).to.be.deep.equal(['e', 'w', 'r'])
        })

        it('should accept a custom equality comparator', function () {
            expect(['hello', 'world'].intersect(['hallo', 'welt'],
                (first, second) => first.length === second.length).toArray()).to.be.deep.equal(["hello", "world"]) // I know, stupid example
        })
    })
})
