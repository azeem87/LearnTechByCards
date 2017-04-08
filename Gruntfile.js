'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

// Configurable paths for the application
var applicationConfig = require('./config/env/all.js');

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn'
  });

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    appConfig: applicationConfig,

    pkg: grunt.file.readJSON('package.json'),
    env: {
      test: {
        NODE_ENV: 'test'
      },
      dev: {
        NODE_ENV: 'development'
      },
      prod: {
        NODE_ENV: 'production'
      }
    },
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= appConfig.pub %>/scripts/{,*/}*.js'],
        tasks: ['newer:jscs:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'newer:jscs:test', 'karma']
      },
      styles: {
        files: ['<%= appConfig.pub %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'postcss']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      }
    },
    livereload: {
      options: {
        livereload: true
      },
      files: [
        '<%= appConfig.pub %>/{,*/}*.html',
        '<%= appConfig.pub %>/views/{,*/}*.html',
        '.tmp/styles/{,*/}*.css',
        '<%= appConfig.pub %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
      ]
    },
    // Make sure code styles are up to par
    jscs: {
      options: {
        config: '.jscsrc',
        verbose: true
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= appConfig.pub %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= appConfig.dist %>/{,*/}*',
            '!<%= appConfig.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    postcss: {
      options: {
        processors: [
          require('autoprefixer-core')({browsers: ['last 1 version']})
        ]
      },
      server: {
        options: {
          map: true
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the pub
    wiredep: {
      pub: {
        src: ['<%= appConfig.pub %>/index.html'],
        ignorePath:  /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath:  /\.\.\//,
        fileTypes:{
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= appConfig.dist %>/scripts/{,*/}*.js',
          '<%= appConfig.dist %>/styles/{,*/}*.css',
          '<%= appConfig.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= appConfig.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= appConfig.pub %>/index.html',
      options: {
        dest: '<%= appConfig.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= appConfig.dist %>/{,*/}*.html'],
      css: ['<%= appConfig.dist %>/styles/{,*/}*.css'],
      js: ['<%= appConfig.dist %>/scripts/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= appConfig.dist %>',
          '<%= appConfig.dist %>/images',
          '<%= appConfig.dist %>/styles'
        ],
        patterns: {
          js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
        }
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= appConfig.pub %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= appConfig.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= appConfig.pub %>/images',
          src: '{,*/}*.svg',
          dest: '<%= appConfig.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true
        },
        files: [{
          expand: true,
          cwd: '<%= appConfig.dist %>',
          src: ['*.html'],
          dest: '<%= appConfig.dist %>'
        }]
      }
    },

    ngtemplates: {
      dist: {
        options: {
          module: 'learnTechByCardsApp',
          htmlmin: '<%= htmlmin.dist.options %>',
          usemin: 'scripts/scripts.js'
        },
        cwd: '<%= appConfig.pub %>',
        src: 'views/{,*/}*.html',
        dest: '.tmp/templateCache.js'
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= appConfig.dist %>/*.html']
      },
      dev: {
        html: ['<%= appConfig.pub %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= appConfig.pub %>',
          dest: '<%= appConfig.dist %>',
          src: [
            '*.{ico,png,txt}',
            '*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= appConfig.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= appConfig.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= appConfig.pub %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    nodemon: {
      dev: {
        script: 'server.js',
        options:{
          args: ["--verbose"],
          ext: 'js,html,css',
          ignore: ['node_modules/*','bower_components/*'],
          watch: ['<%= appConfig.pub %>/*','<%= appConfig.config %>/*','<%= appConfig.app %>/*'],
          debug: true,
          delayTime: 1,
          cwd: __dirname
        }
      },
      prod: {
        script: 'server.js',
        options:{
          args: [],
          ext: 'js,html,css',
          ignore: ['node_modules/*','bower_components/*'],
          watch: ['<%= appConfig.dist %>/*','<%= appConfig.config %>/*','<%= appConfig.app %>/*'],
          debug: true,
          delayTime: 1,
          cwd: __dirname
        }
      }
    },
    // Run some tasks in parallel to speed up the build process
    concurrent: {
      dev: {
        tasks: ['nodemon:dev', 'watch']
      },
      prod: {
        tasks: ['nodemon:prod']
      },
      copystyles: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ],
      options: {
        logConcurrentOutput: true
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });

  //Load NPM tasks
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-filerev');

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'prod') {
      return grunt.task.run(['concurrent:prod']);
    }
    grunt.task.run(['concurrent:dev']);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('build',['clean:server','wiredep:pub']);

  grunt.registerTask('dev',['env:dev','build','serve']);

  grunt.registerTask('prod',['env:prod','clean:dist','wiredep:pub','useminPrepare','concurrent:dist','postcss','ngtemplates',
    'concat', 'ngAnnotate', 'copy:dist', 'cdnify', 'cssmin', 'uglify', 'filerev', 'usemin'
  ]);

  grunt.registerTask('dist',['prod','serve:prod']);

  grunt.registerTask('test',['clean:server','wiredep:test','concurrent:test','postcss','karma']);

  grunt.registerTask('default', ['build']);

};
