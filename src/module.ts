import { RESERVED_WORDS } from './reserved-words';

const convert = (value: any): any => {
    if (value === null) {
        return {
            NULL: true
        };
    }

    if (typeof value === 'boolean') {
        return {
            BOOL: value
        };
    }

    if (typeof value === 'number') {
        return {
            N: value.toString()
        };
    }

    if (typeof value === 'string') {
        return {
            S: value
        };
    }

    if (Array.isArray(value)) {
        return {
            L: value.map(convert)
        };
    }

    if (typeof value === 'object') {
        const map: any = { };

        for (const key of Object.keys(value)) {
            if (value[key] !== undefined) {
                map[key] = convert(value[key]);
            }
        }

        return {
            M: map
        };
    }

    throw new Error('Unsupported data type');
};
const isReservedWord = (property: any) => RESERVED_WORDS.some((reservedWord) => reservedWord === property.toUpperCase());
const formStatement = (property: any, expressionAttributeNames: any) => {
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

export const dataToItem = (data: any): any => {
    const item: any = { };
    const now = Date.now();

    for (const property of Object.keys(data)) {
        if (data[property] !== undefined) {
            item[property] = convert(data[property]);
        }
    }

    item.created = {
        N: now.toString()
    };
    item.modified = {
        N: now.toString()
    };

    return item;
};

export const deltaToExpression = (delta: any): any => {
    const expressionAttributeNames: any = { };
    const expressionAttributeValues: any = { };
    const removeStatements = [];
    const setStatements = [];
    const updateExpressions = [];

    setStatements.push('modified = :modified');
    expressionAttributeValues[':modified'] = {
        N: Date
            .now()
            .toString()
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
            expressionAttributeValues[`:${ property }`] = convert(value);
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
