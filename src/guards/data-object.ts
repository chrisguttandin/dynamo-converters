import { IDataObject } from '../interfaces';
import { TDataValue } from '../types';

export const isDataObject = (value: TDataValue): value is IDataObject => typeof value === 'object';
