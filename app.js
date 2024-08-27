const fs = require("fs").promises;
const groupPhase = require("./src/groups");

function main() {
  groupPhase.simulateGroupPhase();
}

main();
