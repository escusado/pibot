/**
 * @module JstestDualsense
 * @description Used to read the output of jstest-gtk commandline tool, this
 * needs to be installed (read README setup (TBD)) and connected using bluetooth
 * as reported by Jstest the dualsense reads as:
 * Joystick (Wireless Controller) has 8 axes (X, Y, Z, Rx, Ry, Rz, Hat0X, Hat0Y)
 * and 13 buttons (BtnA, BtnB, BtnX, BtnY, BtnTL, BtnTR, BtnTL2, BtnTR2, BtnSelect, BtnStart, BtnMode, BtnThumbL, BtnThumbR).
 * API is mapped using DEFAULT_BUTTONS definition, and the 'bind' method like:
 *   jstestDualsenseInstance.bind('dpadx', (data) => console.log(data));
 */

const os = require("os");
const { spawn } = require("child_process");
const { createStore, select } = require("@ngneat/elf");

const DEFAULT_BUTTONS = {
  joylx: 0,
  joyly: 0,

  joyrx: 0,
  joyry: 0,

  dpadx: 0,
  dpady: 0,

  cross: 0,
  circle: 0,
  triangle: 0,
  square: 0,

  l1: 0,
  r1: 0,
  l2: 0,
  r2: 0,
  // pressing the sticks
  l3: 0,
  r3: 0,

  share: 0,
  hamburger: 0,

  ps: 0,
};

class JstestDualsense {
  constructor() {
    console.log("🕹 JstestDualsense");

    this.jstestOutputStore = createStore({ withProps: { output: "" } });
    this.store = createStore({
      withProps: DEFAULT_BUTTONS,
    });
  }

  setup() {
    // react to program output changes only prevent spam from the controller
    this.jstestOutputStore
      .pipe(select((state) => state.output))
      .subscribe(this.handleJstestOuput.bind(this));

    // catch button press or keydown events (note it will NOT detect keyup)
    spawn("jstest", ["/dev/input/js0"]).stdout.on(
      "data",
      (output) =>
        output[0] === 13 && // wait for output that starts with "A"
        this.jstestOutputStore.update(() => ({
          output: String(output)
            .replace(/^\s+|\s+$|\s+(?=\s)/g, "")
            .replace(/: /g, ":"),
        }))
    );
  }

  handleJstestOuput(data) {
    if (data) {
      //parse axes
      const axesString = data.match(/(?<=Axes: ).*(?= Buttons)/);
      const axesSliced = axesString[0].split(" ");
      const newAxes = {
        joylx: parseInt(axesSliced[0].split(":")[1]),
        joyly: parseInt(axesSliced[1].split(":")[1]) * -1,

        joyrx: parseInt(axesSliced[3].split(":")[1]),
        joyry: parseInt(axesSliced[4].split(":")[1]) * -1,

        dpadx: parseInt(axesSliced[6].split(":")[1]),
        dpady: parseInt(axesSliced[7].split(":")[1]) * -1,
      };

      // //parse buttons
      const buttonsString = data.match(/(?<=Buttons: ).*$/);
      const buttonsSliced = buttonsString[0].split(" ");
      const newButtons = {
        cross: buttonsSliced[0].indexOf("on") > 0,
        circle: buttonsSliced[1].indexOf("on") > 0,
        triangle: buttonsSliced[2].indexOf("on") > 0,
        square: buttonsSliced[3].indexOf("on") > 0,
        l1: buttonsSliced[4].indexOf("on") > 0,
        r1: buttonsSliced[5].indexOf("on") > 0,
        l2: buttonsSliced[6].indexOf("on") > 0,
        r2: buttonsSliced[7].indexOf("on") > 0,
        l3: buttonsSliced[11].indexOf("on") > 0,
        r3: buttonsSliced[12].indexOf("on") > 0,
        share: buttonsSliced[8].indexOf("on") > 0,
        hamburger: buttonsSliced[9].indexOf("on") > 0,
        ps: buttonsSliced[10].indexOf("on") > 0,
      };

      // //update store api
      this.store.update(() => ({
        ...newAxes,
        ...newButtons,
      }));
    }
  }

  bind(inputName, cb) {
    if (Object.keys(DEFAULT_BUTTONS).includes(inputName)) {
      this.store.pipe(select((state) => state[inputName])).subscribe(cb);
      return;
    }
    console.log(
      "Input not found: ",
      inputName,
      " use these instead: ",
      Object.keys(DEFAULT_BUTTONS)
    );
  }
}

module.exports = JstestDualsense;
