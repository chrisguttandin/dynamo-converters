import { createConvertDataArray } from './factories/convert-data-array';
import { createConvertDataObject } from './factories/convert-data-object';
import { createConvertDataValue } from './factories/convert-data-value';
import { createConvertItemArray } from './factories/convert-item-array';
import { createConvertItemObject } from './factories/convert-item-object';
import { createConvertItemValue } from './factories/convert-item-value';
import { createIsReservedWord } from './factories/is-reserved-word';
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
import { TDataValue, TDerivedItemObject } from './types';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

const convertDataValue = createConvertDataValue(createConvertDataArray, createConvertDataObject, isDataArray, isDataObject);
const convertDataObject = createConvertDataObject(convertDataValue);
const isReservedWord = createIsReservedWord(RESERVED_WORDS);
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

export const itemToData = createConvertItemObject(
    createConvertItemValue(
        createConvertItemArray,
        createConvertItemObject,
        isBooleanItemValue,
        isListItemValue,
        isMapItemValue,
        isNullItemValue,
        isNumberItemValue,
        isStringItemValue
    )
);
