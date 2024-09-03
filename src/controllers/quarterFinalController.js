const matchesController = require("./matchesController");
const util = require("../util/util");

let pots = {
  D: [],
  E: [],
  F: [],
  G: [],
};

let quarterFinals = {
  DG1: {},
  DG2: {},
  EF1: {},
  EF2: {},
};

exports.simulateQuarterFinals = (groups) => {
  drawTeams(groups);
  printDrawResults();
  drawQuarterFinalists();
  return { ...quarterFinals };
  // console.log(groups);
};

function drawTeams(groups) {
  let teamsArray = [];
  for (const group in groups) {
    const el = groups[group];

    el.forEach((team) => {
      if (team.rank !== null && team.rank <= 8) {
        // put quarter finalists into an array
        teamsArray.push({
          ISOCode: team.ISOCode,
          name: team.Team,
          rank: team.rank,
        });
      }
    });
  }
  teamsArray = teamsArray.sort((a, b) => a.rank - b.rank);
  // console.log(teamsArray);

  pots.D = [teamsArray[0], teamsArray[1]];
  pots.E = [teamsArray[2], teamsArray[3]];
  pots.F = [teamsArray[4], teamsArray[5]];
  pots.G = [teamsArray[6], teamsArray[7]];

  for (const pot in pots) {
    // shuffle the pots to ensure that teams are later drawn randomly from each pot
    pots[pot] = util.shuffleArray(pots[pot]);
  }
  // console.log(pots);
}

function drawQuarterFinalists() {
  let DG1 = drawMatch("D", "G");
  let DG2 = drawMatch("D", "G");

  let EF1 = drawMatch("E", "F");
  let EF2 = drawMatch("E", "F");

  quarterFinals.DG1 = DG1;
  quarterFinals.DG2 = DG2;
  quarterFinals.EF1 = EF1;
  quarterFinals.EF2 = EF2;
  // console.log(quarterFinals);
}
function drawMatch(potKey1, potKey2) {
  let team1, team2;
  pot1 = pots[potKey1];
  pot2 = pots[potKey2];

  // A Set to track previously attempted combinations
  const attemptedMatches = new Set();

  const maxAttempts = pot1.length * pot2.length;
  let attempts = 0;

  while (attempts < maxAttempts && pot1.length > 0 && pot2.length > 0) {
    attempts++;

    team1 = pot1.pop();
    team2 = pot2.pop();
    const matchKey = (team1, team2) => {
      `${team1}-${team2}`;
    };

    // Check if this combination was already attempted
    if (!attemptedMatches.has(matchKey)) {
      attemptedMatches.add(matchKey); // Record this combination

      if (!matchesController.haveTeamsPlayedAlready(team1, team2)) {
        return [team1, team2]; // Valid match found
      }
    }

    // If the combination was already attempted or teams have played, put them back
    pot1.unshift(team1);
    pot2.unshift(team2);
    util.shuffleArray(pot1);
    util.shuffleArray(pot2);
  }

  // If no valid match was found, fall back to next available teams
  console.warn(
    `Upozorenje:  Za date šešire (${potKey1}, ${potKey2}) nije bilo moguće naći sve parove koji nisu međusobno igrali utakmicu u grupnoj fazi.`
  );
  return [pot1.pop(), pot2.pop()];
}

function printDrawResults() {
  console.log("\nŠeširi:");
  console.log(`  Šešir D\n    ${pots.D[0].name}\n    ${pots.D[1].name}`);
  console.log(`  Šešir E\n    ${pots.E[0].name}\n    ${pots.E[1].name}`);
  console.log(`  Šešir F\n    ${pots.F[0].name}\n    ${pots.F[1].name}`);
  console.log(`  Šešir G\n    ${pots.G[0].name}\n    ${pots.G[1].name}`);
}
