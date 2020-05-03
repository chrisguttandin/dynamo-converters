import { TArrayType } from './array-type';
import { TDerivedDataValue } from './derived-data-value';
import { TItemValue } from './item-value';

export type TDerivedDataArray<T extends TItemValue[]> = TDerivedDataValue<TArrayType<T>>[];
