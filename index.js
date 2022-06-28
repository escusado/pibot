console.log('🤖🍓');
const { networkInterfaces } = require('os');
const { select } = require("@ngneat/elf");

var font = require('oled-font-5x7');
var i2c = require('i2c-bus'),
    i2cBus = i2c.openSync(1),
    oled = require('oled-i2c-bus');

var motorHat = require('motor-hat')({
    address: 0x70,
    dcs: ['M1', 'M2', 'M3', 'M4'],
}).init();

var oled = new oled(i2cBus, {
    width: 128,
    height: 32,
    address: 0x3c
});
oled.clearDisplay();
oled.setCursor(1, 1);

const nets = networkInterfaces();
const results = {};

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

console.log('🌍', results);
var ssid = String(require('child_process').execSync('iwgetid')).match(/(?<=").*(?=")/);
console.log('📶', ssid[0]);
oled.clearDisplay();
oled.writeString(font, 1, `${ssid}\n${results.wlan0[0]}`, 1, true);

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
    console.log('⬆️');
    motorHat.dcs[0].setSpeedSync(25);
    motorHat.dcs[1].setSpeedSync(25);
    motorHat.dcs[2].setSpeedSync(25);
    motorHat.dcs[3].setSpeedSync(25);
    motorHat.dcs[0].runSync('back');
    motorHat.dcs[1].runSync('fwd');
    motorHat.dcs[2].runSync('fwd');
    motorHat.dcs[3].runSync('back');
};

function reverse() {
    console.log('⬇️');
    motorHat.dcs[0].setSpeedSync(25);
    motorHat.dcs[1].setSpeedSync(25);
    motorHat.dcs[2].setSpeedSync(25);
    motorHat.dcs[3].setSpeedSync(25);
    motorHat.dcs[0].runSync('fwd');
    motorHat.dcs[1].runSync('back');
    motorHat.dcs[2].runSync('back');
    motorHat.dcs[3].runSync('fwd');
};


let count = 0;
function left() {
    oled.clearDisplay();
    oled.writeString(font, 1, `el paso del robot ${count}`, 1, true);
    count++;
};


function right() {

};


const { dualsenseStore } = require('./joy');
dualsenseStore.pipe(select((state) => state.axes))
    .subscribe((data) => {

        if (data && data.dpad) {

            if (data.dpad.y > 0) {
                forward();
                return;
            }

            if (data.dpad.y < 0) {
                reverse();
                return;
            }
        }

        stop();
    });