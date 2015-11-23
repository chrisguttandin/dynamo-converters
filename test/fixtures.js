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
        'Action': 'PUT',
        'Value': {
            'L': [
                {
                    'Value': {
                        'S': 'left'
                    }
                }, {
                    'Value': {
                        'S': 'right'
                    }
                }
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
        'Action': 'PUT',
        'Value': {
            'L': [
                {
                    'Value': {
                        'N': '1'
                    }
                }, {
                    'Value': {
                        'N': '2'
                    }
                }
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
    name: 'rabbit',
    properties: [
        'cute',
        'speedy'
    ]
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
    },
    properties: {
        L: [
            {
                S: 'cute'
            }, {
                S: 'speedy'
            }
        ]
    }
};

if (global.fixtures === undefined) {
    global.fixtures = {};
}

global.fixtures.attributes = attributes;
global.fixtures.data = data;
global.fixtures.delta = delta;
global.fixtures.item = item;
