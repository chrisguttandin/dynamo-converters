const { dataToItem, deltaToExpression, itemToData } = require('../build/node/module');

function getArgs(cb) {
    var cmd = process.argv.slice(2, 3)[0];
    var data = process.argv.slice(3, 4)[0];
    if (process.stdin.isTTY) {
        return cb(cmd, data);
    } else {
        var data = '';
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        // Gather all data
        process.stdin.on('data', function (d) {
            data += d;
        });

        // Save when finished
        process.stdin.on('end', function () {
            return cb(cmd, data);
        });
    }
}

var CMD_D2I_P = 'd2i';
var CMD_D2I = 'data-to-item';
var CMD_D2E_P = 'd2e';
var CMD_D2E = 'data-to-expression';
var CMD_I2E_P = 'i2d';
var CMD_I2E = 'item-to-data';
var CMDS = [
    [CMD_D2E, CMD_D2E_P],
    [CMD_D2I, CMD_D2I_P],
    [CMD_I2E, CMD_I2E_P]
];

function run(cmd, data) {
    var fn;
    switch (cmd) {
        case CMD_D2I:
        case CMD_D2I_P:
            fn = dataToItem;
            break;
        case CMD_D2E:
        case CMD_D2E_P:
            fn = deltaToExpression;
            break;
        case CMD_I2E:
        case CMD_I2E_P:
            fn = itemToData;
            break;
        default:
            return console.error('Err: Could not find command, "' + cmd + '" ' + JSON.stringify(CMDS));
    }

    // No data
    if (!data || data === '') {
        return console.error('No data provided');
    }

    // Invalid json
    try {
        var json = JSON.parse(data);
    } catch (e) {
        return console.error('Data is not valid json');
    }

    var out = fn(json);
    console.log(JSON.stringify(out));
}

return getArgs(run);
