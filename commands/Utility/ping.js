const config = require("../../config.json");

module.exports = {
  name: "ping",
  description: "Ping the bot",
  category: "Utility",

  execute: async (msg) => {
    const ping = Date.now() - new Date(msg.createdAt).getTime();
    await msg.reply(`🤖 Beep boop! Bot ping: \`${ping}ms\``);
  }
};
