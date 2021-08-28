import { createConvertItemValue } from '../../../src/factories/convert-item-value';
import { stub } from 'sinon';

describe('createConvertItemValue()', () => {
    let convertItemArray;
    let convertItemObject;
    let convertItemValue;
    let isBooleanItemValue;
    let isListItemValue;
    let isMapItemValue;
    let isNullItemValue;
    let isNumberItemValue;
    let isStringItemValue;

    beforeEach(() => {
        convertItemArray = stub();
        convertItemObject = stub();
        isBooleanItemValue = stub();
        isListItemValue = stub();
        isMapItemValue = stub();
        isNullItemValue = stub();
        isNumberItemValue = stub();
        isStringItemValue = stub();

        convertItemValue = createConvertItemValue(
            () => convertItemArray,
            () => convertItemObject,
            isBooleanItemValue,
            isListItemValue,
            isMapItemValue,
            isNullItemValue,
            isNumberItemValue,
            isStringItemValue
        );

        convertItemArray.returns('a fake data array');
        convertItemObject.returns('a fake data object');
        isBooleanItemValue.returns(false);
        isListItemValue.returns(false);
        isMapItemValue.returns(false);
        isNullItemValue.returns(false);
        isNumberItemValue.returns(false);
        isStringItemValue.returns(false);
    });

    describe('with a BOOL item value', () => {
        let value;

        beforeEach(() => {
            value = { BOOL: 'a fake value' };

            isBooleanItemValue.returns(true);
        });

        it('should return the value of the BOOL property', () => {
            expect(convertItemValue(value)).to.equal('a fake value');

            expect(isBooleanItemValue).to.have.been.calledOnce.and.calledWithExactly(value);
        });
    });

    describe('with an L item value', () => {
        let value;

        beforeEach(() => {
            value = { L: 'a fake value' };

            isListItemValue.returns(true);
        });

        it('should return the processed value of the L property', () => {
            expect(convertItemValue(value)).to.equal('a fake data array');

            expect(isListItemValue).to.have.been.calledOnce.and.calledWithExactly(value);
            expect(convertItemArray).to.have.been.calledOnce.and.calledWithExactly('a fake value');
        });
    });

    describe('with an M item value', () => {
        let value;

        beforeEach(() => {
            value = { M: 'a fake value' };

            isMapItemValue.returns(true);
        });

        it('should return the processed value of the M property', () => {
            expect(convertItemValue(value)).to.equal('a fake data object');

            expect(isMapItemValue).to.have.been.calledOnce.and.calledWithExactly(value);
            expect(convertItemObject).to.have.been.calledOnce.and.calledWithExactly('a fake value');
        });
    });

    describe('with an N item value', () => {
        beforeEach(() => isNumberItemValue.returns(true));

        describe('with an integer value', () => {
            let value;

            beforeEach(() => (value = { N: '134' }));

            it('should return the parsed value of the N property', () => {
                expect(convertItemValue(value)).to.equal(134);

                expect(isNumberItemValue).to.have.been.calledOnce.and.calledWithExactly(value);
            });
        });

        describe('with a floating point value', () => {
            let value;

            beforeEach(() => (value = { N: '13.4' }));

            it('should return the parsed value of the N property', () => {
                expect(convertItemValue(value)).to.equal(13.4);

                expect(isNumberItemValue).to.have.been.calledOnce.and.calledWithExactly(value);
            });
        });
    });

    describe('with a NULL item value', () => {
        let value;

        beforeEach(() => {
            value = { NULL: 'a fake value' };

            isNullItemValue.returns(true);
        });

        it('should return null', () => {
            expect(convertItemValue(value)).to.be.null;

            expect(isNullItemValue).to.have.been.calledOnce.and.calledWithExactly(value);
        });
    });

    describe('with an S item value', () => {
        let value;

        beforeEach(() => {
            value = { S: 'a fake value' };

            isStringItemValue.returns(true);
        });

        it('should return the value of the S property', () => {
            expect(convertItemValue(value)).to.equal('a fake value');

            expect(isStringItemValue).to.have.been.calledOnce.and.calledWithExactly(value);
        });
    });
});
