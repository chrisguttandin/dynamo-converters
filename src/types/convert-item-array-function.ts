import { TDerivedDataArray } from './derived-data-array';
import { TItemValue } from './item-value';

export type TConvertItemArrayFunction = <T extends TItemValue[]>(array: T) => TDerivedDataArray<T>;
