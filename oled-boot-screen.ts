const { networkInterfaces } = require("os");
const font = require("oled-font-5x7");
const i2c = require("i2c-bus");
const i2cBus = i2c.openSync(1);
const oled = require("oled-i2c-bus");

const oledScreen = new oled(i2cBus, {
  width: 128,
  height: 32,
  address: 0x3c,
});

const nets = networkInterfaces();
const results = new Map();

for (const name of Object.keys(nets)) {
  const netName = nets[name];
  if (netName) {
    for (const net of netName) {
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
      if (net.family === familyV4Value && !net.internal) {
        if (!results.has(name)) {
          results.set(name, []);
        }
        results.set(name, [...results.get(name), net.address]);
      }
    }
  }
}

const ssid = String(require("child_process").execSync("iwgetid")).match(
  /(?<=").*(?=")/
);

oledScreen.clearDisplay();
oledScreen.setCursor(1, 1);
// oledScreen.writeString(
//   font,
//   1,
// `[-c°w°]-c\n>${ssid?.[0].slice(0, 19)}\n>${
//   results.get("wlan0")[0]
// }\nwhat is my purpose?`,
//   1,
//   true
// );

oledScreen.writeString(font, 1, `${results.get("wlan0")[0]}`, 1, true);
