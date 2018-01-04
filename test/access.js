describe('access', function () {
    const people = [
        {name: 'Gandalf', race: 'istari'},
        {name: 'Thorin', race: 'dwarfs'},
        {name: 'Frodo', race: 'hobbit'},
    ]

    describe('ElementAt', function () {
        it('should return the element at the given index', function () {
            expect(people.elementAt(0).name).to.be.equal('Gandalf')
        })

        it('should throw an error if index is out of bounds', function () {
            expect(function () {
                people.elementAt(3)
            }).to.throw(Error)
            expect(function () {
                people.elementAt(-1)
            }).to.throw(Error)
        })
    })

    describe('Take', function () {
        it('should return the first count elements in the sequence as a new sequence', function () {
            expect([1, 2, 3, 4, 5].take(2).toArray()).to.be.deep.equal([1, 2])
        })

        it('should return an empty sequence if count <= 0', function () {
            expect([1, 2, 3, 4, 5].take(-1).toArray()).to.be.deep.equal([])
            expect([1, 2, 3, 4, 5].take(0).toArray()).to.be.deep.equal([])
        })

        it('should return the sequence itself if count >= sequence.length', function () {
            expect([1, 2, 3, 4, 5].take(10).toArray()).to.be.deep.equal([1, 2, 3, 4, 5])
        })
    })

    describe('Skip', function () {
        it('should skip count elements and return the remaining sequence', function () {
            expect(people.skip(2).toArray()).to.be.deep.equal([{name: 'Frodo', race: 'hobbit'}])
        })

        it('should return the sequence itself if count <= 0', function () {
            expect(people.skip(0).toArray()).to.be.deep.equal(people)
            expect(people.skip(-1).toArray()).to.be.deep.equal(people)
        })

        it('should return an empty sequence if count >= sequence length', function () {
            expect(people.skip(100).toArray()).to.be.deep.equal([])
        })
    })

    describe('TakeWhile', function () {
        it('should return all elements while the predicate mathces', function () {
            expect(people.takeWhile(p => p.race !== 'hobbit').toArray()).to.be.deep.equal(people.take(2).toArray())
            expect([1, 2, 3, 4, 5, 'foo'].takeWhile(elem => !isNaN(parseFloat(elem))).toArray()).to.be.deep.equal([1, 2, 3, 4, 5])
        })

        it('should accept predicates using the index as second parameter', function () {
            expect([1, 2, 3, 4, 5].takeWhile((elem, index) => index < 3).toArray()).to.be.deep.equal([1, 2, 3])
        })
    })

    describe('SkipWhile', function () {
        it('should skip all elements while the predicate matches', function () {
            expect(people.skipWhile(p => p.race !== 'hobbit').toArray()).to.be.deep.equal(people.skip(2).toArray())
            expect([1, 2, 3, 4, 5, 'foo'].skipWhile(elem => !isNaN(parseFloat(elem))).toArray()).to.be.deep.equal(['foo'])
        })

        it('should accept predicates using the index as second parameter', function () {
            expect([1, 2, 3, 4, 5].skipWhile((elem, index) => index < 3).toArray()).to.be.deep.equal([4, 5])
        })
    })

    describe('Skip/Take', function () {
        it('Take(n) concatenated with Skip(n) should yield the sequence itself', function () {
            let arr = [1, 2, 3, 4, 5]

            expect(arr.take(2).concat(arr.skip(2)).toArray()).to.be.deep.equal(arr)
        })

        it('Both should throw an error if called with non-numeric parameter', function () {
            expect(function () {
                [1, 2, 3].take('foo')
            }).to.throw(Error)
        })
    })

    describe('TakeUntil', function () {
        it('should take elements until the predicate yields false', function () {
            expect([1, 2, 3, 4, 5].takeUntil(x => x === 3).toArray()).to.be.deep.equal([1, 2])
        })

        it('should accept the index in the predicate', function () {
            expect([1, 2, 3, 4, 5].takeUntil((x, i) => i > 2).toArray()).to.be.deep.equal([1, 2, 3])
        })
    })

    describe('SkipUntil', function () {
        it('should skip elements until the predicate yields false', function () {
            expect([1, 2, 3, 4, 5].skipUntil(x => x === 3).toArray()).to.be.deep.equal([3, 4, 5])
        })

        it('should accept the index in the predicate', function () {
            expect([1, 2, 3, 4, 5].skipUntil((x, i) => i > 2).toArray()).to.be.deep.equal([4, 5])
        })
    })

    describe('First', function () {
        it('should return first element of an sequence', function () {
            expect([1, 2, 3, 4].first()).to.be.equal(1)
        })

        it('should return first element matching a predicate', function () {
            expect([10, 20, 30, 40, 50].first(x => x > 20)).to.be.equal(30)
        })

        it('should throw an error if sequence is empty', function () {
            expect(function () {
                [].first()
            }).to.throw(Error)
        })
    })

    describe('FirstOrDefault/LastOrDefault/SingleOrDefault', function () {
        it('should behave like the original functions when sequence is not empty', function () {
            expect([1, 2, 3].firstOrDefault()).to.be.equal([1, 2, 3].first())
            expect([1, 2, 3].firstOrDefault(x => x > 1)).to.be.equal([1, 2, 3].first(x => x > 1))

            expect([1, 2, 3].lastOrDefault()).to.be.equal([1, 2, 3].last())
            expect([1, 2, 3].lastOrDefault(x => x > 1)).to.be.equal([1, 2, 3].last(x => x > 1))

            expect([1, 2, 3].singleOrDefault(x => x > 2)).to.be.equal([1, 2, 3].single(x => x > 2))
        })

        it('should return default instead of throwing an error if sequence is empty', function () {
            expect([].firstOrDefault()).to.be.null
            expect([].firstOrDefault(Number)).to.be.equal(0)
            expect([].firstOrDefault(x => x > 1, Boolean)).to.be.false

            expect([].lastOrDefault()).to.be.null
            expect([].lastOrDefault(Number)).to.be.equal(0)
            expect([].lastOrDefault(x => x > 1, Boolean)).to.be.false

            expect([].singleOrDefault()).to.be.null
            expect([].singleOrDefault(Number)).to.be.equal(0)
            expect([].singleOrDefault(x => x > 1, Boolean)).to.be.false
        })

        it('should return default if no element is found matching the predicate', function () {
            const arr = [1, 2, 3]

            expect(arr.firstOrDefault(x => x > 5)).to.be.null
            expect(arr.firstOrDefault(x => x > 5, 6)).to.be.equal(6)
            expect(arr.firstOrDefault(x => x > 5, Boolean)).to.be.false

            expect(arr.lastOrDefault(x => x > 5)).to.be.null
            expect(arr.lastOrDefault(x => x > 5, 6)).to.be.equal(6)
            expect(arr.lastOrDefault(x => x > 5, Boolean)).to.be.false

            expect(arr.singleOrDefault(x => x > 5)).to.be.null
            expect(arr.singleOrDefault(x => x > 5, 6)).to.be.equal(6)
            expect(arr.singleOrDefault(x => x > 6, Boolean)).to.be.false
        })
    })

    describe('Last', function () {
        it('should return last element of an sequence', function () {
            expect([1, 2, 3, 4].last()).to.be.equal(4)
        })

        it('should return last element matching a predicate', function () {
            expect([10, 20, 30, 40, 50].last(x => x > 20)).to.be.equal(50)
        })

        it('should throw an error if sequence is empty', function () {
            expect(function () {
                [].last()
            }).to.throw(Error)
        })
    })

    describe('Single', function () {
        it('should return the element matching the predicate', function () {
            expect([1, 2, 3].single(x => x % 2 === 0)).to.be.equal(2)
            expect([1].single()).to.be.equal(1)
        })

        it('should throw an error if the result contains more than one element', function () {
            expect(function () {
                [1, 2].single()
            }).to.throw(Error)
            expect(function () {
                [1, 2, 3].single(x => x > 1)
            }).to.throw(Error)
        })

        it('should throw an error if sequence is empty', function () {
            expect(function () {
                [].single()
            }).to.throw(Error)
        })
    })

    describe('DefaultIfEmpty', function () {
        it('should return the default of the provided constructor in a new sequence if sequence is empty', function () {
            expect([].defaultIfEmpty(Boolean).toArray()).to.be.deep.equal([false])
            expect([].defaultIfEmpty(Object).toArray()).to.be.deep.equal([null])
            expect([].defaultIfEmpty().toArray()).to.be.deep.equal([null])
        })

        it('should return the specified default in a new sequence if the sequence is empty', function () {
            const defaultPet = {Name: "Default Pet", Age: 0}
            const pets = []
            expect(pets.defaultIfEmpty(defaultPet).count()).to.be.equal(1)
            expect(pets.defaultIfEmpty(defaultPet).toArray()).to.be.deep.equal([defaultPet])
        })

        it('should return the sequence itself if it is not empty', function () {
            expect([1, 2, 3, 4].defaultIfEmpty(Number).toArray()).to.be.deep.equal([1, 2, 3, 4])
        })
    })
})
