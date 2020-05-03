import { IDataObject } from '../interfaces';
import { TDerivedItemValue } from './derived-item-value';

export type TDerivedItemObject<T extends IDataObject> = { [ U in keyof T ]: TDerivedItemValue<T[U]> };
