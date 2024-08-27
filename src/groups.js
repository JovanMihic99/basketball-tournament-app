const fs = require("fs").promises;
const util = require("./util");

let groups = {};

exports.simulateGroupPhase = async () => {
  groups = await util.readJSONFile("./groups.json");

  console.log("GRUPNA FAZA:");
  groups = intializeStandings(groups); // add standings fields to the every team in groups

  printGroups(groups);
};

function simulateMatch(team1, team2) {
  const rankDifferenece = team1.rank - team2.rank;
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
  // console.log(groups);
  return groups;
}

function printGroups(groups) {
  console.log("Grupe:");

  Object.keys(groups).forEach((group) => {
    console.log(`Grupa ${group}:`);

    groups[group].forEach((team) => {
      console.log(
        `  ${team.Team} (ISO Code: ${team.ISOCode}, FIBA Ranking: ${team.FIBARanking}, Wins: ${team.wins}, Losses: ${team.losses}, Points Scored: ${team.pointsScored}, Points Conceded: ${team.pointsConceded}, Total Points: ${team.totalPoints})`
      );
    });

    console.log("");
  });
}
