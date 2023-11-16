const Pibot = require("./src/pibot");
// kickstart app
console.log("😴 Waking Pibot up...");

global.pibot = new Pibot();
pibot.setup();
// pibot.setup();
