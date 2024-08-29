let pots = {
  D: [],
  E: [],
  F: [],
  G: [],
};
exports.simulateQuarterFinals = (groups) => {
  drawTeams(groups);
  printDrawResults();
  // console.log(groups);
};

function drawTeams(groups) {
  let quarerFinalists = [];
  for (const group in groups) {
    const el = groups[group];

    el.forEach((team) => {
      if (team.rank !== null && team.rank <= 8) {
        // put quarter finalists into an array
        quarerFinalists.push({
          ISOCode: team.ISOCode,
          name: team.Team,
          rank: team.rank,
        });
      }
    });
  }
  quarerFinalists = quarerFinalists.sort((a, b) => a.rank - b.rank);

  pots.D = [quarerFinalists[0], quarerFinalists[1]];
  pots.E = [quarerFinalists[2], quarerFinalists[3]];
  pots.F = [quarerFinalists[4], quarerFinalists[5]];
  pots.G = [quarerFinalists[6], quarerFinalists[7]];
}

function printDrawResults() {
  console.log("Šeširi:");
  console.log(`  Šešir D\n    ${pots.D[0].name}\n    ${pots.D[1].name}`);
  console.log(`  Šešir E\n    ${pots.E[0].name}\n    ${pots.E[1].name}`);
  console.log(`  Šešir F\n    ${pots.F[0].name}\n    ${pots.F[1].name}`);
  console.log(`  Šešir G\n    ${pots.G[0].name}\n    ${pots.G[1].name}`);
}
