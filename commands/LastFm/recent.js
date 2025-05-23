//Special Thanks to Asraye for this code (I'm too stupid to code this I'll be honest.)

const config = require("../../config.json");


module.exports = {
  name: "recent",
  description: "Show recent tracks (You need to define a username for this command to work)",
  category: "LastFm",
  execute: async (msg, args) => {
    const username = args[0];
    if (!username) return msg.reply("❌ Please provide a Last.fm username.");

    const lastfmApiKey = 'API_KEY' // hack type shi, LIKE WHY THE FUCK DOES IT WORK WHEN I PUT THE FUCKING API KEY HERE IN THIS FUCKING COMMAND????

    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${lastfmApiKey}&format=json&limit=5`;

    const res = await fetch(url);
    const data = await res.json();
    const tracks = data.recenttracks.track;

    if (!tracks || !tracks.length) return msg.reply("No recent tracks found.");

    const reply = tracks
      .map((t, i) => `> ${i + 1}. **${t.name}** by **${t.artist["#text"]}**`)
      .join("\n");

    msg.reply(`> 🎶 **Recent Tracks for ${username}:**\n${reply}`);
  }
};
