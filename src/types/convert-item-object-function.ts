import { IItemObject } from '../interfaces';
import { TDerivedDataObject } from './derived-data-object';

export type TConvertItemObjectFunction = <T extends IItemObject>(object: T) => TDerivedDataObject<T>;
