'use strict';

var expect = require('chai').expect,
    converters = require('../src/dynamo-converters.js');

describe('dynamo-converters', function () {

    describe('dataToItem()', function () {

        it('add default timestamps to item', function () {
            var item = converters.dataToItem({});

            expect(Object.keys(item)).to.deep.equal(['created', 'modified']);

            expect(Object.keys(item.created)).to.deep.equal(['N']);
            expect(item.created).to.be.an('object');
            expect(item.created.N).to.be.an('string');
            expect(parseInt(item.created.N, 10)).to.be.closeTo(Date.now(), 100);

            expect(Object.keys(item.modified)).to.deep.equal(['N']);
            expect(item.modified).to.be.an('object');
            expect(item.modified.N).to.be.an('string');
            expect(parseInt(item.modified.N, 10)).to.be.closeTo(Date.now(), 100);
        });

        it('convert a data object into an item', function () {
            var item = converters.dataToItem(global.fixtures.data);

            expect(Object.keys(item)).to.deep.equal(['ears', 'map', 'name', 'properties', 'created', 'modified']);

            expect(Object.keys(item.created)).to.deep.equal(['N']);
            expect(item.created).to.be.an('object');
            expect(item.created.N).to.be.an('string');
            expect(parseInt(item.created.N, 10)).to.be.closeTo(Date.now(), 100);

            expect(item.ears).to.deep.equal(global.fixtures.item.ears);

            expect(Object.keys(item.modified)).to.deep.equal(['N']);
            expect(item.modified).to.be.an('object');
            expect(item.modified.N).to.be.an('string');
            expect(parseInt(item.modified.N, 10)).to.be.closeTo(Date.now(), 100);

            expect(item.name).to.deep.equal(global.fixtures.item.name);

            expect(item.map).to.deep.equal(global.fixtures.item.map);

            expect(item.properties).to.deep.equal(global.fixtures.item.properties);
        });

    });

    describe('deltaToExpression()', function () {

        it('should add modified with the current timestamp as its value', function () {
            var expression = converters.deltaToExpression({});

            expect(parseInt(expression.expressionAttributeValues[':modified'].N, 10)).to.be.closeTo(Date.now(), 100);

            expect(expression).to.deep.equal({
                expressionAttributeNames: undefined,
                expressionAttributeValues: {
                    ':modified': {
                        N: expression.expressionAttributeValues[':modified'].N
                    }
                },
                updateExpression: 'SET modified = :modified'
            });
        });

        it('should convert a delta into an expression', function () {
            var expression = converters.deltaToExpression(global.fixtures.delta);

            expect(expression).to.deep.equal({
                expressionAttributeNames: {
                    '#name': 'name'
                },
                expressionAttributeValues: {
                    ':ears': {
                        N: '3'
                    },
                    ':legs': {
                        L: [
                            {
                                S: 'left'
                            }, {
                                S: 'right'
                            }
                        ]
                    },
                    ':name': {
                        S: 'atomic rabbit'
                    },
                    ':numbers': {
                        L: [
                            {
                                N: '1'
                            }, {
                                N: '2'
                            }
                        ]
                    },
                    ':modified': {
                        N: expression.expressionAttributeValues[':modified'].N
                    }
                },
                updateExpression: 'REMOVE eyes SET modified = :modified, ears = :ears, legs = :legs, #name = :name, numbers = :numbers, modified = :modified'
            });
        });

    });

    describe('itemToData', function () {

        it('add no default properties to data at all', function () {
            var data = converters.itemToData({});

            expect(data).to.deep.equal({});
        });

        it('convert a item into data', function () {
            var data = converters.itemToData(global.fixtures.item);

            expect(data).to.deep.equal(global.fixtures.data);
        });

    });

});
