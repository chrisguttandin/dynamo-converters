import { TDataArray } from './data-array';
import { TDataValue } from './data-value';
import { TTransformedArray } from './transformed-array';

export type TTransformDataArrayFunction = <DataArray extends TDataArray, HandledValue, TransformedValue extends TDataValue>(
    array: DataArray
) => TTransformedArray<DataArray, HandledValue, TransformedValue>;
