import { TDataValue } from './data-value';
import { TTransformDataArrayFunction } from './transform-data-array-function';
import { TTransformedValue } from './transformed-value';

export type TTransformDataArrayFactory = <HandledValue, TransformedValue extends TDataValue>(
    transformDataValue: <Value>(value: Value) => TTransformedValue<Value, HandledValue, TransformedValue>
) => TTransformDataArrayFunction;
