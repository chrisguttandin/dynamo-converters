import { INumberItemValue } from '../interfaces';
import { TItemValue } from '../types';

export const isNumberItemValue = (value: TItemValue): value is INumberItemValue => 'N' in value;
