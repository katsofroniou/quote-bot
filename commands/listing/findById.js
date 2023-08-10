const { SlashCommandBuilder } = require('discord.js');
const { findQuoteById, findAllQuotes } = require('../../database/findQuotes');
const { invalidQuoteId, oneQuoteFind, errorEmbed } = require('../../embeds');


module.exports = {
	name: 'findbyid',
	data: new SlashCommandBuilder()
		.setName('findbyid')
		.setDescription('Find a quote by id')
		.addIntegerOption(option =>
			option
				.setName('quoteid')
				.setDescription('What quote do you want to find?')
				.setRequired(true),
		),

	async execute(interaction) {
		const guildId = interaction.guildId;
		const quotesArray = await findAllQuotes(guildId);

		const id = interaction.options.getInteger('quoteid');
		const quoteToFind = id - 1;

		try {
			if (id === 0 || (id > quotesArray.length)) {
				return await interaction.reply({ embeds: [invalidQuoteId], ephemeral: false });
			}
			else {
				const quote = await findQuoteById(guildId, quoteToFind);
				const count = (await findAllQuotes(guildId)).length;
				await interaction.reply(oneQuoteFind(quote.content, quote.author, count));
			}
		}
		catch (error) {
			await interaction.reply({ embed: [errorEmbed], ephemeral: true });
			console.log(error);
		}
	},
};