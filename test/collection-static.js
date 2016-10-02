describe('Collection static methods', function () {
  describe('Collection.from(iterable)', function () {
    it('should behave the same as new Collection(iterable)', function () {
      expect(Collection.from([1,2,3])).to.be.deep.equal(new Collection([1,2,3]))
    })
  })

  describe('Collection.From(iterable)', function () {
    it('should be equal to Collection.from (lowercase f)', function () {
      expect(Collection.From).to.be.deep.equal(Collection.from)
    })
  })

  describe('Collection.Range(start, count)', function () {
    it('should return a new Collection of count numbers from start including', function () {
      expect(Collection.Range(1,5).ToArray()).to.be.deep.equal([1,2,3,4,5])
      expect(Collection.Range(-5, 5).ToArray()).to.be.deep.equal([-5, -4, -3, -2, -1])

      const squares = Collection.Range(1, 5).Select(x => x * x)
      expect(squares.ToArray()).to.be.deep.equal([1, 4, 9, 16, 25])

      const even = Collection.Range(1, 10).Where(x => x % 2 === 0)
      expect(even.ToArray()).to.be.deep.equal([2, 4, 6, 8, 10])
    })

    it('should throw an error if count < 0', function () {
      expect(function () { Collection.Range(0, -1) }).to.throw(Error)
      expect(function () { Collection.Range(-1, -1) }).to.throw(Error)
    })

    it('should return an empty collection for count = 0', function () {
      expect(Collection.Range(0, 0).ToArray()).to.be.deep.equal([])
      expect(Collection.Range(10, 0).ToArray()).to.be.deep.equal([])
    })
  })

  describe('Collection.Repeat(val, count)', function () {
    it('should return a Collection of count times val', function () {
      expect(Collection.Repeat('na', 10).ToArray().join(' ') + ' BATMAN!').to.be.equal('na na na na na na na na na na BATMAN!')
    })

    it('should return an empty collection if count = 0', function () {
      expect(Collection.Repeat('foo', 0).ToArray()).to.have.length(0)
    })

    it('should throw an error if count < 0', function () {
      expect(function () { Collection.Repeat('foo', -1) }).to.throw(Error)
    })
  })
})

describe('Collection static properties', function () {
  describe('Collection.Empty', function () {
    it('should be an empty Collection', function () {
      expect(Collection.Empty.ToArray()).to.be.deep.equal([])
    })

    it('should have no setter and therefore prohibit overwriting its value', function () {
      Collection.Empty = null
      expect(Collection.Empty).not.to.be.null
    })
  })
})
