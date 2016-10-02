describe('equality', function () {
  describe('SequenceEqual(second, equalityCompareFn)', function () {
    const pet1 = { Name: 'Turbo', Age: 2 }
    const pet2 = { Name: 'Peanut', Age: 8 }
    const pet3 = { Name: 'Miez', Age: 2 }
    const pets1 = [pet1, pet2]
    const pets2 = [pet1, pet2]
    const pets3 = [pet1]
    const pets4 = [pet3, pet2]

    it('should compare the sequence with the second sequence for equality', function () {
      expect(pets1.SequenceEqual(pets2)).to.be.true
      expect(pets1.SequenceEqual(pets3)).to.be.false
      expect(pets1.SequenceEqual(pets4)).to.be.false
    })

    it('should accept a custom equality comparator function', function () {
      expect(pets4.SequenceEqual(pets1, (p1, p2) => p1.Age === p2.Age)).to.be.true
      expect(pets4.SequenceEqual(pets3, (p1, p2) => p1.Age === p2.Age)).to.be.false
    })

    it('should return false if compared with non-iterables', function () {
      expect(pets1.SequenceEqual(1)).to.be.false
    })
  })
})
