const { SlashCommandBuilder } = require('discord.js');
const { findQuoteByAuthor } = require('../../database/findQuotes');
const { errorEmbed, quoteAuthorNotFound, allQuotesAuthor, noQuoteError } = require('../../embeds');


module.exports = {
	name: 'findbyauthor',
	data: new SlashCommandBuilder()
		.setName('findbyauthor')
		.setDescription('Find a quotes by author')
		.addStringOption(option =>
			option
				.setName('quoteauthor')
				.setDescription('What quote do you want to find?')
				.setRequired(true),
		),

	async execute(interaction) {
		const guildId = interaction.guildId;
		const authorToFind = interaction.options.getString('quoteauthor');

		try {
			const cursor = await findQuoteByAuthor(guildId, authorToFind);

			if (!cursor) {
				await interaction.reply({ embeds: [noQuoteError], ephemeral: false });
			}
			else {
				const quotes = await cursor.toArray();

				if (quotes.length === 0) {
					await interaction.reply([quoteAuthorNotFound(authorToFind)]);
				}
				else {
					let formattedQuotes = '';

					for (const quote of quotes) {
						formattedQuotes += `"${quote.content}" - ${quote.author}\n`;
					}

					await interaction.reply({ embeds: [allQuotesAuthor(authorToFind, formattedQuotes)], ephemeral: false });
				}
			}
		}
		catch (error) {
			await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			console.log(error);
		}
	},
};