const matchesController = require("./matchesController");
const groupPhaseController = require("./groupPhaseController");

exports.simulateSemiFinals = (quarterFinals, groups) => {
  let result = [];
  console.log(" Eliminaciona faza:");
  for (const pot in quarterFinals) {
    if (Object.prototype.hasOwnProperty.call(quarterFinals, pot)) {
      const match = quarterFinals[pot];
      console.log(`   ${match[0].name}  vs  ${match[1].name}`);
      let team1 = getTeam(groups, match[0].ISOCode);
      let team2 = getTeam(groups, match[1].ISOCode);
      let simulatedMatch = matchesController.simulateMatch(team1, team2);
      result.push(simulatedMatch);
    }
  }
  //   getTeam(groups, match[0].ISOCode);
  return result;
};

function getTeam(groups, iso) {
  for (const group in groups) {
    if (Object.prototype.hasOwnProperty.call(groups, group)) {
      const teams = groups[group];
      //   console.log(teams);
      let res = teams.find((t) => t.ISOCode === iso);
      if (res) {
        // console.log(res);
        return res;
      }
    }
  }
  return null;
}
