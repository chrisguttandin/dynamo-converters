'use strict';

var expect = require('chai').expect,
    converters = require('../src/dynamo-converters.js');

describe('dynamo-converters', function () {

    describe('dataToItem()', function () {

        it('should add a field called "created" to the item', function () {
            var item = converters.dataToItem({});

            expect(item).to.contain.a.key('created');
            expect(parseInt(item.created.N, 10)).to.be.closeTo(Date.now(), 100);
            expect(item.created).to.deep.equal({ N: item.created.N });
        });

        it('should add a field called "modified" to the item', function () {
            var item = converters.dataToItem({});

            expect(item).to.contain.a.key('modified');
            expect(parseInt(item.modified.N, 10)).to.be.closeTo(Date.now(), 100);
            expect(item.modified).to.deep.equal({ N: item.modified.N });
        });

        it('should convert a property with a value of "null"', function () {
            var item = converters.dataToItem({ null: null });

            expect(item.null).to.deep.equal({ NULL: true });
        });

        it('should convert a property of type "boolean"', function () {
            var item = converters.dataToItem({ boolean: true });

            expect(item.boolean).to.deep.equal({ BOOL: true });
        });

        it('should convert a property of type "number"', function () {
            var item = converters.dataToItem({ number: 2 });

            expect(item.number).to.deep.equal({ N: '2' });
        });

        it('should convert a property of type "string"', function () {
            var item = converters.dataToItem({ string: 'lorem ipsum' });

            expect(item.string).to.deep.equal({ S: 'lorem ipsum' });
        });

        it('should convert an array', function () {
            var item = converters.dataToItem({ array: [ 2, 'lorem ipsum' ] });

            expect(item.array).to.deep.equal({ L: [
                { N: '2' },
                { S: 'lorem ipsum' }
            ]});
        });

        it('should convert an object', function () {
            var item = converters.dataToItem({ object: { number: 2, string: 'lorem ipsum' }});

            expect(item.object).to.deep.equal({ M: {
                number: { N: '2' },
                string: { S: 'lorem ipsum' }
            }});
        });

    });

    describe('deltaToExpression()', function () {

        it('should add a field called "modified" to the expression', function () {
            var expression = converters.deltaToExpression({});

            expect(expression.expressionAttributeValues).to.contain.a.key(':modified');
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

        it('should convert a property with a value of "null"', function () {
            var expression = converters.deltaToExpression({ null: null });

            expect(expression.expressionAttributeNames).to.deep.equal({ '#null': 'null' });
            expect(expression.expressionAttributeValues[':null']).to.deep.equal({
                NULL: true
            });
            expect(expression.updateExpression).to.equal('SET modified = :modified, #null = :null');
        });

        it('should convert a property of type "boolean"', function () {
            var expression = converters.deltaToExpression({ boolean: true });

            expect(expression.expressionAttributeNames).to.deep.equal({ '#boolean': 'boolean' });
            expect(expression.expressionAttributeValues[':boolean']).to.deep.equal({
                BOOL: true
            });
            expect(expression.updateExpression).to.equal('SET modified = :modified, #boolean = :boolean');
        });

        it('should convert a property of type "number"', function () {
            var expression = converters.deltaToExpression({ number: 2 });

            expect(expression.expressionAttributeNames).to.deep.equal({ '#number': 'number' });
            expect(expression.expressionAttributeValues[':number']).to.deep.equal({
                N: '2'
            });
            expect(expression.updateExpression).to.equal('SET modified = :modified, #number = :number');
        });

        it('should convert a property of type "string"', function () {
            var expression = converters.deltaToExpression({ string: 'lorem ipsum' });

            expect(expression.expressionAttributeNames).to.deep.equal({ '#string': 'string' });
            expect(expression.expressionAttributeValues[':string']).to.deep.equal({
                S: 'lorem ipsum'
            });
            expect(expression.updateExpression).to.equal('SET modified = :modified, #string = :string');
        });

        it('should convert a property of type "undefined"', function () {
            var expression = converters.deltaToExpression({ undefined: undefined });

            expect(expression.expressionAttributeNames).to.be.undefined;
            expect(expression.expressionAttributeValues[':undefined']).to.be.undefined;
            expect(expression.updateExpression).to.equal('REMOVE undefined SET modified = :modified');
        });

        it('should convert an array', function () {
            var expression = converters.deltaToExpression({ array: [ 2, 'lorem ipsum' ] });

            expect(expression.expressionAttributeNames).to.deep.equal({ '#array': 'array' });
            expect(expression.expressionAttributeValues[':array']).to.deep.equal({ L: [
                { N: '2' },
                { S: 'lorem ipsum' }
            ]});
            expect(expression.updateExpression).to.equal('SET modified = :modified, #array = :array');
        });

        it('should convert an object', function () {
            var expression = converters.deltaToExpression({ object: { number: 2, string: 'lorem ipsum' }});

            expect(expression.expressionAttributeNames).to.deep.equal({ '#object': 'object' });
            expect(expression.expressionAttributeValues[':object']).to.deep.equal({ M: {
                number: { N: '2' },
                string: { S: 'lorem ipsum' }
            }});
            expect(expression.updateExpression).to.equal('SET modified = :modified, #object = :object');
        });

    });

    describe('itemToData()', function () {

        it('should convert a property with a value of "null"', function () {
            var data = converters.itemToData({ null: { NULL: true }});

            expect(data).to.deep.equal({ null: null });
        });

        it('should convert a property of type "boolean"', function () {
            var data = converters.itemToData({ boolean: { BOOL: true }});

            expect(data).to.deep.equal({ boolean: true });
        });

        it('should convert a property of type "number"', function () {
            var data = converters.itemToData({ number: { N: '2' }});

            expect(data).to.deep.equal({ number: 2 });
        });

        it('should convert a property of type "string"', function () {
            var data = converters.itemToData({ string: { S: 'lorem ipsum' }});

            expect(data).to.deep.equal({ string: 'lorem ipsum' });
        });

        it('should convert an array', function () {
            var data = converters.itemToData({ array: { L: [
                    { N: '2' },
                    { S: 'lorem ipsum' }
                ]}});

            expect(data).to.deep.equal({ array: [ 2, 'lorem ipsum' ] });
        });

        it('should convert an object', function () {
            var data = converters.itemToData({ object: { M: {
                    number: { N: '2' },
                    string: { S: 'lorem ipsum' }
                }}});

            expect(data).to.deep.equal({ object: { number: 2, string: 'lorem ipsum' }});
        });

    });

});
