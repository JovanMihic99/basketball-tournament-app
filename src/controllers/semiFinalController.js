const matchesController = require("./matchesController");
const groupPhaseController = require("./groupPhaseController");

exports.simulateSemiFinals = (qFinalWinners, groups) => {
  //   console.log(qFinalWinners);
  let matches = simulateMatches(qFinalWinners, groups);
  let winners = matches.map((m) =>
    m.score1 > m.score2
      ? { ISOCode: m.team1ISO, name: m.team1Name }
      : { ISOCode: m.team2ISO, name: m.team2Name }
  );
  let losers = matches.map((m) =>
    m.score1 < m.score2
      ? { ISOCode: m.team1ISO, name: m.team1Name }
      : { ISOCode: m.team2ISO, name: m.team2Name }
  );

  return { winners, losers };
};
let semiFinalists = [];

function simulateMatches(qFinalWinners, groups) {
  matches = [];

  semiFinalists = matchSemifinalists(qFinalWinners);

  semiFinalists.forEach((sf) => {
    matches.push(
      matchesController.simulateMatch(
        matchesController.getTeam(groups, sf.team1.ISOCode),
        matchesController.getTeam(groups, sf.team2.ISOCode)
      )
    );
  });
  console.log("\x1b[36m%s\x1b[0m", "\n  Polufinale:");
  matches.forEach((m) => {
    console.log(
      `    ${m.team1Name} - ${m.team2Name} (${m.score1}:${m.score2})`
    );
  });

  return matches;
}

function printMatches() {}

function matchSemifinalists(qFinalWinners) {
  let match1, match2;
  (match1 = {
    team1: qFinalWinners.find((qf) => {
      return qf.pot === "DG1";
    }),

    team2: qFinalWinners.find((qf) => {
      return qf.pot === "EF1";
    }),
  }),
    (match2 = {
      team1: qFinalWinners.find((qf) => {
        return qf.pot === "DG2";
      }),

      team2: qFinalWinners.find((qf) => {
        return qf.pot === "EF2";
      }),
    });

  return [match1, match2];
}
