import { createIsReservedWord } from '../../../src/factories/is-reserved-word';

describe('createIsReservedWord()', () => {
    let isReservedWord;
    let reservedWords;

    beforeEach(() => {
        reservedWords = ['SOME', 'RESERVED', 'WORDS'];

        isReservedWord = createIsReservedWord(reservedWords);
    });

    it('should return true for exact matches', () => {
        expect(isReservedWord('RESERVED')).to.be.true;
    });

    it('should return true for the same word with different casing', () => {
        expect(isReservedWord('words')).to.be.true;
    });

    it("should return false for words which aren't in the given list", () => {
        expect(isReservedWord('OTHER')).to.be.false;
    });
});
