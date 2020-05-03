import { IItemObject } from '../interfaces';
import { TDerivedDataValue } from './derived-data-value';

export type TDerivedDataObject<T extends IItemObject> = { [ U in keyof T ]: TDerivedDataValue<T[U]> };
