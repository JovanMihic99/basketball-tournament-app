const fs = require("fs").promises;
const util = require("./util");

let groups = {};

exports.simulateGroupPhase = async () => {
  groups = await util.readJSONFile("./groups.json");

  console.log("GRUPNA FAZA:");
  groups = intializeStandings(groups); // add standings fields to the every team in groups

  printGroups(groups);
  SimulateAllGroupMatches(groups);
  printGroups(groups);
};

function SimulateAllGroupMatches(groups) {
  Object.keys(groups).forEach((group) => {
    const teams = groups[group];

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const team1 = teams[i];
        const team2 = teams[j];

        const result = simulateMatch(team1, team2);
        console.log(
          `group ${group}, i, j: (${i}, ${j})), ${team1.ISOCode} Vs ${team2.ISOCode} | Winner: ${result.winner.ISOCode}`
        );
        // update winner
        updateTeamStandings(group, result.winner.ISOCode, {
          wins: result.winner.wins + 1,
        });
        // update loser
        updateTeamStandings(group, result.loser.ISOCode, {
          losses: result.loser.losses + 1,
        });
      }
    }
  });

  function simulateMatch(team1, team2) {
    winner = team1;
    loser = team2;
    if (Math.random() > 0.5) {
      winner = team2;
      loser = team1;
    }
    return { winner, loser };
  }
  function updateTeamStandings(group, isoCode, newValue) {
    const groupArray = groups[group];
    if (!groupArray) {
      console.error("No group found!");
    }

    const team = groupArray.find((team) => team.ISOCode === isoCode);

    if (team) {
      Object.assign(team, newValue);
    } else {
      console.error("No team found!");
    }
  }
}

function intializeStandings(groups) {
  Object.keys(groups).forEach((group) => {
    groups[group] = groups[group].map((team) => ({
      ...team,
      wins: 0,
      losses: 0,
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
        `  ${team.Team} (ISO Code: ${team.ISOCode}, FIBA Ranking: ${team.FIBARanking}, Wins: ${team.wins}, Losses: ${team.losses}, Total Points: ${team.totalPoints})`
      );
    });

    console.log("");
  });
}
