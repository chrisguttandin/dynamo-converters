import { TDataArray, TDataValue } from '../types';

export const isDataArray = (value: TDataValue): value is TDataArray => Array.isArray(value);
