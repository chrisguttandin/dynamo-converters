import type { createConvertDataValue } from '../factories/convert-data-value';
import { TConvertDataObjectFunction } from './convert-data-object-function';

export type TConvertDataObjectFactory = (convertDataValue: ReturnType<typeof createConvertDataValue>) => TConvertDataObjectFunction;
