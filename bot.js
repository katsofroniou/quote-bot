// Discord.js
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dbFunc = require('./database/dbFunc')

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

// Runs only once when client is ready
client.once(Events.ClientReady, c => {
	console.log(`${c.user.tag} is now online!`);
});

process.on('beforeExit', () => {
	console.log('Shutting down...');
	dbClient.close();
});

// Creates interaction listener
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	// Command interaction used
	const command = interaction.client.commands.get(interaction.commandName);

	// If the command doesn't exist
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
	}

	try {
		// Executes command
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

dbFunc.connectDatabase().then(() => {
	// Log in w/ client token
	client.login(token);
}).catch((error) => {
	console.error('Error: ', error);
	process.exit(1);
});