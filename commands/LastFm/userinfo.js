//Special Thanks to Asraye for the help on this code (I'm too stupid to code this alone I'll be honest.)

const config = require("../../config.json");


module.exports = {
  name: "userinfo",
  aliases: ["ui"],
  description: "Show someone's profile/user info (You need to define a username for this command to work.)",
  category: "LastFm",
  execute: async (msg, args) => {
    const username = args[0];
    if (!username) return msg.reply("❌ Please provide a Last.fm username.");

    const lastfmApiKey = 'API_KEY' // hack type shi, LIKE WHY THE FUCK DOES IT WORK WHEN I PUT THE FUCKING API KEY HERE IN THIS FUCKING COMMAND????



    const url = `http://ws.audioscrobbler.com/2.0/?method=user.GetInfo&user=${username}&api_key=${lastfmApiKey}&format=json`;

    const res = await fetch(url);
    const data = await res.json();
    const user = data.user;

        if (!user) return msg.reply("This user does not exist");

    msg.reply(`📄 **${username}'s profile!:**\n**💿 Scrobbles**: ${user.playcount}\n**👤 ${username}** has listened to ${user.artist_count} artists, ${user.track_count} tracks, and ${user.album_count} albums in total.\n**🌐 Profile Link**: ${user.url}`);
  }
};
