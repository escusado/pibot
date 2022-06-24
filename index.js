console.log('🤖🍓');

var motorHat = require('motor-hat')().init();
motorHat.dcs[0].runSync('fwd');
// Set DC motor speed to 50%
motorHat.dcs[0].setSpeedSync(50);
// reverse the dc motor to back direction
motorHat.dcs[0].runSync('back');
// stop the dc motor
motorHat.dcs[0].stopSync();

console.log(';🍕');