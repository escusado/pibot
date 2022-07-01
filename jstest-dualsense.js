const { spawn } = require("child_process");
const { createStore } = require("@ngneat/elf");
const os = require("os");

let child;

if (os.platform() === "linux") {
  child = spawn("jstest", ["/dev/input/js0"]);
} else {
  child = {
    on: (event, cb) => {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", function (key) {
        if (key === "\u0003") {
          process.exit();
        }

        switch (key) {
          case "s":
            cb(
              "Axes: 0: 0 1: 0 2: 0 3: 0 4: 0 5: 0 6: 0 7: 0 Buttons: 0:off 1:off 2:off 3:off 4:off 5:off 6:off 7:off 8:off 9:off 10:off 11:off 12:off"
            );
            break;
          default:
            break;
        }
      });
    },
  };
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
    child.stdout.on("data", (data) => {
      // get jstest-gtk output clean whitespace
      var jsTestOutput = String(data)
        .replace(/^\s+|\s+$|\s+(?=\s)/g, "")
        .replace(/: /g, ":");

      if (jsTestOutput.indexOf("Axes") === 0) {
        //parse axes
        const axesString = jsTestOutput.match(/(?<=Axes: ).*(?= Buttons)/);
        const axesSliced = axesString[0].split(" ");
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
  }
}

module.exports = JstestDualsense;
