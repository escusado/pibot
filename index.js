console.log('🤖🍓');

var motorHat = require('motor-hat')({
    address: 0x70,
    dcs: ['M1', 'M2', 'M3', 'M4'],
}).init();


async function main() {
    motorHat.dcs[0].setSpeedSync(50);
    motorHat.dcs[0].runSync('fwd');
    await sleep(1000);
    // Set DC motor speed to 50%
    // reverse the dc motor to back direction
    motorHat.dcs[0].runSync('back');
    // stop the dc motor
    motorHat.dcs[0].stopSync();
    console.log('🤖');
}

main();