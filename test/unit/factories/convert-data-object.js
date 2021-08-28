import { createConvertDataObject } from '../../../src/factories/convert-data-object';
import { stub } from 'sinon';

describe('createConvertDataObject()', () => {
    let convertDataObject;
    let convertDataValue;

    beforeEach(() => {
        convertDataValue = stub();

        convertDataObject = createConvertDataObject(convertDataValue);

        convertDataValue.onFirstCall().returns('three').onSecondCall().returns('new').onThirdCall().returns('values');
    });

    it('should call convertDataValue() for each value in the object', () => {
        const object = { a: 'fake', object: 'with', some: 'properties' };

        convertDataObject(object);

        expect(convertDataValue)
            .to.have.been.calledThrice.and.calledWithExactly('fake')
            .and.calledWithExactly('with')
            .and.calledWithExactly('properties');
    });

    it('should rebuild the object with the values returned by convertDataValue()', () => {
        const object = { a: 'fake', object: 'with', some: 'properties' };

        expect(convertDataObject(object)).to.deep.equal({ a: 'three', object: 'new', some: 'values' });
    });
});
