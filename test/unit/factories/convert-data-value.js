import { createConvertDataValue } from '../../../src/factories/convert-data-value';
import { stub } from 'sinon';

describe('createConvertDataValue()', () => {
    let convertDataArray;
    let convertDataObject;
    let convertDataValue;
    let isDataArray;
    let isDataObject;

    beforeEach(() => {
        convertDataArray = stub();
        convertDataObject = stub();
        isDataArray = stub();
        isDataObject = stub();

        convertDataValue = createConvertDataValue(
            () => convertDataArray,
            () => convertDataObject,
            isDataArray,
            isDataObject
        );

        convertDataArray.returns('a fake item array');
        convertDataObject.returns('a fake item object');
        isDataArray.returns(false);
        isDataObject.returns(false);
    });

    describe('with a value of null', () => {
        it('should return a NULL item value', () => {
            expect(convertDataValue(null)).to.deep.equal({ NULL: true });
        });
    });

    describe('with a boolean value', () => {
        it('should return a BOOL item value', () => {
            expect(convertDataValue(false)).to.deep.equal({ BOOL: false });
        });
    });

    describe('with a value of type "number"', () => {
        it('should return an N item value', () => {
            expect(convertDataValue(231)).to.deep.equal({ N: '231' });
        });
    });

    describe('with a value of type "string"', () => {
        it('should return an S item value', () => {
            expect(convertDataValue('text')).to.deep.equal({ S: 'text' });
        });
    });

    describe('with a value that is an array', () => {
        let value;

        beforeEach(() => {
            value = ['a fake array'];

            isDataArray.returns(true);
        });

        it('should return an L item value', () => {
            expect(convertDataValue(value)).to.deep.equal({ L: 'a fake item array' });

            expect(isDataArray).to.have.been.calledOnce.and.calledWithExactly(['a fake array']);
            expect(convertDataArray).to.have.been.calledOnce.and.calledWithExactly(['a fake array']);
        });
    });

    describe('with a value that is an object', () => {
        let value;

        beforeEach(() => {
            value = { a: 'fake object' };

            isDataObject.returns(true);
        });

        it('should return an M item value', () => {
            expect(convertDataValue(value)).to.deep.equal({ M: 'a fake item object' });

            expect(isDataObject).to.have.been.calledOnce.and.calledWithExactly({ a: 'fake object' });
            expect(convertDataObject).to.have.been.calledOnce.and.calledWithExactly({ a: 'fake object' });
        });
    });
});
