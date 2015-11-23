'use strict';

var data,
    delta,
    item;

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

global.fixtures.data = data;
global.fixtures.delta = delta;
global.fixtures.item = item;
