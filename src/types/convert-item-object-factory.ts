import type { createConvertItemValue } from '../factories/convert-item-value';
import { TConvertItemObjectFunction } from './convert-item-object-function';

export type TConvertItemObjectFactory = (convertItemValue: ReturnType<typeof createConvertItemValue>) => TConvertItemObjectFunction;
