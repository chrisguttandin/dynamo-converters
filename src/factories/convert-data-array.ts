import { TArrayType, TConvertDataArrayFactory, TDataArray, TDerivedItemArray, TDerivedItemValue } from '../types';

export const createConvertDataArray: TConvertDataArrayFactory =
    (convertDataValue) =>
    <T extends TDataArray>(array: T): TDerivedItemArray<T> =>
        array.map((value) => <TDerivedItemValue<TArrayType<T>>>convertDataValue(value));
