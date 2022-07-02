const JstestDualsense = require("./components/jstest-dualsense");
const Rover = require("./components/rover");

class Pibot {
  setup() {
    console.log("🥧🤖: [Pibot booting...]");
    this.controller = new JstestDualsense();
    this.controller.setup();

    this.controller.bind("joylx", (data) => console.log("joylx ", data));
    this.controller.bind("joyly", (data) => console.log("joyly ", data));
    this.controller.bind("joyrx", (data) => console.log("joyrx ", data));
    this.controller.bind("joyry", (data) => console.log("joyry ", data));
    this.controller.bind("dpadx", (data) => console.log("dpadx ", data));
    this.controller.bind("dpady", (data) => console.log("dpady ", data));

    this.controller.bind("circle", (data) => console.log(">>>>>>> ⭕️", data));
    this.controller.bind("cross", (data) => console.log(">>>>>>> ❌", data));
    this.controller.bind("triangle", (data) => console.log(">>>>>>> 📐", data));
    this.controller.bind("square", (data) => console.log(">>>>>>> 🟪", data));

    this.controller.bind("l1", (data) => console.log("l1", data));
    this.controller.bind("r1", (data) => console.log("r1", data));
    this.controller.bind("l2", (data) => console.log("l2", data));
    this.controller.bind("r2", (data) => console.log("r2", data));
    this.controller.bind("l3", (data) => console.log("l3", data));
    this.controller.bind("r3", (data) => console.log("r3", data));

    this.controller.bind("share", (data) => console.log("share", data));
    this.controller.bind("hamburger", (data) => console.log("hamburer", data));
    this.controller.bind("ps", (data) => console.log("ps", data));

    this.rover = new Rover();
    console.log("🥧🤖: [what is my purpose?]");
  }
}

module.exports = Pibot;
