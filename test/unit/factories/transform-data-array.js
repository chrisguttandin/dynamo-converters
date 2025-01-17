import { createTransformDataArray } from '../../../src/factories/transform-data-array';
import { stub } from 'sinon';

describe('createTransformDataArray()', () => {
    let transformDataArray;
    let transformDataValue;

    beforeEach(() => {
        transformDataValue = stub();

        transformDataArray = createTransformDataArray(transformDataValue);

        transformDataValue.onFirstCall().returns('three').onSecondCall().returns('new').onThirdCall().returns('values');
    });

    it('should call transformDataValue() for each element in the array', () => {
        const array = ['a', 'fake', 'array'];

        transformDataArray(array);

        expect(transformDataValue)
            .to.have.been.calledThrice.and.calledWithExactly('a')
            .and.calledWithExactly('fake')
            .and.calledWithExactly('array');
    });

    it('should map the array with the values returned by transformDataValue()', () => {
        const array = ['a', 'fake', 'array'];

        expect(transformDataArray(array)).to.deep.equal(['three', 'new', 'values']);
    });
});
