const fs = require("fs").promises;
const util = require("./util");

let groups = {};

exports.simulateGroupPhase = async () => {
  groups = await util.readJSONFile("./groups.json");
  console.log("GRUPNA FAZA:");
  for (const key in groups) {
    console.log(groups[key]);
  }
};

function simulateMatch(team1, team2) {}
