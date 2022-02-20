import { IItemObject } from '../interfaces';
import { TDataValue } from '../types';
import type { createConvertDataValue } from './convert-data-value';
import type { createCreatePropertyName } from './create-property-name';
import type { createIsIllegalWord } from './is-illegal-word';

export const createFormSetStatement =
    (
        convertDataValue: ReturnType<typeof createConvertDataValue>,
        createPropertyName: ReturnType<typeof createCreatePropertyName>,
        isIllegalWord: ReturnType<typeof createIsIllegalWord>
    ) =>
    <T extends TDataValue>(
        property: string,
        value: T,
        expressionAttributeNames: { [key: string]: string },
        expressionAttributeValues: IItemObject
    ): string => {
        if (isIllegalWord(property)) {
            const propertyName = createPropertyName(property, expressionAttributeNames);

            expressionAttributeValues[`:${propertyName}`] = convertDataValue(value);

            return `#${propertyName} = :${propertyName}`;
        }

        expressionAttributeValues[`:${property}`] = convertDataValue(value);

        return `${property} = :${property}`;
    };
