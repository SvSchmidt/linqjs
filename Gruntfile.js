RegExp.escape = function(str) {
  return String(str).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt)

  const _ = grunt.util._

  grunt.option('force', true);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %>\n' +
            ' * (c) <%= pkg.author %> \n' +
            ' * License: <%= pkg.licenses[0].type %> (<%= pkg.licenses[0].url %>)\n' +
            ' */',
    babel: {
        options: {
          sourceMap: false,
          presets: ['es2015']
        },
        dist: {
          files: {
              'dist/linq.es5.js': 'dist/linq.js'
          }
        },
    },
    uglify: {
        dist: {
            files: {
              'dist/linq.es5.min.js': ['dist/linq.es5.js']
            }
        }
    },
    file_info: {
      dist: {
        src: ['dist/linq.es5.min.js', 'dist/linq.es5.js', 'dist/linq.js', 'dist/linq.min.js'],
        options: {
            stdout: 'linq.js ES6       :   {{= Number(size(src[2])/1024).toFixed(2) }} kB' + grunt.util.linefeed +
                    'linq.min.js ES6   :   {{= Number(size(src[3])/1024).toFixed(2) }} kB' + grunt.util.linefeed +
                    'linq.js ES5       :   {{= Number(size(src[1])/1024).toFixed(2) }} kB' + grunt.util.linefeed +
                    'linq.min.js ES5   :   {{= Number(size(src[0])/1024).toFixed(2) }} kB' + grunt.util.linefeed
        }
      }
    },
    mochacli: {
        options: {
            reporter: 'nyan',
            bail: true,
        },
        dist: ['test/runner.js']
    },
    watch: {
        src: {
          files: ['Gruntfile.js', 'test/**/*.js', 'src/**/*.js', 'fragments/**/*.js', '.jshintrc'],
          tasks: ['default'],
          options: {
            spawn: false,
          },
        },
    },
    jshint: {
      options: {
        jshintrc: true,
      },
      before_concat: ['src/*.js'],
      after_concat: ['tmp/linq.js'],
      dist: ['dist/linq.js']
    },
    build: {
      debug: {
        src: 'fragments/sources.js',
        target: 'dist/linq.js',
        debug: true,
      },
      dist: {
        src: '<%= build.debug.src %>',
        target: '<%= build.debug.target %>',
      }
    },
    exec: {
      coverage: {
        command: './node_modules/babel-cli/bin/babel-node.js ./node_modules/.bin/isparta cover ./node_modules/.bin/_mocha -- ./test/runner.js --reporter min --recursive',
        stdout: true,
        stderr: false
      },
    },
  });

  function getSource (file) {
    return grunt.file.read(`./${file}`)
  }

  function getCombinedSources (files) {
    return [].concat(files)
      .map(getSource)
      .join('')
      .replace(/\n$/, '')
      .split('\n')
      .join('\n  ')
      .replace(/  \n/ig, '\n')
  }

  function applyBanner (source) {
    return `${grunt.config.get('banner')}\n${source}`
  }

  function normalizeLineBreaks (str) {
    return String(str).replace(/\r\n/g, '\n')
  }

  function defineDebugContant (source, value) {
    return source.replace(new RegExp('DEBUG_CONSTANT_VALUE'), String(value))
  }

  function getAndRemoveExports (source) {
    const pattern = /.*?export.*?\{(.*)\}\)/g
    const m = pattern.exec(source)

    if (m && m.length > 1) {
      let sourceWithoutExports = source.replace(pattern, '')
      return [sourceWithoutExports, m[1]]
    } else {
      return [source, null];
    }
  }

  function getNonExportedFunctions (source, exportsArr) {
    const pattern = /function ([a-z_][a-zA-Z0-9-_]+)\s?\(.*\) {$/mg
    const blacklist = ['next', 'from', 'constructor', 'eval']
    let result = []
    let match

    do {
        match = pattern.exec(source);
        // push into result array if not in list of exports
        match && !~blacklist.indexOf(match[1]) && !~exportsArr.indexOf(match[1]) && result.push(match[1])
    } while (match)

    return result.sort().reverse()
  }

  function getFunctionParameters (source) {
    const pattern = /function [\ba-zA-Z1-9]+ ?\((.*)\)/ig
    const blacklist = ['constructor', 'next', 'index', 'start', 'value', 'val', 'key', 'iterable', 'collection', 'coll', 'arr']

    let result = []
    let match

    do {
        match = pattern.exec(source)

        if (!match) continue

        // we will receive ALL function parameters (the whole list), separated by comma
        // so we have to do some cleaning-up first
        let params = match[1].split(',').map(x => {
            let p = x.split('=')[0].trim()

            if (p === '' || p.length < 3 || /[^a-zA-Z0-9]+/.test(p)) {
              return null
            }

            return p
        })

        // push each param into the result array if not already contained and not blacklisted
        params.forEach(p => {
          if (p && !~result.indexOf(p) && !~blacklist.indexOf(p)) {
            result.push(p)
          }
        })
    } while (match)

    // sort by length descending
    return result.sort((a, b) => b.length - a.length)
  }

  function minify (source, exportsArr) {
    const stripWhiteSpacesBeforeAndAfterChars = ['=', '==', '===', '+', '-', '*', '||', '&&', '!=', '!==', '<', '>', '<=', '>=', '=>']
    const stripWhiteSpacesAfterChars = [',', ';', ')', '{']
    const stripWhiteSpacesBeforeChars = [',', ';', '(', '{']

    // Get functions which are not exported (internal use) and rename them to have shorter names
    // also rename some of the too-long parameter names (e.g. resultSelector)
    const nonExportedFunctions = getNonExportedFunctions(source, exportsArr)
    const functionParams = getFunctionParameters(source)
    const tooLongVariableNames = ['nativeConstructors', 'outerValue', 'innerValue', 'firstIter', 'secondIter',
      'defaultVal', 'result', 'previous', 'outerVal', 'innerVal', 'innerNext', 'outerNext', 'lastIndex',
      'staticMethods', 'outer',  'left', 'right', 'additionalComparator', 'mappedEntry', 'current', 'outerIter', 'innerIter',
      'groupKey', 'endSkip', 'HeapElement', 'hasTopElement']

    // Note that order DOES matter, since if we put functionParams on the first position,
    // we may replace parameters by very short names (e.g. i, x..., see below)
    // and everyone knows that these are common variable names which would cause conflicts
    const shouldBeShorter = [...nonExportedFunctions, ...functionParams, ...tooLongVariableNames]

    for (let i = j = 0; i < shouldBeShorter.length; i++) {
      const asciiLowerLetters = 97
      const asciiUpperLetters = 65

      let result

      if (i < 26) {
        // Use the 26 lower letters of the alphabet first (except common one-character-variables like i, j, x)
        result = String.fromCharCode(asciiLowerLetters + (i % 26))
      } else if (i >= 26 && i < 52) {
        // Then the upper ones
        result = String.fromCharCode(asciiUpperLetters + (i % 26))
      } else {
        // Then a combination of two lower ones (aa, ab, ac... ba, bb, bc... --> should be more than enough)
        result = String.fromCharCode(asciiLowerLetters + (i % 26)) + String.fromCharCode(asciiLowerLetters + j)
        j = Math.floor(i / 26)
      }

      // Replace each occurence of the too long word with the shortened version using a regular expression
      source = source.replace(new RegExp(RegExp.escape(shouldBeShorter[i]), 'g'), result)
    }

    // Replace true by !0 and false by !1
    source = source.replace(/true/g, '!0')
    source = source.replace(/false/g, '!1')

    // Replace Infinity by 1/0
    source = source.replace(/Infinity/g, '1/0')

    // Remove comments (block and single line)
    source = source.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/g, '')
    source = source.replace(/(\/\/.*\n)/g, '')

    // Remove leading whitespaces (or other invisible characters like \t)
    source = source.replace(/^\s+/mg, '')

    // Remove multi-whitespaces in general
    source = source.replace(/\s{2,}/g, ' ')

    // Remove whitespace before and after some chars
    stripWhiteSpacesBeforeAndAfterChars.forEach(c => {
      source = source.replace(new RegExp(` ${RegExp.escape(c)} `, 'g'), c)
    })

    // Remove whitespace after some chars
    stripWhiteSpacesAfterChars.forEach(c => {
      source = source.replace(new RegExp(`${RegExp.escape(c)} `, 'g'), c)
    })

    // Remove whitespace before some chars
    stripWhiteSpacesBeforeChars.forEach(c => {
      source = source.replace(new RegExp(` ${RegExp.escape(c)}`, 'g'), c)
    })

    // insert semicola at line ends if there is not any of the defined characters following
    source = source.replace(/(.+[^;,{}\n])\n(?![\?\:\}\{])/g, '$1;')

    // remove multi-linebreaks
    source = source.replace(/\n\n/g, '\n')

    // Remove line breaks if an opening curly brace was before
    source = source.replace(/{\n/g, '{')

    // Remove line breaks if followed by any character and a closing curly brace (positive look-ahead)
    source = source.replace(/\n(?=.*})/mg, '')

    // Remove line breaks followed by ? or : (multi-line ternary operations)
    source = source.replace(/\n(?=[\:\?])/mg, '')

    // Remove spaces before or after : or ?
    source = source.replace(/\s*([\?|\:])\s*/g, '$1')

    // Remove semicola followed by }
    source = source.replace(/\;(?=\})/g, '')

    // Remove space before else keyword
    source = source.replace(/(\s+)(?=else)/g, '')

    // Remove space after else keyword if not followed by 'if'
    source = source.replace(/else(\s+)(?!if)/g, '')

    // Remove line breaks after semicola
    source = source.replace(/;\n/g, ';')

    return source
  }

  function build ({ src, target, debug = false } = {}) {
    const minTarget = target.replace('.js', '.min.js')

    /*
    The specified source file contains a call for defineSourceFiles which we gonna define globally
    meaning after the evaluation sourceFileNames will contain the desired data for further usage
    */
    let sourceFileNames
    global.defineSourceFiles = sources => sourceFileNames = sources
    eval(grunt.file.read('./' + src))

    /*
    Combine pre and post source code (iife, module loading etc.)
    */
    let pre = getSource('fragments/pre.js')
    let moduleLoaderPre = getSource('fragments/module-loader-pre.js')

    let moduleLoaderPost = getSource('fragments/module-loader-post.js')
    let post = getSource('fragments/post.js')

    /*
    Handle each source file and extract their exports (defined by __export()) and remove the __export-call
    In the end, we will get a single __export at the end of the file containing every export from the specific source files
    */
    let linqjsOutput = ''
    let linqjsExports = []

    for (let file of sourceFileNames) {
      const [sourceWithoutExports, theExports] = getAndRemoveExports(getSource(file))

      linqjsOutput += `\n\n/* ${file} */\n\n` // add file name as a comment
      linqjsOutput += sourceWithoutExports
      linqjsExports.push(theExports)
    }

    // combine exports
    linqjsExports = linqjsExports
          .filter(x => String(x) === x)
          .map(x => x.trim())
          .join(', ')
    const linqjsExportStr = `  /* Export public interface */\n  __export({ ${linqjsExports} })\n`

    /*
    combine the sources in the appropriate order
    */
    let combinedSources = String.prototype.concat.apply('', [
      pre,
      moduleLoaderPre,
      linqjsOutput,
      linqjsExportStr,
      moduleLoaderPost,
      post])

    /*
    Process the final outcome
    */
    let output = normalizeLineBreaks(combinedSources)
    output = defineDebugContant(output, debug)

    /*
    Create minified output
    */
    let minOutput = minify(output, linqjsExports.split(', '))

    /*
    Finally do the magic, apply the banner and write back the output to the destination files
    */
    output = applyBanner(output)
    minOutput = applyBanner(minOutput)
    grunt.file.write(`./${target}`, output)
    grunt.file.write(`./${minTarget}`, minOutput)

    grunt.log.ok(`\n${sourceFileNames.join(', ')} ==> ${target}`)
    grunt.log.ok(`\nMinified ${target} => ${minTarget}`)
    grunt.log.ok(`\nDefined DEBUG constant: ${debug}`)

    return !this.errorCount;
  }

  grunt.registerTask('clean', 'Clean output files', function () {
    const files = ['dist/linq.es5.js', 'dist/linq.js', 'dist/linq.es5.min.js', 'dist/linq.min.js']

    _.forEach(files, function (file) {
        if (grunt.file.exists(file)) {
          grunt.file.delete(file)
        }
    })

    grunt.log.ok("Cleaned output files")

    return !this.errorCount
  })

  grunt.registerMultiTask('build', 'Build linqjs', function () {
    build(this.data)
  })

  grunt.registerTask('test', ['mochacli'])
  grunt.registerTask('coverage', ['exec:coverage'])
  grunt.registerTask('debug', ['clean',
                                'build:debug',
                                'babel:dist',
                                'uglify:dist',
                                'file_info'])
  grunt.registerTask('dist',   ['clean',
                                'build:dist',
                                'babel:dist',
                                'uglify:dist',
                                'file_info'])
  grunt.registerTask('default', ['debug', 'test', 'watch'])
};
