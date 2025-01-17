import { withDateSerialization } from '../../../src/functions/with-date-serialization';

describe('withDateSerialization()', () => {
    describe('with a value of null', () => {
        it('should return null', () => {
            expect(withDateSerialization(null)).to.equal(null);
        });
    });

    describe('with a boolean value', () => {
        it('should return the value', () => {
            expect(withDateSerialization(false)).to.equal(false);
        });
    });

    describe('with a value of type "number"', () => {
        it('should return the value', () => {
            expect(withDateSerialization(231)).to.equal(231);
        });
    });

    describe('with a value of type "string"', () => {
        it('should return the value', () => {
            expect(withDateSerialization('text')).to.equal('text');
        });
    });

    describe('with a value that is an array', () => {
        let value;

        beforeEach(() => {
            value = ['a fake array'];
        });

        it('should return the value', () => {
            expect(withDateSerialization(value)).to.equal(value);
        });
    });

    describe('with a value that is an object', () => {
        let value;

        beforeEach(() => {
            value = { a: 'fake object' };
        });

        it('should return the value', () => {
            expect(withDateSerialization(value)).to.equal(value);
        });
    });

    describe('with a value that is an instance of Date', () => {
        let value;

        beforeEach(() => {
            value = new Date();
        });

        it('should return the result of calling toJSON()', () => {
            expect(withDateSerialization(value)).to.equal(value.toJSON());
        });
    });
});
