const { SlashCommandBuilder, Embed, EmbedBuilder, Colors } = require('discord.js');
const { checkPerms } = require('../../checkPerms');
const { findAllQuotes } = require('../../database/findQuotes');


module.exports = {
	name: 'listall',
	data: new SlashCommandBuilder()
		.setName('listall')
		.setDescription('List all quotes, don\'t blame me if you\'re scarred'),

	async execute(interaction) {
		if (!checkPerms(interaction)) {
			return interaction.reply('You do not have permission to use this command');
		}

		const guildId = interaction.guildId;
		const quotesArray = await findAllQuotes(guildId);
		console.log(quotesArray);

		const quotesList = quotesArray.map(quote => {
			return `_id: ${quote._id}, author: ${quote.author}, content: ${quote.content}, channel_id: ${quote.channel_id}, creator: ${quote.creator}`;
		}).join('\n');

		const embed = new EmbedBuilder()
			.setColor(Colors.Orange)
			.setTitle('Quotes')
			.setDescription(`${quotesList}`);

		await interaction.reply({ embeds: [embed], ephemeral: false });
	},
};