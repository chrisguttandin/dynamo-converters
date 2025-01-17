import { IDataObject } from '../interfaces';
import { TDataValue } from './data-value';
import { TTransformedValue } from './transformed-value';

export type TTransformedObject<
    DataObject extends IDataObject,
    HandledValue,
    TransformedValue extends TDataValue
> = keyof DataObject extends string
    ? {
          [Property in keyof DataObject]: TTransformedValue<DataObject[Property], HandledValue, TransformedValue>;
      }
    : never;
