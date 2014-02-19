'use strict';

var util = require('util');

module.exports = {

    dataToItem: function (data) {
        var item = {},
            now = Date.now(),
            property,
            value;

        for (property in data) {
            value = data[property];

            if (typeof value === 'number') {
                item[property] = {
                    N: value.toString()
                };
            } else if (typeof value === 'string') {
                item[property] = {
                    S: value
                };
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

    deltaToAttributes: function (delta) {
        var attribute,
            attributes = {},
            property,
            value;

        delta.modified = Date.now();

        for (property in delta) {
            attribute = {};
            value = delta[property];

            if (typeof value === 'number') {
                attribute.Action = 'PUT';
                attribute.Value = {
                    N: value.toString()
                };
            } else if (typeof value === 'string') {
                attribute.Action = 'PUT';
                attribute.Value = {
                    S: value
                };
            } else if (util.isArray(value)) {
                attribute.Action = 'ADD';
                if (typeof value[0] === 'number') {
                    attribute.Value = {
                        NN: value.join('x').split('x') // equivalent to calling toString() on each item
                    };
                } else {
                    attribute.Value = {
                        SS: value
                    };
                }
            } else if (value === undefined) {
                attribute.Action = 'DELETE';
            }

            attributes[property] = attribute;
        }

        return attributes;
    },

    itemToData: function (item) {
        var data = {},
            property,
            value;

        for (property in item) {
            value = item[property];

            if (value.N !== undefined) {
                if (value.N.match(/\./)) {
                    data[property] = parseFloat(value.N);
                } else {
                    data[property] = parseInt(value.N, 10);
                }
            } else if (value.S !== undefined) {
                data[property] = value.S;
            } else if (value.SS !== undefined) {
                data[property] = value.SS;
            }
        }

        return data;
    }

};
