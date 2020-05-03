import { INullItemValue } from '../interfaces';
import { TItemValue } from '../types';

export const isNullItemValue = (value: TItemValue): value is INullItemValue => 'NULL' in value;
