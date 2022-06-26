const { spawn } = require("child_process");

const child = spawn("jstest", ["/dev/input/js0"]);

child.stdout.on("data", (data) => {
  // get jstest-gtk output clean whitespace
  var jsTestOutput = String(data).replace(/^\s+|\s+$|\s+(?=\s)/g, "");

  if (jsTestOutput.indexOf("Axes") === 0) {
    const axesString = jsTestOutput.match(/(?<=Axes: ).*(?= Buttons)/);
    const axesSliced = axesString[0].replace(/: /g, ":").split(" ");
    const axisParsed = {
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
    console.log("axes✚", axisParsed);

    const buttonsString = jsTestOutput.match(/(?<=Buttons: ).*$/);
    const buttonsSliced = buttonsString[0].replace(/: /g, ":").split(" ");
    const buttonsParsed = {
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
    console.log("buttons🔴", buttonsParsed);
  }
});

child.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});
