const JstestDualsense = require("./components/jstest-dualsense");
const Rover = require("./components/rover");

class Pibot {
  setup() {
    console.log("🥧🤖: [Pibot booting...]");
    this.controller = new JstestDualsense();
    this.controller.setup();
    this.controller.bind("joylx", (data) => console.log(">>>>>>> 🎮", data));
    this.controller.bind("circle", (data) => console.log(">>>>>>> ⭕️", data));
    this.controller.bind("cross", (data) => console.log(">>>>>>> ❌", data));
    this.controller.bind("triangle", (data) => console.log(">>>>>>> 📐", data));
    this.controller.bind("square", (data) => console.log(">>>>>>> 🟪", data));

    this.rover = new Rover();
    console.log("🥧🤖: [what is my purpose?]");
  }
}

module.exports = Pibot;
