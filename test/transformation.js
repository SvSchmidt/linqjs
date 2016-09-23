require('./base')
const expect = require('chai').expect

describe('Transformation', function () {
  describe('Aggregate', function () {
    it('should aggregate the elements in the array using an aggregator function', function () {
      const sentence = "the quick brown fox jumps over the lazy dog"
      const words = sentence.split(' ')
      const reversed = words.Aggregate((workingSentence, next) => next + " " + workingSentence)
      expect(reversed).to.be.equal('dog lazy the over jumps fox brown quick the')

      expect([1,2,3,4,5].Aggregate((result, next) => result + next)).to.be.equal(15)
    })

    it('should accept the starting value as first parameter', function () {
      const ints = [4, 8, 8, 3, 9, 0, 7, 8, 2]
      const even = ints.Aggregate(0, (total, next) => next % 2 === 0 ? total + 1 : total)
      expect(even).to.be.equal(6)
    })

    it('should accept the starting value as first and a transformator function as third parameter', function () {
      const fruits = ["apple", "mango", "orange", "passionfruit", "grape"]
      const longestName = fruits.Aggregate('banana',
          (longest, next) => next.length > longest.length ? next : longest,
          // Return the final result as an upper case string.
          fruit => fruit.toUpperCase())

      expect(longestName).to.be.equal('PASSIONFRUIT')
    })
  })

  describe('Distinct', function () {
    it('should return the distinct values of an array using the default equality comparer', function () {
      expect([1,2,3,4,5,6,6,7,1,2].Distinct().ToArray()).to.be.deep.equal([1,2,3,4,5,6,7])
    })

    it('should accept a custom equality compare function and return the distinct valeus', function () {
      const pets = [
        { name: 'miez', species: 'cat' },
        { name: 'wuff', species: 'dog' },
        { name: 'leo', species: 'cat' },
        { name: 'flipper', specices: 'dolphin' }
      ]

      expect(pets.Distinct((a, b) => a.species === b.species).ToArray()).to.be.deep.equal([
        { name: 'miez', species: 'cat' },
        { name: 'wuff', species: 'dog' },
        { name: 'flipper', specices: 'dolphin' }
      ])

      expect([1,2,3,4].Distinct((a, b) => a % 2 === b % 2).ToArray()).to.be.deep.equal([1,2])
      expect([].Distinct().ToArray()).to.be.deep.equal([])
      expect([].Distinct((a, b) => a % 2 === b % 2).ToArray()).to.be.deep.equal([])
    })
  })
})
