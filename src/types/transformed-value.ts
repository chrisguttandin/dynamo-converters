import { IDataObject } from '../interfaces';
import { TDataArray } from './data-array';
import { TDataValue } from './data-value';
import { TTransformedArray } from './transformed-array';
import { TTransformedObject } from './transformed-object';

export type TTransformedValue<Value, HandledValue, TransformedValue extends TDataValue> = Value extends HandledValue
    ? TransformedValue extends TDataArray
        ? TTransformedArray<TransformedValue, HandledValue, TransformedValue>
        : TransformedValue extends IDataObject
          ? TTransformedObject<TransformedValue, HandledValue, TransformedValue>
          : TransformedValue
    : Value extends TDataArray
      ? TTransformedArray<Value, HandledValue, TransformedValue>
      : Value extends IDataObject
        ? TTransformedObject<Value, HandledValue, TransformedValue>
        : Value;
