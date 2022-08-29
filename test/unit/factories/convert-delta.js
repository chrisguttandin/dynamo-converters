import { createConvertDelta } from '../../../src/factories/convert-delta';
import { stub } from 'sinon';

describe('createConvertDelta()', () => {
    let convertDelta;
    let formAddStatement;
    let formRemoveStatement;
    let formSetStatement;
    let isTuple;

    beforeEach(() => {
        formAddStatement = stub();
        formRemoveStatement = stub();
        formSetStatement = stub();
        isTuple = stub();

        convertDelta = createConvertDelta(formAddStatement, formRemoveStatement, formSetStatement, isTuple);
    });

    describe('with a property to add a value', () => {
        let delta;
        let property;

        beforeEach(() => {
            property = ['a fake symbol', 73];
            delta = { property };

            formAddStatement.returns('a fake add statement');
            isTuple.returns(true);
        });

        it('should call isTuple()', () => {
            convertDelta(delta);

            expect(isTuple).to.have.been.calledOnce.and.calledWithExactly(property);
        });

        it('should call formAddStatement()', () => {
            convertDelta(delta);

            const [, , expressionAttributeNames, expressionAttributeValues] = formAddStatement.getCall(0).args;

            expect(expressionAttributeNames).to.deep.equal({});
            expect(expressionAttributeValues).to.deep.equal({});
            expect(formAddStatement).to.have.been.calledOnce.and.calledWithExactly(
                'property',
                property[1],
                expressionAttributeNames,
                expressionAttributeValues
            );
        });

        describe('without any modifications', () => {
            it('should return update params with am add statement', () => {
                expect(convertDelta(delta)).to.deep.equal({
                    ExpressionAttributeNames: undefined,
                    ExpressionAttributeValues: {},
                    UpdateExpression: 'ADD a fake add statement'
                });
            });
        });

        describe('with modified expressionAttributeNames', () => {
            beforeEach(() => {
                formAddStatement.callsFake((_1, _2, expressionAttributeNames) => {
                    expressionAttributeNames['new'] = 'value';

                    return 'a fake add statement';
                });
            });

            it('should return update params with an add statement', () => {
                expect(convertDelta(delta)).to.deep.equal({
                    ExpressionAttributeNames: { new: 'value' },
                    ExpressionAttributeValues: {},
                    UpdateExpression: 'ADD a fake add statement'
                });
            });
        });

        describe('with modified expressionAttributeValues', () => {
            beforeEach(() => {
                formAddStatement.callsFake((_1, _2, _3, expressionAttributeValues) => {
                    expressionAttributeValues['new'] = 'value';

                    return 'a fake add statement';
                });
            });

            it('should return update params with an add statement', () => {
                expect(convertDelta(delta)).to.deep.equal({
                    ExpressionAttributeNames: undefined,
                    ExpressionAttributeValues: {
                        new: 'value'
                    },
                    UpdateExpression: 'ADD a fake add statement'
                });
            });
        });
    });

    describe('with a property to delete a value', () => {
        let delta;

        beforeEach(() => {
            delta = { property: undefined };

            formRemoveStatement.returns('a fake remove statement');
        });

        it('should not call isTuple()', () => {
            convertDelta(delta);

            expect(isTuple).to.have.not.been.called;
        });

        it('should call formRemoveStatement()', () => {
            convertDelta(delta);

            const expressionAttributeNames = formRemoveStatement.getCall(0).args[1];

            expect(expressionAttributeNames).to.deep.equal({});
            expect(formRemoveStatement).to.have.been.calledOnce.and.calledWithExactly('property', expressionAttributeNames);
        });

        describe('without any modifications', () => {
            it('should return update params with a remove statement', () => {
                expect(convertDelta(delta)).to.deep.equal({
                    ExpressionAttributeNames: undefined,
                    ExpressionAttributeValues: {},
                    UpdateExpression: 'REMOVE a fake remove statement'
                });
            });
        });

        describe('with modified expressionAttributeNames', () => {
            beforeEach(() => {
                formRemoveStatement.callsFake((_1, expressionAttributeNames) => {
                    expressionAttributeNames['new'] = 'value';

                    return 'a fake remove statement';
                });
            });

            it('should return update params with a remove statement', () => {
                expect(convertDelta(delta)).to.deep.equal({
                    ExpressionAttributeNames: { new: 'value' },
                    ExpressionAttributeValues: {},
                    UpdateExpression: 'REMOVE a fake remove statement'
                });
            });
        });
    });

    describe('with a property to set a value', () => {
        const properties = {
            boolean: false,
            number: 17,
            object: {
                boolean: false,
                number: 17,
                string: 'a string'
            },
            string: 'a string'
        };

        for (const [type, property] of Object.entries(properties)) {
            describe(`with a property of type "${type}"`, () => {
                let delta;

                beforeEach(() => {
                    delta = { property };

                    formSetStatement.returns('a fake set statement');
                    isTuple.returns(false);
                });

                it('should call isTuple()', () => {
                    convertDelta(delta);

                    expect(isTuple).to.have.been.calledOnce.and.calledWithExactly(property);
                });

                it('should call formSetStatement()', () => {
                    convertDelta(delta);

                    const [, , expressionAttributeNames, expressionAttributeValues] = formSetStatement.getCall(0).args;

                    expect(expressionAttributeNames).to.deep.equal({});
                    expect(expressionAttributeValues).to.deep.equal({});
                    expect(formSetStatement).to.have.been.calledOnce.and.calledWithExactly(
                        'property',
                        property,
                        expressionAttributeNames,
                        expressionAttributeValues
                    );
                });

                describe('without any modifications', () => {
                    it('should return update params with a set statement', () => {
                        expect(convertDelta(delta)).to.deep.equal({
                            ExpressionAttributeNames: undefined,
                            ExpressionAttributeValues: {},
                            UpdateExpression: 'SET a fake set statement'
                        });
                    });
                });

                describe('with modified expressionAttributeNames', () => {
                    beforeEach(() => {
                        formSetStatement.callsFake((_1, _2, expressionAttributeNames) => {
                            expressionAttributeNames['new'] = 'value';

                            return 'a fake set statement';
                        });
                    });

                    it('should return update params with a set statement', () => {
                        expect(convertDelta(delta)).to.deep.equal({
                            ExpressionAttributeNames: { new: 'value' },
                            ExpressionAttributeValues: {},
                            UpdateExpression: 'SET a fake set statement'
                        });
                    });
                });

                describe('with modified expressionAttributeValues', () => {
                    beforeEach(() => {
                        formSetStatement.callsFake((_1, _2, _3, expressionAttributeValues) => {
                            expressionAttributeValues['new'] = 'value';

                            return 'a fake set statement';
                        });
                    });

                    it('should return update params with a set statement', () => {
                        expect(convertDelta(delta)).to.deep.equal({
                            ExpressionAttributeNames: undefined,
                            ExpressionAttributeValues: {
                                new: 'value'
                            },
                            UpdateExpression: 'SET a fake set statement'
                        });
                    });
                });
            });
        }
    });
});
