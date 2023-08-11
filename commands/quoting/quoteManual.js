const { SlashCommandBuilder } = require('discord.js');
const { addQuote } = require('../../database/addQuote');
const { checkPerms } = require('../../checkPerms');
const { findAllQuotes } = require('../../database/findQuotes');
const { oneQuoteSuccess, permissionErrorEmbed, quoteError } = require('../../embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quote')
		.setDescription('Save a message manually!')
		.addStringOption(option =>
			option
				.setName('text')
				.setDescription('What do you want to quote?')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('author')
				.setDescription('Who said this?')
				.setRequired(true),
		),

	async execute(interaction) {
		if (!checkPerms(interaction)) {
			return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
		}

		const content = interaction.options.getString('text');
		const author = interaction.options.getString('author');
		const creator = interaction.user?.tag;
		const guildId = interaction.guildId;
		const channelId = interaction.channelId;
		const quoteArray = await findAllQuotes(guildId);
		const count = quoteArray.length;

		try {
			await addQuote(author, content, guildId, channelId, creator);

			const quoteEmbed = oneQuoteSuccess(content, author, count + 1);
			return await interaction.reply({ embeds: [quoteEmbed], ephemeral: false });
		}
		catch (error) {
			console.log(error);
			return await interaction.reply({ embeds: [quoteError], ephemeral: true });
		}
	},
};