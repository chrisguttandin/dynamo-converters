import { TArrayType } from './array-type';
import { TDataArray } from './data-array';
import { TItemValue } from './item-value';

export type TItemArray<T extends TDataArray> = TItemValue<TArrayType<T>>[];
