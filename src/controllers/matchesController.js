const matchesFile = "./matches.json";
const exibitionsFile = "./exibitions.json";
const util = require("../util/util");
const standingsController = require("./standingsController");

matches = [];
let exibitions = loadExibitions();
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
  console.log("\x1b[36m%s\x1b[0m", "GRUPNA FAZA:");
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
    console.log("\x1b[38;5;110m", `  ${romanNumerals[i + 1]} kolo:\x1b[0m`);
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
  // console.log(exibitions);
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
  let scores = calculateScore(team1, team2);

  // create match object
  let match = {
    team1ISO: team1.ISOCode,
    team2ISO: team2.ISOCode,
    score1: scores.score1,
    score2: scores.score2,
    team1Name: team1.Team,
    team2Name: team2.Team,
  };

  return match;
};

function calculateScore(team1, team2) {
  const minPoints = 65;
  const maxPoints = 120;
  let t1Condition = team1.condition; // condition is a number between 0 and 1
  let t2Condition = team2.condition;

  let t1FIBA = team1.FIBARanking;
  let t2FIBA = team2.FIBARanking;

  let FIBAdiff = normalizeDifference(t1FIBA, t2FIBA); // used for lowering condition based on FIBA ranking
  let newT1Condition, newT2Condition;
  if (t1FIBA > t2FIBA) {
    // this formula is gotten by trial and errror
    newT1Condition = (t1Condition * 100 - FIBAdiff * 3) / 100; // t1 fiba ranking is higher therfore it's condition reduction is less severe
    newT2Condition = (t2Condition * 100 - FIBAdiff * 5) / 100;
  } else {
    newT2Condition = (t2Condition * 100 - FIBAdiff * 3) / 100; // t2 fiba ranking is higher therefore it's condition reduction is less severe
    newT1Condition = (t1Condition * 100 - FIBAdiff * 5) / 100;
  }

  standingsController.setCondition(newT1Condition, team1.ISOCode);
  standingsController.setCondition(newT2Condition, team2.ISOCode);

  let score1 = Math.round(
    util.getRandomNumberBetween(minPoints, maxPoints) * t1Condition // random number between min and max multiplied by condition
  );
  let score2 = Math.round(
    util.getRandomNumberBetween(minPoints, maxPoints) * t2Condition
  );

  if (score1 === score2) {
    // if there is a tie, simulate overtime by randomly giving one team 1-3 points
    if (Math.random() > 0.5) {
      score1 += Math.floor(Math.random() * 3) + 1;
    } else {
      score2 += Math.floor(Math.random() * 3) + 1;
    }
  }

  return { score1, score2 };
}
function normalizeDifference(num1, num2) {
  // Ensure num1 is less than or equal to num2
  if (num1 > num2) {
    [num1, num2] = [num2, num1]; // swap them
  }

  const difference = num2 - num1;

  const maxDifference = 100;

  const normalizedValue = 1 + (9 * difference) / maxDifference;

  // return value between 1 and 10
  return Math.max(1, Math.min(10, normalizedValue));
}

exports.getTeam = (groups, iso) => {
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
};

exports.printGroups = (groups) => {
  // prints values of groups array into the console (used for debugging)
  let groupsArray = Object.keys(groups);
  groupsArray.forEach((group) => {
    groups[group].forEach((team) => {
      console.log(
        `\t\t${team.Team} (ISO Code: ${team.ISOCode}, FIBA Ranking: ${team.FIBARanking}, Wins: ${team.wins}, Losses: ${team.losses}, Total Points: ${team.tournamentPoints}, Rank: ${team.rank})`
      );

      // console.log(team);
    });

    console.log("");
  });
};

exports.haveTeamsPlayedAlready = (team1, team2) => {
  let iso1 = team1.ISOCode;
  let iso2 = team2.ISOCode;

  let res = matches.some(
    (m) =>
      (m.team1ISO === iso1 && m.team2ISO === iso2) ||
      (m.team1ISO === iso2 && m.team2ISO === iso1)
  );
  // console.log(iso1, iso2, res);
  // console.log(matches);
  return res;
};

async function loadExibitions() {
  try {
    exibitions = await util.readJSONFile(exibitionsFile);
  } catch (error) {
    console.log(error);
  }
}

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
