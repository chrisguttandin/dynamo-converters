import { IMapItemValue } from '../interfaces';
import { TItemValue } from '../types';

export const isMapItemValue = (value: TItemValue): value is IMapItemValue => 'M' in value;
