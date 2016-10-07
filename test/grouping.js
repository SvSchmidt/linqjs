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
    const keyComparer = (outer, inner) => Math.floor(parseFloat(outer)) === Math.floor(parseFloat(inner))
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
             (outer, inner) => Math.floor(parseFloat(outer)) === Math.floor(parseFloat(inner)))

        expect(result.ToArray()).to.be.deep.equal(expected)
      })
    })
  })

  describe('GroupJoin', function () {
    describe('GroupJoin(inner, outerKeySelector, innerKeySelector, resultSelector)', function () {
      it('should correlate two sequences by using the key selectors and select a result using the resultSelector', function () {
        const magnus = { Name: 'Hedlund, Magnus' }
        const terry = { Name: 'Addams, Terry' }
        const charlotte = { Name: 'Weiss, Charlotte' }

        const barley = { Name: 'Barley', Owner: terry }
        const boots = { Name: 'Boots', Owner: terry }
        const whiskers = { Name: 'Whiskers', Owner: charlotte }
        const daisy = { Name: 'Daisy', Owner: magnus }

        const persons = [magnus, terry, charlotte]
        const pets = [barley, boots, whiskers, daisy]

        const query = persons.GroupJoin(pets,
                             person => person,
                             pet => pet.Owner,
                             (person, petCollection) =>
                                 ({
                                     OwnerName: person.Name,
                                     Pets: petCollection.Select(pet => pet.Name).ToArray(),
                                 }))

        const expected = [
          {
           OwnerName: magnus.Name,
           Pets: [daisy.Name],
          },
          {
           OwnerName: terry.Name,
           Pets: [barley.Name, boots.Name],
          },
          {
           OwnerName: charlotte.Name,
           Pets: [whiskers.Name],
          },
        ]

        expect(query.ToArray()).to.be.deep.equal(expected)
      })
    })

    describe('GroupJoin(inner, outerKeySelector, innerKEySelector, resultSelector, keyComparer)', function () {
      it('should correlate two sequences by using the key selectors, compare keys using the keyComparer and select a result using the resultSelector', function () {
        const customers = [
          { Code: 5, Name: 'Sam' },
          { Code: 6, Name: 'Dave' },
          { Code: 7, Name: 'Julia' },
          { Code: 8, Name: 'Sue' },
        ]

        const orders = [
          { KeyCode: 5, Product: 'Book' },
          { KeyCode: '5', Product: 'Game' },
          { KeyCode: '7', Product: 'Computer' },
          { KeyCode: 7, Product: 'Mouse' },
          { KeyCode: 8, Product: 'Shirt' },
          { KeyCode: 5, Product: 'Underwear' },
        ]

        const query = customers.GroupJoin(orders,
                c => c.Code,
                o => o.KeyCode,
                (customer, bought) => ({ customer: customer.Name, bought: bought.Select(b => b.Product).ToArray() }),
                (a, b) => parseInt(a) === parseInt(b));
        expect(query.First()).to.be.deep.equal({
          customer: 'Sam',
          bought: ['Book', 'Game', 'Underwear']
        })
      })
    })
  })
})
