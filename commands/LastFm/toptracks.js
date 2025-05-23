//Special Thanks to Asraye for the help on this code (I'm too stupid to code this alone I'll be honest.)

const config = require("../../config.json");


module.exports = {
  name: "toptracks",
  aliases: ["tt"],
  description: "Show your top tracks. (You need to define a username and timespan for this command to work. Timespan can be overall, 7day, 1month, 3month, 6month or 12month.)",
  category: "LastFm",
  execute: async (msg, args) => {
    const username = args[0];
    if (!username) return msg.reply("❌ Please provide a Last.fm username.");
        const timespan = args[1];
    if (!timespan) return msg.reply("❌ Please provide a timespan. Can be overall, 7day, 1month, 3month, 6month or 12month.");

    const lastfmApiKey = 'API_KEY' // hack type shi, LIKE WHY THE FUCK DOES IT WORK WHEN I PUT THE FUCKING API KEY HERE IN THIS FUCKING COMMAND????



    const url = `http://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user=${username}&api_key=${lastfmApiKey}&period=${timespan}&limit=5&format=json`;

    const res = await fetch(url);
    const data = await res.json();
    const artists = data.toptracks.track;

        if (!artists) return msg.reply("You haven't listened to any tracks yet, scrobble a song to get started!");

    const reply = artists
      .map((t, i) => `> ${i + 1}. **${t.name}** by **${t.artist["name"]}** - ${t.playcount} plays`)
      .join("\n");

    msg.reply(`> 💽 **${username}'s top tracks:**\n${reply}`);
  }
};
