const { spawn } = require("child_process");
import { createStore, withProps } from "@ngneat/elf";

const child = spawn("jstest", ["/dev/input/js0"]);

const dualsenseStore = createStore({
  name: "dualsense",
  withProps: {
    axes: {
      joyl: {
        x: 0,
        y: 0,
      },
      joyr: {
        x: 0,
        y: 0,
      },
      dpad: {
        x: 0,
        y: 0,
      },
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

child.stdout.on("data", (data) => {
  // get jstest-gtk output clean whitespace
  var jsTestOutput = String(data).replace(/^\s+|\s+$|\s+(?=\s)/g, "");

  if (jsTestOutput.indexOf("Axes") === 0) {
    //parse axes
    const axesString = jsTestOutput.match(/(?<=Axes: ).*(?= Buttons)/);
    const axesSliced = axesString[0].replace(/: /g, ":").split(" ");
    const axes = {
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
    const buttons = {
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

    dualsenseStore.update(() => ({
      axes,
      buttons,
    }));
  }
});

child.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});
