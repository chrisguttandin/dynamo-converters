import { IDataObject } from '../interfaces';
import { TDerivedItemObject } from './derived-item-object';

export type TConvertDataObjectFunction = <T extends IDataObject>(object: T) => TDerivedItemObject<T>;
