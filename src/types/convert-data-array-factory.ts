import type { createConvertDataValue } from '../factories/convert-data-value';
import { TConvertDataArrayFunction } from './convert-data-array-function';

export type TConvertDataArrayFactory = (convertDataValue: ReturnType<typeof createConvertDataValue>) => TConvertDataArrayFunction;
