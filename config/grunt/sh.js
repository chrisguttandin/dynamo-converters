module.exports = (grunt) => {
    const fix = (grunt.option('fix') === true);

    return {
        'lint-config': {
            cmd: `eslint --config config/eslint/config.json --ext .js ${ (fix) ? '--fix ' : '' }--report-unused-disable-directives *.js config/`
        },
        'lint-src': {
            cmd: `eslint --config config/eslint/src.json --ext .js ${ (fix) ? '--fix ' : '' }--report-unused-disable-directives src/`
        },
        'lint-test': {
            cmd: `eslint --config config/eslint/test.json --ext .js ${ (fix) ? '--fix ' : '' }--report-unused-disable-directives test/`
        },
        'test-unit': {
            cmd: 'mocha --bail --recursive --require config/mocha/config-unit.js test/unit'
        }
    };
};
