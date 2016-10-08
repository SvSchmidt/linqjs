describe('access', function () {
  const people = [
    { name: 'Gandalf', race: 'istari' },
    { name: 'Thorin', race: 'dwarfs' },
    { name: 'Frodo', race: 'hobbit' },
  ]

  describe('ElementAt', function () {
    it('should return the element at the given index', function () {
      expect(people.ElementAt(0).name).to.be.equal('Gandalf')
    })

    it('should throw an error if index is out of bounds', function () {
      expect(function () { people.ElementAt(3) }).to.throw(Error)
      expect(function () { people.ElementAt(-1) }).to.throw(Error)
    })
  })

  describe('Take', function () {
      it('should return the first count elements in the sequence as a new sequence', function () {
        expect([1,2,3,4,5].Take(2).ToArray()).to.be.deep.equal([1,2])
      })

      it('should return an empty sequence if count <= 0', function () {
        expect([1,2,3,4,5].Take(-1).ToArray()).to.be.deep.equal([])
        expect([1,2,3,4,5].Take(0).ToArray()).to.be.deep.equal([])
      })

      it('should return the sequence itself if count >= sequence.length', function () {
        expect([1,2,3,4,5].Take(10).ToArray()).to.be.deep.equal([1,2,3,4,5])
      })
  })

  describe('Skip', function () {
    it('should skip count elements and return the remaining sequence', function () {
      expect(people.Skip(2).ToArray()).to.be.deep.equal([{ name: 'Frodo', race: 'hobbit' }])
    })

    it('should return the sequence itself if count <= 0', function () {
      expect(people.Skip(0).ToArray()).to.be.deep.equal(people)
      expect(people.Skip(-1).ToArray()).to.be.deep.equal(people)
    })

    it('should return an empty sequence if count >= sequence length', function () {
      expect(people.Skip(100).ToArray()).to.be.deep.equal([])
    })
  })

  describe('TakeWhile', function () {
    it('should return all elements while the predicate mathces', function () {
      expect(people.TakeWhile(p => p.race !== 'hobbit').ToArray()).to.be.deep.equal(people.Take(2).ToArray())
      expect([1,2,3,4,5,'foo'].TakeWhile(elem => !isNaN(parseFloat(elem))).ToArray()).to.be.deep.equal([1,2,3,4,5])
    })

    it('should accept predicates using the index as second parameter', function () {
      expect([1,2,3,4,5].TakeWhile((elem, index) => index < 3).ToArray()).to.be.deep.equal([1,2,3])
    })
  })

  describe('SkipWhile', function () {
    it('should skip all elements while the predicate matches', function () {
      expect(people.SkipWhile(p => p.race !== 'hobbit').ToArray()).to.be.deep.equal(people.Skip(2).ToArray())
      expect([1,2,3,4,5,'foo'].SkipWhile(elem => !isNaN(parseFloat(elem))).ToArray()).to.be.deep.equal(['foo'])
    })

    it('should accept predicates using the index as second parameter', function () {
      expect([1,2,3,4,5].SkipWhile((elem, index) => index < 3).ToArray()).to.be.deep.equal([4,5])
    })
  })

  describe('Skip/Take', function () {
    it('Take(n) concatenated with Skip(n) should yield the sequence itself', function () {
      let arr = [1,2,3,4,5]

      expect(arr.Take(2).Concat(arr.Skip(2)).ToArray()).to.be.deep.equal(arr)
    })

    it('Both should throw an error if called with non-numeric parameter', function () {
      expect(function () { [1,2,3].Take('foo') }).to.throw(Error)
    })
  })

  describe('TakeUntil', function () {
    it('should take elements until the predicate yields false', function () {
      expect([1,2,3,4,5].TakeUntil(x => x === 3).ToArray()).to.be.deep.equal([1,2])
    })

    it('should accept the index in the predicate', function () {
      expect([1,2,3,4,5].TakeUntil((x, i) => i > 2).ToArray()).to.be.deep.equal([1,2,3])
    })
  })

  describe('SkipUntil', function () {
    it('should skip elements until the predicate yields false', function () {
      expect([1,2,3,4,5].SkipUntil(x => x === 3).ToArray()).to.be.deep.equal([3,4,5])
    })

    it('should accept the index in the predicate', function () {
      expect([1,2,3,4,5].SkipUntil((x, i) => i > 2).ToArray()).to.be.deep.equal([4,5])
    })
  })

  describe('First', function () {
    it('should return first element of an sequence', function () {
      expect([1, 2, 3, 4].First()).to.be.equal(1)
    })

    it('should return first element matching a predicate', function () {
      expect([10, 20, 30, 40, 50].First(x => x > 20)).to.be.equal(30)
    })

    it('should throw an error if sequence is empty', function () {
      expect(function () { [].First() }).to.throw(Error)
    })
  })

  describe('FirstOrDefault/LastOrDefault/SingleOrDefault', function () {
    it('should behave like the original functions when sequence is not empty', function () {
      expect([1,2,3].FirstOrDefault()).to.be.equal([1,2,3].First())
      expect([1,2,3].FirstOrDefault(x => x > 1)).to.be.equal([1,2,3].First(x => x > 1))

      expect([1,2,3].LastOrDefault()).to.be.equal([1,2,3].Last())
      expect([1,2,3].LastOrDefault(x => x > 1)).to.be.equal([1,2,3].Last(x => x > 1))

      expect([1,2,3].SingleOrDefault(x => x > 2)).to.be.equal([1,2,3].Single(x => x > 2))
    })

    it('should return default instead of throwing an error if sequence is empty', function () {
      expect([].FirstOrDefault()).to.be.null
      expect([].FirstOrDefault(Number)).to.be.equal(0)
      expect([].FirstOrDefault(x => x > 1, Boolean)).to.be.false

      expect([].LastOrDefault()).to.be.null
      expect([].LastOrDefault(Number)).to.be.equal(0)
      expect([].LastOrDefault(x => x > 1, Boolean)).to.be.false

      expect([].SingleOrDefault()).to.be.null
      expect([].SingleOrDefault(Number)).to.be.equal(0)
      expect([].SingleOrDefault(x => x > 1, Boolean)).to.be.false
    })

    it('should return default if no element is found matching the predicate', function () {
      const arr = [1,2,3]

      expect(arr.FirstOrDefault(x => x > 5)).to.be.null
      expect(arr.FirstOrDefault(x => x > 5, 6)).to.be.equal(6)
      expect(arr.FirstOrDefault(x => x > 5, Boolean)).to.be.false

      expect(arr.LastOrDefault(x => x > 5)).to.be.null
      expect(arr.LastOrDefault(x => x > 5, 6)).to.be.equal(6)
      expect(arr.LastOrDefault(x => x > 5, Boolean)).to.be.false

      expect(arr.SingleOrDefault(x => x > 5)).to.be.null
      expect(arr.SingleOrDefault(x => x > 5, 6)).to.be.equal(6)
      expect(arr.SingleOrDefault(x => x > 6, Boolean)).to.be.false
    })
  })

  describe('Last', function () {
    it('should return last element of an sequence', function () {
      expect([1,2,3,4].Last()).to.be.equal(4)
    })

    it('should return last element matching a predicate', function () {
      expect([10, 20, 30, 40, 50].Last(x => x > 20)).to.be.equal(50)
    })

    it('should throw an error if sequence is empty', function () {
      expect(function () { [].Last() }).to.throw(Error)
    })
  })

  describe('Single', function () {
    it('should return the element matching the predicate', function () {
      expect([1,2,3].Single(x => x % 2 === 0)).to.be.equal(2)
      expect([1].Single()).to.be.equal(1)
    })

    it('should throw an error if the result contains more than one element', function () {
      expect(function () { [1,2].Single() }).to.throw(Error)
      expect(function () { [1,2,3].Single(x => x > 1) }).to.throw(Error)
    })

    it('should throw an error if sequence is empty', function () {
      expect(function () { [].Single() }).to.throw(Error)
    })
  })

  describe('DefaultIfEmpty', function () {
    it('should return the default of the provided constructor in a new sequence if sequence is empty', function () {
      expect([].DefaultIfEmpty(Boolean)).to.be.deep.equal([false])
      expect([].DefaultIfEmpty(Object)).to.be.deep.equal([null])
      expect([].DefaultIfEmpty()).to.be.deep.equal([null])
    })

    it('should return the specified default in a new sequence if the sequence is empty', function () {
      const defaultPet = { Name: "Default Pet", Age: 0 }
      const pets = []
      expect(pets.DefaultIfEmpty(defaultPet).length).to.be.equal(1)
      expect(pets.DefaultIfEmpty(defaultPet)).to.be.deep.equal([defaultPet])
    })

    it('should return the sequence itself if it is not empty', function () {
      expect([1,2,3,4].DefaultIfEmpty(Number).ToArray()).to.be.deep.equal([1,2,3,4])
    })
  })
})
