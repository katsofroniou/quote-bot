// Discord.js
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dbFunc = require('./database/dbFunc');

// Config
// Token
require('dotenv').config();
const token = process.env.DISCORD_TOKEN;

// New Client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Commands
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Gets all command files from command folder
// Returns error if command file is incomplete
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Read event files
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

dbFunc.connectDatabase().then(() => {
	// Log in w/ client token
	client.login(token);
}).catch((error) => {
	console.error('Error: ', error);
	process.exit(1);
});

process.on('beforeExit', () => {
	dbFunc.dbClient.close().then(() => console.log('Shutting down...'));
});