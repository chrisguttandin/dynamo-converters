import { TArrayType } from './array-type';
import { TDataArray } from './data-array';
import { TDataValue } from './data-value';
import { TTransformedValue } from './transformed-value';

export type TTransformedArray<DataArray extends TDataArray, HandledValue, TransformedValue extends TDataValue> = TTransformedValue<
    TArrayType<DataArray>,
    HandledValue,
    TransformedValue
>[];
