require('./base')
const expect = require('chai').expect

describe('Concatenation', function () {
  describe('Concat', function () {
    it('should concatenate two arrays', function () {
      expect([1, 2, 3].Concat([4, 5, 6]).ToArray()).to.be.deep.equal([1, 2, 3, 4, 5, 6])
    })

    it('should keep duplicates', function () {
      expect([1, 2, 3].Concat([2, 3, 4]).ToArray()).to.be.deep.equal([1, 2, 3, 2, 3, 4])
    })
  })

  describe('Union', function () {
    it('should concatenate and remove duplicates', function () {
      expect([1, 2, 3].Union([2, 3, 4]).ToArray()).to.be.deep.equal([1, 2, 3, 4])
    })

    it('should accept a function to define which entries are equal', function () {
      const petsA = [
        { name: 'miez', species: 'cat' },
        { name: 'wuff', species: 'dog' }
      ];

      const petsB = [
        { name: 'leo', species: 'cat' },
        { name: 'flipper', specices: 'dolphin' }
      ];

      expect(petsA.Union(petsB, (a, b) => a.species === b.species).Count()).to.be.equal(3) // miez and leo are assumed equal
      expect([1,2,3,4].Union([6, 8, 9], (a, b) => a % 2 === b % 2).Count()).to.be.equal(2) // [1, 2]
    })
  })

  describe('Join', function () {
    const magnus = { Name: 'Hedlund, Magnus' }
    const terry = { Name: 'Adams, Terry' }
    const charlotte = { Name: 'Weiss, Charlotte' }
    const people = [magnus, terry, charlotte]

    const barley = { Name: 'Barley', Owner: terry }
    const boots = { Name: 'Boots', Owner: terry }
    const whiskers = { Name: 'Whiskers', Owner: charlotte }
    const daisy = { Name: 'Daisy', Owner: magnus }
    const pets = [barley, boots, whiskers, daisy]

    it('should join two sequences and transform the pairs using a resultSelector', function () {
      const query =
          people.Join(pets,
                      person => person,
                      pet => pet.Owner,
                      (person, pet) => { return { OwnerName: person.Name, Pet: pet.Name } })

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

    it('should accept an optional keyEqualityCompareFn to compare the keys', function () {
      const keyEqualityCompareFn = (a, b) => a === b

      const query =
          people.Join(pets,
                      person => person,
                      pet => pet.Owner,
                      (person, pet) => { return { OwnerName: person.Name, Pet: pet.Name } },
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
      const numbers1 = [ 2.0, 2.1, 2.2, 2.3, 2.4, 2.5 ]
      const numbers2 = [ 2.2 ]

      const onlyInFirstSet = numbers1.Except(numbers2);

      expect(onlyInFirstSet.ToArray()).to.be.deep.equal([2.0, 2.1, 2.3, 2.4, 2.5])
    })
  })
})
