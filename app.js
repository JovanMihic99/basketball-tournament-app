const groupPhaseController = require("./src/controllers/groupPhaseController");
const { simulateMatch } = require("./src/controllers/matchesController");
const quarterFinalController = require("./src/controllers/quarterFinalController");
const semiFinalController = require("./src/controllers/semiFinalController");
const matchesController = require("./src/controllers/matchesController");

async function main() {
  let groupResults = await groupPhaseController.simulateGroupPhase();
  let groups = groupResults.groups;
  let quarterFinals = await quarterFinalController.simulateQuarterFinals(
    groups
  );
  let finals = semiFinalController.simulateSemiFinals(quarterFinals, groups);
  let finalMatch = simulateMatch(
    matchesController.getTeam(groups, finals.winners[0].ISOCode),
    matchesController.getTeam(groups, finals.winners[1].ISOCode)
  );
  let bronzeMatch = simulateMatch(
    matchesController.getTeam(groups, finals.losers[0].ISOCode),
    matchesController.getTeam(groups, finals.losers[1].ISOCode)
  );
  console.log("\x1b[36m%s\x1b[0m", "\n  Utakmica za trece mesto:");
  console.log(
    `    ${bronzeMatch.team1Name} - ${bronzeMatch.team2Name} (${bronzeMatch.score1}:${bronzeMatch.score2})`
  );

  console.log("\x1b[36m%s\x1b[0m", "\n  Finale:");
  console.log(
    `    ${finalMatch.team1Name} - ${finalMatch.team2Name} (${finalMatch.score1}:${finalMatch.score2})`
  );
  let gold =
    finalMatch.score1 > finalMatch.score2
      ? finalMatch.team1Name
      : finalMatch.team2Name;
  let silver =
    finalMatch.score1 < finalMatch.score2
      ? finalMatch.team1Name
      : finalMatch.team2Name;
  let bronze =
    bronzeMatch.score1 > bronzeMatch.score2
      ? bronzeMatch.team1Name
      : bronzeMatch.team2Name;
  console.log("\x1b[38;5;253m", `\n Medalje:\x1b[0m`);
  console.log("\x1b[38;5;220m", `  1. ${gold}\x1b[0m`);
  console.log("\x1b[38;5;250m", `  2. ${silver}\x1b[0m`);
  console.log("\x1b[38;5;172m", `  3. ${bronze}\x1b[0m`);

  // console.log(groupResults.matches);
}

main();
