import { now } from './functions/now';
import { isDataArray } from './guards/data-array';
import { isDataObject } from './guards/data-object';
import { IDataObject } from './interfaces';
import { RESERVED_WORDS } from './reserved-words';
import { TArrayType, TDataArray, TDataValue, TItemArray, TItemObject, TItemValue } from './types';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

const convertDataValue = <T extends TDataValue>(value: T): TItemValue<T> => {
    if (value === null) {
        return <TItemValue<T>> {
            NULL: true
        };
    }

    if (typeof value === 'boolean') {
        return <TItemValue<T>> {
            BOOL: value
        };
    }

    if (typeof value === 'number') {
        return <TItemValue<T>> {
            N: value.toString()
        };
    }

    if (typeof value === 'string') {
        return <TItemValue<T>> {
            S: value
        };
    }

    if (isDataArray(value)) {
        return <TItemValue<T>> {
            L: convertDataArray(value)
        };
    }

    if (isDataObject(value)) {
        return <TItemValue<T>> {
            M: convertDataObject(value)
        };
    }

    throw new Error('Unsupported data type');
};
const convertDataArray = <T extends TDataArray>(array: T): TItemArray<T> => {
    return array.map((value) => <TItemValue<TArrayType<T>>> convertDataValue(value));
};
const convertDataObject = <T extends IDataObject>(object: T): TItemObject<T> => {
    const entries = Object
        .entries(object)
        .filter(([ , value ]) => value !== undefined)
        .map(([ key, value ]) => [ key, convertDataValue(value) ]);

    return Object.fromEntries(entries);
};

const isReservedWord = (property: any) => RESERVED_WORDS.some((reservedWord) => reservedWord === property.toUpperCase());
const formStatement = (property: string, expressionAttributeNames: { [ key: string ]: string }): string => {
    if (isReservedWord(property)) {
        expressionAttributeNames[`#${ property }`] = property;

        return `#${ property } = :${ property }`;
    }

    return `${ property } = :${ property }`;
};
const parse = (value: any) => {
    if (value.BOOL !== undefined) {
        return value.BOOL;
    }

    if (value.L !== undefined) {
        return value.L.map(parse);
    }

    if (value.M !== undefined) {
        const map: any = { };

        for (const key of Object.keys(value.M)) {
            map[key] = parse(value.M[key]);
        }

        return map;
    }

    if (value.N !== undefined) {
        if (value.N.match(/\./)) {
            return parseFloat(value.N);
        }

        return parseInt(value.N, 10);
    }

    if (value.NULL === true) {
        return null;
    }

    if (value.S !== undefined) {
        return value.S;
    }

    throw new Error('Unsupported data type');
};

export const dataToItem = <T extends IDataObject>(data: T): TItemObject<T & { created: number; modified: number }> => {
    const created = parseInt(now(), 10);

    return convertDataObject({ ...data, created, modified: created });
};

export const deltaToExpression = (delta: any): any => {
    const created = now();
    const expressionAttributeNames: { [ key: string ]: string } = { };
    const expressionAttributeValues: any = { };
    const removeStatements = [];
    const setStatements = [];
    const updateExpressions = [];

    setStatements.push('modified = :modified');
    expressionAttributeValues[':modified'] = {
        N: created
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

export const itemToData = (item: any): any => {
    const data: any = { };

    for (const property of Object.keys(item)) {
        if (item[property] !== undefined) {
            data[property] = parse(item[property]);
        }
    }

    return data;
};
