const { SlashCommandBuilder } = require('discord.js');
const { deleteQuote } = require('../../database/deleteQuotes');
const { checkPerms } = require('../../checkPerms');
const { permissionErrorEmbed, oneDelete, errorEmbed } = require('../../embeds');


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
		if (!checkPerms(interaction)) {
			return interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
		}

		const guildId = interaction.guildId;
		const quoteToDel = interaction.options.getInteger('quoteid') - 1;
		const author = quoteToDel.author;
		const content = quoteToDel.content;

		try {
			await deleteQuote(guildId, quoteToDel);
			await interaction.reply({ embeds: [oneDelete(quoteToDel, author, content)], ephemeral: false });
		}
		catch (error) {
			await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			console.log('Error occured: ', error);
		}
	},
};