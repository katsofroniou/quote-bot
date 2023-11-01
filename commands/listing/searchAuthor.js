const { SlashCommandBuilder, quote, Colors} = require('discord.js');
const { findQuoteByAuthor } = require('../../database/findQuotes');
const { errorEmbed, noQuoteError} = require('../../embeds');
const { handleQuotesInteraction} = require('../../multipleQuoteLogic');

module.exports = {
	name: 'searchauthor',
	data: new SlashCommandBuilder()
		.setName('searchauthor')
		.setDescription('Search for quotes by a specific author')
		.addStringOption(option =>
			option
				.setName('author')
				.setDescription('What quote do you want to find?')
				.setRequired(true),
		),

	async execute(interaction) {
		try {
			const guildId = interaction.guildId;
			const authorToFind = interaction.options.getString('author');

			const cursor = await findQuoteByAuthor(guildId, authorToFind);

			if (!cursor) {
				await interaction.reply({ embeds: [noQuoteError], ephemeral: false });
			}
			else {
				const quotes = await cursor.toArray();

				if (quotes.length === 0) {
					await interaction.reply({ embeds: [noQuoteError], ephemeral: true });
					return;
				}

				const colour = Colors.Orange;
				const title = `:mag: Quotes by ${authorToFind}`;

				await handleQuotesInteraction(interaction, quotes, colour, title);
			}
		} catch (error) {
			console.error('\nError:', error);
			await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		}
	},
};