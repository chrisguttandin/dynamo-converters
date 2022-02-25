import { TDataValue } from './data-value';
import { TDerivedItemValue } from './derived-item-value';

export type TDerivedItemObject<T> = keyof T extends string
    ? T[keyof T] extends TDataValue
        ? { [U in keyof T]: TDerivedItemValue<T[U]> }
        : never
    : never;
