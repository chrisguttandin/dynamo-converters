'use strict';

const chai = require('chai');

module.exports = {
    test: {
        options: {
            bail: true,
            clearRequireCache: true,
            require: [
                function () {
                    global.expect = chai.expect;
                }
            ]
        },
        src: [
            'test/unit.js'
        ]
    }
};
