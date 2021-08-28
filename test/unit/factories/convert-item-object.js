import { createConvertItemObject } from '../../../src/factories/convert-item-object';
import { stub } from 'sinon';

describe('createConvertItemObject()', () => {
    let convertItemObject;
    let convertItemValue;

    beforeEach(() => {
        convertItemValue = stub();

        convertItemObject = createConvertItemObject(convertItemValue);

        convertItemValue.onFirstCall().returns('three').onSecondCall().returns('new').onThirdCall().returns('values');
    });

    it('should call convertItemValue() for each value in the object', () => {
        const object = { a: 'fake', object: 'with', some: 'properties' };

        convertItemObject(object);

        expect(convertItemValue)
            .to.have.been.calledThrice.and.calledWithExactly('fake')
            .and.calledWithExactly('with')
            .and.calledWithExactly('properties');
    });

    it('should rebuild the object with the values returned by convertItemValue()', () => {
        const object = { a: 'fake', object: 'with', some: 'properties' };

        expect(convertItemObject(object)).to.deep.equal({ a: 'three', object: 'new', some: 'values' });
    });
});
