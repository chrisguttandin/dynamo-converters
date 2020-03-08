const reservedWords = require('./reserved-words.json');

function convert (value) {
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
        const map = {};

        for (const key in value) {
            if (value[key] !== undefined) {
                map[key] = convert(value[key]);
            }
        }

        return {
            M: map
        };
    }

    throw new Error('Unsupported data type');
}

function isReservedWord (property) {
    return reservedWords.some(function (reservedWord) {
        return reservedWord === property.toUpperCase();
    });
}

function formStatement (property, expressionAttributeNames) {
    if (isReservedWord(property)) {
        expressionAttributeNames['#' + property] = property;

        return '#' + property + ' = :' + property;
    }

    return property + ' = :' + property;
}

function parse (value) {
    if (value.BOOL !== undefined) {
        return value.BOOL;
    }

    if (value.L !== undefined) {
        return value.L.map(parse);
    }

    if (value.M !== undefined) {
        const map = {};

        for (const key in value.M) {
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
}

module.exports = {

    dataToItem: function (data) { // eslint-disable-line object-shorthand
        const item = {};
        const now = Date.now();

        for (const property in data) {
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
    },

    deltaToExpression: function (delta) { // eslint-disable-line object-shorthand
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};
        const removeStatements = [];
        const setStatements = [];
        const updateExpressions = [];

        setStatements.push('modified = :modified');
        expressionAttributeValues[':modified'] = {
            N: Date.now().toString()
        };

        for (const property in delta) {
            const value = delta[property];

            if (value === undefined) {
                if (isReservedWord(property)) {
                    expressionAttributeNames['#' + property] = property;
                    removeStatements.push('#' + property);
                } else {
                    removeStatements.push(property);
                }
            } else if (typeof value === 'boolean' ||
                    typeof value === 'number' ||
                    typeof value === 'string' ||
                    typeof value === 'object') {
                setStatements.push(formStatement(property, expressionAttributeNames));
                expressionAttributeValues[':' + property] = convert(value);
            }
        }

        if (removeStatements.length > 0) {
            updateExpressions.push('REMOVE ' + removeStatements.join(', '));
        }
        if (setStatements.length > 0) {
            updateExpressions.push('SET ' + setStatements.join(', '));
        }

        return {
            expressionAttributeNames: (Object.keys(expressionAttributeNames).length > 0) ? expressionAttributeNames : undefined,
            expressionAttributeValues: expressionAttributeValues, // eslint-disable-line object-shorthand
            updateExpression: updateExpressions.join(' ')
        };
    },

    itemToData: function (item) { // eslint-disable-line object-shorthand
        const data = {};

        for (const property in item) {
            if (item[property] !== undefined) {
                data[property] = parse(item[property]);
            }
        }

        return data;
    }

};
