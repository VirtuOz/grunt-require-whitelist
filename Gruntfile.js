/*
 * grunt-require-whitelist
 *
 *
 * Copyright (c) 2015 Matt Casella
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    require_whitelist: {
      default: {
        options: {
        },
        src: ['../lib/**/*']
      }

    },
    dependencyCheck: {
      default: {
        files: ['app.js', './lib/**/*.js'], // same as --entry
        options: {
          package: '.',
          missing: true,
          unused: true,
          excludeUnusedDev: false,
          ignoreUnused: [],
          noDefaultEntries: true
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  //grunt.registerTask('test', ['clean', 'require_whitelist', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'require_whitelist', 'dependencyCheck']);

  var match = false;

  grunt.warn = function (str) {
    if (/Dependencies not listed/.test(str)) {
      match = true;
    }
  };

  process.on('exit', function () {
    if (!match) {
      process.exit(1);
    }
  });

};
