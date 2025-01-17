import { IDataObject } from '../interfaces';
import { TDataValue } from './data-value';
import { TTransformedObject } from './transformed-object';

export type TTransformDataObjectFunction = <DataObject extends IDataObject, HandledValue, TransformedValue extends TDataValue>(
    object: DataObject
) => TTransformedObject<DataObject, HandledValue, TransformedValue>;
