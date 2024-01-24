const JstestDualsense = require("./components/jstest-dualsense");
const OledScreen = require("./components/oled-screen");

const Rover = require("./components/rover");
const Arm = require("./components/arm");

class Pibot {
  inputResetTimeout = null;
  setup() {
    console.log("🥧🤖: [Pibot booting...]");
    OledScreen.log("booting...");
    this.controller = new JstestDualsense();
    this.rover = new Rover();
    this.controller.setup();

    this.controller.bind("joylx", (data) => OledScreen.log(`joylx ${data}`));
    // this.controller.bind("joyly", (data) => console.log("joyly ", data));
    // this.controller.bind("joyrx", (data) => console.log("joyrx ", data));
    // this.controller.bind("joyry", (data) => console.log("joyry ", data));
    this.controller.bind("dpadx", (data) => {
      clearTimeout(this.inputResetTimeout);
      this.inputResetTimeout = setTimeout(() => {
        if (data > 0) {
          this.rover.right(10);
        } else {
          this.rover.left(10);
        }
        setTimeout(() => this.rover.stop(), 500);
      }, 100);
      OledScreen.log(`dpadx: ${data}`);
    });

    this.controller.bind("dpady", (data) => {
      clearTimeout(this.inputResetTimeout);
      this.inputResetTimeout = setTimeout(() => {
        if (data > 0) {
          this.rover.forward(10);
        } else {
          this.rover.reverse(10);
        }
        setTimeout(() => this.rover.stop(), 500);
      }, 100);
      OledScreen.log(`dpady: ${data}`);
    });

    // this.controller.bind("circle", (data) => console.log(">>>>>>> ⭕️", data));
    // this.controller.bind("cross", (data) => console.log(">>>>>>> ❌", data));
    // this.controller.bind("triangle", (data) => console.log(">>>>>>> 📐", data));
    // this.controller.bind("square", (data) => console.log(">>>>>>> 🟪", data));

    // this.controller.bind("l1", (data) => console.log("l1", data));
    // this.controller.bind("r1", (data) => console.log("r1", data));
    // this.controller.bind("l2", (data) => console.log("l2", data));
    // this.controller.bind("r2", (data) => console.log("r2", data));
    // this.controller.bind("l3", (data) => console.log("l3", data));
    // this.controller.bind("r3", (data) => console.log("r3", data));

    // this.controller.bind("share", (data) => console.log("share", data));
    // this.controller.bind("hamburger", (data) => console.log("hamburer", data));
    // this.controller.bind("ps", (data) => console.log("ps", data));

    // this.rover.forward();

    // this.arm = new Arm();
    // setTimeout(() => this.rover.stop(), 100);

    // for (let i = 0; i < 50; i++) {
    //   setTimeout(() => {
    //     this.rover.forward(i);
    //   }, 1000 * i);
    // }
    // this.arm.tilt(50);
    console.log("🥧🤖: [what is my purpose??????]");
    OledScreen.log("Hello >[o_o]>");
  }
}

module.exports = Pibot;
