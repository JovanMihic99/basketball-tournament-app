const fs = require("fs").promises;
const util = require("./util");

let groups = {};

exports.simulateGroupPhase = async () => {
  groups = await util.readJSONFile("./groups.json");

  console.log("GRUPNA FAZA:");
  intializeStandings(groups);
  printGroups(groups);
};

function simulateMatch(team1, team2) {
  const rankDifferenece = team1.rank - tean2.rank;
}

function intializeStandings(groups) {
  Object.keys(groups).forEach((group) => {
    groups[group] = groups[group].map((team) => ({
      ...team,
      wins: 0,
      losses: 0,
      pointsScored: 0,
      pointsConceded: 0,
      totalPoints: 0,
    }));
  });
  return groups;
}

function printGroups(groups) {
  console.log("Grupe:");

  Object.keys(groups).forEach((group) => {
    console.log(`Grupa ${group}:`);

    groups[group].forEach((team) => {
      console.log(
        `  ${team.Team} (ISO Code: ${team.ISOCode}, FIBA Ranking: ${
          team.FIBARanking
        }, Wins: ${team.wins || 0}, Losses: ${
          team.losses || 0
        }, Points Scored: ${team.pointsScored || 0}, Points Conceded: ${
          team.pointsConceded || 0
        }, Total Points: ${team.totalPoints || 0})`
      );
    });

    console.log("");
  });
}
