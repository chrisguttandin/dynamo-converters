import { TItemObject } from '../types';
import { IDataObject } from './data-object';

export interface IExpression {

    expressionAttributeNames?: { [ key: string ]: string };

    expressionAttributeValues: TItemObject<IDataObject>;

    updateExpression: string;

}
