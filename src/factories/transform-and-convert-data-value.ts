import { IDataObject } from '../interfaces';
import { TDataValue, TTransformSingleValueFunction } from '../types';
import type { createConvertDataObject } from './convert-data-object';
import type { createTransformDataObject as createTransformDataObjectFunction } from './transform-data-object';
import type { createTransformDataValueFactory } from './transform-data-value-factory';

export const createTransformAndConvertDataObjectFactory =
    (
        convertDataObject: ReturnType<typeof createConvertDataObject>,
        createTransformDataValue: ReturnType<typeof createTransformDataValueFactory>,
        createTransformDataObject: typeof createTransformDataObjectFunction
    ) =>
    <HandledValue, TransformedValue extends TDataValue>(
        transformSingleValue: TTransformSingleValueFunction<HandledValue, TransformedValue>
    ) => {
        const transformDataObject = createTransformDataObject(createTransformDataValue(transformSingleValue));

        return <DataObject extends IDataObject>(object: DataObject) =>
            convertDataObject(transformDataObject<DataObject, HandledValue, TransformedValue>(object));
    };
