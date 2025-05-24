const { Client } = require("revolt.js");

const config = require("./config.json");

const registerCommands = require("./utils/loader.js");

const client = new Client();
const cooldowns = new Map();

const commands = registerCommands("./commands");
client.commands = commands;

client.on("ready", async () => {
  console.info("✅ Logged in as Scrobbled.");
  await client.api.patch("/users/@me", {
    status: { text: "wat dis?", presence: "Focus" },
  });
});

client.on("messageCreate", async (msg) => {
  if (!msg.content?.startsWith(config.prefix) || msg.author.bot) return;

  const args = msg.content.slice(config.prefix.length).trim().split(/\s+/);
  const cmdName = args.shift().toLowerCase();

  const command = client.commands.get(cmdName);
  if (!command) return;

  const now = Date.now();
  const key = `${msg.authorId}:${command.name}`;
  const cooldownTime = (config.cooldownSeconds || 3) * 1000;

  if (cooldowns.has(key)) {
    const elapsed = now - cooldowns.get(key);
    if (elapsed < cooldownTime) {
      const timeLeft = ((cooldownTime - elapsed) / 1000).toFixed(1);
      try {
        await msg.reply(`⏳ You're on cooldown! Try again in ${timeLeft}s.`);
      } catch {

      }
      return;
    }
  }

  cooldowns.set(key, now);
  setTimeout(() => cooldowns.delete(key), cooldownTime);

  try {
    await command.execute(msg, args, client);
  } catch (err) {
    console.error(`❌ Error running command "${cmdName}":`, err);
    try {
      await msg.reply("❌ An error occurred while executing the command.");
    } catch {

    }
  }
});

client.loginBot(config.token);
