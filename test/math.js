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
    it('should return the minimum of the array', function () {
      expect([1,2,3,4,5].Min()).to.be.equal(1)
    })

    it('should be able to transform the values using a mapFn and then return the minimum', function () {
      expect([1,2,3,4,5].Min(x => x + 3)).to.be.equal(4)

      /*
        Spec: https://msdn.microsoft.com/de-de/library/bb534961(v=vs.110).aspx
      */
      expect(pets.Min(pet => pet.Age)).to.be.equal(1)
    })

    it('should throw an error if the array is empty', function () {
      expect(function () { [].Min() }).to.throw(Error)
    })
  })

  describe('Max', function () {
    it('should return the maximum of the array', function () {
      expect([1,2,3,4,5].Max()).to.be.equal(5)
    })

    it('should be able to transform the values using a mapFn and then return the maximum', function () {
      expect([1,2,3,4,5].Max(x => x + 3)).to.be.equal(8)

      /*
        Spec: https://msdn.microsoft.com/de-de/library/bb549404(v=vs.110).aspx
      */
      expect(pets.Max(pet => pet.Age + pet.Name.length)).to.be.equal(14)
    })

    it('should throw an error if the array is empty', function () {
      expect(function () { [].Max() }).to.throw(Error)
    })
  })

  describe('Average', function () {
    it('should return the average of the array values', function () {
      expect([1,2,3,4,5].Average()).to.be.equal(3)
    })

    it('should be able to transform the values using a mapFn and then return the sum', function () {
      expect([1,2,3,4,5].Average(x => 2 * x)).to.be.equal(6)
      expect(pets.Average(pet => pet.Age)).to.be.equal(4.333333333333333)
    })

    it('should throw an error if the array is empty', function () {
      expect(function () { [].Average() }).to.throw(Error)
    })
  })

  describe('Sum', function () {
    it('should return the sum of the array values', function () {
      expect([1,2,3,4,5].Sum()).to.be.equal(15)
    })

    it('should be able to transform the values using a mapFn and then return the sum', function () {
      expect([1,2,3,4,5].Sum(x => 2 * x)).to.be.equal(30)
      expect(pets.Sum(pet => pet.Age)).to.be.equal(13)
    })

    it('should throw an error if the array is empty', function () {
      expect(function () { [].Sum() }).to.throw(Error)
    })
  })
})
