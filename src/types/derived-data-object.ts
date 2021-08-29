import { IItemObject } from '../interfaces';
import { TDerivedDataValue } from './derived-data-value';

export type TDerivedDataObject<T> = T extends IItemObject ? { [U in keyof T]: TDerivedDataValue<T[U]> } : never;
