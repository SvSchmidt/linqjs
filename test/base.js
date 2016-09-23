require("babel-core/register")
require("babel-polyfill")

if (process.env.IS_COVERAGE) {
    describe('Test coverage', function () {
        it('should generate instrumentation', function (done) {
            require('child_process').exec('$(npm root)/.bin/jscoverage dist coverage/dist', done)
        });

        it('should load coverage module', function () {
          require('../coverage/dist/linq.js').install()
        });
    });
} else {
  require('../dist/linq').install()
}
