const fetch = require("node-fetch");
const config = require("../../config.json");
const { readUserData } = require("../../utils/userHandler");

module.exports = {
  name: "recent",
  description: "Show your most recently played tracks from Last.fm.",
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
    if (!apiKey) return msg.reply("❌ Last.fm API key is missing in `config.json`.");

    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(username)}&api_key=${apiKey}&format=json&limit=5`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const tracks = data?.recenttracks?.track;
      if (!tracks || !tracks.length) {
        return msg.reply(`❌ No recent tracks found for **${username}**.`);
      }

      const formatted = tracks
        .map((t, i) => {
          const name = t.name || "Unknown Title";
          const artist = t.artist?.["#text"] || "Unknown Artist";
          const now = t['@attr']?.nowplaying ? " (now playing)" : "";
          return `> ${i + 1}. **${name}** by **${artist}**${now}`;
        })
        .join("\n");

      msg.reply(`🎶 **Recent Tracks for ${username}:**\n${formatted}`);
    } catch (err) {
      console.error("Last.fm error:", err);
      msg.reply("❌ Error fetching data from Last.fm. Try again later.");
    }
  }
};
