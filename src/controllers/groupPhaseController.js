const util = require("../util/util");
const matchesController = require("./matchesController");
const standingsController = require("./standingsController");

let groups = {};

let matches = matchesController.getMatches();

exports.simulateGroupPhase = async () => {
  // simulates all matches in the Grop Phase and prints them in the console
  groups = await util.readJSONFile("./groups.json");
  groups = standingsController.initializeStandings(groups); // add standings fields to the every team in groups

  await matchesController.simulateAllGroupMatches(groups); // simulate all the matches
  matches = matchesController.getMatches(); // put simulated matches into this variable
  matchesController.printMatchesByGroup(matches, groups); // print the matches in console
  printGroupPhaseResults(groups);
  // matchesController.printGroups(groups);
  let result = {
    matches: matches,
    groups: groups,
  };
  return result;
};

function printGroupPhaseResults(groups) {
  // Prints final results of group phase
  console.log("\x1b[36m%s\x1b[0m", "Konačan plasman u grupama:");
  Object.keys(groups).forEach((group, i) => {
    let teams = groups[group];
    teams = sortTeamsInGroup(teams, matches); // Sort teams

    console.log(
      "\x1b[36m%s\x1b[0m",
      `  Grupa ${group} (Ime | pobede/porazi | bodovi | postignuti koševi | primljeni koševi | koš razlika):`
    );
    rankTeams(groups);
    // Loop through the sorted teams and print their stats

    teams.forEach((team, index) => {
      printGroupPhaseTeam(team, index);
    });
  });
}

function rankTeams(groups) {
  Object.keys(groups).forEach((group, i) => {
    let teams = [...groups[group]];
    // console.log("Grupa " + i, teams[3]);
    teams[0].rank = i + 1; // first place in group
    teams[1].rank = i + 4; // second place in group
    teams[2].rank = i + 7; // third place in group
    teams[3].rank = null; // fourth place in group
  });
}

function printGroupPhaseTeam(team, index) {
  // helper function for printGroupPhaseResults() to print one team
  const winLoss = `${team.wins}/${team.losses}`;
  const points = team.tournamentPoints;
  const scoredPoints = team.pointsScored;
  const concededPoints = team.pointsConceded;
  const pointDifference = scoredPoints - concededPoints;
  let colors = {
    0: "\x1b[38;5;253m",
    1: "\x1b[38;5;251m",
    2: "\x1b[38;5;249m",
    3: "\x1b[38;5;247m",
  };
  console.log(
    colors[index],
    `    ${index + 1}. ${team.Team}`.padEnd(24) +
      ` | ${winLoss} | ${points} | ${scoredPoints} | ${concededPoints} | ${
        pointDifference > 0 ? "+" + pointDifference : pointDifference
      }` +
      "|".padStart(2)
  );
}

function sortTeamsInGroup(teams, matches) {
  let result = teams.sort((team1, team2) => {
    // Step 1: Sort by tournament points
    let sortValue = team2.tournamentPoints - team1.tournamentPoints;

    if (sortValue !== 0) {
      return sortValue;
    }

    // Step 2: Handle two-team tie using head-to-head
    const tiedTeams = teams.filter(
      (team) => team.tournamentPoints === team1.tournamentPoints
    );

    if (tiedTeams.length === 2) {
      return compareHeadToHead(team1, team2, matches);
    }

    // Step 3: Handle three-team tie using point difference in mutual matches
    if (tiedTeams.length === 3) {
      return resolveThreeTeamTie(tiedTeams, matches);
    }

    return 0; // If no other criteria apply, consider them equal
  });
  return result;
}

// Function to resolve three-team tie using point difference in mutual matches
function resolveThreeTeamTie(tiedTeams, matches) {
  let miniLeagueResults = tiedTeams.map((team) => {
    let pointsScored = 0;
    let pointsConceded = 0;

    matches.forEach((match) => {
      // Check only the matches between the three tied teams
      if (
        tiedTeams.some((t) => t.ISOCode === match.team1ISO) &&
        tiedTeams.some((t) => t.ISOCode === match.team2ISO)
      ) {
        if (match.team1ISO === team.ISOCode) {
          pointsScored += match.score1;
          pointsConceded += match.score2;
        } else if (match.team2ISO === team.ISOCode) {
          pointsScored += match.score2;
          pointsConceded += match.score1;
        }
      }
    });

    return {
      team,
      pointDifference: pointsScored - pointsConceded,
    };
  });

  // Sort based on point difference in mutual matches
  miniLeagueResults.sort((a, b) => b.pointDifference - a.pointDifference);

  // Return the order of teams based on point difference
  return miniLeagueResults.map((result) => result.team);
}

// Function to compare two teams based on head-to-head result
function compareHeadToHead(team1, team2, matches) {
  const headToHeadMatch = matches.find(
    //find the matches where both teams played against eachother
    (match) =>
      (match.team1ISO === team1.ISOCode && match.team2ISO === team2.ISOCode) ||
      (match.team1ISO === team2.ISOCode && match.team2ISO === team1.ISOCode)
  );

  if (headToHeadMatch) {
    // Determine which team won
    if (
      (headToHeadMatch.team1ISO === team1.ISOCode &&
        headToHeadMatch.score1 > headToHeadMatch.score2) ||
      (headToHeadMatch.team2ISO === team1.ISOCode &&
        headToHeadMatch.score2 > headToHeadMatch.score1)
    ) {
      return -1; // team1 wins head-to-head
    } else {
      return 1; // team2 wins head-to-head
    }
  }

  return 0; // If no head-to-head match is found, consider them equal
}
