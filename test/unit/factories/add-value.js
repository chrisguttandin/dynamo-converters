import { createAddValue } from '../../../src/factories/add-value';

describe('createAddValue()', () => {
    let addSymbol;
    let addValue;
    let value;

    beforeEach(() => {
        addSymbol = 'a fake symbol';
        value = 33;

        addValue = createAddValue(addSymbol);
    });

    it('should return an array with the symbol and the given value', () => {
        expect(addValue(value)).to.deep.equal([addSymbol, value]);
    });
});
