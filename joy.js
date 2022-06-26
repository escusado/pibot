const { spawn } = require('child_process');

const child = spawn('jstest', ['/dev/input/js0']);


child.stdout.on('data', (data) => {
    // get jstest-gtk output clean whitespace
    var jsTestOutput = String(data).replace(/^\s+|\s+$|\s+(?=\s)/g, "");


    if (jsTestOutput.indexOf('Axes') === 0) {
        const axesString = jsTestOutput.match(/(?<=Axes: ).*(?= Buttons)/);
        const axesParsed = axesString[0].replace(/: /g, ":").split(' ');
        console.table('axes✚', axesParsed);

        const buttonsString = jsTestOutput.match(/(?<=Buttons: ).*$/);
        const buttonsParsed = buttonsString[0].replace(/: /g, ":").split(' ');
        console.table('buttons🔴', buttonsParsed);
    }
});

child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
