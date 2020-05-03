import { IDataObject, INullItemValue, INumberItemValue } from '../interfaces';
import { TDataArray } from './data-array';
import { TDataValue } from './data-value';
import { TDerivedItemArray } from './derived-item-array';
import { TDerivedItemObject } from './derived-item-object';

export type TDerivedItemValue<T extends TDataValue> = T extends boolean
    ? { BOOL: T }
    : T extends null
        ? INullItemValue
        : T extends number
            ? INumberItemValue
            : T extends string
                ? { S: T }
                : T extends TDataArray
                    ? { L: TDerivedItemArray<T> }
                    : T extends IDataObject
                        ? { M: TDerivedItemObject<T> }
                        : never;
