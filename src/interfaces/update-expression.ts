import { IItemObject } from './item-object';

export interface IUpdateParams {
    ExpressionAttributeNames?: { [key: string]: string };

    ExpressionAttributeValues: IItemObject;

    UpdateExpression: string;
}
