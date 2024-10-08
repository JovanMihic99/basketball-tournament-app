const matchesController = require("./matchesController");
const util = require("../util/util");

let pots = {
  D: [],
  E: [],
  F: [],
  G: [],
};

let quarterFinals = {
  DG1: [],
  DG2: [],
  EF1: [],
  EF2: [],
};

exports.simulateQuarterFinals = (groups) => {
  drawTeams(groups);
  printDrawResults();
  drawQuarterFinalists();
  console.log("\x1b[36m%s\x1b[0m", "\n Eliminaciona faza:");

  let matches = simulateMatches(groups);
  console.log("\x1b[36m%s\x1b[0m", "\n  Četvrtfinale:");
  matches.forEach((m) => {
    console.log(
      `    ${m.team1Name} - ${m.team2Name} (${m.score1}:${m.score2})`
    );
  });
  // create a winners object containing winner name, iso and pot
  let winners = matches.map((m) =>
    m.score1 > m.score2
      ? { ISOCode: m.team1ISO, name: m.team1Name, pot: m.pot }
      : { ISOCode: m.team2ISO, name: m.team2Name, pot: m.pot }
  );
  // console.log(winners);
  return winners;
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
  let DG1 = drawMatch("D", "G")[0];
  let DG2 = drawMatch("D", "G")[1];

  let EF1 = drawMatch("E", "F")[0];
  let EF2 = drawMatch("E", "F")[1];

  quarterFinals.DG1 = DG1;
  quarterFinals.DG2 = DG2;
  quarterFinals.EF1 = EF1;
  quarterFinals.EF2 = EF2;
  // console.log(quarterFinals);
}
function drawMatch(potKey1, potKey2) {
  // let team1, team2;
  pot1 = pots[potKey1];
  pot2 = pots[potKey2];
  // since there are only two possible draws I hard-coded them
  const draws = [
    [
      [pot1[0], pot2[0]], // Match 1
      [pot1[1], pot2[1]], // Match 2
    ],
    [
      [pot1[0], pot2[1]], // Match 1
      [pot1[1], pot2[0]], // Match 2
    ],
  ];
  for (const draw of draws) {
    const [match1, match2] = draw;
    const [team1A, team1B] = match1;
    const [team2A, team2B] = match2;

    if (
      !matchesController.haveTeamsPlayedAlready(team1A, team1B) &&
      !matchesController.haveTeamsPlayedAlready(team2A, team2B)
    ) {
      return draw;
    }
  }

  // If no valid match was found, fall back to next available teams
  console.warn(
    `\u001B[3m\u001B[90mUpozorenje:  Za date šešire (${potKey1}, ${potKey2}) nije bilo moguće naći sve parove koji nisu međusobno igrali utakmicu u grupnoj fazi.`
  );
  // return [pot1.pop(), pot2.pop()];
}

function printDrawResults() {
  console.log("\x1b[36m%s\x1b[0m", "\nŠeširi:");
  for (const pot in pots) {
    if (Object.prototype.hasOwnProperty.call(pots, pot)) {
      const el = pots[pot];
      console.log("\x1b[38;5;110m", `  Šešir ${pot}\x1b[0m`);
      console.log(`    ${el[0].name} \n    ${el[1].name}`);
    }
  }
}

function simulateMatches(groups) {
  result = [];

  for (const pot in quarterFinals) {
    if (Object.prototype.hasOwnProperty.call(quarterFinals, pot)) {
      const match = quarterFinals[pot];
      console.log(`   ${match[0].name}  vs  ${match[1].name}`);
      let team1 = matchesController.getTeam(groups, match[0].ISOCode);
      let team2 = matchesController.getTeam(groups, match[1].ISOCode);
      let simulatedMatch = matchesController.simulateMatch(team1, team2);
      simulatedMatch["pot"] = pot;
      result.push(simulatedMatch);
    }
  }
  // console.log(result);
  return result;
}
