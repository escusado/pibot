const PiServo = require("pi-servo");
const servoPan = new PiServo(27);
const servoTilt = new PiServo(17);

class Arm {
  constructor() {
    console.log(">arm");
  }

  tilt(degree) {
    // pass the GPIO number
    servoTilt.open().then(function () {
      servoTilt.setDegree(degree); // 0 - 180
    });
  }
}

module.exports = Arm;
