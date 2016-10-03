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

    it('should accept a custom equality compare function and return the distinct values', function () {
      const pets = [
        { name: 'miez', species: 'cat' },
        { name: 'wuff', species: 'dog' },
        { name: 'leo', species: 'cat' },
        { name: 'flipper', species: 'dolphin' }
      ]

      expect(pets.Distinct((a, b) => a.species === b.species).ToArray()).to.be.deep.equal([
        { name: 'miez', species: 'cat' },
        { name: 'wuff', species: 'dog' },
        { name: 'flipper', species: 'dolphin' }
      ])

      expect([1,2,3,4].Distinct((a, b) => a % 2 === b % 2).ToArray()).to.be.deep.equal([1,2])
      expect([].Distinct().ToArray()).to.be.deep.equal([])
      expect([].Distinct((a, b) => a % 2 === b % 2).ToArray()).to.be.deep.equal([])
    })
  })

  describe('ToDictionary', function () {
    const pets = [
      { name: 'miez', species: 'cat' },
      { name: 'wuff', species: 'dog' },
      { name: 'leo', species: 'cat' },
      { name: 'flipper', species: 'dolphin' }
    ]

    it('should have the overload ToDictionary(keySelector)', function () {
      const petDict = pets.ToDictionary(p => p.name)
      expect(petDict instanceof Map).to.be.true
      expect(petDict.has('miez')).to.be.true
      expect(petDict.get('leo')).to.be.deep.equal({ name: 'leo', species: 'cat' })
    })

    it('should have the overload ToDictionary(keySelector, elementSelector)', function () {
      const petDict = pets.ToDictionary(p => p.name, p => p.species)
      expect(petDict instanceof Map).to.be.true
      expect(petDict.has('miez')).to.be.true
      expect(petDict.get('leo')).to.be.equal('cat')
      expect(petDict.get('miez')).to.be.equal('cat')
    })

    it('should have the overload ToDictionary(keySelector, keyComparer)', function () {
      // because of a.length === b.length 'cat' equals 'dog' -> error since the key is in use
      expect(function () { pets.ToDictionary(p => p.species, (a, b) => a.length === b.length) }).to.throw(Error)
      expect(function () { pets.ToDictionary(p => p.name, (a, b) => a.length === b.length) }).to.throw(Error)
      expect(function () { pets.Skip(2).ToDictionary(p => p.name, (a, b) => a.length === b.length) }).not.to.throw(Error)
    })

    it('should have the overload ToDictionary(keySelector, elementSelector, keyComparer)', function () {
      // because of a.length === b.length 'cat' equals 'dog' -> error since the key is in use
      expect(function () { pets.ToDictionary(p => p.species, p => p.name, (a, b) => a.length === b.length) }).to.throw(Error)
      expect(function () { pets.ToDictionary(p => p.name, p => p.species, (a, b) => a.length === b.length) }).to.throw(Error)
      expect(pets.Skip(2).ToDictionary(p => p.name, p => p.species, (a, b) => a.length === b.length).get('leo')).to.be.equal('cat')
      expect(pets.Skip(2).ToDictionary(p => p.name, p => p.species, (a, b) => a.length === b.length).get('flipper')).to.be.equal('dolphin')
      expect(pets.Skip(2).ToDictionary(p => p.name, p => p.species, (a, b) => a.length === b.length).has('miez')).to.be.false
    })
  })

  describe('ToJSON', function () {
    it('should return the JSON representation of the sequence', function () {
      const people = [
        { name: 'Gandalf', race: 'istari' },
        { name: 'Thorin', race: 'dwarfs' },
        { name: 'Frodo', race: 'hobbit' },
      ]

      expect(people.ToJSON()).to.be.equal(`[{"name":"Gandalf","race":"istari"},{"name":"Thorin","race":"dwarfs"},{"name":"Frodo","race":"hobbit"}]`)
      expect([1,2,3].ToJSON()).to.be.equal(`[1,2,3]`)
    })
  })

  describe('Reverse', function () {
    const pets = [
      { name: 'miez', species: 'cat' },
      { name: 'wuff', species: 'dog' },
      { name: 'leo', species: 'cat' },
      { name: 'flipper', species: 'dolphin' }
    ]
    const fruits = ["apple", "mango", "orange", "passionfruit", "grape"]

    it('should return a new sequence with the elements of the original one in reverse order', function () {
      expect(fruits.Reverse().ToArray()).to.be.deep.equal(['grape', 'passionfruit', 'orange', 'mango', 'apple'])
      expect(pets.Reverse().ToArray().First()).to.be.deep.equal(pets[3])
      expect([1,2,3].Reverse().ToArray()).to.be.deep.equal([3,2,1])
    })

    it('should return the original sequence if Reverse is called twice', function () {
      expect(pets.Reverse().Reverse().ToArray()).to.be.deep.equal(pets)
    })
  })

  describe('Flatten', function () {
    it('should flatten a sequence', function () {
      expect([1,2,3,[4,5,6]].Flatten().ToArray()).to.be.deep.equal([1,2,3,4,5,6])
    })
  })

  describe('Select', function () {
    it('should transform each element to a new form', function () {
      const petOwners = [
        { Name: 'Higa, Sidney', Pets: ['Scruffy', 'Sam'] },
        { Name: 'Ashkenazi, Ronen', Pets: ['Walker', 'Sugar'] },
        { Name: 'Price, Vernette', Pets: ['Scratches', 'Diesel'] },
      ]

      expect(petOwners.Select(x => x.Name).ToArray()).to.be.deep.equal(['Higa, Sidney', 'Ashkenazi, Ronen', 'Price, Vernette'])
      expect([1, 2, 3].Select(x => 2 * x).ToArray()).to.be.deep.equal([2, 4, 6])
    })

    it('should accept the index in the mapFn', function () {
      expect([1, 2, 3].Select((x, i) => x + i).ToArray()).to.be.deep.equal([1, 3, 5])
    })
  })

  describe('SelectMany', function () {
    const petOwners = [
      { Name: 'Higa, Sidney', Pets: ['Scruffy', 'Sam'] },
      { Name: 'Ashkenazi, Ronen', Pets: ['Walker', 'Sugar'] },
      { Name: 'Price, Vernette', Pets: ['Scratches', 'Diesel'] },
    ]

    describe('SelectMany(mapFn)', function () {
      it('should map each value in the sequence using mapFn and flatten the result', function () {
        expect(petOwners.SelectMany(petOwner => petOwner.Pets).ToArray()).to.be.deep.equal(['Scruffy', 'Sam', 'Walker', 'Sugar', 'Scratches', 'Diesel'])
      })

      it('should allow to use the index of the element to project the result', function () {
          expect(petOwners.SelectMany((petOwner, index) =>
                                 petOwner.Pets.Select(pet => index + pet)).ToArray()).to.be.deep.equal(['0Scruffy', '0Sam', '1Walker', '1Sugar', '2Scratches', '2Diesel'])
      })
    })

    describe('SelectMany(mapFn, resultSelector)', function () {
      it('should map each value in the sequence using mapFn and flatten the result. A resultSelector function is invoked on each output value.', function () {
        const result = petOwners.SelectMany(petOwner => petOwner.Pets,
                                            (owner, petName) => ({ owner, petName }))
                                .Select(ownerAndPet => ({
                                  owner: ownerAndPet.owner.Name,
                                  pet: ownerAndPet.petName,
                                }))
                                .Take(2)
                                .ToArray()
        const expected = [{"owner":"Higa, Sidney","pet":"Scruffy"},{"owner":"Higa, Sidney","pet":"Sam"}]

        expect(result).to.be.deep.equal(expected)
      })
    })
  })

  describe('ForEach', function () {
    it('should invoke a function for each value of the Collection', function () {
      let called = 0;
      [1,2,3,4,5,6].ForEach(elem => called++)
      expect(called).to.be.equal(6)

      let sum = 0;
      [1,2,3,4,5,6].ForEach(elem => sum += elem)
      expect(sum).to.be.equal(21)
    })
  })
})
