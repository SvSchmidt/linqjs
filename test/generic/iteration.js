describe('iteration', function () {
  describe('Chained functions', function () {
    it('should return the correct outcome when partially iterated (e.g. for non-emptyness checks)', function () {
      expect(Collection.from([1,2,3,4,5])
        .where(x => x % 2 === 0)
        .select(x => 2 * x)
        .first()).to.be.equal(4)
    })
  })
})
