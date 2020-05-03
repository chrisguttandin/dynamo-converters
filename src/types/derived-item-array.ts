import { TArrayType } from './array-type';
import { TDataArray } from './data-array';
import { TDerivedItemValue } from './derived-item-value';

export type TDerivedItemArray<T extends TDataArray> = TDerivedItemValue<TArrayType<T>>[];
