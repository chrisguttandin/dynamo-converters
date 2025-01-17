import { IDataObject } from '../interfaces';

export const isDataObject = (value: unknown): value is IDataObject => value !== null && typeof value === 'object';
