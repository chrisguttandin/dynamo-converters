import { TArrayType, TDataArray, TDataValue, TTransformDataArrayFactory, TTransformedArray, TTransformedValue } from '../types';

export const createTransformDataArray: TTransformDataArrayFactory =
    (transformDataValue) =>
    <DataArray extends TDataArray, HandledValue, TransformedValue extends TDataValue>(
        array: DataArray
    ): TTransformedArray<DataArray, HandledValue, TransformedValue> =>
        array.map((value) => <TTransformedValue<TArrayType<DataArray>, HandledValue, TransformedValue>>transformDataValue(value));
