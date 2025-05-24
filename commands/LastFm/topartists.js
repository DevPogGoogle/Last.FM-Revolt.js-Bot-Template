const fetch = require("node-fetch");
const config = require("../../config.json");
const { readUserData } = require("../../utils/userHandler");

const validPeriods = ["overall", "7day", "1month", "3month", "6month", "12month"];

module.exports = {
  name: "topartists",
  aliases: ["ta"],
  description: "Show your top artists over a timespan.",
  category: "LastFm",

  execute: async (msg, args) => {
    let username = args[0];
    let period = args[1];

    const userData = readUserData();

    if (!username || validPeriods.includes(username.toLowerCase())) {
      const saved = userData[msg.author.id];
      if (!saved || !saved.lastfm) {
        return msg.reply("❌ Please provide a Last.fm username or set one using `setfm`.");
      }
      period = username || "overall"; 
      username = saved.lastfm;
    }

    if (!period || !validPeriods.includes(period.toLowerCase())) {
      return msg.reply(
        "❌ Please provide a valid timespan.\nValid options: `overall`, `7day`, `1month`, `3month`, `6month`, `12month`"
      );
    }

    period = period.toLowerCase();

    const apiKey = config.lastfmApiKey;
    if (!apiKey) return msg.reply("❌ Last.fm API key is missing in `config.json`.");

    const url = `http://ws.audioscrobbler.com/2.0/?method=user.getTopArtists&user=${encodeURIComponent(
      username
    )}&api_key=${apiKey}&period=${period}&limit=5&format=json`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const artists = data?.topartists?.artist;
      if (!artists || !artists.length) {
        return msg.reply(`❌ No top artists found for **${username}** during **${period}**.`);
      }

      const formatted = artists
        .map((a, i) => `> ${i + 1}. **${a.name}** – ${a.playcount} plays`)
        .join("\n");

      msg.reply(`🎤 **Top Artists for ${username}** (*${period}*):\n${formatted}`);
    } catch (err) {
      console.error("Last.fm error:", err);
      msg.reply("❌ Failed to fetch data from Last.fm. Please try again later.");
    }
  },
};
