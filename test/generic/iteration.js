describe('iteration', function () {
  describe('Chained functions', function () {
    it('should return the correct outcome when partially iterated (e.g. for non-emptyness checks)', function () {
      expect(Collection.from([1,2,3,4,5])
        .Where(x => x % 2 === 0)
        .Select(x => 2 * x)
        .First()).to.be.equal(4)
    })
  })
})
