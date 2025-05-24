const fetch = require("node-fetch");
const config = require("../../config.json");
const { readUserData } = require("../../utils/userHandler");

module.exports = {
  name: "np",
  description: "Show what the user is currently listening to on Last.fm.",
  category: "LastFm",

  execute: async (msg, args) => {
    const userData = readUserData();

    let username = args[0];

    if (!username) {
      const userSaved = userData[msg.author.id];
      if (!userSaved || !userSaved.lastfm) {
        return msg.reply("❌ Please provide a Last.fm username or set one using `setfm`.");
      }
      username = userSaved.lastfm;
    }

    const apiKey = config.lastfmApiKey;
    if (!apiKey) return msg.reply("❌ API key is not configured in `config.json`.");

    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(
      username
    )}&api_key=${apiKey}&format=json&limit=1`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const tracks = data?.recenttracks?.track;
      if (!tracks || !tracks.length) {
        return msg.reply(`❌ No recent tracks found for **${username}**.`);
      }

      const track = tracks[0];
      const isNowPlaying = track["@attr"]?.nowplaying === "true";

      const trackName = track.name || "Unknown Title";
      const artist = track.artist?.["#text"] || "Unknown Artist";
      const album = track.album?.["#text"] || "Unknown Album";
      const image = track.image?.length ? track.image[track.image.length - 1]["#text"] : null;
      const link = track.url || null;

      const response =
        `${isNowPlaying ? "🎧 **Now Playing**" : "🕒 **Last Played**"} for **${username}**:\n` +
        `> 🎵 **${trackName}**\n> 👤 **${artist}**\n> 💿 *${album}*` +
        (link ? `\n> 🔗 [Listen on Last.fm](${link})` : "");

      msg.reply(response, image ? { attachments: [image] } : undefined);
    } catch (error) {
      console.error("Last.fm API error:", error);
      msg.reply("❌ An error occurred while fetching data from Last.fm.");
    }
  },
};
