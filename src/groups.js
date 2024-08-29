const fs = require("fs").promises;
const util = require("./util");
const matchesController = require("./matches");

let groups = {};

let matches = matchesController.getMatches();

exports.simulateGroupPhase = async () => {
  // simulates all matches in the Grop Phase and prints them in the console
  groups = await util.readJSONFile("./groups.json");
  groups = intializeStandings(groups); // add standings fields to the every team in groups

  await simulateAllGroupMatches(groups); // simulate all the matches
  matches = matchesController.getMatches(); // put simulated matches into this variable
  printMatchesByGroup(matches, groups); // print the matches in console
};

async function simulateAllGroupMatches(groups) {
  for (const group of Object.keys(groups)) {
    const teams = groups[group];

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const team1 = teams[i];
        const team2 = teams[j];
        const result = simulateMatch(team1, team2); //simulate match
        await matchesController.addMatch(result); // save match to array of played matches
        updateTeamStandings(group, result, team1, team2); // update information in groups array according to simulated matches
      }
    }
  }
  // matchesController.printMatches();
}

function simulateMatch(team1, team2) {
  const minPoints = 65;
  const maxPoints = 120;
  let score1 = util.getRandomNumberBetween(minPoints, maxPoints);
  let score2 = util.getRandomNumberBetween(minPoints, maxPoints);

  if (score1 === score2) {
    // if there is a tie, simulate overtime by randomly giving one team 1-3 points
    if (Math.random() > 0.5) {
      score1 += Math.floor(Math.random() * 3) + 1;
    } else {
      score2 += Math.floor(Math.random() * 3) + 1;
    }
  }
  // create match object
  let match = {
    team1ISO: team1.ISOCode,
    team2ISO: team2.ISOCode,
    score1,
    score2,
    team1Name: team1.Team,
    team2Name: team2.Team,
  };

  return match;
}

function updateTeamStandings(group, result, team1, team2) {
  const forfeitProbability = 0.005; // used for simulating forfeit (to be implemented...)
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

function intializeStandings(groups) {
  // initializes all the standings fields in groups array
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

function printMatchesByGroup(matches, groups) {
  console.log("GRUPNA FAZA:");
  const romanNumerals = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
    9: "IX",
  };
  let startValueJ = 0; // start value for J is used to print only 2 matches at a time.
  for (let i = 0; i < 9; i++) {
    console.log(`  ${romanNumerals[i + 1]} kolo:`);
    for (let j = startValueJ; j < 2 + startValueJ; j++) {
      const match = matches[j];
      console.log(
        `    ${match.team1Name} - ${match.team2Name} | (${match.score1}:${match.score2})`
      );
    }
    startValueJ += 2; // add 2 to start value to skip already printed matches
  }
}

function printGroups(groups) {
  // prints values of groups array into the console (used for debugging)
  let groupsArray = Object.keys(groups);
  groupsArray.forEach((group) => {
    groups[group].forEach((team) => {
      console.log(
        `\t\t${team.Team} (ISO Code: ${team.ISOCode}, FIBA Ranking: ${team.FIBARanking}, Wins: ${team.wins}, Losses: ${team.losses}, Total Points: ${team.tournamentPoints})`
      );
    });

    console.log("");
  });
}
