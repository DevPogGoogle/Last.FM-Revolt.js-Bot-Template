const { readUserData, writeUserData } = require("../../utils/userHandler");

module.exports = {
  name: "setfm",
  description: "Save your Last.fm username for future commands.",
  category: "LastFm",

  execute: async (msg, args) => {
    const username = args[0];
    if (!username) return msg.reply("❌ Please provide your Last.fm username.");

    const userId = msg.author.id;
    if (!userId) return msg.reply("❌ Could not determine your user ID.");

    const userData = readUserData();
    userData[userId] = { lastfm: username };
    writeUserData(userData);

    msg.reply(`✅ Saved your Last.fm username as **${username}**.`);
  },
};
