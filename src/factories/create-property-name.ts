export const createCreatePropertyName =
    (regex: RegExp) =>
    (property: string, expressionAttributeNames: { [key: string]: string }): string => {
        let propertyName = property.replace(regex, '');
        let expressionAttributeName = `#${propertyName}`;

        while (expressionAttributeName in expressionAttributeNames) {
            propertyName = `${propertyName}_`;
            expressionAttributeName = `#${propertyName}`;
        }

        expressionAttributeNames[`#${propertyName}`] = property;

        return propertyName;
    };
