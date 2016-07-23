'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        eslint: {
            config: {
                options: {
                    configFile: 'config/eslint/config.json'
                },
                src: [
                    '*.js',
                    'config/**/*.js'
                ]
            },
            src: {
                options: {
                    configFile: 'config/eslint/src.json'
                },
                src: [
                    'src/**/*.js'
                ]
            },
            test: {
                options: {
                    configFile: 'config/eslint/test.json'
                },
                src: [
                    'test/**/*.js'
                ]
            }
        },
        mochaTest: {
            all: {
                options: {
                    reporter: 'spec'
                },
                src: [
                    'test/unit.js'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('gruntify-eslint');

    grunt.registerTask('test', [
        'mochaTest'
    ]);

};
