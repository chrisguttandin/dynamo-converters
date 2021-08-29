import { IItemObject } from './item-object';

export interface IExpression {
    expressionAttributeNames?: { [key: string]: string };

    expressionAttributeValues: IItemObject;

    updateExpression: string;
}
