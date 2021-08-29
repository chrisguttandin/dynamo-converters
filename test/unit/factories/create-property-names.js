import { createCreatePropertyName } from '../../../src/factories/create-property-name';

describe('createCreatePropertyName()', () => {
    let createPropertyName;
    let expressionAttributeNames;
    let regex;

    beforeEach(() => {
        expressionAttributeNames = {};
        regex = /-/g;

        createPropertyName = createCreatePropertyName(regex);
    });

    describe("with a property that doesn't match the regex", () => {
        describe("with a property which isn't in the expressionAttributeNames list", () => {
            it('should return the property name', () => {
                expect(createPropertyName('property', expressionAttributeNames)).to.equal('property');
            });

            it('should add the property to the expressionAttributeNames', () => {
                createPropertyName('property', expressionAttributeNames);

                expect(expressionAttributeNames['#property']).to.equal('property');
            });
        });

        describe('with a property which is already stored in the expressionAttributeNames list', () => {
            beforeEach(() => (expressionAttributeNames['#property'] = 'property'));

            it('should return the property name with a suffix', () => {
                expect(createPropertyName('property', expressionAttributeNames)).to.equal('property_');
            });

            it('should add the property with a suffix to the expressionAttributeNames', () => {
                createPropertyName('property', expressionAttributeNames);

                expect(expressionAttributeNames['#property_']).to.equal('property');
            });
        });
    });

    describe('with a property that does match the regex', () => {
        describe("with a property which isn't in the expressionAttributeNames list", () => {
            it('should return the filtered property name', () => {
                expect(createPropertyName('pro-per-ty', expressionAttributeNames)).to.equal('property');
            });

            it('should add the filtered property to the expressionAttributeNames', () => {
                createPropertyName('pro-per-ty', expressionAttributeNames);

                expect(expressionAttributeNames['#property']).to.equal('pro-per-ty');
            });
        });

        describe('with a property which is already stored in the expressionAttributeNames list', () => {
            beforeEach(() => (expressionAttributeNames['#property'] = 'property'));

            it('should return the filtered property name with a suffix', () => {
                expect(createPropertyName('pro-per-ty', expressionAttributeNames)).to.equal('property_');
            });

            it('should add the filtered property with a suffix to the expressionAttributeNames', () => {
                createPropertyName('pro-per-ty', expressionAttributeNames);

                expect(expressionAttributeNames['#property_']).to.equal('pro-per-ty');
            });
        });
    });
});
