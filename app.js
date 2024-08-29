const groupPhaseController = require("./src/controllers/groupPhaseController");
const quarterFinalController = require("./src/controllers/quarterFinalController");

async function main() {
  let groupResults = await groupPhaseController.simulateGroupPhase();
  let groups = groupResults.groups;
  quarterFinalController.simulateQuarterFinals(groups);
  // console.log(groupResults.matches);
}

main();
