import { TConvertDataObjectFactory } from '../types';

export const createConvertDataObject: TConvertDataObjectFactory = (convertDataValue) => (object) => {
    const entries = Object.entries(object)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, convertDataValue(value)]);

    return Object.fromEntries(entries);
};
