describe('Search', function () {
    const fruits = [
        {name: 'banana', color: 'yellow'},
        {name: 'strawberry', color: 'red'},
        {name: 'rasperry', color: 'red'},
        {name: 'tomato', color: 'red'},
        {name: 'blueberry', color: 'blue'}
    ]

    const people = [
        {name: 'Gandalf', race: 'istari'},
        {name: 'Thorin', race: 'dwarfs'},
        {name: 'Frodo', race: 'hobbit'},
    ]

    describe('IndexOf(element, equalityCompareFn)', function () {
        it('should return the index of the first occurence of element in the sequence or -1 if not found', function () {
            expect(people.select(x => x.name).indexOf('Gandalf')).to.be.equal(0)
            expect(people.select(x => x.name).indexOf('Saruman')).to.be.equal(-1)
        })

        it('should accept a custom equality comparator', function () {
            expect(people.indexOf({
                name: 'Saruman',
                race: 'istari'
            }, (first, second) => first.race === second.race)).to.be.equal(0)
        })
    })

    describe('LastIndexOf(element, equalityCompareFn)', function () {
        it('should return the index of the last occurence of element in the sequence or -1 if not found', function () {
            expect(people.select(x => x.name).lastIndexOf('Gandalf')).to.be.equal(0)
            expect(people.select(x => x.name).lastIndexOf('Saruman')).to.be.equal(-1)
            expect([1, 2, 3, 4, 1, 5, 6].lastIndexOf(1)).to.be.equal(4)
        })

        it('should accept a custom equality comparator', function () {
            expect(people.lastIndexOf({
                name: 'Saruman',
                race: 'istari'
            }, (first, second) => first.race === second.race)).to.be.equal(0)
        })
    })

    describe('Contains', function () {
        /*
        Spec: https://msdn.microsoft.com/de-de/library/bb352880(v=vs.110).aspx
        */
        const fruits = ["apple", "banana", "mango", "orange", "passionfruit", "grape"];

        it('should return true if array contains specified element', function () {
            expect(fruits.contains('mango')).to.be.true;
        })

        it('should return false if array does not contains specified element', function () {
            expect(fruits.contains('tomato')).to.be.false;
        })
    })

    describe('Where(predicate)', function () {
        it('should return a new sequence containing the elements matching the predicate', function () {
            expect([1, 2, 3].where(x => x > 1).toArray()).to.be.deep.equal([2, 3])
        })

        it('should accept index-based predicate', function () {
            expect([1, 2, 3, 4, 5].where((elem, index) => index > 1).toArray()).to.be.deep.equal([3, 4, 5])
        })
    })

    describe('ConditionalWhere(condition, predicate)', function () {
        const arr = [1, 2, 3, 4, 5]

        it('should behave like Where if the condition is true', function () {
            expect(arr.conditionalWhere(true, x => x > 1).toArray()).to.be.deep.equal(arr.where(x => x > 1).toArray())
            expect(arr.conditionalWhere(true, (x, i) => i > 1).toArray()).to.be.deep.equal(arr.where((x, i) => i > 1).toArray())
        })

        it('should return the original sequence (without filtering) if the condition is falsy (e.g. gets ignored)', function () {
            expect(arr.conditionalWhere(false, x => x > 1).toArray()).to.be.deep.equal(arr.toArray())
        })
    })

    describe('Any', function () {
        it('should return true if no predicate is given and the array contains elements', function () {
            expect([1, 2, 3, 4, 5].any()).to.be.true
            expect([].any()).to.be.false
        })

        it('should return true if at least one element matches the predicate', function () {
            expect(fruits.any(x => x.color === 'blue')).to.be.true
            expect(fruits.any(x => x.color === 'orange')).to.be.false
        })
    })

    describe('All', function () {
        it('should return true if all elements match the predicate', function () {
            expect(fruits.all(x => x.color === 'red')).to.be.false
            expect([2, 4, 6, 8].all(x => x % 2 === 0)).to.be.true
            expect([].all(x => x % 2 === 0)).to.be.true // since there's no elements
        })
    })

    describe('Count', function () {
        it('should return the length of array if called with no parameters', function () {
            expect(fruits.count()).to.be.equal(fruits.length)
            expect([].count()).to.be.equal(0)
        })

        it('should count the elements matching a predicate', function () {
            expect(fruits.count(x => x.color === 'red')).to.be.equal(3)
            expect(fruits.count(x => x.color === 'orange')).to.be.equal(0)
            expect(fruits.count(x => x.color !== 'orange')).to.be.equal(fruits.length)
        })
    })
})
