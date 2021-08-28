import type { createConvertItemValue } from '../factories/convert-item-value';
import { TConvertItemArrayFunction } from './convert-item-array-function';

export type TConvertItemArrayFactory = (convertItemValue: ReturnType<typeof createConvertItemValue>) => TConvertItemArrayFunction;
