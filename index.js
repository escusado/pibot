const OledScreen = require("./src/components/oled-screen");
const Pibot = require("./src/pibot");
// kickstart app
console.log("😴 Waking Pibot up...");
OledScreen.log("yo!");

global.pibot = new Pibot();
pibot.setup();
// pibot.setup();
