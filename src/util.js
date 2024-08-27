const fs = require("fs").promises;

exports.readJSONFile = async (path) => {
  try {
    const data = await fs.readFile(path, "utf8");
    const res = JSON.parse(data);
    return res;
  } catch (error) {
    console.error("Error reading '" + path + "':\n\t", error);
  }
};
