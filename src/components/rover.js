const OledScreen = require("./oled-screen");
var motorHat = require("motor-hat")({
  address: 0x70,
  dcs: ["M1", "M2", "M3", "M4"],
}).init();

class Rover {
  stop() {
    console.log("🔴");
    motorHat.dcs[0].stopSync();
    motorHat.dcs[1].stopSync();
    motorHat.dcs[2].stopSync();
    motorHat.dcs[3].stopSync();
  }

  forward(speed) {
    console.log("⬆️");
    OledScreen.log("Forward");
    motorHat.dcs[0].setSpeedSync(speed);
    motorHat.dcs[1].setSpeedSync(speed);
    motorHat.dcs[2].setSpeedSync(speed);
    motorHat.dcs[3].setSpeedSync(speed);
    motorHat.dcs[0].runSync("fwd");
    motorHat.dcs[1].runSync("back");
    motorHat.dcs[2].runSync("back");
    motorHat.dcs[3].runSync("fwd");
  }

  reverse(speed) {
    console.log("⬇️");
    OledScreen.log("Reverse");
    motorHat.dcs[0].setSpeedSync(speed);
    motorHat.dcs[1].setSpeedSync(speed);
    motorHat.dcs[2].setSpeedSync(speed);
    motorHat.dcs[3].setSpeedSync(speed);
    motorHat.dcs[0].runSync("back");
    motorHat.dcs[1].runSync("fwd");
    motorHat.dcs[2].runSync("fwd");
    motorHat.dcs[3].runSync("back");
  }

  left(speed) {
    console.log("⬅️");
    OledScreen.log("Left");
    motorHat.dcs[0].setSpeedSync(speed);
    motorHat.dcs[1].setSpeedSync(speed);
    motorHat.dcs[2].setSpeedSync(speed);
    motorHat.dcs[3].setSpeedSync(speed);
    motorHat.dcs[0].runSync("back");
    motorHat.dcs[1].runSync("fwd");
    motorHat.dcs[2].runSync("back");
    motorHat.dcs[3].runSync("fwd");
  }

  right(speed) {
    console.log("➡️");
    OledScreen.log("Right");
    motorHat.dcs[0].setSpeedSync(speed);
    motorHat.dcs[1].setSpeedSync(speed);
    motorHat.dcs[2].setSpeedSync(speed);
    motorHat.dcs[3].setSpeedSync(speed);
    motorHat.dcs[0].runSync("fwd");
    motorHat.dcs[1].runSync("back");
    motorHat.dcs[2].runSync("fwd");
    motorHat.dcs[3].runSync("back");
  }
}

module.exports = Rover;
