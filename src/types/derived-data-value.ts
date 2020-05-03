import { IBooleanItemValue, IListItemValue, IMapItemValue, INullItemValue, INumberItemValue, IStringItemValue } from '../interfaces';
import { TDerivedDataArray } from './derived-data-array';
import { TDerivedDataObject } from './derived-data-object';

export type TDerivedDataValue<T> = T extends IBooleanItemValue
    ? boolean
    : T extends IListItemValue
        ? TDerivedDataArray<T['L']>
        : T extends IMapItemValue
            ? TDerivedDataObject<T['M']>
            : T extends INullItemValue
                ? null
                : T extends INumberItemValue
                    ? number
                    : T extends IStringItemValue
                        ? string
                        : never;
