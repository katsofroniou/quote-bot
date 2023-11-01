const { SlashCommandBuilder, Colors } = require('discord.js');
const { findAllQuotes } = require('../../database/findQuotes');
const {errorEmbed, noQuoteError} = require('../../embeds');
const { handleQuotesInteraction} = require('../../multipleQuoteLogic');

module.exports = {
	name: 'listall',
	data: new SlashCommandBuilder()
		.setName('listall')
		.setDescription('List all quotes, don\'t blame me if you\'re scarred'),

	async execute(interaction) {
		try {
			const guildId = interaction.guildId;
			const quotesArray = await findAllQuotes(guildId);

			if (quotesArray.length === 0) {
				await interaction.reply({ embeds: [noQuoteError], ephemeral: true });
				return;
			}

			const colour = Colors.Orange;
			const title = `:scroll: Quotes`;

			await handleQuotesInteraction(interaction, quotesArray, colour, title);
		} catch (error) {
			console.error(error);
			await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		}
	},
};