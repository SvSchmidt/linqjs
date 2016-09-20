'use strict';

const expect = require('chai').expect

if (process.env.IS_COVERAGE) {
    describe('Test coverage', function () {
        it('should generate instrumentation', function (done) {
              require('child_process').exec('$(npm root)/.bin/jscoverage dist coverage/dist', done)
        });

        it('should load coverage module', function () {
            require('../coverage/dist/linq.js').install()
        });
    });
} else {
  require('../dist/linq').install()
}

describe('linqjs', function () {
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

      it('should throw an error if the array is empty', function () {
        expect(function () { [].Average() }).to.throw(Error)
      })
    })

    describe('Sum', function () {
      it('should return the sum of the array values', function () {
        expect([1,2,3,4,5].Sum()).to.be.equal(15)
      })

      it('should throw an error if the array is empty', function () {
        expect(function () { [].Sum() }).to.throw(Error)
      })
    })
  })

  describe('Contains', function () {
    /*
    Spec: https://msdn.microsoft.com/de-de/library/bb352880(v=vs.110).aspx
    */
    const fruits = [ "apple", "banana", "mango", "orange", "passionfruit", "grape" ];

    it('should return true if array contains specified element', function() {
      expect(fruits.Contains('mango')).to.be.true;
    })

    it('should return false if array does not contains specified element', function() {
      expect(fruits.Contains('tomato')).to.be.false;
    })
  })

  describe('Array access', function () {
    const people = [
      { name: 'Gandalf', race: 'istari' },
      { name: 'Thorin', race: 'dwarfs' },
      { name: 'Frodo', race: 'hobbit' },
    ]

    describe('ElementAt', function () {
      it('should return the element at the given index', function () {
        expect(people.ElementAt(0).name).to.be.equal('Gandalf')
      })

      it('should throw an error if index < 0 or >= arr.length', function () {
        expect(function () { people.ElementAt(3) }).to.throw(Error)
        expect(function () { people.ElementAt(-1) }).to.throw(Error)
      })
    })

    describe('Take', function () {
        it('should return the first count elements in the array', function () {
          expect([1,2,3,4,5].Take(2)).to.be.deep.equal([1,2])
        })

        it('should return an empty array if count <= 0', function () {
          expect([1,2,3,4,5].Take(-1)).to.be.deep.equal([])
          expect([1,2,3,4,5].Take(0)).to.be.deep.equal([])
        })

        it('should return the array itself if count >= array.length', function () {
          expect([1,2,3,4,5].Take(10)).to.be.deep.equal([1,2,3,4,5])
        })
    })

    describe('Skip', function () {
      it('should skip count elements and return the remaining array', function () {
        expect(people.Skip(2)).to.be.deep.equal([{ name: 'Frodo', race: 'hobbit' }])
      })

      it('should return the array itself if count <= 0', function () {
        expect(people.Skip(0)).to.be.deep.equal(people)
        expect(people.Skip(-1)).to.be.deep.equal(people)
      })

      it('should return an empty array if count >= array.length', function () {
        expect(people.Skip(100)).to.be.deep.equal([])
      })
    })

    describe('Skip/Take are complementary', function () {
      it('arr.Take(n) concatenated with arr.Skip(n) should yield arr itself', function () {
        let arr = [1,2,3,4,5]

        expect(Array.prototype.concat.apply([], [arr.Take(2), arr.Skip(2)])).to.be.deep.equal(arr)
      })
    })

    describe('TakeWhile', function () {
      it('should return all elements until the predicate stops matching', function () {
        expect(people.TakeWhile(p => p.race !== 'hobbit')).to.be.deep.equal(people.Take(2))
        expect([1,2,3,4,5,'foo'].TakeWhile(elem => !isNaN(parseFloat(elem)))).to.be.deep.equal([1,2,3,4,5])
      })

      it('should accept predicates using the index as second parameter', function () {
        expect([1,2,3,4,5].TakeWhile((elem, index) => index < 3)).to.be.deep.equal([1,2,3])
      })
    })

    describe('SkipWhile', function () {
      it('should skip all elements until the predicate stops matching', function () {
        expect(people.SkipWhile(p => p.race !== 'hobbit')).to.be.deep.equal(people.Skip(2))
        expect([1,2,3,4,5,'foo'].SkipWhile(elem => !isNaN(parseFloat(elem)))).to.be.deep.equal(['foo'])
      })

      it('should accept predicates using the index as second parameter', function () {
        expect([1,2,3,4,5].SkipWhile((elem, index) => index < 3)).to.be.deep.equal([4,5])
      })
    })

    describe('First', function () {
      it('should return first element of an array', function () {
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
    })

    describe('Last', function () {
      it('should return last element of an array', function () {
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
      it('should return the default of the provided constructor in a new array if sequence is empty', function () {
        expect([].DefaultIfEmpty(Boolean)).to.be.deep.equal([false])
        expect([].DefaultIfEmpty(Object)).to.be.deep.equal([null])
        expect([].DefaultIfEmpty()).to.be.deep.equal([null])
      })

      it('should return the specified default in a new array if the sequence is empty', function () {
        const defaultPet = { Name: "Default Pet", Age: 0 }
        const pets = []
        expect(pets.DefaultIfEmpty(defaultPet).length).to.be.equal(1)
        expect(pets.DefaultIfEmpty(defaultPet)).to.be.deep.equal([defaultPet])
      })
    })
  })

  describe('Array search', function () {
    const fruits = [
      { name: 'banana', color: 'yellow' },
      { name: 'strawberry', color: 'red' },
      { name: 'rasperry', color: 'red' },
      { name: 'tomato', color: 'red' },
      { name: 'blueberry', color: 'blue' }
    ]

    describe('Where', function () {
      it('should return a new sequence containing the elements matching the predicate', function () {
        expect([1,2,3].Where(x => x > 1)).to.be.deep.equal([2,3])
      })

      it('should accept index-based predicate', function () {
        expect([1,2,3,4,5].Where((elem, index) => index > 1)).to.be.deep.equal([3,4,5])
      })
    })

    describe('Any', function () {
      it('should return true if no predicate is given and the array contains elements', function () {
        expect([1,2,3,4,5].Any()).to.be.true
        expect([].Any()).to.be.false
      })

      it('should return true if at least one element matches the predicate', function () {
        expect(fruits.Any(x => x.color === 'blue')).to.be.true
        expect(fruits.Any(x => x.color === 'orange')).to.be.false
      })
    })

    describe('All', function () {
      it('should return true if all elements match the predicate', function () {
        expect(fruits.All(x => x.color === 'red')).to.be.false
        expect([2,4,6,8].All(x => x % 2 === 0)).to.be.true
        expect([].All(x => x % 2 === 0)).to.be.true // since there's no elements
      })
    })

    describe('Count', function () {
      it('should return the length of array if called with no parameters', function () {
        expect(fruits.Count()).to.be.equal(fruits.length)
        expect([].Count()).to.be.equal(0)
      })

      it('should count the elements matching a predicate', function () {
        expect(fruits.Count(x => x.color === 'red')).to.be.equal(3)
        expect(fruits.Count(x => x.color === 'orange')).to.be.equal(0)
        expect(fruits.Count(x => x.color !== 'orange')).to.be.equal(fruits.length)
      })
    })
  })

  describe('Concatenation', function () {
    describe('Concat', function () {
      it('should concatenate two arrays', function () {
        expect([1, 2, 3].Concat([4, 5, 6])).to.be.deep.equal([1, 2, 3, 4, 5, 6])
      })

      it('should keep duplicates', function () {
        expect([1, 2, 3].Concat([2, 3, 4])).to.be.deep.equal([1, 2, 3, 2, 3, 4])
      })
    })

    describe('Union', function () {
      it('should concatenate and remove duplicates', function () {
        expect([1, 2, 3].Union([2, 3, 4])).to.be.deep.equal([1, 2, 3, 4])
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

        expect(petsA.Union(petsB, (a, b) => a.species === b.species).length).to.be.equal(3) // miez and leo are assumed equal
        expect([1,2,3,4].Union([6, 8, 9], (a, b) => a % 2 === b % 2).length).to.be.equal(2) // [1, 2]
      })
    })
  })

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
        expect([1,2,3,4,5,6,6,7,1,2].Distinct()).to.be.deep.equal([1,2,3,4,5,6,7])
      })

      it('should accept a custom equality compare function and return the distinct valeus', function () {
        const pets = [
          { name: 'miez', species: 'cat' },
          { name: 'wuff', species: 'dog' },
          { name: 'leo', species: 'cat' },
          { name: 'flipper', specices: 'dolphin' }
        ]

        expect(pets.Distinct((a, b) => a.species === b.species)).to.be.deep.equal([
          { name: 'miez', species: 'cat' },
          { name: 'wuff', species: 'dog' },
          { name: 'flipper', specices: 'dolphin' }
        ])

        expect([1,2,3,4].Distinct((a, b) => a % 2 === b % 2)).to.be.deep.equal([1,2])
        expect([].Distinct()).to.be.deep.equal([])
        expect([].Distinct((a, b) => a % 2 === b % 2)).to.be.deep.equal([])
      })
    })
  })

  describe('Insert/Remove', function () {
    describe('Add', function () {
      it('should return a new array containing the value at the end', function () {
        let arr = [1,2,3]

        arr.Add(4)
        expect(arr.length).to.be.equal(4)
        expect(arr[3]).to.be.equal(4)

        arr.Add(5)
        expect(arr.length).to.be.equal(5)
        expect(arr[4]).to.be.equal(5)
      })
    })

    describe('Insert', function () {
      it('should add values to any index of the array', function () {
        let arr = [1,2,3]

        arr.Insert(4, 0)
        expect(arr).to.be.deep.equal([4,1,2,3])

        arr.Insert(5, 2)
        expect(arr).to.be.deep.equal([4,1,5,2,3])
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
      let pets = [
        { name: 'miez', species: 'cat' },
        { name: 'wuff', species: 'dog' },
        { name: 'leo', species: 'cat' },
        { name: 'flipper', specices: 'dolphin' }
      ]

      expect(pets.Remove({ name: 'miez', species: 'cat' })).to.be.true
      expect(pets.length).to.be.equal(3)

      expect(pets.Remove(4)).to.be.false
      expect(pets.length).to.be.equal(3)

      expect(pets.Remove({ name: 'leo', species: 'cat' })).to.be.true
      expect(pets.length).to.be.equal(2)

      expect(pets.Remove({ name: 'wuff', species: 'dog' })).to.be.true
      expect(pets.length).to.be.equal(1)

      expect(pets.Remove({ name: 'wuff', species: 'dog' })).to.be.false
      expect(pets.length).to.be.equal(1)

      expect(pets.Remove({ name: 'flipper', specices: 'dolphin' })).to.be.true
      expect(pets.length).to.be.equal(0)

      expect([].Remove(1)).to.be.false
    })
  })
})
