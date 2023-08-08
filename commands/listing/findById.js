const { SlashCommandBuilder } = require('discord.js');
const { checkPerms } = require('../../checkPerms');
const { findQuoteById, findAllQuotes } = require('../../database/findQuotes');


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
		if (!checkPerms(interaction)) {
			return interaction.reply('You do not have permission to use this command');
		}

		const guildId = interaction.guildId;
		const quotesArray = await findAllQuotes(guildId);

		const id = interaction.options.getInteger('quoteid');
		const quoteToFind = id - 1;

		try {
			if (id === 0 || (id > quotesArray.length)) {
				return await interaction.reply('Invalid quote id, please try again');
			}
			else {
				const quote = await findQuoteById(guildId, quoteToFind);
				await interaction.reply(`${quote.content}, author: ${quote.author} -- quote found`);
			}
		}
		catch (error) {
			await interaction.reply('Error occured: ', error);
			console.log(error);
		}
	},
};