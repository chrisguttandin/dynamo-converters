import { IItemObject } from './item-object';

export interface IUpdateParams {
    expressionAttributeNames?: { [key: string]: string };

    expressionAttributeValues: IItemObject;

    updateExpression: string;
}
