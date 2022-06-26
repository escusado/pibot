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
        y: parseInt(axesSliced[1].split(":")[1]) - 32767,
      },
    };
    console.log("axes✚", axisParsed);

    const buttonsString = jsTestOutput.match(/(?<=Buttons: ).*$/);
    const buttonsSliced = buttonsString[0].replace(/: /g, ":").split(" ");
    console.log("buttons🔴", buttonsSliced);
  }
});

child.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});
