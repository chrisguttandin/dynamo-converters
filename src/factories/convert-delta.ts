import { IItemObject, IUpdateParams } from '../interfaces';
import { TDataValue } from '../types';
import type { createFormAddStatement } from './form-add-statement';
import type { createFormRemoveStatement } from './form-remove-statement';
import type { createFormSetStatement } from './form-set-statement';
import type { createIsTuple } from './is-tuple';

export const createConvertDelta =
    (
        formAddStatement: ReturnType<typeof createFormAddStatement>,
        formRemoveStatement: ReturnType<typeof createFormRemoveStatement>,
        formSetStatement: ReturnType<typeof createFormSetStatement>,
        isTuple: ReturnType<typeof createIsTuple>
    ) =>
    // tslint:disable-next-line:no-null-undefined-union
    <T extends { [key: string]: undefined | [symbol, number] | TDataValue }>(delta: T): IUpdateParams => {
        const addStatements: string[] = [];
        const expressionAttributeNames: { [key: string]: string } = {};
        const expressionAttributeValues: IItemObject = {};
        const removeStatements: string[] = [];
        const setStatements: string[] = [];
        const updateExpressions: string[] = [];

        for (const [property, value] of Object.entries(delta)) {
            if (value === undefined) {
                removeStatements.push(formRemoveStatement(property, expressionAttributeNames));
            } else if (isTuple(value)) {
                addStatements.push(formAddStatement(property, value[1], expressionAttributeNames, expressionAttributeValues));
            } else if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string' || typeof value === 'object') {
                setStatements.push(formSetStatement(property, value, expressionAttributeNames, expressionAttributeValues));
            }
        }

        if (addStatements.length > 0) {
            updateExpressions.push(`ADD ${addStatements.join(', ')}`);
        }

        if (removeStatements.length > 0) {
            updateExpressions.push(`REMOVE ${removeStatements.join(', ')}`);
        }

        if (setStatements.length > 0) {
            updateExpressions.push(`SET ${setStatements.join(', ')}`);
        }

        return {
            ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
            ExpressionAttributeValues: expressionAttributeValues,
            UpdateExpression: updateExpressions.join(' ')
        };
    };
