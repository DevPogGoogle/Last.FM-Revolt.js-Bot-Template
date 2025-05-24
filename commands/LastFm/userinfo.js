const fetch = require("node-fetch");
const config = require("../../config.json");
const { readUserData } = require("../../utils/userHandler");

module.exports = {
  name: "userinfo",
  aliases: ["ui"],
  description: "Show someone's Last.fm profile info. (Uses saved username if none is provided)",
  category: "LastFm",

  execute: async (msg, args) => {
    let username = args[0];
    const userData = readUserData();

    if (!username) {
      const saved = userData[msg.author.id];
      if (!saved || !saved.lastfm) {
        return msg.reply("❌ Please provide a Last.fm username or set one using `setfm`.");
      }
      username = saved.lastfm;
    }

    const apiKey = config.lastfmApiKey;
    if (!apiKey) return msg.reply("❌ Missing Last.fm API key in `config.json`.");

    const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${encodeURIComponent(
      username
    )}&api_key=${apiKey}&format=json`;

    try {
      const res = await fetch(apiUrl);
      const data = await res.json();

      const user = data?.user;
      if (!user) {
        return msg.reply(`❌ No user found for **${username}**.`);
      }

      const playcount = user.playcount || "0";
      const artistCount = user.artist_count || "unknown";
      const albumCount = user.album_count || "unknown";
      const trackCount = user.track_count || "unknown";
      const profileUrl = user.url || "No profile link available";

      msg.reply(
        `📄 **Last.fm Profile: ${user.name}**\n` +
          `> 💿 **Total Scrobbles**: ${playcount}\n` +
          `> 👤 **Artists**: ${artistCount} | **Tracks**: ${trackCount} | **Albums**: ${albumCount}\n` +
          `> 🌐 [View Profile](${profileUrl})`
      );
    } catch (err) {
      console.error("Error fetching Last.fm user info:", err);
      msg.reply("❌ Failed to fetch user info from Last.fm.");
    }
  },
};
