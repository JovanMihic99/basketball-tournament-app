const matchesFile = "./matches.json";
const util = require("./util");

matches = [];
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