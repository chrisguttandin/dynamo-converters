import { createConvertDataArray } from './factories/convert-data-array';
import { createConvertDataObject } from './factories/convert-data-object';
import { createConvertDataValue } from './factories/convert-data-value';
import { now } from './functions/now';
import { isBooleanItemValue } from './guards/boolean-item-value';
import { isDataArray } from './guards/data-array';
import { isDataObject } from './guards/data-object';
import { isListItemValue } from './guards/list-item-value';
import { isMapItemValue } from './guards/map-item-value';
import { isNullItemValue } from './guards/null-item-value';
import { isNumberItemValue } from './guards/number-item-value';
import { isStringItemValue } from './guards/string-item-value';
import { IExpression, IItemObject } from './interfaces';
import { RESERVED_WORDS } from './reserved-words';
import { TArrayType, TDataValue, TDerivedDataArray, TDerivedDataObject, TDerivedDataValue, TDerivedItemObject, TItemValue } from './types';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

const convertDataValue = createConvertDataValue(createConvertDataArray, createConvertDataObject, isDataArray, isDataObject);
const convertDataObject = createConvertDataObject(convertDataValue);
const isReservedWord = (property: string): boolean => RESERVED_WORDS.some((reservedWord) => reservedWord === property.toUpperCase());
const illegalWordRegex = /[\s|.]/g;
const isIllegalWord = (property: string): boolean => illegalWordRegex.test(property) || isReservedWord(property);
const createPropertyName = (property: string, expressionAttributeNames: { [key: string]: string }): string => {
    let propertyName = property.replace(illegalWordRegex, '');
    let expressionAttributeName = `#${propertyName}`;

    while (expressionAttributeName in expressionAttributeNames) {
        propertyName = `${propertyName}_`;
        expressionAttributeName = `#${propertyName}`;
    }

    expressionAttributeNames[`#${propertyName}`] = property;

    return propertyName;
};
const formRemoveStatement = (property: string, expressionAttributeNames: { [key: string]: string }): string => {
    if (isIllegalWord(property)) {
        const propertyName = createPropertyName(property, expressionAttributeNames);

        return `#${propertyName}`;
    }

    return property;
};
const formSetStatement = <T extends TDataValue>(
    property: string,
    value: T,
    expressionAttributeNames: { [key: string]: string },
    expressionAttributeValues: IItemObject & { ':modified': { N: string } }
): string => {
    if (isIllegalWord(property)) {
        const propertyName = createPropertyName(property, expressionAttributeNames);

        expressionAttributeValues[`:${propertyName}`] = convertDataValue(value);

        return `#${propertyName} = :${propertyName}`;
    }

    expressionAttributeValues[`:${property}`] = convertDataValue(value);

    return `${property} = :${property}`;
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
    return array.map((value) => <TDerivedDataValue<TArrayType<T>>>convertItemValue(value));
};
const convertItemObject = <T extends IItemObject>(object: T): TDerivedDataObject<T> => {
    const entries = Object.entries(object)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, convertItemValue(value)]);

    return Object.fromEntries(entries);
};

export const dataToItem = <T extends object>(data: T): TDerivedItemObject<T & { created: number; modified: number }> => {
    const created = now();

    return convertDataObject({ ...data, created, modified: created });
};

export const deltaToExpression = <T extends object>(delta: T): IExpression => {
    const expressionAttributeNames: { [key: string]: string } = {};
    const modified = now();
    const expressionAttributeValues: IItemObject & { ':modified': { N: string } } = { ':modified': { N: modified.toString() } };
    const removeStatements: string[] = [];
    const setStatements: string[] = ['modified = :modified'];
    const updateExpressions: string[] = [];

    for (const [property, value] of Object.entries(delta)) {
        if (value === undefined) {
            removeStatements.push(formRemoveStatement(property, expressionAttributeNames));
        } else if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string' || typeof value === 'object') {
            setStatements.push(formSetStatement(property, value, expressionAttributeNames, expressionAttributeValues));
        }
    }

    if (removeStatements.length > 0) {
        updateExpressions.push(`REMOVE ${removeStatements.join(', ')}`);
    }
    if (setStatements.length > 0) {
        updateExpressions.push(`SET ${setStatements.join(', ')}`);
    }

    return {
        expressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
        expressionAttributeValues,
        updateExpression: updateExpressions.join(' ')
    };
};

export const itemToData = <T extends IItemObject>(item: T): TDerivedDataObject<T> => convertItemObject(item);
