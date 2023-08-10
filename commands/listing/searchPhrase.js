const { SlashCommandBuilder } = require('discord.js');
const { findQuoteByPhrase } = require('../../database/findQuotes');
const { errorEmbed, noQuoteWordError, multiQuoteFind } = require('../../embeds');


module.exports = {
	name: 'searchphrase',
	data: new SlashCommandBuilder()
		.setName('searchphrase')
		.setDescription('Search for quotes containing a certain phrase')
		.addStringOption(option =>
			option
				.setName('word')
				.setDescription('What phrase do you want to find?')
				.setRequired(true),
		),

	async execute(interaction) {
		const guildId = interaction.guildId;

		const wordToFind = interaction.options.getString('word');
		const quotes = await findQuoteByPhrase(guildId, wordToFind);

		try {
			if (quotes.length > 0) {
				const formattedQuotesList = quotes.map((quote, index) => {
					return `**${index + 1}**) "${quote.content}" - ${quote.author}`;
				}).join('\n');

				await interaction.reply({ embeds: [multiQuoteFind(wordToFind, formattedQuotesList)] });
			}
			else {
				interaction.reply({ embeds: [noQuoteWordError(wordToFind)], ephemeral: false });
			}
		}
		catch (error) {
			await interaction.reply({ embed: [errorEmbed], ephemeral: true });
			console.log(error);
		}
	},
};