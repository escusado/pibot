const JstestDualsense = require("./jstest-dualsense");

class Pibot {
  setup() {
    console.log(">>>>>>> 🍕");
    this.controller = new JstestDualsense();
  }
}

module.exports = Pibot;
