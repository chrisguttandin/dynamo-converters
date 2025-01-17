import { IDataObject } from '../interfaces';
import { TDataValue, TTransformDataObjectFactory, TTransformedObject } from '../types';

export const createTransformDataObject: TTransformDataObjectFactory =
    (transformDataValue) =>
    <DataObject extends IDataObject, HandledValue, TransformedValue extends TDataValue>(
        object: DataObject
    ): TTransformedObject<DataObject, HandledValue, TransformedValue> => {
        const entries = Object.entries(object)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => [key, transformDataValue(value)]);

        return Object.fromEntries(entries);
    };
