import { IBooleanItemValue, IListItemValue, IMapItemValue, INullItemValue, INumberItemValue, IStringItemValue } from '../interfaces';

export type TItemValue = Partial<IBooleanItemValue | IListItemValue | IMapItemValue | INullItemValue | INumberItemValue | IStringItemValue>;
