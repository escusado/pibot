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

oledScreen.clearDisplay();
oledScreen.turnOnDisplay();
oledScreen.setCursor(1, 1);

try {
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

  oledScreen.writeString(font, 1, `[-c°w°]-c Pibot v1`, 1, true);

  setTimeout(() => {
    oledScreen.setCursor(1, 1);
    oledScreen.clearDisplay();
    oledScreen.writeString(
      font,
      1,
      `${ssid?.[0]}: ${results.get("wlan0")[0]}`,
      1,
      true
    );
  }, 2000);
} catch (e) {
  oledScreen.writeString(font, 1, `Error: ${(e as Error).message}`, 1, true);
}
