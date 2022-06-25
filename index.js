console.log('🤖🍓');

var motorHat = require('motor-hat')({
    address: 0x70,
    dcs: ['M1', 'M2', 'M3', 'M4'],
}).init();

var i2c = require('i2c-bus'),
    i2cBus = i2c.openSync(1),
    oled = require('oled-i2c-bus');

var opts = {
    width: 128,
    height: 32,
    address: 0x3c
};

var oled = new oled(i2cBus, opts);
oled.clearDisplay();

var font = require('oled-font-5x7');

// sets cursor to x = 1, y = 1
oled.setCursor(1, 1);
oled.writeString(font, 1, 'Cats and dogs are really cool animals, you know.', 1, true);


process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (key) {
    if (key === '\u0003') {
        process.exit();
    }

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
    console.log('🔴');
    motorHat.dcs[0].stopSync();
    motorHat.dcs[1].stopSync();
    motorHat.dcs[2].stopSync();
    motorHat.dcs[3].stopSync();
}

function forward() {
    console.log('🥦');
    motorHat.dcs[0].setSpeedSync(50);
    motorHat.dcs[1].setSpeedSync(50);
    motorHat.dcs[2].setSpeedSync(50);
    motorHat.dcs[3].setSpeedSync(50);
    motorHat.dcs[0].runSync('fwd');
    motorHat.dcs[1].runSync('fwd');
    motorHat.dcs[2].runSync('fwd');
    motorHat.dcs[3].runSync('fwd');
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