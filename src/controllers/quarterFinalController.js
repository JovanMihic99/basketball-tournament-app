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
  console.log(teamsArray);

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
  console.log(quarterFinals);
}
function drawMatch(pot1, pot2) {
  let team1, team2;
  pot1 = pots[pot1];
  pot2 = pots[pot2];
  while (pot1.length > 0 && pot2.length > 0) {
    team1 = pot1.pop();
    team2 = pot2.pop();
    if (!matchesController.haveTeamsPlayedAlready(team1, team2)) {
      return [team1, team2];
    }
    pot1.unshift(team1);
    pot2.unshift(team2);
    util.shuffleArray(pot1);
    util.shuffleArray(pot2);
  }
}

function printDrawResults() {
  console.log("\nŠeširi:");
  console.log(`  Šešir D\n    ${pots.D[0].name}\n    ${pots.D[1].name}`);
  console.log(`  Šešir E\n    ${pots.E[0].name}\n    ${pots.E[1].name}`);
  console.log(`  Šešir F\n    ${pots.F[0].name}\n    ${pots.F[1].name}`);
  console.log(`  Šešir G\n    ${pots.G[0].name}\n    ${pots.G[1].name}`);
}
