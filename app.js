const fs = require("fs").promises;
const groupPhase = require("./src/controllers/groupPhaseController");

function main() {
  groupPhase.simulateGroupPhase();
}

main();
