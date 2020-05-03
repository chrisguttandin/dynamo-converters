import { TDataArray } from './data-array';
import { TDerivedItemValue } from './derived-item-value';

export type TDerivedItemObject<T> = keyof T extends string
    ? { [ U in keyof T ]: T[U] extends boolean | null | number | object | string | TDataArray ? TDerivedItemValue<T[U]> : never }
    : never;
