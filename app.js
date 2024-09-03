const groupPhaseController = require("./src/controllers/groupPhaseController");
const quarterFinalController = require("./src/controllers/quarterFinalController");
const semiFinalController = require("./src/controllers/semiFinalController");

async function main() {
  let groupResults = await groupPhaseController.simulateGroupPhase();
  let groups = groupResults.groups;
  let quarterFinals = await quarterFinalController.simulateQuarterFinals(
    groups
  );
  semiFinalController.simulateSemiFinals(quarterFinals, groups);
  // console.log(groupResults.matches);
}

main();
