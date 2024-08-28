const fs = require("fs").promises;

exports.readJSONFile = async (path) => {
  try {
    const data = await fs.readFile(path, "utf8");
    const res = JSON.parse(data);
    return res;
  } catch (error) {
    console.error(`Error reading '${path}':\n\t${error}`);
  }
};
exports.writeJSONFile = async (path, data) => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(path, jsonString, "utf8");
    // console.log(`Successfully written to '${path}'`);
  } catch (error) {
    console.error(`Error writing '${path}':\n\t${error}`);
  }
};

exports.getRandomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
