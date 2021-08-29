import type { createCreatePropertyName } from './create-property-name';
import type { createIsIllegalWord } from './is-illegal-word';

export const createFormRemoveStatement =
    (createPropertyName: ReturnType<typeof createCreatePropertyName>, isIllegalWord: ReturnType<typeof createIsIllegalWord>) =>
    (property: string, expressionAttributeNames: { [key: string]: string }): string => {
        if (isIllegalWord(property)) {
            const propertyName = createPropertyName(property, expressionAttributeNames);

            return `#${propertyName}`;
        }

        return property;
    };
