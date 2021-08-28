import { createConvertDataArray } from '../../../src/factories/convert-data-array';
import { stub } from 'sinon';

describe('createConvertDataArray()', () => {
    let convertDataArray;
    let convertDataValue;

    beforeEach(() => {
        convertDataValue = stub();

        convertDataArray = createConvertDataArray(convertDataValue);

        convertDataValue.onFirstCall().returns('three').onSecondCall().returns('new').onThirdCall().returns('values');
    });

    it('should call convertDataValue() for each element in the array', () => {
        const array = ['a', 'fake', 'array'];

        convertDataArray(array);

        expect(convertDataValue)
            .to.have.been.calledThrice.and.calledWithExactly('a')
            .and.calledWithExactly('fake')
            .and.calledWithExactly('array');
    });

    it('should map the array with the values returned by convertDataValue()', () => {
        const array = ['a', 'fake', 'array'];

        expect(convertDataArray(array)).to.deep.equal(['three', 'new', 'values']);
    });
});
