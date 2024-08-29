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
    }));
  });
  // console.log(groups);
  return groups;
};
