import type { isBooleanItemValue as isBooleanItemValueFunction } from '../guards/boolean-item-value';
import type { isListItemValue as isListItemValueFunction } from '../guards/list-item-value';
import type { isMapItemValue as isMapItemValueFunction } from '../guards/map-item-value';
import type { isNullItemValue as isNullItemValueFunction } from '../guards/null-item-value';
import type { isNumberItemValue as isNumberItemValueFunction } from '../guards/number-item-value';
import type { isStringItemValue as isStringItemValueFunction } from '../guards/string-item-value';
import { TConvertItemArrayFactory, TConvertItemObjectFactory, TItemValue } from '../types';

export const createConvertItemValue = (
    createConvertItemArray: TConvertItemArrayFactory,
    createConvertItemObject: TConvertItemObjectFactory,
    isBooleanItemValue: typeof isBooleanItemValueFunction,
    isListItemValue: typeof isListItemValueFunction,
    isMapItemValue: typeof isMapItemValueFunction,
    isNullItemValue: typeof isNullItemValueFunction,
    isNumberItemValue: typeof isNumberItemValueFunction,
    isStringItemValue: typeof isStringItemValueFunction
) => {
    const convertItemValue = (value: TItemValue) => {
        if (isBooleanItemValue(value)) {
            return value.BOOL;
        }

        if (isListItemValue(value)) {
            return convertItemArray(value.L);
        }

        if (isMapItemValue(value)) {
            return convertItemObject(value.M);
        }

        if (isNumberItemValue(value)) {
            if (/\./.test(value.N)) {
                return parseFloat(value.N);
            }

            return parseInt(value.N, 10);
        }

        if (isNullItemValue(value)) {
            return null;
        }

        if (isStringItemValue(value)) {
            return value.S;
        }

        throw new Error('Unsupported data type');
    };
    const convertItemArray = createConvertItemArray(convertItemValue);
    const convertItemObject = createConvertItemObject(convertItemValue);

    return convertItemValue;
};
