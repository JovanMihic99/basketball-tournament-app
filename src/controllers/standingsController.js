const util = require("../util/util");
const exibitionsFile = "./exibitions.json";
let exibitions = loadExibitions();

exports.updateTeamStandings = (groups, group, result, team1, team2) => {
  const forfeitProbability = 0.005; // used for simulating forfeit (to be implemented...)
  const groupArray = groups[group];
  if (!groupArray) {
    console.error("No group found!");
    return;
  }
  // Determine winner and loser
  const winner = result.score1 > result.score2 ? team1 : team2;
  const loser = result.score1 > result.score2 ? team2 : team1;
  const winnerScore =
    result.score1 > result.score2 ? result.score1 : result.score2;
  const loserScore =
    result.score1 > result.score2 ? result.score2 : result.score1;

  // Update the standings for the winner
  const updatedWinner = {
    wins: winner.wins + 1, // Add 1 win to the winner's record
    pointsScored: winner.pointsScored + winnerScore, // Add points scored in this match
    pointsConceded: winner.pointsConceded + loserScore, // Add points conceded (points the loser scored)
    tournamentPoints: winner.tournamentPoints + 2, // Add 2 points for a win
  };

  // Update the standings for the loser
  const updatedLoser = {
    losses: loser.losses + 1, // Add 1 loss to the loser's record
    pointsScored: loser.pointsScored + loserScore, // Add points scored in this match
    pointsConceded: loser.pointsConceded + winnerScore, // Add points conceded (points the winner scored)
    tournamentPoints: loser.tournamentPoints + 1, // Add 1 point for a loss
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
};

exports.initializeStandings = (groups) => {
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
      condition: initializeConditions(team.ISOCode),
    }));
  });
  return groups;
};

function initializeConditions(isoCode) {
  let condition;
  let totalCondition;
  let count;

  const team = exibitions[isoCode];

  // console.log(exibition);

  condition = 1.0;
  totalCondition = 0;
  count = 0;
  team.forEach((game) => {
    let score = game.Result.split("-")[0];
    let opponentScore = game.Result.split("-")[1];

    let scoreRatioMultiplyer = (score - opponentScore) / score;

    let calculatedCondition = condition + scoreRatioMultiplyer;

    if (calculatedCondition <= 0) {
      calculatedCondition = 0;
    } else if (calculatedCondition >= 1.0) {
      calculatedCondition = 1.0;
    }
    condition = calculatedCondition >= 1.0 ? 1 : calculatedCondition;
    totalCondition += condition;
    count++;
    // console.log("condition: ", condition);
  });
  let avgCondition = totalCondition / count;
  // console.log("avg cond: " + avgCondition);

  return avgCondition;
}
async function loadExibitions() {
  try {
    exibitions = await util.readJSONFile(exibitionsFile);
  } catch (error) {
    console.log(error);
  }
}
