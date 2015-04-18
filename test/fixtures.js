'use strict';

var attributes,
    data,
    delta,
    item;

attributes = {
    ears: {
        'Action': 'PUT',
        'Value': {
            'N': '3'
        }
    },
    eyes: {
        'Action': 'DELETE'
    },
    legs: {
        'Action': 'ADD',
        'Value': {
            'SS': [
                'left',
                'right'
            ]
        }
    },
    name: {
        'Action': 'PUT',
        'Value': {
            'S': 'atomic rabbit'
        }
    },
    numbers: {
        'Action': 'ADD',
        'Value': {
            'NN': [
                '1',
                '2'
            ]
        }
    }
};

data = {
    ears: 2,
    map: {
        something: 1,
        else: 'text'
    },
    name: 'rabbit'
};

delta = {
    ears: 3,
    eyes: undefined,
    legs: [
        'left',
        'right'
    ],
    name: 'atomic rabbit',
    numbers: [
        1,
        2
    ]
};

item = {
    ears: {
        N: '2'
    },
    name: {
        S: 'rabbit'
    },
    map: {
        M: {
            something: {
                N: '1'
            },
            else: {
                S: 'text'
            }
        }
    }
};

if (global.fixtures === undefined) {
    global.fixtures = {};
}

global.fixtures.attributes = attributes;
global.fixtures.data = data;
global.fixtures.delta = delta;
global.fixtures.item = item;
