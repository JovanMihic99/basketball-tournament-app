const matchesController = require("./matchesController");
const util = require("../util/util");

let pots = {
  D: [],
  E: [],
  F: [],
  G: [],
};

let quarterFinals = {
  DG1: { team1: null, team2: null },
  DG2: { team1: null, team2: null },
  EF1: { team1: null, team2: null },
  EF2: { team1: null, team2: null },
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
  // ...to be finished

  quarterFinals.DG1 = drawMatch(pots.D, pots.G);
  quarterFinals.DG2 = drawMatch(pots.D, pots.G);

  quarterFinals.EF1 = drawMatch(pots.E, pots.F);
  quarterFinals.EF2 = drawMatch(pots.E, pots.F);
  // console.log(pots);
  // console.log(quarterFinals);
  // console.log(pots);
}
function drawMatch(pot1, pot2) {
  // let team1 = pot1.shift();
  // let team2 = pot2.shift();
  // let result = {
  //   draw1: [],
  //   draw2: [],
  // };
  // let foundMatch = false;
  // for (let i = 0; i < pot1.length; i++) {
  //   if (foundMatch) {
  //     break;
  //   }
  //   for (let j = 0; j < pot2.length; j++) {
  //     const team1 = pot1[i];
  //     const team2 = pot2[j];
  //     if (matchesController.haveTeamsPlayedAlready(team1, team2)) {
  //       console.log(
  //         `Teams ${team1.ISOCode} and ${team2.ISOCode} have already played. Redrawing.`
  //       );
  //     } else {
  //       console.log(
  //         `teams drawn: team1: ${pot1[i].ISOCode}\t team2: ${pot2[j].ISOCode}`
  //       );
  //       delete pot1[i];
  //       delete pot2[j];
  //       foundMatch = true;
  //       break;
  //     }
  //   }
  // }

  let attempts = 0;
  const maxAttempts = 100; // Set a maximum number of attempts to prevent infinite loops

  while (attempts < maxAttempts) {
    // Draw teams
    let team1 = pot1.shift();
    let team2 = pot2.shift();

    // Check if teams have played against each other
    if (!matchesController.haveTeamsPlayedAlready(team1, team2)) {
      // Return the valid match
      return {
        team1,
        team2,
      };
    }
    console.log(
      `These teams already played: ${team1.ISOCode} - ${team2.ISOCode}`
    );
    // If invalid match, push teams back and try again
    pot1.push(team1);
    pot2.push(team2);
    attempts++;
  }

  // If maximum attempts are reached and no valid match found, handle the error
  throw new Error("Unable to draw a valid match after multiple attempts");

  // Return the drawn matches
  return matches;

  // while (matchesController.haveTeamsPlayedAlready(team1, team2)) {
  //   console.log(
  //     `Teams ${team1.ISOCode} and ${team2.ISOCode} have already played. Redrawing.`
  //   );

  //   // Push the teams back into the pots
  //   pot1.push(team1);
  //   pot2.push(team2);

  //   // Check if pots are empty
  //   if (pot1.length === 0 || pot2.length === 0) {
  //     console.error("Pots are empty. Cannot find a new pair.");
  //     return null;
  //   }

  //   // draw new teams
  //   team1 = pot1.shift();
  //   team2 = pot2.shift();
  // }
  // return {
  //   team1,
  //   team2,
  // };
}

function printDrawResults() {
  console.log("\nŠeširi:");
  console.log(`  Šešir D\n    ${pots.D[0].name}\n    ${pots.D[1].name}`);
  console.log(`  Šešir E\n    ${pots.E[0].name}\n    ${pots.E[1].name}`);
  console.log(`  Šešir F\n    ${pots.F[0].name}\n    ${pots.F[1].name}`);
  console.log(`  Šešir G\n    ${pots.G[0].name}\n    ${pots.G[1].name}`);
}
