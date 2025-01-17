import { TDataValue } from './data-value';
import { TTransformDataObjectFunction } from './transform-data-object-function';
import { TTransformedValue } from './transformed-value';

export type TTransformDataObjectFactory = <HandledValue, TransformedValue extends TDataValue>(
    transformDataValue: <Value>(value: Value) => TTransformedValue<Value, HandledValue, TransformedValue>
) => TTransformDataObjectFunction;
