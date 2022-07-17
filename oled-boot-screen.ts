import { networkInterfaces } from "os";

var font = require("oled-font-5x7");
var i2c = require("i2c-bus"),
  i2cBus = i2c.openSync(1),
  oled = require("oled-i2c-bus");

var oled = new oled(i2cBus, {
  width: 128,
  height: 32,
  address: 0x3c,
});
oled.clearDisplay();
oled.setCursor(1, 1);

const nets = networkInterfaces();
const results = new Map();

for (const name of Object.keys(nets)) {
  const netName = nets[name];
  if (netName) {
    for (const net of netName) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
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

console.log("🌍", results);
var ssid = String(require("child_process").execSync("iwgetid")).match(
  /(?<=").*(?=")/
);
console.log("📶", ssid?.[0]);
oled.clearDisplay();
oled.writeString(
  font,
  1,
  ` [ -c°|||°]-c \n
  Pibot connected to:\n
  ${ssid}\n
  ${results.get("wlan0")[0]}`,
  1,
  true
);
