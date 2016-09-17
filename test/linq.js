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

    describe('TakeWhile', function () {
      const people = [
        { name: 'Gandalf', race: 'istari' },
        { name: 'Thorin', race: 'dwarfs' },
        { name: 'Frodo', race: 'hobbit' },
      ]

      it('should return all elements until the predicate stops matching', function () {
        expect(people.TakeWhile(p => p.race !== 'hobbit')).to.be.deep.equal(people.Take(2))
        expect([1,2,3,4,5,'foo'].TakeWhile(elem => !isNaN(parseFloat(elem)))).to.be.deep.equal([1,2,3,4,5])
      })

      it('should accept predicates using the index as second parameter', function () {
        expect([1,2,3,4,5].TakeWhile((elem, index) => index < 3)).to.be.deep.equal([1,2,3])
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
  })

  describe('Array search', function () {
    describe('Where', function () {
      it('should return a new sequence containing the elements matching the predicate', function () {
        expect([1,2,3].Where(x => x > 1)).to.be.deep.equal([2,3])
      })

      it('should accept index-based predicate', function () {
        expect([1,2,3,4,5].Where((elem, index) => index > 1)).to.be.deep.equal([3,4,5])
      })
    })
  })

  describe('Concat', function () {
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
        let petsA = [
          { name: 'miez', species: 'cat' },
          { name: 'wuff', species: 'dog' }
        ];

        let petsB = [
          { name: 'leo', species: 'cat' },
          { name: 'flipper', specices: 'dolphin' }
        ];

        expect(petsA.Union(petsB, (a, b) => a.species === b.species).length).to.be.equal(3) // miez and leo are assumed equal
        expect([1,2,3,4].Union([6, 8, 9], (a, b) => a % 2 === b % 2).length).to.be.equal(2) // [1, 2]
      })
    })
  })
})
