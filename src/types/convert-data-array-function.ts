import { TDataArray } from './data-array';
import { TDerivedItemArray } from './derived-item-array';

export type TConvertDataArrayFunction = <T extends TDataArray>(array: T) => TDerivedItemArray<T>;
