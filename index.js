console.log('🤖🍓');

var motorHat = require('motor-hat')({
    address: 0x70,
    dcs: ['M1', 'M2', 'M3', 'M4'],
}).init();


async function main() {
    motorHat.dcs[0].setSpeedSync(50);
    motorHat.dcs[0].runSync('fwd');
    // Set DC motor speed to 50%
    // reverse the dc motor to back direction
    motorHat.dcs[0].runSync('back');
    // stop the dc motor
    motorHat.dcs[0].stopSync();
    console.log('🤖');
}

main();

var stdin = process.stdin;

// without this, we would only get streams once enter is pressed
stdin.setRawMode(true);

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();

// i don't want binary, do you?
stdin.setEncoding('utf8');

// on any data into stdin
stdin.on('data', function (key) {
    // ctrl-c ( end of text )
    if (key === '\u0003') {
        process.exit();
    }
    // write the key to stdout all normal like
    process.stdout.write(key);
});
