const matchesController = require("./matchesController");
const groupPhaseController = require("./groupPhaseController");

exports.simulateSemiFinals = (qFinalWinners, groups) => {
  console.log(qFinalWinners);
  let matches = simulateMatches(qFinalWinners, groups);
  console.log(matches);
  let winners = matches.map((m) =>
    m.score1 > m.score2
      ? { ISOCode: m.team1ISO, name: m.team1Name, pot: m.pot }
      : { ISOCode: m.team2ISO, name: m.team2Name, pot: m.pot }
  );
  return winners;
};
let semiFinalists = [];

function simulateMatches(qFinalWinners, groups) {
  matches = [];

  semiFinalists = matchSemifinalists(qFinalWinners);

  semiFinalists.forEach((sf) => {
    matches.push(
      matchesController.simulateMatch(
        getTeam(groups, sf.team1.ISOCode),
        getTeam(groups, sf.team2.ISOCode)
      )
    );
  });

  return matches;
}

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

function getTeam(groups, iso) {
  for (const group in groups) {
    if (Object.prototype.hasOwnProperty.call(groups, group)) {
      const teams = groups[group];
      //   console.log(teams);
      let res = teams.find((t) => t.ISOCode === iso);
      if (res) {
        // console.log(res);
        return res;
      }
    }
  }
  return null;
}
