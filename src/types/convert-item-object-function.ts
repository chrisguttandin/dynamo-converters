import { TDerivedDataObject } from './derived-data-object';

export type TConvertItemObjectFunction = <T>(object: T) => TDerivedDataObject<T>;
