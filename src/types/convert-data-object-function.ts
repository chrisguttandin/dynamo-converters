import { TDerivedItemObject } from './derived-item-object';

export type TConvertDataObjectFunction = <T>(object: T) => TDerivedItemObject<T>;
