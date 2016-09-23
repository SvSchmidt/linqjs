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
})
