import { TConvertItemObjectFactory } from '../types';

export const createConvertItemObject: TConvertItemObjectFactory = (convertItemValue) => (object) => {
    const entries = Object.entries(object)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, convertItemValue(value)]);

    return Object.fromEntries(entries);
};
