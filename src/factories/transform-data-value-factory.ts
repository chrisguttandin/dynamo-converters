import type { isDataArray as isDataArrayFunction } from '../guards/data-array';
import type { isDataObject as isDataObjectFunction } from '../guards/data-object';
import { TDataValue, TTransformSingleValueFunction, TTransformedValue } from '../types';
import type { createTransformDataArray as createTransformDataArrayFunction } from './transform-data-array';
import type { createTransformDataObject as createTransformDataObjectFunction } from './transform-data-object';

export const createTransformDataValueFactory =
    (
        createTransformDataArray: typeof createTransformDataArrayFunction,
        createTransformDataObject: typeof createTransformDataObjectFunction,
        isDataArray: typeof isDataArrayFunction,
        isDataObject: typeof isDataObjectFunction
    ) =>
    <HandledValue, TransformedValue extends TDataValue>(
        transformSingleValue: TTransformSingleValueFunction<HandledValue, TransformedValue>
    ): (<Value>(value: Value) => TTransformedValue<Value, HandledValue, TransformedValue>) => {
        const transformDataValue = <Value>(value: Value): TTransformedValue<Value, HandledValue, TransformedValue> => {
            const transformedValue = transformSingleValue<Value>(value);

            return <TTransformedValue<Value, HandledValue, TransformedValue>>(
                (isDataArray(transformedValue)
                    ? transformDataArray(transformedValue)
                    : isDataObject(transformedValue)
                      ? transformDataObject(transformedValue)
                      : transformedValue)
            );
        };
        const transformDataArray = createTransformDataArray(transformDataValue);
        const transformDataObject = createTransformDataObject(transformDataValue);

        return transformDataValue;
    };
