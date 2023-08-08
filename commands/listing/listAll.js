const { SlashCommandBuilder } = require('discord.js');
const { checkPerms } = require('../../checkPerms');
const { findAllQuotes } = require('../../database/findQuotes');

module.exports = {
	name: 'listall',
	data: new SlashCommandBuilder()
		.setName('listall')
		.setDescription('Find all quotes'),

	async execute(interaction) {
		if (!checkPerms(interaction)) {
			return interaction.reply('You do not have permission to use this command');
		}

		try {
			const guildId = interaction.guildId;
			const quotes = await findAllQuotes(guildId);

			if (quotes.length === 0) {
				return await interaction.reply('No quotes found.');
			}
			else {
				let formattedQuotes = '';

				for (const quote of quotes) {
					formattedQuotes += `Quote: ${quote.content}, author: ${quote.author}\n`;
				}

				return await interaction.reply(`All quotes:\n${formattedQuotes}`);
			}
		}
		catch (error) {
			console.log(error);
			return await interaction.reply('An error occurred: ' + error.message);
		}
	},
};