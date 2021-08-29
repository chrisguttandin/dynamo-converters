import { createFormRemoveStatement } from '../../../src/factories/form-remove-statement';
import { stub } from 'sinon';

describe('createFormRemoveStatement()', () => {
    let createPropertyName;
    let expressionAttributeNames;
    let formRemoveStatement;
    let isIllegalWord;
    let property;

    beforeEach(() => {
        createPropertyName = stub();
        expressionAttributeNames = 'a fake list of expressionAttributeNames';
        isIllegalWord = stub();
        property = 'a fake property';

        formRemoveStatement = createFormRemoveStatement(createPropertyName, isIllegalWord);

        isIllegalWord.returns(false);
    });

    describe('with a legal property', () => {
        it('should return the property', () => {
            expect(formRemoveStatement(property, expressionAttributeNames)).to.equal(property);
        });

        it('should call isIllegalWord()', () => {
            formRemoveStatement(property, expressionAttributeNames);

            expect(isIllegalWord).to.have.been.calledOnce.and.calledWithExactly(property);
        });
    });

    describe('with an illegal property', () => {
        let replacedProperty;

        beforeEach(() => {
            replacedProperty = 'the replaced property';

            createPropertyName.returns(replacedProperty);
            isIllegalWord.returns(true);
        });

        it('should return the replaced property with a prefix', () => {
            expect(formRemoveStatement(property, expressionAttributeNames)).to.equal(`#${replacedProperty}`);
        });

        it('should call isIllegalWord()', () => {
            formRemoveStatement(property, expressionAttributeNames);

            expect(isIllegalWord).to.have.been.calledOnce.and.calledWithExactly(property);
        });

        it('should call createPropertyName()', () => {
            formRemoveStatement(property, expressionAttributeNames);

            expect(createPropertyName).to.have.been.calledOnce.and.calledWithExactly(property, expressionAttributeNames);
        });
    });
});
