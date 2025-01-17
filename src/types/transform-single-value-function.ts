import { TDataValue } from './data-value';

export type TTransformSingleValueFunction<HandledValue, TransformedValue extends TDataValue> = <Value>(
    value: Value
) => Value extends HandledValue ? TransformedValue : Value;
