const matchesFile = "./matches.json";
const util = require("../util/util");
const standingsController = require("./standingsController");

matches = [];
saveMatches();

exports.printMatches = () => {
  matches.forEach((m) => {
    console.log(
      `id: ${m.id} | ${m.team1ISO} vs ${m.team2ISO} | ${m.score1}:${
        m.score2
      } | winner: [${m.score1 > m.score2 ? m.team1ISO : m.team2ISO}]`
    );
  });
};

exports.addMatch = async (match = {}) => {
  await loadMatches();
  const newMatch = { ...match, id: matches.length + 1 };
  matches.push(newMatch);
  await saveMatches();
};

exports.getMatches = () => {
  return matches;
};

exports.printMatchesByGroup = (matches, groups) => {
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
        `    ${match.team1Name} - ${match.team2Name} `.padEnd(36) +
          ` | (${match.score1}:${match.score2})`
      );
    }
    console.log("");
    startValueJ += 2; // add 2 to start value to skip already printed matches
  }
};

exports.simulateAllGroupMatches = async (groups) => {
  for (const group of Object.keys(groups)) {
    const teams = groups[group];

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const team1 = teams[i];
        const team2 = teams[j];

        const result = this.simulateMatch(team1, team2); //simulate match
        await this.addMatch(result); // save match to array of played matches

        standingsController.updateTeamStandings(
          groups,
          group,
          result,
          team1,
          team2
        ); // update information in groups array according to simulated matches
      }
    }
  }
  // matchesController.printMatches();
};

exports.simulateMatch = (team1, team2) => {
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
};

exports.printGroups = (groups) => {
  // prints values of groups array into the console (used for debugging)
  let groupsArray = Object.keys(groups);
  groupsArray.forEach((group) => {
    groups[group].forEach((team) => {
      console.log(
        `\t\t${team.Team} (ISO Code: ${team.ISOCode}, FIBA Ranking: ${team.FIBARanking}, Wins: ${team.wins}, Losses: ${team.losses}, Total Points: ${team.tournamentPoints})`
      );

      // console.log(team);
    });

    console.log("");
  });
};

exports.haveTeamsPlayedAlready = (team1, team2) => {
  let iso1 = team1.ISOCode;
  let iso2 = team2.ISOCode;
  return matches.some(
    (m) =>
      (m.team1ISO === iso1 && m.team2ISO === iso2) ||
      (m.team1ISO === iso2 && m.team2ISO === iso1)
  );
};

async function saveMatches() {
  await util.writeJSONFile(matchesFile, matches);
}

async function loadMatches() {
  try {
    matches = await util.readJSONFile(matchesFile);
  } catch (error) {
    console.log(error);
  }
}
