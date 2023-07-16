const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Config
require('dotenv').config();
const token = process.env.DISCORD_TOKEN;
const clientID = process.env.DISCORD_APPLICATION_ID;

// Commands
const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Gets all command files from command folders
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	// Grab the SlashCommandBuilder.toJSON() output of each command's data
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct + prep rest instance
const rest = new REST().setToken(token);

// Deploy commands
(async () => {
	try {
		// Debug statement
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// Put refreshes bot commands
		const data = await rest.put(
			Routes.applicationCommands(clientID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		console.error(error);
	}
})();
