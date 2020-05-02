module.exports = {
    build: [
        'clean:build',
        'sh:build',
        'babel:build'
    ],
    lint: [
        'sh:lint-config',
        'sh:lint-src',
        'sh:lint-test'
    ],
    test: [
        'build',
        'sh:test-unit'
    ]
};
