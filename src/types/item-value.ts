import { IDataObject } from '../interfaces';
import { TDataArray } from './data-array';
import { TDataValue } from './data-value';
import { TItemArray } from './item-array';
import { TItemObject } from './item-object';

export type TItemValue<T extends TDataValue> = T extends boolean
    ? { BOOL: T }
    : T extends null
        ? { NULL: boolean }
        : T extends number
            ? { N: string }
            : T extends string
                ? { S: T }
                : T extends TDataArray
                    ? { L: TItemArray<T> }
                    : T extends IDataObject
                        ? { M: TItemObject<T> }
                        : never;
