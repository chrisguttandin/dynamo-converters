import { TTransformSingleValueFunction } from '../types';

export const withDateSerialization: TTransformSingleValueFunction<Date, string> = <Value>(value: Value) =>
    <Value extends Date ? string : Value>(value instanceof Date ? value.toJSON() : value);
