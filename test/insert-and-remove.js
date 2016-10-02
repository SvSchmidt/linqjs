describe('Insert/Remove', function () {
  describe('Add', function () {
    it('should return a new collection containing the value at the end', function () {
      let coll = Collection.from([1,2,3])

      coll.Add(4)
      expect(coll.Count()).to.be.equal(4)
      expect(coll.ElementAt(3)).to.be.equal(4)

      coll.Add(5)
      expect(coll.Count()).to.be.equal(5)
      expect(coll.ElementAt(4)).to.be.equal(5)
    })
  })

  describe('Insert', function () {
    it('should add values to any index of the array', function () {
      let coll = Collection.from([1,2,3])

      coll.Insert(4, 0)
      expect(coll.ToArray()).to.be.deep.equal([4,1,2,3])

      coll.Insert(5, 2)
      expect(coll.ToArray()).to.be.deep.equal([4,1,5,2,3])
    })

    it('should throw an error if the index is out of bounds', function () {
      expect(function () { [].Insert(1, 100) }).to.throw(Error)
    })
  })

  describe('Add/Insert', function () {
    it('should modify the original array and return void', function () {
      expect([].Add(1)).to.be.undefined
      expect([].Insert(1, 0)).to.be.undefined
    })
  })

  describe('Remove', function () {
    it('should remove an element from the array modifying the original array', function () {
      let pets = Collection.from([
        { name: 'miez', species: 'cat' },
        { name: 'wuff', species: 'dog' },
        { name: 'leo', species: 'cat' },
        { name: 'flipper', specices: 'dolphin' }
      ])

      expect(pets.Remove({ name: 'miez', species: 'cat' })).to.be.true
      expect(pets.Count()).to.be.equal(3)

      expect(pets.Remove(4)).to.be.false
      expect(pets.Count()).to.be.equal(3)

      expect(pets.Remove({ name: 'leo', species: 'cat' })).to.be.true
      expect(pets.Count()).to.be.equal(2)

      expect(pets.Remove({ name: 'wuff', species: 'dog' })).to.be.true
      expect(pets.Count()).to.be.equal(1)

      expect(pets.Remove({ name: 'wuff', species: 'dog' })).to.be.false
      expect(pets.Count()).to.be.equal(1)

      expect(pets.Remove({ name: 'flipper', specices: 'dolphin' })).to.be.true
      expect(pets.Count()).to.be.equal(0)

      expect([].Remove(1)).to.be.false
    })
  })
})
