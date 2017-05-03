const converters = require('../src/module.js');

describe('dynamo-converters', function () {

    describe('dataToItem()', function () {

        it('should add a field called "created" to the item', function () {
            const item = converters.dataToItem({});

            expect(item).to.contain.a.key('created');
            expect(parseInt(item.created.N, 10)).to.be.closeTo(Date.now(), 100);
            expect(item.created).to.deep.equal({ N: item.created.N });
        });

        it('should add a field called "modified" to the item', function () {
            const item = converters.dataToItem({});

            expect(item).to.contain.a.key('modified');
            expect(parseInt(item.modified.N, 10)).to.be.closeTo(Date.now(), 100);
            expect(item.modified).to.deep.equal({ N: item.modified.N });
        });

        it('should convert a property with a value of "null"', function () {
            const item = converters.dataToItem({ null: null });

            expect(item.null).to.deep.equal({ NULL: true });
        });

        it('should not convert a property with a value of "undefined"', function () {
            const item = converters.dataToItem({ nothing: undefined });

            expect(item).to.have.keys('created', 'modified');
        });

        it('should convert a property of type "boolean"', function () {
            const item = converters.dataToItem({ boolean: true });

            expect(item.boolean).to.deep.equal({ BOOL: true });
        });

        it('should convert a property of type "number"', function () {
            const item = converters.dataToItem({ number: 2 });

            expect(item.number).to.deep.equal({ N: '2' });
        });

        it('should convert a property of type "string"', function () {
            const item = converters.dataToItem({ string: 'lorem ipsum' });

            expect(item.string).to.deep.equal({ S: 'lorem ipsum' });
        });

        it('should convert an array', function () {
            const item = converters.dataToItem({ array: [ 2, 'lorem ipsum' ] });

            expect(item.array).to.deep.equal({ L: [
                { N: '2' },
                { S: 'lorem ipsum' }
            ] });
        });

        it('should convert an object', function () {
            const item = converters.dataToItem({ object: { number: 2, string: 'lorem ipsum' } });

            expect(item.object).to.deep.equal({ M: {
                number: { N: '2' },
                string: { S: 'lorem ipsum' }
            } });
        });

        it('should not convert a property of an object with a value of "undefined"', function () {
            const item = converters.dataToItem({ object: { nothing: undefined } });

            expect(item.object).to.deep.equal({ M : {} });
        });

    });

    describe('deltaToExpression()', function () {

        it('should add a field called "modified" to the expression', function () {
            const expression = converters.deltaToExpression({});

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
            const expression = converters.deltaToExpression({ null: null });

            expect(expression.expressionAttributeNames).to.deep.equal({ '#null': 'null' });
            expect(expression.expressionAttributeValues[':null']).to.deep.equal({
                NULL: true
            });
            expect(expression.updateExpression).to.equal('SET modified = :modified, #null = :null');
        });

        it('should convert a property of type "boolean"', function () {
            const expression = converters.deltaToExpression({ boolean: true });

            expect(expression.expressionAttributeNames).to.deep.equal({ '#boolean': 'boolean' });
            expect(expression.expressionAttributeValues[':boolean']).to.deep.equal({
                BOOL: true
            });
            expect(expression.updateExpression).to.equal('SET modified = :modified, #boolean = :boolean');
        });

        it('should convert a property of type "number"', function () {
            const expression = converters.deltaToExpression({ number: 2 });

            expect(expression.expressionAttributeNames).to.deep.equal({ '#number': 'number' });
            expect(expression.expressionAttributeValues[':number']).to.deep.equal({
                N: '2'
            });
            expect(expression.updateExpression).to.equal('SET modified = :modified, #number = :number');
        });

        it('should convert a property of type "string"', function () {
            const expression = converters.deltaToExpression({ string: 'lorem ipsum' });

            expect(expression.expressionAttributeNames).to.deep.equal({ '#string': 'string' });
            expect(expression.expressionAttributeValues[':string']).to.deep.equal({
                S: 'lorem ipsum'
            });
            expect(expression.updateExpression).to.equal('SET modified = :modified, #string = :string');
        });

        it('should convert a property of type "undefined"', function () {
            const expression = converters.deltaToExpression({ nothing: undefined });

            expect(expression.expressionAttributeNames).to.be.undefined;
            expect(expression.expressionAttributeValues[':nothing']).to.be.undefined;
            expect(expression.updateExpression).to.equal('REMOVE nothing SET modified = :modified');
        });

        it('should convert an array', function () {
            const expression = converters.deltaToExpression({ array: [ 2, 'lorem ipsum' ] });

            expect(expression.expressionAttributeNames).to.deep.equal({ '#array': 'array' });
            expect(expression.expressionAttributeValues[':array']).to.deep.equal({ L: [
                { N: '2' },
                { S: 'lorem ipsum' }
            ] } );
            expect(expression.updateExpression).to.equal('SET modified = :modified, #array = :array');
        });

        it('should convert an object', function () {
            const expression = converters.deltaToExpression({ object: { number: 2, string: 'lorem ipsum' } });

            expect(expression.expressionAttributeNames).to.deep.equal({ '#object': 'object' });
            expect(expression.expressionAttributeValues[':object']).to.deep.equal({ M: {
                number: { N: '2' },
                string: { S: 'lorem ipsum' }
            } });
            expect(expression.updateExpression).to.equal('SET modified = :modified, #object = :object');
        });

    });

    describe('itemToData()', function () {

        it('should convert a property with a value of "null"', function () {
            const data = converters.itemToData({ null: { NULL: true } });

            expect(data).to.deep.equal({ null: null });
        });

        it('should convert a property of type "boolean"', function () {
            const data = converters.itemToData({ boolean: { BOOL: true } });

            expect(data).to.deep.equal({ boolean: true });
        });

        it('should convert a property of type "number"', function () {
            const data = converters.itemToData({ number: { N: '2' } });

            expect(data).to.deep.equal({ number: 2 });
        });

        it('should convert a property of type "string"', function () {
            const data = converters.itemToData({ string: { S: 'lorem ipsum' } });

            expect(data).to.deep.equal({ string: 'lorem ipsum' });
        });

        it('should convert an array', function () {
            const data = converters.itemToData({ array: { L: [
                { N: '2' },
                { S: 'lorem ipsum' }
            ] } });

            expect(data).to.deep.equal({ array: [ 2, 'lorem ipsum' ] });
        });

        it('should convert an object', function () {
            const data = converters.itemToData({ object: { M: {
                number: { N: '2' },
                string: { S: 'lorem ipsum' }
            } } });

            expect(data).to.deep.equal({ object: { number: 2, string: 'lorem ipsum' } });
        });

    });

});
