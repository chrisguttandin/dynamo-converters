import { IListItemValue } from '../interfaces';
import { TItemValue } from '../types';

export const isListItemValue = (value: TItemValue): value is IListItemValue => 'L' in value;
