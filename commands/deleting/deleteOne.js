const { SlashCommandBuilder } = require('discord.js');
const { deleteQuote } = require('../../database/deleteQuotes');
const { checkPerms } = require('../../checkPerms');


module.exports = {
	name: 'deleteone',
	data: new SlashCommandBuilder()
		.setName('deleteone')
		.setDescription('Delete a single quote')
		.addIntegerOption(option =>
			option
				.setName('quoteid')
				.setDescription('What quote do you want to delete?')
				.setRequired(true),
		),

	async execute(interaction) {
		checkPerms(interaction);

		const guildId = interaction.guildId;
		const quoteToDel = interaction.options.getInteger('quoteid') - 1;

		try {
			await deleteQuote(guildId, quoteToDel);
			await interaction.reply(`Quote #${interaction.options.getInteger('quoteid')} deleted!`);
		}
		catch (error) {
			await interaction.reply('Error deleting quote');
			console.log('Error occured: ', error);
		}
	},
};