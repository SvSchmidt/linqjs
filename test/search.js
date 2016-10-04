describe('Search', function () {
  const fruits = [
    { name: 'banana', color: 'yellow' },
    { name: 'strawberry', color: 'red' },
    { name: 'rasperry', color: 'red' },
    { name: 'tomato', color: 'red' },
    { name: 'blueberry', color: 'blue' }
  ]

  const people = [
    { name: 'Gandalf', race: 'istari' },
    { name: 'Thorin', race: 'dwarfs' },
    { name: 'Frodo', race: 'hobbit' },
  ]

  describe('IndexOf(element, equalityCompareFn)', function () {
    it('should return the index of the first occurence of element in the sequence or -1 if not found', function () {
      expect(people.IndexOf({ name: 'Gandalf', race: 'istari' })).to.be.equal(0)
      expect(people.IndexOf({ name: 'Saruman', race: 'istari' })).to.be.equal(-1)
    })

    it('should accept a custom equality comparator', function () {
      expect(people.IndexOf({ name: 'Saruman', race: 'istari' }, (first, second) => first.race === second.race)).to.be.equal(0)
    })
  })

  describe('LastIndexOf(element, equalityCompareFn)', function () {
    it('should return the index of the last occurence of element in the sequence or -1 if not found', function () {
      expect(people.LastIndexOf({ name: 'Gandalf', race: 'istari' })).to.be.equal(0)
      expect(people.LastIndexOf({ name: 'Saruman', race: 'istari' })).to.be.equal(-1)
      expect([1,2,3,4,1,5,6].LastIndexOf(1)).to.be.equal(4)
    })

    it('should accept a custom equality comparator', function () {
      expect(people.LastIndexOf({ name: 'Saruman', race: 'istari' }, (first, second) => first.race === second.race)).to.be.equal(0)
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

  describe('Where(predicate)', function () {
    it('should return a new sequence containing the elements matching the predicate', function () {
      expect([1,2,3].Where(x => x > 1).ToArray()).to.be.deep.equal([2,3])
    })

    it('should accept index-based predicate', function () {
      expect([1,2,3,4,5].Where((elem, index) => index > 1).ToArray()).to.be.deep.equal([3,4,5])
    })
  })

  describe('ConditionalWhere(condition, predicate)', function () {
    const arr = [1,2,3,4,5]

    it('should behave like Where if the condition is true', function () {
      expect(arr.ConditionalWhere(true, x => x > 1).ToArray()).to.be.deep.equal(arr.Where(x => x > 1).ToArray())
      expect(arr.ConditionalWhere(true, (x, i) => i > 1).ToArray()).to.be.deep.equal(arr.Where((x, i) => i > 1).ToArray())
    })

    it('should return the original sequence (without filtering) if the condition is falsy (e.g. gets ignored)', function () {
      expect(arr.ConditionalWhere(false, x => x > 1).ToArray()).to.be.deep.equal(arr.ToArray())
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
