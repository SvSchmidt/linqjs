const linq = require(process.env.TEST_MIN ? '../dist/linq.commonjs.min' : '../dist/linq.commonjs')
const Collection = linq.Collection;
const expect = require('chai').expect
const fs = require('fs')

// patch prototypes
linq.extendNativeTypes()

function run(path) {
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
    run('test/iteration.js')
    run('test/module.js')
});
