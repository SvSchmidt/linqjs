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

    // in the keyCompraer examples we want to have "4" (string 4) and 4 (number) treated as equal keys
    // that's why we need a copy of the pets array with "Boots" having a age of "4" (string 4)
    const keyComparer = (first, second) => Math.floor(parseFloat(first)) === Math.floor(parseFloat(second))
    const petsKeyComparer = [
      {
        Name: 'Barley',
        Age: 8.3,
      },
      {
        Name: 'Boots',
        Age: "4",
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

    it('should throw an error if called with more than 4 arguments', function () {
      expect(function () { pets.GroupBy(pet => pet.Age, pet => pet.Age, 'foo', 'bar', 'baz') }).to.throw(Error)
    })

    describe('GroupBy(keySelector)', function () {
      it('should group the elements using the keySelector', function () {
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

    describe('GroupBy(keySelector, keyComparer)', function () {
      it('should group the sequence using the keySelector and compare keys using the keyComparer', function () {
        const expected = [[8.3,[{"Name":"Barley","Age":8.3}]],["4",[{"Name":"Boots","Age":"4"},{"Name":"Daisy","Age":4.3}]],[1.5,[{"Name":"Whiskers","Age":1.5}]]]
        const result = petsKeyComparer.GroupBy(pet => pet.Age, keyComparer)

        expect(result.ToArray()).to.be.deep.equal(expected)
      })
    })

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

    describe('GroupBy(keySelector, elementSelector, keyComparer)', function () {
      it('should group a sequence using the keySelector, map each element using the elementSelector and compare keys using the keyComparer', function () {
        const expected = new Map([[8.3,[8.3]],["4",["4",4.3]],[1.5,[1.5]]])
        const result = petsKeyComparer.GroupBy(pet => pet.Age, pet => pet.Age, keyComparer)

        expect(result).to.be.deep.equal(expected)
      })
    })

    describe('GroupBy(keySelector, resultSelector, keyComparer)', function () {
      it('should group a sequence using the keySelector, create a result from each group using the resultSelector and compare keys using the keyComparer', function () {
        const expected = [{"key":8.3,"pets":[{"Name":"Barley","Age":8.3}]},{"key":"4","pets":[{"Name":"Boots","Age":"4"},{"Name":"Daisy","Age":4.3}]},{"key":1.5,"pets":[{"Name":"Whiskers","Age":1.5}]}]
        const result = petsKeyComparer.GroupBy(pet => pet.Age, (age, pets) => ({ key: age, pets }), keyComparer)

        expect(result.ToArray()).to.be.deep.equal(expected)
      })
    })

    describe('GroupBy(keySelector, elementSelector, resultSelector, keyComparer)', function () {
      it('should group the sequence using the keySelector, map each element using elementSelector, create a result of each group with the resultSelector and compare keys by keyComparer', function () {
        const expected = [{"key":8.3,"min":8.3,"max":8.3},{"key":"4","min":4,"max":4.3},{"key":1.5,"min":1.5,"max":1.5}]
        const result = petsKeyComparer.GroupBy(pet => pet.Age,
             pet => pet.Age,
             (baseAge, ages) => ({
               key: baseAge,
               min: ages.Min(),
               max: ages.Max(),
             }),
             (first, second) => Math.floor(parseFloat(first)) === Math.floor(parseFloat(second)))

        expect(result.ToArray()).to.be.deep.equal(expected)
      })
    })
  })
})
