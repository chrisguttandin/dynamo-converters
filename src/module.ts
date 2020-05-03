import { now } from './functions/now';
import { isBooleanItemValue } from './guards/boolean-item-value';
import { isDataArray } from './guards/data-array';
import { isDataObject } from './guards/data-object';
import { isListItemValue } from './guards/list-item-value';
import { isMapItemValue } from './guards/map-item-value';
import { isNullItemValue } from './guards/null-item-value';
import { isNumberItemValue } from './guards/number-item-value';
import { isStringItemValue } from './guards/string-item-value';
import { IDataObject, IExpression, IItemObject } from './interfaces';
import { RESERVED_WORDS } from './reserved-words';
import {
    TArrayType,
    TDataArray,
    TDataValue,
    TDerivedDataArray,
    TDerivedDataObject,
    TDerivedDataValue,
    TDerivedItemArray,
    TDerivedItemObject,
    TDerivedItemValue,
    TItemValue
} from './types';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

const convertDataValue = <T extends TDataValue>(value: T): TDerivedItemValue<T> => {
    if (value === null) {
        return <TDerivedItemValue<T>> {
            NULL: true
        };
    }

    if (typeof value === 'boolean') {
        return <TDerivedItemValue<T>> {
            BOOL: value
        };
    }

    if (typeof value === 'number') {
        return <TDerivedItemValue<T>> {
            N: value.toString()
        };
    }

    if (typeof value === 'string') {
        return <TDerivedItemValue<T>> {
            S: value
        };
    }

    if (isDataArray(value)) {
        return <TDerivedItemValue<T>> {
            L: convertDataArray(value)
        };
    }

    if (isDataObject(value)) {
        return <TDerivedItemValue<T>> {
            M: convertDataObject(value)
        };
    }

    throw new Error('Unsupported data type');
};
const convertDataArray = <T extends TDataArray>(array: T): TDerivedItemArray<T> => {
    return array.map((value) => <TDerivedItemValue<TArrayType<T>>> convertDataValue(value));
};
const convertDataObject = <T extends IDataObject>(object: T): TDerivedItemObject<T> => {
    const entries = Object
        .entries(object)
        .filter(([ , value ]) => value !== undefined)
        .map(([ key, value ]) => [ key, convertDataValue(value) ]);

    return Object.fromEntries(entries);
};

const isReservedWord = (property: string): boolean => RESERVED_WORDS.some((reservedWord) => reservedWord === property.toUpperCase());
const formStatement = (property: string, expressionAttributeNames: { [ key: string ]: string }): string => {
    if (isReservedWord(property)) {
        expressionAttributeNames[`#${ property }`] = property;

        return `#${ property } = :${ property }`;
    }

    return `${ property } = :${ property }`;
};

const convertItemValue = (value: TItemValue) => {
    if (isBooleanItemValue(value)) {
        return value.BOOL;
    }

    if (isListItemValue(value)) {
        return convertItemArray(value.L);
    }

    if (isMapItemValue(value)) {
        return convertItemObject(value.M);
    }

    if (isNumberItemValue(value)) {
        if (/\./.test(value.N)) {
            return parseFloat(value.N);
        }

        return parseInt(value.N, 10);
    }

    if (isNullItemValue(value)) {
        return null;
    }

    if (isStringItemValue(value)) {
        return value.S;
    }

    throw new Error('Unsupported data type');
};
const convertItemArray = <T extends TItemValue[]>(array: T): TDerivedDataArray<T> => {
    return array.map((value) => <TDerivedDataValue<TArrayType<T>>> convertItemValue(value));
};
const convertItemObject = <T extends IItemObject>(object: T): TDerivedDataObject<T> => {
    const entries = Object
        .entries(object)
        .filter(([ , value ]) => value !== undefined)
        .map(([ key, value ]) => [ key, convertItemValue(value) ]);

    return Object.fromEntries(entries);
};

export const dataToItem = <T extends IDataObject>(data: T): TDerivedItemObject<T & { created: number; modified: number }> => {
    const created = now();

    return convertDataObject({ ...data, created, modified: created });
};

export const deltaToExpression = <T extends IDataObject>(delta: T): IExpression => {
    const expressionAttributeNames: { [ key: string ]: string } = { };
    const expressionAttributeValues: IItemObject = { };
    const modified = now();
    const removeStatements: string[] = [];
    const setStatements: string[] = [];
    const updateExpressions: string[] = [];

    setStatements.push('modified = :modified');
    expressionAttributeValues[':modified'] = {
        N: modified.toString()
    };

    for (const property of Object.keys(delta)) {
        const value = delta[property];

        if (value === undefined) {
            if (isReservedWord(property)) {
                expressionAttributeNames[`#${ property }`] = property;
                removeStatements.push(`#${ property }`);
            } else {
                removeStatements.push(property);
            }
        } else if (typeof value === 'boolean' ||
                typeof value === 'number' ||
                typeof value === 'string' ||
                typeof value === 'object') {
            setStatements.push(formStatement(property, expressionAttributeNames));
            expressionAttributeValues[`:${ property }`] = convertDataValue(value);
        }
    }

    if (removeStatements.length > 0) {
        updateExpressions.push(`REMOVE ${ removeStatements.join(', ') }`);
    }
    if (setStatements.length > 0) {
        updateExpressions.push(`SET ${ setStatements.join(', ') }`);
    }

    return {
        expressionAttributeNames: (Object.keys(expressionAttributeNames).length > 0) ? expressionAttributeNames : undefined,
        expressionAttributeValues,
        updateExpression: updateExpressions.join(' ')
    };

};

export const itemToData = <T extends IItemObject>(item: T): TDerivedDataObject<T> => convertItemObject(item);
