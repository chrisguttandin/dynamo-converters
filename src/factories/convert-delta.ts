import { IExpression, IItemObject } from '../interfaces';
import type { createFormRemoveStatement } from './form-remove-statement';
import type { createFormSetStatement } from './form-set-statement';

export const createConvertDelta =
    (formRemoveStatement: ReturnType<typeof createFormRemoveStatement>, formSetStatement: ReturnType<typeof createFormSetStatement>) =>
    <T>(delta: T): IExpression => {
        const expressionAttributeNames: { [key: string]: string } = {};
        const expressionAttributeValues: IItemObject = {};
        const removeStatements: string[] = [];
        const setStatements: string[] = [];
        const updateExpressions: string[] = [];

        for (const [property, value] of Object.entries(delta)) {
            if (value === undefined) {
                removeStatements.push(formRemoveStatement(property, expressionAttributeNames));
            } else if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string' || typeof value === 'object') {
                setStatements.push(formSetStatement(property, value, expressionAttributeNames, expressionAttributeValues));
            }
        }

        if (removeStatements.length > 0) {
            updateExpressions.push(`REMOVE ${removeStatements.join(', ')}`);
        }

        if (setStatements.length > 0) {
            updateExpressions.push(`SET ${setStatements.join(', ')}`);
        }

        return {
            expressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
            expressionAttributeValues,
            updateExpression: updateExpressions.join(' ')
        };
    };
