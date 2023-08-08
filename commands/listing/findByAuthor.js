const { SlashCommandBuilder } = require('discord.js');
const { checkPerms } = require('../../checkPerms');
const { findQuoteByAuthor } = require('../../database/findQuotes');


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
		if (!checkPerms(interaction)) {
			return interaction.reply('You do not have permission to use this command');
		}

		const guildId = interaction.guildId;
		const authorToFind = interaction.options.getString('quoteauthor');

		try {
			const cursor = await findQuoteByAuthor(guildId, authorToFind);

			if (!cursor) {
				await interaction.reply('An error occurred or no quotes found.');
			}
			else {
				const quotes = await cursor.toArray();

				if (quotes.length === 0) {
					await interaction.reply(`No quotes by ${authorToFind} specified.`);
				}
				else {
					let formattedQuotes = '';

					for (const quote of quotes) {
						formattedQuotes += `Quote: ${quote.content}, author: ${quote.author}\n`;
					}

					await interaction.reply(`Quotes by ${authorToFind}:\n${formattedQuotes}`);
				}
			}
		}
		catch (error) {
			await interaction.reply('An error occurred: ' + error.message);
			console.log(error);
		}
	},
};