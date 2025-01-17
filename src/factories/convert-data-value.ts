import type { isDataArray as isDataArrayFunction } from '../guards/data-array';
import type { isDataObject as isDataObjectFunction } from '../guards/data-object';
import { TDerivedItemValue } from '../types';
import type { createConvertDataArray as createConvertDataArrayFunction } from './convert-data-array';
import type { createConvertDataObject as createConvertDataObjectFunction } from './convert-data-object';

export const createConvertDataValue = (
    createConvertDataArray: typeof createConvertDataArrayFunction,
    createConvertDataObject: typeof createConvertDataObjectFunction,
    isDataArray: typeof isDataArrayFunction,
    isDataObject: typeof isDataObjectFunction
) => {
    const convertDataValue = <T>(value: T): TDerivedItemValue<T> => {
        if (value === null) {
            return <TDerivedItemValue<T>>{
                NULL: true
            };
        }

        if (typeof value === 'boolean') {
            return <TDerivedItemValue<T>>{
                BOOL: value
            };
        }

        if (typeof value === 'number') {
            return <TDerivedItemValue<T>>{
                N: value.toString()
            };
        }

        if (typeof value === 'string') {
            return <TDerivedItemValue<T>>{
                S: value
            };
        }

        if (isDataArray(value)) {
            return <TDerivedItemValue<T>>{
                L: convertDataArray(value)
            };
        }

        if (isDataObject(value)) {
            return <TDerivedItemValue<T>>{
                M: convertDataObject(value)
            };
        }

        throw new Error('Unsupported data type');
    };
    const convertDataArray = createConvertDataArray(convertDataValue);
    const convertDataObject = createConvertDataObject(convertDataValue);

    return convertDataValue;
};
