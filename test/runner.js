const Collection = require(process.env.TEST_MIN ? '../dist/linq.min' : '../dist/linq')
const expect = require('chai').expect
const fs = require('fs')

function run (path) {
  let source = fs.readFileSync(path, 'utf8')
  source = `(function () { ${source} }())`

  eval(source)
}

describe("linqjs", function () {
    run('test/access.js')
    run('test/collection-static.js')
    run('test/concatenation.js')
    run('test/equality.js')
    run('test/grouping.js')
    run('test/heap.js')
    run('test/insert-and-remove.js')
    run('test/collection.js')
    run('test/math.js')
    run('test/order.js')
    run('test/search.js')
    run('test/transformation.js')
    run('test/generic/iteration.js')
});
