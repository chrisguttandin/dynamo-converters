import { createFormAddStatement } from '../../../src/factories/form-add-statement';
import { stub } from 'sinon';

describe('createFormAddStatement()', () => {
    let convertDataValue;
    let createPropertyName;
    let expressionAttributeNames;
    let expressionAttributeValues;
    let formAddStatement;
    let isIllegalWord;
    let property;
    let value;

    beforeEach(() => {
        convertDataValue = stub();
        createPropertyName = stub();
        expressionAttributeNames = 'a fake list of expressionAttributeNames';
        expressionAttributeValues = {};
        isIllegalWord = stub();
        property = 'a fake property';
        value = 'a fake value';

        formAddStatement = createFormAddStatement(convertDataValue, createPropertyName, isIllegalWord);

        convertDataValue.returns('a fake item value');
        isIllegalWord.returns(false);
    });

    describe('with a legal property', () => {
        it('should return a statement with the property', () => {
            expect(formAddStatement(property, value, expressionAttributeNames, expressionAttributeValues)).to.equal(
                `${property} :${property}`
            );
        });

        it('should call isIllegalWord()', () => {
            formAddStatement(property, value, expressionAttributeNames, expressionAttributeValues);

            expect(isIllegalWord).to.have.been.calledOnce.and.calledWithExactly(property);
        });

        it('should call convertDataValue()', () => {
            formAddStatement(property, value, expressionAttributeNames, expressionAttributeValues);

            expect(convertDataValue).to.have.been.calledOnce.and.calledWithExactly(value);
        });

        it('should add the property with a prefix and the converted value to the expressionAttributeValues', () => {
            formAddStatement(property, value, expressionAttributeNames, expressionAttributeValues);

            expect(expressionAttributeValues[`:${property}`]).to.equal('a fake item value');
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
            expect(formAddStatement(property, value, expressionAttributeNames, expressionAttributeValues)).to.equal(
                `#${replacedProperty} :${replacedProperty}`
            );
        });

        it('should call isIllegalWord()', () => {
            formAddStatement(property, value, expressionAttributeNames, expressionAttributeValues);

            expect(isIllegalWord).to.have.been.calledOnce.and.calledWithExactly(property);
        });

        it('should call createPropertyName()', () => {
            formAddStatement(property, value, expressionAttributeNames, expressionAttributeValues);

            expect(createPropertyName).to.have.been.calledOnce.and.calledWithExactly(property, expressionAttributeNames);
        });

        it('should call convertDataValue()', () => {
            formAddStatement(property, value, expressionAttributeNames, expressionAttributeValues);

            expect(convertDataValue).to.have.been.calledOnce.and.calledWithExactly(value);
        });

        it('should add the property with a prefix and the converted value to the expressionAttributeValues', () => {
            formAddStatement(property, value, expressionAttributeNames, expressionAttributeValues);

            expect(expressionAttributeValues[`:${replacedProperty}`]).to.equal('a fake item value');
        });
    });
});
