console.log('🤖🍓');

var motorHat = require('motor-hat')({
    address: 0x70,
    dcs: ['M1', 'M2', 'M3', 'M4'],
}).init();

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (key) {

    if (key === '\u0003') {
        process.exit();
    }

    console.log('🚀', key);

    switch (key) {
        case 's': stop(); break;
        case 'f': forward(); break;
        case 'r': reverse(); break;
        case 'l': left(); break;
        case 'r': right(); break;
        default: break;
    }
});

function stop() {
    motorHat.dcs.stopSync();
}

function forward() {
    motorHat.dcs.setSpeedSync(50);
    motorHat.dcs.runSync('fwd');
};

function reverse() {
    motorHat.dcs.setSpeedSync(50);
    motorHat.dcs.runSync('back');
};

function left() {
    motorHat.dcs.setSpeedSync(50);
    motorHat.dcs.runSync('fwd');
};

function right() {
    motorHat.dcs.setSpeedSync(50);
    motorHat.dcs.runSync('fwd');
};