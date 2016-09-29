const Collection = require('../dist/linq')
const expect = require('chai').expect

describe('grouping', function () {
  describe('GroupBy', function () {
    const pets = [
      {
        Name: 'Barley',
        Age: 8.3,
      },
      {
        Name: 'Boots',
        Age: 4.9,
      },
      {
        Name: 'Whiskers',
        Age: 1.5,
      },
      {
        Name: 'Daisy',
        Age: 4.3
      }
    ]

    describe('GroupBy(keySelector, elementSelector, resultSelector)', function () {
      it('should group the elements using the keyselector, map each group member using the elementSelector and fetch a result using the resultSelector', function () {
        const query = pets.GroupBy(
            pet => Math.floor(pet.Age),
            pet => pet.Age,
            (baseAge, ages) => ({
                Key: baseAge,
                Count: ages.Count(),
                Min: ages.Min(),
                Max: ages.Max()
            })
          );

        const expected = [
          {
            Key: 8,
            Count: 1,
            Min: 8.3,
            Max: 8.3,
          },
          {
            Key: 4,
            Count: 2,
            Min: 4.3,
            Max: 4.9,
          },
          {
            Key: 1,
            Count: 1,
            Min: 1.5,
            Max: 1.5,
          }
        ]

        expect(query.ToArray()).to.be.deep.equal(expected)
      })
    })

    describe('GroupBy(keySelector)', function () {
      it('should group the elements using a key selector', function () {
        const result = pets.GroupBy(pet => pet.Name[0])
        const expected = new Map()
        expected.set('B', [
          {
            Name: 'Barley',
            Age: 8.3,
          },
          {
            Name: 'Boots',
            Age: 4.9,
          },
        ])
        expected.set('W', [
          {
            Name: 'Whiskers',
            Age: 1.5,
          },
        ])
        expected.set('D', [
          {
            Name: 'Daisy',
            Age: 4.3
          }
        ])

        expect(result).to.be.deep.equal(expected)
      })
    })

    describe('GroupBy(keySelector, elementSelector)', function () {
      it('should group the sequence using the key selector and project each element using the element selector', function () {
        const expected = new Map([[8, [8.3]], [4, [4.9, 4.3]], [1, [1.5]]])
        const result = pets.GroupBy(pet => Math.floor(pet.Age), pet => pet.Age)
        expect(result).to.be.deep.equal(expected)
      })
    })

    describe('GroupBy(keySelector, resultSelector)', function () {
      it('should group the sequence using the key selector and project each group using the result selector', function () {
        const result = pets
          .GroupBy(
            pet => Math.floor(pet.Age),
            (key, pets) => ({ key, youngest: pets.First(p => p.Age === pets.Min(g => g.Age)).Name }))
          .ToArray()
        const expected = [{"key":8,"youngest":"Barley"},{"key":4,"youngest":"Daisy"},{"key":1,"youngest":"Whiskers"}]

        expect(result).to.be.deep.equal(expected)
      })
    })
  })
})
