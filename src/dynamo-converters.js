'use strict';

var reservedWords = require('./reserved-words.json'),
    util = require('util');

function convert (value) {
    var key,
        map;

    if (typeof value === 'number') {
        return {
            N: value.toString()
        };
    } else if (typeof value === 'string') {
        return {
            S: value
        };
    } else if (util.isArray(value)) {
        return {
            L: value.map(convert)
        };
    } else if (typeof value === 'object') {
        map = {};

        for (key in value) {
            map[key] = convert(value[key]);
        }

        return {
            M: map
        };
    } else {
        throw new Error('Unsupported data type');
    }
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

module.exports = {

    dataToItem: function (data) {
        var item = {},
            now = Date.now(),
            property;

        for (property in data) {
            item[property] = convert(data[property]);
        }

        item.created = {
            N: now.toString()
        };
        item.modified = {
            N: now.toString()
        };

        return item;
    },

    deltaToAttributes: function (delta) {
        var attribute,
            attributes = {},
            property,
            value;

        delta.modified = Date.now();

        for (property in delta) {
            attribute = {};
            value = delta[property];

            if (value === undefined) {
                attribute.Action = 'DELETE';
            } else if (typeof value === 'number' ||
                    typeof value === 'string' ||
                    typeof value === 'object') {
                attribute.Action = 'PUT';
                attribute.Value = convert(value);
            }

            attributes[property] = attribute;
        }

        return attributes;
    },

    deltaToExpression: function (delta) {
        var expressionAttributeNames = {},
            expressionAttributeValues = {},
            property,
            removeStatements = [],
            setStatements = [],
            updateExpressions = [],
            value;

        setStatements.push('modified = :modified');
        expressionAttributeValues[':modified'] = {
            N: Date.now().toString()
        };

        for (property in delta) {
            value = delta[property];

            if (value === undefined) {
                if (isReservedWord(property)) {
                    expressionAttributeNames['#' + property] = property;
                    removeStatements.push('#' + property);
                } else {
                    removeStatements.push(property);
                }
            } else if (typeof value === 'number' ||
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
            expressionAttributeValues: expressionAttributeValues,
            updateExpression: updateExpressions.join(' ')
        };
    },

    itemToData: function (item) {
        var data = {},
            property;

        function parse (value) {
            var key,
                map;

            if (value.L !== undefined) {
                return value.L.map(parse);
            } else if (value.M !== undefined) {
                map = {};

                for (key in value.M) {
                    map[key] = parse(value.M[key]);
                }

                return map;
            } else if (value.N !== undefined) {
                if (value.N.match(/\./)) {
                    return parseFloat(value.N);
                } else {
                    return parseInt(value.N, 10);
                }
            } else if (value.S !== undefined) {
                return value.S;
            }
        }

        for (property in item) {
            if (item[property] !== undefined) {
                data[property] = parse(item[property]);
            }
        }

        return data;
    }

};
