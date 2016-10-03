RegExp.escape = function(str) {
  return String(str).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.option('force', true);

  const banner = '/*!\n' +
          ' * <%= pkg.name %> v<%= pkg.version %>\n' +
          ' * (c) <%= pkg.author %> \n' +
          ' * License: <%= pkg.licenses[0].type %> (<%= pkg.licenses[0].url %>)\n' +
          ' */';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: ['dist/'],
      tmp: ['tmp/'],
      output: ['tmp/', 'dist/'],
    },
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
    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: banner,
          linebreak: true
        },
        files: {
          dist: [ 'dist/*.js' ]
        }
      }
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
    jsdoc : {
        dist : {
            src: ['src/*.js', 'test/*.js'],
            options: {
                destination: 'docs'
            }
        }
    }
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

  function normalizeLineBreaks (str) {
    return String(str).replace(/\r\n/g, '\n')
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
    const blacklist = ['next', 'from']
    let result = []
    let match

    do {
        match = pattern.exec(source);
        // push into result array if not in list of exports
        match && !~blacklist.indexOf(match[1]) && !~exportsArr.indexOf(match[1]) && result.push(match[1])
    } while (match)

    return result.sort().reverse()
  }

  function minify (source, exportsArr) {
    const stripWhiteSpacesBeforeAndAfterChars = ['=', '==', '===', '+', '-', '||', '&&', '!=', '!==', '<', '>', '<=', '>=', '=>']
    const stripWhiteSpacesAfterChars = [',', ';', ')', '{']
    const stripWhiteSpacesBeforeChars = [',', ';', '(', '{']

    // Get functions which are not exported (internal use) and rename them to have shorter names
    // also rename some of the too-long parameter names (e.g. resultSelector)
    const nonExportedFunctions = getNonExportedFunctions(source, exportsArr)
    const tooLongParameterNames = ['resultSelector', 'resultTransformFn', 'equalityCompareFn',
      'keySelector', 'keyComparer', 'elementSelector', 'iterableOrGenerator', 'constructorOrValue',
      'firstKeySelector', 'secondKeySelector', 'predicate', 'nativeConstructors', 'firstIter', 'secondIter',
      'collectionStaticMethods']
    const shouldBeShorter = [...nonExportedFunctions, ...tooLongParameterNames]

    for (let i = j = 0; i < shouldBeShorter.length; i++) {
      const asciiLowerLetters = 97
      const asciiUpperLetters = 65

      let result

      if (i < 26) {
        // Use the 26 lower letters of the alphabet first
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

    // Remove comments (block and single line)
    source = source.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/g, '')
    source = source.replace(/(\/\/.*\n)/g, '')

    // Remove leading whitespaces (or other invisible characters like \t)
    source = source.replace(/^\s+/mg, '')

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

    // insert semicola at line ends if there was none of the defined characters before
    source = source.replace(/(.+[^;,{}\n])\n(?![\?\:\}])/g, '$1;')

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

    //source = source.replace(/\n/g, '')

    return source
  }

  function build ({ src, target, debug = false } = {}) {
    const minTarget = target.replace('.js', '.min.js')

    let sourceFileNames;
    global.defineSourceFiles = sources => sourceFileNames = sources;

    /*
    The specified source file contains a call for defineSourceFiles which we just defined globally
    meaning after the evaluation sourceFileNames will contain the desired data
    */
    eval(grunt.file.read('./' + src))

    /*
    Combine pre and post source code (iife, module loading etc.)
    */
    let pre = getSource('fragments/pre.js')
    pre += `  const DEBUG = ${debug};\n\n`; // add DEBUG constant to output
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
    combine the sources in the appropriate order and process the final source code (e.g. normalizing line breaks)
    */
    let combinedSources = String.prototype.concat.apply('', [
      pre,
      moduleLoaderPre,
      linqjsOutput,
      linqjsExportStr,
      moduleLoaderPost,
      post])
    let output = normalizeLineBreaks(combinedSources)

    /*
    Write combined output into the target file and offer some output
    */
    grunt.file.write(`./${target}`, output)

    /*
    Write minified output
    */
    grunt.file.write(`./${minTarget}`, minify(output, linqjsExports.split(', ')))

    grunt.log.ok(`\n${sourceFileNames.join(', ')} ==> ${target}`)
    grunt.log.ok(`\nMinified ${target} => ${minTarget}`)
    grunt.log.ok(`\nDefined DEBUG constant: DEBUG=${debug}`)

    return !this.errorCount;
  }

  grunt.registerMultiTask('build', 'Concat files', function () {
    build(this.data)
  })

  grunt.registerTask('test', ['mochacli'])
  grunt.registerTask('coverage', ['exec:coverage'])
  grunt.registerTask('debug', ['clean:dist',
                                'build:debug',
                                'babel:dist',
                                'uglify:dist',
                                'usebanner',
                                'file_info'])
  grunt.registerTask('dist',   ['clean:dist',
                                'build:dist',
                                'babel:dist',
                                'uglify:dist',
                                'usebanner',
                                'file_info',
                                'clean:tmp'])
  grunt.registerTask('doc', ['jsdoc'])
  grunt.registerTask('default', ['debug', 'test', 'watch'])
};
