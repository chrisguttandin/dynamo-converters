module.exports = () => {
    return {
        'build': {
            cmd: 'npm run build'
        },
        'test-unit': {
            cmd: 'mocha --bail --parallel --recursive --require config/mocha/config-unit.js test/unit'
        }
    };
};
