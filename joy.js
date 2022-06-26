const { spawn } = require('child_process');

const child = spawn('jstest', ['/dev/input/js0']);


child.stdout.on('data', (chunk) => {
    // data from standard output is here as buffers
    console.log('>>>🍕', chunk);
});

child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
