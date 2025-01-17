import { TDataArray } from '../types';

export const isDataArray = (value: unknown): value is TDataArray => Array.isArray(value);
