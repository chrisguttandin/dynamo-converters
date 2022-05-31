module.exports = (grunt) => {
    const fix = grunt.option('fix') === true;

    return {
        'build': {
            cmd: `tsc --project src/tsconfig.json && \
                babel ./build/es2019 --config-file ./config/babel/build.json --out-dir ./build/node`
        },
        'clean': {
            cmd: 'rimraf build/*'
        },
        'lint-config': {
            cmd: `eslint --config config/eslint/config.json --ext .js ${fix ? '--fix ' : ''}--report-unused-disable-directives *.js config/`
        },
        'lint-src': {
            cmd: 'tslint --config config/tslint/src.json --project src/tsconfig.json src/*.ts src/**/*.ts'
        },
        'lint-test': {
            cmd: `eslint --config config/eslint/test.json --ext .js ${fix ? '--fix ' : ''}--report-unused-disable-directives test/`
        },
        'test-unit': {
            cmd: 'mocha --bail --parallel --recursive --require config/mocha/config-unit.js test/unit'
        }
    };
};
