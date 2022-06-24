console.log('🤖🍓');

var motorHat = require('motor-hat')({ steppers: [{ W1: 'M1', W2: 'M2' }] }).init();
motorHat.steppers[0].setSpeed({ pps: 100 });
motorHat.steppers[0].step('back', 2048, (err, result) => {
    if (err) return console.log('Oh no, there was an error', err);
    console.log(`Did ${result.steps} steps ${result.dir} in ${result.duration / 1000} seconds. I had to retry ${result.retried} steps because you set me up quicker than your poor board can handle.`);
});


console.log(';🍕');