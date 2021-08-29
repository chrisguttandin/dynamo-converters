import { createIsIllegalWord } from '../../../src/factories/is-illegal-word';
import { stub } from 'sinon';

describe('createIsIllegalWord()', () => {
    let illegalWordRegex;
    let isIllegalWord;
    let isReservedWord;

    beforeEach(() => {
        illegalWordRegex = /illegal/;
        isReservedWord = stub();

        isIllegalWord = createIsIllegalWord(illegalWordRegex, isReservedWord);

        isReservedWord.returns(false);
    });

    describe('with an illegal word', () => {
        it('it should return true', () => {
            expect(isIllegalWord('illegal')).to.be.true;
        });
    });

    describe('with a legal but reserved word', () => {
        beforeEach(() => isReservedWord.returns(true));

        it('it should return true', () => {
            expect(isIllegalWord('reserved')).to.be.true;

            expect(isReservedWord).to.have.been.calledOnce.and.calledWithExactly('reserved');
        });
    });

    describe("with a legal word that isn't reserved", () => {
        it('it should return false', () => {
            expect(isIllegalWord('legal')).to.be.false;
        });
    });
});
