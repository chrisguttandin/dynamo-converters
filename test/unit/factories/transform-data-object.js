import { createTransformDataObject } from '../../../src/factories/transform-data-object';
import { stub } from 'sinon';

describe('createTransformDataObject()', () => {
    let transformDataObject;
    let transformDataValue;

    beforeEach(() => {
        transformDataValue = stub();

        transformDataObject = createTransformDataObject(transformDataValue);

        transformDataValue.onFirstCall().returns('three').onSecondCall().returns('new').onThirdCall().returns('values');
    });

    it('should call transformDataValue() for each value in the object', () => {
        const object = { a: 'fake', object: 'with', some: 'properties' };

        transformDataObject(object);

        expect(transformDataValue)
            .to.have.been.calledThrice.and.calledWithExactly('fake')
            .and.calledWithExactly('with')
            .and.calledWithExactly('properties');
    });

    it('should rebuild the object with the values returned by transformDataValue()', () => {
        const object = { a: 'fake', object: 'with', some: 'properties' };

        expect(transformDataObject(object)).to.deep.equal({ a: 'three', object: 'new', some: 'values' });
    });
});
