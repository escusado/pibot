const { spawn } = require('child_process');

const child = spawn('jstest', ['/dev/input/js0']);


child.stdout.on('data', (data) => {
    // get jstest-gtk output clean whitespace
    var jsTestOutput = String(data).replace(/^\s+|\s+$|\s+(?=\s)/g, "");


    if (jsTestOutput.indexOf('Axes') === 0) {
        console.log('>>>🥦', jsTestOutput);

        const axesString = jsTestOutput.match(/(?<=Axes: ).*(?= Buttons)/);
        console.log('axes✚', axesString[0]);

        const buttonsString = jsTestOutput.match(/(?<=Buttons: ).*$/);
        console.log('buttons🔴', buttonsString[0]);
    }
});

child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
