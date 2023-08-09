const { Events } = require('discord.js');
const { errorEmbed, noCommandEmbed } = require('../embeds');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		// If the command doesn't exist
		if (!command) {
			await interaction.followUp({ embeds: [noCommandEmbed], ephemeral: true });
			console.log(`No command matching ${interaction.commandName} was found.`);
		}

		try {
			// Executes command
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		}
	},
};