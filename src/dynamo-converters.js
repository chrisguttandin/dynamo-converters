'use strict';

var util = require('util');

module.exports = {

    dataToItem: function (data) {
        var item = {},
            now = Date.now(),
            property;

        function convert(value) {
            var key,
                map;

            if (typeof value === 'number') {
                return {
                    N: value.toString()
                };
            } else if (typeof value === 'object') {
                map = {};

                for (key in value) {
                    map[key] = convert(value[key]);
                }

                return {
                    M: map
                };
            } else if (typeof value === 'string') {
                return {
                    S: value
                };
            }
        }

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

        function convert(value) {
            var key,
                map;

            if (value.M !== undefined) {
                map = {};

                for (key in value.M) {
                    map[key] = convert(value.M[key]);
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
            } else if (value.SS !== undefined) {
                return value.SS;
            }
        }

        for (property in item) {
            data[property] = convert(item[property]);
        }

        return data;
    }

};
