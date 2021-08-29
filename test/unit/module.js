const converters = require('../../build/node/module');

describe('dynamo-converters', () => {
    describe('dataToItem()', () => {
        it('should convert a property with a value of "null"', () => {
            const item = converters.dataToItem({ null: null });

            expect(item.null).to.deep.equal({ NULL: true });
        });

        it('should not convert a property with a value of "undefined"', () => {
            const item = converters.dataToItem({ nothing: undefined });

            expect(item).to.deep.equal({});
        });

        it('should convert a property of type "boolean"', () => {
            const item = converters.dataToItem({ boolean: true });

            expect(item).to.deep.equal({ boolean: { BOOL: true } });
        });

        it('should convert a property of type "number"', () => {
            const item = converters.dataToItem({ number: 2 });

            expect(item).to.deep.equal({ number: { N: '2' } });
        });

        it('should convert a property of type "string"', () => {
            const item = converters.dataToItem({ string: 'lorem ipsum' });

            expect(item).to.deep.equal({ string: { S: 'lorem ipsum' } });
        });

        it('should convert an array', () => {
            const item = converters.dataToItem({ array: [2, 'lorem ipsum'] });

            expect(item).to.deep.equal({ array: { L: [{ N: '2' }, { S: 'lorem ipsum' }] } });
        });

        it('should convert an object', () => {
            const item = converters.dataToItem({ object: { number: 2, string: 'lorem ipsum' } });

            expect(item).to.deep.equal({
                object: {
                    M: {
                        number: { N: '2' },
                        string: { S: 'lorem ipsum' }
                    }
                }
            });
        });

        it('should not convert a property of an object with a value of "undefined"', () => {
            const item = converters.dataToItem({ object: { nothing: undefined } });

            expect(item).to.deep.equal({ object: { M: {} } });
        });
    });

    describe('deltaToUpdateParams()', () => {
        it('should convert a property with a value of "null"', () => {
            const updateParams = converters.deltaToUpdateParams({ null: null });

            expect(updateParams.ExpressionAttributeNames).to.deep.equal({ '#null': 'null' });
            expect(updateParams.ExpressionAttributeValues).to.deep.equal({
                ':null': {
                    NULL: true
                }
            });
            expect(updateParams.UpdateExpression).to.equal('SET #null = :null');
        });

        it('should convert a property of type "boolean"', () => {
            const updateParams = converters.deltaToUpdateParams({ boolean: true });

            expect(updateParams.ExpressionAttributeNames).to.deep.equal({ '#boolean': 'boolean' });
            expect(updateParams.ExpressionAttributeValues).to.deep.equal({
                ':boolean': {
                    BOOL: true
                }
            });
            expect(updateParams.UpdateExpression).to.equal('SET #boolean = :boolean');
        });

        it('should convert a property of type "number"', () => {
            const updateParams = converters.deltaToUpdateParams({ number: 2 });

            expect(updateParams.ExpressionAttributeNames).to.deep.equal({ '#number': 'number' });
            expect(updateParams.ExpressionAttributeValues).to.deep.equal({
                ':number': {
                    N: '2'
                }
            });
            expect(updateParams.UpdateExpression).to.equal('SET #number = :number');
        });

        it('should convert a property of type "string"', () => {
            const updateParams = converters.deltaToUpdateParams({ string: 'lorem ipsum' });

            expect(updateParams.ExpressionAttributeNames).to.deep.equal({ '#string': 'string' });
            expect(updateParams.ExpressionAttributeValues).to.deep.equal({
                ':string': {
                    S: 'lorem ipsum'
                }
            });
            expect(updateParams.UpdateExpression).to.equal('SET #string = :string');
        });

        it('should convert a property of type "undefined"', () => {
            const updateParams = converters.deltaToUpdateParams({ nothing: undefined });

            expect(updateParams.ExpressionAttributeNames).to.be.undefined;
            expect(updateParams.ExpressionAttributeValues).to.deep.equal({});
            expect(updateParams.UpdateExpression).to.equal('REMOVE nothing');
        });

        it('should convert an array', () => {
            const updateParams = converters.deltaToUpdateParams({ array: [2, 'lorem ipsum'] });

            expect(updateParams.ExpressionAttributeNames).to.deep.equal({ '#array': 'array' });
            expect(updateParams.ExpressionAttributeValues).to.deep.equal({ ':array': { L: [{ N: '2' }, { S: 'lorem ipsum' }] } });
            expect(updateParams.UpdateExpression).to.equal('SET #array = :array');
        });

        it('should convert an object', () => {
            const updateParams = converters.deltaToUpdateParams({ object: { number: 2, string: 'lorem ipsum' } });

            expect(updateParams.ExpressionAttributeNames).to.deep.equal({ '#object': 'object' });
            expect(updateParams.ExpressionAttributeValues).to.deep.equal({
                ':object': {
                    M: {
                        number: { N: '2' },
                        string: { S: 'lorem ipsum' }
                    }
                }
            });
            expect(updateParams.UpdateExpression).to.equal('SET #object = :object');
        });

        it('should convert properties with spaces in their name', () => {
            const updateParams = converters.deltaToUpdateParams({ 'a property name': 'some value', 'another property name': undefined });

            expect(updateParams.ExpressionAttributeNames).to.deep.equal({
                '#anotherpropertyname': 'another property name',
                '#apropertyname': 'a property name'
            });
            expect(updateParams.ExpressionAttributeValues).to.deep.equal({ ':apropertyname': { S: 'some value' } });
            expect(updateParams.UpdateExpression).to.equal('REMOVE #anotherpropertyname SET #apropertyname = :apropertyname');
        });

        it('should convert properties with dots in their name', () => {
            const updateParams = converters.deltaToUpdateParams({ 'a.property.name': 'some value', 'another.property.name': undefined });

            expect(updateParams.ExpressionAttributeNames).to.deep.equal({
                '#anotherpropertyname': 'another.property.name',
                '#apropertyname': 'a.property.name'
            });
            expect(updateParams.ExpressionAttributeValues).to.deep.equal({ ':apropertyname': { S: 'some value' } });
            expect(updateParams.UpdateExpression).to.equal('REMOVE #anotherpropertyname SET #apropertyname = :apropertyname');
        });

        it('should convert properties with conflicting names', () => {
            const updateParams = converters.deltaToUpdateParams({
                'a property name': undefined,
                'a.property.name': 'some other value',
                'apropertyname': 'some value'
            });

            expect(updateParams.ExpressionAttributeNames).to.deep.equal({
                '#apropertyname': 'a property name',
                '#apropertyname_': 'a.property.name'
            });
            expect(updateParams.ExpressionAttributeValues).to.deep.equal({
                ':apropertyname': { S: 'some value' },
                ':apropertyname_': { S: 'some other value' }
            });
            expect(updateParams.UpdateExpression).to.equal(
                'REMOVE #apropertyname SET #apropertyname_ = :apropertyname_, apropertyname = :apropertyname'
            );
        });
    });

    describe('itemToData()', () => {
        it('should convert a property with a value of "null"', () => {
            const data = converters.itemToData({ null: { NULL: true } });

            expect(data).to.deep.equal({ null: null });
        });

        it('should convert a property of type "boolean"', () => {
            const data = converters.itemToData({ boolean: { BOOL: true } });

            expect(data).to.deep.equal({ boolean: true });
        });

        it('should convert a property of type "number"', () => {
            const data = converters.itemToData({ number: { N: '2' } });

            expect(data).to.deep.equal({ number: 2 });
        });

        it('should convert a property of type "string"', () => {
            const data = converters.itemToData({ string: { S: 'lorem ipsum' } });

            expect(data).to.deep.equal({ string: 'lorem ipsum' });
        });

        it('should convert an array', () => {
            const data = converters.itemToData({ array: { L: [{ N: '2' }, { S: 'lorem ipsum' }] } });

            expect(data).to.deep.equal({ array: [2, 'lorem ipsum'] });
        });

        it('should convert an object', () => {
            const data = converters.itemToData({
                object: {
                    M: {
                        number: { N: '2' },
                        string: { S: 'lorem ipsum' }
                    }
                }
            });

            expect(data).to.deep.equal({ object: { number: 2, string: 'lorem ipsum' } });
        });
    });
});
