const fs = require('fs');
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const dotenv = require('dotenv');

dotenv.config();

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.argv[2];


const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	console.log(`Adding command to command list: ${command.data.name}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(DISCORD_BOT_TOKEN);

if (guildId) {
	console.log("Sending commands to guild: " + guildId);
	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);
} else {
	console.log("Sending commands to global application");
	rest.put(Routes.applicationCommands(clientId), { body: commands })
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);
}