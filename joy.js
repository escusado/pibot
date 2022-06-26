const { spawn } = require('child_process');

const child = spawn('jstest', ['/dev/input/js0']);


child.stdout.on('data', (data) => {
    // data from standard output is here as buffers

    var s = String(data);
    // buffer = buffer.concat(s.split("\n"));

    console.log('>>>🔴🍕', s);
});

child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
