import { IDataObject } from '../interfaces';
import { TItemValue } from './item-value';

export type TItemObject<T extends IDataObject> = { [ U in keyof T ]: TItemValue<T[U]> };
