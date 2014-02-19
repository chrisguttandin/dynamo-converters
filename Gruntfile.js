'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        jshint: {
            src: {
                options: {
                    jshintrc: 'src/.jshintrc'
                },
                src: ['*.js', 'src/*.js']
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/*.js']
            }
        },
        mochaTest: {
            all: {
                options: {
                    reporter: 'spec',
                    timeout: 0
                },
                require: require('./test/fixtures.js'),
                src: [
                    'test/unit.js'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', [
        'mochaTest'
    ]);

};
