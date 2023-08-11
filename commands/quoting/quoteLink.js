const { SlashCommandBuilder } = require('discord.js');
const { addQuote } = require('../../database/addQuote.js');
const { checkPerms } = require('../../checkPerms');
const { permissionErrorEmbed, diffServerError, oneQuoteSuccess, errorEmbed, emptyMessage, quoteError } = require('../../embeds');
const { findAllQuotes } = require('../../database/findQuotes');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quotelink')
		.setDescription('Save a message by link!')
		.addStringOption(option =>
			option
				.setName('link')
				.setDescription('Link to the message you want to quote')
				.setRequired(true),
		),

	async execute(interaction) {
		if (!checkPerms(interaction)) {
			return await interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
		}

		const link = interaction.options.getString('link');
		const splitLink = link.split('/');
		const guildId = splitLink[4];
		const channelId = splitLink[5];
		const messageId = splitLink[6];

		if (guildId !== interaction.guildId) {
			return await interaction.reply({ embeds: [diffServerError], ephemeral: true });
		}

		try {
			// Fetching the message based on the link
			const guild = interaction.client.guilds.cache.get(guildId);
			const channel = guild.channels.cache.get(channelId);
			const message = await channel.messages.fetch(messageId);

			// Grabs message and username of who sent it
			const content = message.content;
			const author = message.author?.tag;

			const count = (await findAllQuotes(guildId)).length;

			// Gets username of who ran command
			const creator = interaction.user?.tag;

			if (content.trim() === '' || message.attachments.size > 0) {
				return interaction.reply({ embeds: [emptyMessage], ephemeral: true });
			}

			try {
				await addQuote(author, content, guildId, channelId, creator);

				const successEmbed = oneQuoteSuccess(content, author, count);

				return await interaction.reply({ embeds: [successEmbed], ephemeral: false });
			}
			catch (error) {
				console.error(error.message);
				return await interaction.reply({ embeds: [quoteError], ephemeral: true });
			}
		}
		catch (error) {
			console.error('Error retrieving the message:', error);
			return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		}
	},
};