const fs = require("fs");
const path = require("path");

const userDataPath = path.resolve(__dirname, "../data/userData.json");

function readUserData() {
  try {
    if (!fs.existsSync(userDataPath)) {
      fs.writeFileSync(userDataPath, "{}");
    }
    const data = fs.readFileSync(userDataPath, "utf8");
    return JSON.parse(data || "{}");
  } catch (err) {
    console.error("Error reading user data:", err);
    return {};
  }
}

function writeUserData(data) {
  try {
    fs.writeFileSync(userDataPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing user data:", err);
  }
}

module.exports = {
  readUserData,
  writeUserData,
};
