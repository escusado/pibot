const font = require("oled-font-5x7");
const i2c = require("i2c-bus");
const i2cBus = i2c.openSync(1);
const oled = require("oled-i2c-bus");

const oledScreen = new oled(i2cBus, {
  width: 128,
  height: 32,
  address: 0x3c,
});

oledScreen.clearDisplay();
oledScreen.turnOnDisplay();
oledScreen.setCursor(1, 1);

// module.exports = OledScreen;
module.exports = {
  log: (message) => oledScreen.writeString(font, 1, message, 1, true),
};
