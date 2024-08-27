const fs = require("fs").promises;

let groups,
  exibitions = {};

async function main() {
  groups = await readJSONFile("./groups.json");
  exibitions = await readJSONFile("./exibitions.json");
  //   console.log(groups, exibitions);
}

async function readJSONFile(path) {
  try {
    const data = await fs.readFile(path, "utf8");
    const res = JSON.parse(data);
    return res;
  } catch (error) {
    console.error("Error reading '" + path + "':\n\t", error);
  }
}

main();
