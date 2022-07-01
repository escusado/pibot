/**
 * @module JstestDualsense
 * @description Used to read the output of jstest-gtk commandline tool, this
 * needs to be installed (read README setup (TBD)) and connected using bluetooth
 * if the app detects is running on mac it will use the keyboard input instead
 * using the fake data input that can be manipulated for dev purposes.
 * It uses "elf.js" state manager library to report its current state, we use
 * the `bind` method to add listeners to "axes" & "buttons" changes.
 */

const os = require("os");
const { spawn } = require("child_process");
const { createStore, select } = require("@ngneat/elf");

// Haven't found a way to read dualsense input in mac, using keyboard hack 4 now
console.log("🐧/🍎OS: ", os.platform());
let child = {};
if (os.platform() === "linux") {
  console.log("Using dualsense 🎮");
  child = spawn("jstest", ["/dev/input/js0"]);
} else {
  console.log("Using dummy keyboard inputs ⌨️");
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  child["stdout"] = process.stdin;
}

class JstestDualsense {
  constructor() {
    console.log("🕹 JstestDualsense");

    this.store = createStore({
      withProps: {
        axes: {
          joyl: { x: 0, y: 0 },
          joyr: { x: 0, y: 0 },
          dpad: { x: 0, y: 0 },
        },
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
    });
  }

  setup() {
    // keep objects outside to detect changes
    const axes = {};
    const buttons = {};

    // catch button press or keydown events (note it will NOT detect keyup)
    child.stdout.on("data", (data) => {
      // detect Ctrl+c
      if (data === "\u0003") {
        process.exit();
      }

      let jsTestOutput = "";
      if (os.platform() === "darwin") {
        //write dummy input data for dev purposes
        jsTestOutput = `Axes: 0: 0 1: -32767 2: 0 3: 0 4: 0 5: 0 6: 0 7: 0 Buttons: 0:${
          data === "s" ? "on" : "off"
        } 1:${
          data === "a" ? "on" : "off"
        } 2:off 3:off 4:off 5:off 6:off 7:off 8:off 9:off 10:off 11:off 12:off`;
      } else {
        // get jstest-gtk output
        jsTestOutput = String(data);
      }

      // cleanup weird whitespace
      jsTestOutput.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
      if (jsTestOutput.indexOf("Axes") === 0) {
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

        //parse buttons
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

        //update store api
        this.store.update(() => ({
          axes: Object.assign(axes, newAxes),
          buttons: Object.assign(buttons, newButtons),
        }));
      }
    });
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
