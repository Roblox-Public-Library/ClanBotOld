const fs = require('fs');
const { Client, Collection, Intents } = require("discord.js");
const dotenv = require('dotenv');

dotenv.config();

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
    ],
});

client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(`Adding command to bot: ${command.data.name}`)
    client.commands.set(command.data.name, command);
}


const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
    console.log(`Adding event to bot: ${event.name}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(DISCORD_BOT_TOKEN);