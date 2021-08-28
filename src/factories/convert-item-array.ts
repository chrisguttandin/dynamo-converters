import { TArrayType, TConvertItemArrayFactory, TDerivedDataArray, TDerivedDataValue, TItemValue } from '../types';

export const createConvertItemArray: TConvertItemArrayFactory =
    (convertItemValue) =>
    <T extends TItemValue[]>(array: T): TDerivedDataArray<T> =>
        array.map((value) => <TDerivedDataValue<TArrayType<T>>>convertItemValue(value));
