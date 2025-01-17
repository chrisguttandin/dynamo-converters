import { IDataObject } from '../interfaces';
import { TConvertDataObjectFactory, TDerivedItemObject } from '../types';

export const createConvertDataObject: TConvertDataObjectFactory =
    (convertDataValue) =>
    <T extends IDataObject>(object: T): TDerivedItemObject<T> => {
        const entries = Object.entries(object)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => [key, convertDataValue(value)]);

        return Object.fromEntries(entries);
    };
