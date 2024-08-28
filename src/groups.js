const fs = require("fs").promises;
const util = require("./util");
const matchesController = require("./matches");

let groups = {};

let matches = matchesController.matches;

exports.simulateGroupPhase = async () => {
  groups = await util.readJSONFile("./groups.json");

  console.log("GRUPNA FAZA:");
  groups = intializeStandings(groups); // add standings fields to the every team in groups

  printGroups(groups);
  simulateAllGroupMatches(groups);
  printGroups(groups);
};

async function simulateAllGroupMatches(groups) {
  for (const group of Object.keys(groups)) {
    const teams = groups[group];

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const team1 = teams[i];
        const team2 = teams[j];

        const result = simulateMatch(team1, team2);
        await matchesController.addMatch(result);

        updateTeamStandings(group, result, team1, team2);
      }
    }
    matchesController.printMatches();
  }

  function simulateMatch(team1, team2) {
    const minPoints = 65;
    const maxPoints = 120;

    let match = {
      team1ISO: team1.ISOCode,
      team2ISO: team2.ISOCode,
      score1: util.getRandomNumberBetween(minPoints, maxPoints),
      score2: util.getRandomNumberBetween(minPoints, maxPoints),
    };

    return match;
  }

  function updateTeamStandings(group, result, team1, team2) {
    const groupArray = groups[group];
    if (!groupArray) {
      console.error("No group found!");
      return;
    }

    // Determine winner and loser
    const winner = result.score1 > result.score2 ? team1 : team2;
    const loser = result.score1 > result.score2 ? team2 : team1;

    // Update the standings for the winner
    const updatedWinner = {
      wins: winner.wins + 1,
      pointsScored: winner.pointsScored + result.score1,
      pointsConceded: winner.pointsConceded + result.score2,
      tournamentPoints: winner.tournamentPoints + 2, // 2 points for a win
    };

    // Update the standings for the loser
    const updatedLoser = {
      losses: loser.losses + 1,
      pointsScored: loser.pointsScored + result.score2,
      pointsConceded: loser.pointsConceded + result.score1,
      tournamentPoints: loser.tournamentPoints + 1, // 1 point for a loss
    };

    // Update both teams in the group
    Object.assign(
      groupArray.find((team) => team.ISOCode === winner.ISOCode),
      updatedWinner
    );
    Object.assign(
      groupArray.find((team) => team.ISOCode === loser.ISOCode),
      updatedLoser
    );
  }
}

function intializeStandings(groups) {
  Object.keys(groups).forEach((group) => {
    groups[group] = groups[group].map((team) => ({
      ...team,
      wins: 0,
      losses: 0,
      rank: null,
      pointsScored: 0,
      pointsConceded: 0,
      tournamentPoints: 0,
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
        `  ${team.Team} (ISO Code: ${team.ISOCode}, FIBA Ranking: ${team.FIBARanking}, Wins: ${team.wins}, Losses: ${team.losses}, Total Points: ${team.tournamentPoints})`
      );
    });

    console.log("");
  });
}
