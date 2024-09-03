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
  console.log("\n  Utakmica za trece mesto:");
  console.log(
    `    ${bronzeMatch.team1Name} - ${bronzeMatch.team2Name} (${bronzeMatch.score1}:${bronzeMatch.score2})`
  );

  console.log("\n  Finale:");
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
  console.log(`\n Medalje:\n  1. ${gold}\n  2. ${silver}\n  3. ${bronze}`);
  // console.log(groupResults.matches);
}

main();
