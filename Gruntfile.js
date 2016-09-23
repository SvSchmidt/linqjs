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
              'dist/linq.js': 'tmp/linq.es6.js'
          }
        },
    },
    uglify: {
        dist: {
            files: {
              'dist/linq.min.js': ['dist/linq.js']
            }
        }
    },
    file_info: {
      dist: {
        src: ['dist/linq.min.js', 'dist/linq.js', 'tmp/linq.es6.js'],
        options: {
            stdout: 'linq.js ES6   :   {{= Number(size(src[2])/1024).toFixed(2) }} kB' + grunt.util.linefeed +
                    'linq.js       :   {{= Number(size(src[1])/1024).toFixed(2) }} kB' + grunt.util.linefeed /*+
                    'linq.min.js   :   {{= Number(size(src[0])/1024).toFixed(2) }} kB' + grunt.util.linefeed*/
        }
      }
    },
    mochacli: {
        options: {
            reporter: 'nyan',
            bail: true,
        },
        dist: ['test/*.js']
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
    concat: {
      all: {
        src: 'fragments/sources.js',
        target: 'tmp/linq.es6.js'
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

  function getCombinedExports (exportsArr = []) {
    const result = exportsArr
          .filter(x => String(x) === x)
          .map(x => x.trim())
          .join(', ')

    return `  /* Export public interface */\n  __export({ ${result} })\n`
  }

  function concat ({ src, target }) {
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
    const DEBUG = true // Todo: Pass as parameter

    let pre = getSource('fragments/pre.js')
    pre += `  const DEBUG = ${DEBUG};\n\n`;
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

    // combine exports, will yield an object in ES6 syntax: { foo, bar, baz }
    linqJsExports = getCombinedExports(linqjsExports)

    /*
    combine the sources in the appropriate order and process the final source code (e.g. normalizing line breaks)
    */
    let combinedSources = String.prototype.concat.apply('', [pre, moduleLoaderPre, linqjsOutput, linqJsExports, moduleLoaderPost, post])
    let output = normalizeLineBreaks(combinedSources)

    /*
    Write combined output into the target file and offer some output
    */
    grunt.file.write(`./${target}`, output)

    grunt.log.ok(`\n${sourceFileNames.join(', ')} ==> ${target}`)

    return !this.errorCount;
  }

  grunt.registerMultiTask('concat', 'Concat files', function () {
    concat(this.data)
  })

  grunt.registerTask('test', ['mochacli'])
  grunt.registerTask('build', ['clean:dist',
                                'concat:all',
                                //'jshint:after_concat',
                                'babel:dist',
                                'uglify:dist',
                                'usebanner',
                                'file_info'])
  grunt.registerTask('dist', ['build', 'clean:tmp'])
  grunt.registerTask('default', ['build', 'test', 'watch'])
};
