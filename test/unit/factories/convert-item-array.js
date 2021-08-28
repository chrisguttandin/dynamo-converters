import { createConvertItemArray } from '../../../src/factories/convert-item-array';
import { stub } from 'sinon';

describe('createConvertItemArray()', () => {
    let convertItemArray;
    let convertItemValue;

    beforeEach(() => {
        convertItemValue = stub();

        convertItemArray = createConvertItemArray(convertItemValue);

        convertItemValue.onFirstCall().returns('three').onSecondCall().returns('new').onThirdCall().returns('values');
    });

    it('should call convertItemValue() for each element in the array', () => {
        const array = ['a', 'fake', 'array'];

        convertItemArray(array);

        expect(convertItemValue)
            .to.have.been.calledThrice.and.calledWithExactly('a')
            .and.calledWithExactly('fake')
            .and.calledWithExactly('array');
    });

    it('should map the array with the values returned by convertItemValue()', () => {
        const array = ['a', 'fake', 'array'];

        expect(convertItemArray(array)).to.deep.equal(['three', 'new', 'values']);
    });
});
