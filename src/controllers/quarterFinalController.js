let pots = {
  D: [],
  E: [],
  F: [],
  G: [],
};
exports.simulateQuarterFinals = (groups) => {
  drawTeams(groups);
  printDrawResults();
  drawQuarterFinalists();
  // console.log(groups);
};

function drawTeams(groups) {
  let teamsArray = [];
  let quarterFinalists = [];
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

  pots.D = [teamsArray[0], teamsArray[1]];
  pots.E = [teamsArray[2], teamsArray[3]];
  pots.F = [teamsArray[4], teamsArray[5]];
  pots.G = [teamsArray[6], teamsArray[7]];
}

function drawQuarterFinalists() {
  // ...to be finished
  let quarterFinals = [];

  console.log(Math.round(Math.random()));
  quarterFinals.push({
    team1: pots.D[Math.round(Math.random())],
    team2: pots.G[Math.round(Math.random())],
  });
  quarterFinals.push({
    team1: pots.E[Math.round(Math.random())],
    team2: pots.F[Math.round(Math.random())],
  });
  console.log(quarterFinals);
}

function printDrawResults() {
  console.log("\nŠeširi:");
  console.log(`  Šešir D\n    ${pots.D[0].name}\n    ${pots.D[1].name}`);
  console.log(`  Šešir E\n    ${pots.E[0].name}\n    ${pots.E[1].name}`);
  console.log(`  Šešir F\n    ${pots.F[0].name}\n    ${pots.F[1].name}`);
  console.log(`  Šešir G\n    ${pots.G[0].name}\n    ${pots.G[1].name}`);
}
