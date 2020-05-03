import { IStringItemValue } from '../interfaces';
import { TItemValue } from '../types';

export const isStringItemValue = (value: TItemValue): value is IStringItemValue => 'S' in value;
