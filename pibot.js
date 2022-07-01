const JstestDualsense = require("./jstest-dualsense");
const Rover = require("./rover");

class Pibot {
  setup() {
    console.log("🥧🤖: [Pibot booting...]");
    this.controller = new JstestDualsense();
    this.controller.setup();
    this.controller.bind("axes", (data) => console.log(">>>>>>> 🎮", data));
    this.controller.bind("buttons", (data) => console.log(">>>>>>> ⭕️", data));

    this.rover = new Rover();
    console.log("🥧🤖: [what is my purpose?]");
  }
}

module.exports = Pibot;
