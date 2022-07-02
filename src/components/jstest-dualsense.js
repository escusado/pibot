/**
 * @module JstestDualsense
 * @description Used to read the output of jstest-gtk commandline tool, this
 * needs to be installed (read README setup (TBD)) and connected using bluetooth
 */

const os = require("os");
const { spawn } = require("child_process");
const { createStore, select } = require("@ngneat/elf");

class JstestDualsense {
  constructor() {
    console.log("🕹 JstestDualsense");

    this.jstestOutputStore = createStore({ withProps: { output: "" } });
    this.store = createStore({
      withProps: {
        axes: {
          joyl: { x: 0, y: 0 },
          joyr: { x: 0, y: 0 },
          dpad: { x: 0, y: 0 },
        },
        buttons: {
          cross: 0,
          circle: 0,
          triangle: 0,
          square: 0,
          l1: 0,
          r1: 0,
          l2: 0,
          r2: 0,
          share: 0,
          hamburger: 0,
          ps: 0,
          joyl: 0,
          joyr: 0,
        },
      },
    });
  }

  setup() {
    // react to program output
    this.jstestOutputStore
      .pipe(select((state) => state.output))
      .subscribe(this.handleJstestOuput.bind(this));

    // catch button press or keydown events (note it will NOT detect keyup)
    spawn("jstest", ["/dev/input/js0"]).stdout.on(
      "data",
      (output) =>
        output[0] === 13 && // wait for output that starts with "A"
        this.jstestOutputStore.update(() => ({
          output: String(output).replace(/^\s+|\s+$|\s+(?=\s)/g, ""),
        }))
    );
  }

  handleJstestOuput(jsTestOutput) {
    //parse axes
    const axesString = jsTestOutput.match(/(?<=Axes: ).*(?= Buttons)/);
    const axesSliced = axesString[0].replace(/: /g, ":").split(" ");
    const newAxes = {
      joyl: {
        x: parseInt(axesSliced[0].split(":")[1]),
        y: parseInt(axesSliced[1].split(":")[1]) * -1,
      },
      joyr: {
        x: parseInt(axesSliced[3].split(":")[1]),
        y: parseInt(axesSliced[4].split(":")[1]) * -1,
      },
      dpad: {
        x: parseInt(axesSliced[6].split(":")[1]),
        y: parseInt(axesSliced[7].split(":")[1]) * -1,
      },
    };

    // //parse buttons
    const buttonsString = jsTestOutput.match(/(?<=Buttons: ).*$/);
    const buttonsSliced = buttonsString[0].replace(/: /g, ":").split(" ");
    const newButtons = {
      cross: buttonsSliced[0].indexOf("on") > 0,
      circle: buttonsSliced[1].indexOf("on") > 0,
      triangle: buttonsSliced[2].indexOf("on") > 0,
      square: buttonsSliced[3].indexOf("on") > 0,
      l1: buttonsSliced[4].indexOf("on") > 0,
      r1: buttonsSliced[5].indexOf("on") > 0,
      l2: buttonsSliced[6].indexOf("on") > 0,
      r2: buttonsSliced[7].indexOf("on") > 0,
      share: buttonsSliced[8].indexOf("on") > 0,
      hamburger: buttonsSliced[9].indexOf("on") > 0,
      ps: buttonsSliced[10].indexOf("on") > 0,
      joyl: buttonsSliced[11].indexOf("on") > 0,
      joyr: buttonsSliced[12].indexOf("on") > 0,
    };

    // //update store api
    this.store.update(() => ({
      axes: newAxes,
      buttons: newButtons,
    }));
  }

  bind(eventName, cb) {
    if (eventName === "axes" || eventName === "buttons") {
      this.store.pipe(select((state) => state[eventName])).subscribe(cb);
      return;
    }
    console.log("Event not supported: ", eventName);
  }
}

module.exports = JstestDualsense;
