import { TDataValue } from '../types';

export const createIsTuple =
    (addSymbol: symbol) =>
    (value: TDataValue | [symbol, number]): value is [symbol, number] =>
        Array.isArray(value) && value[0] === addSymbol;
