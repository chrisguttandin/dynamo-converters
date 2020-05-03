import { IBooleanItemValue } from '../interfaces';
import { TItemValue } from '../types';

export const isBooleanItemValue = (value: TItemValue): value is IBooleanItemValue => 'BOOL' in value;
