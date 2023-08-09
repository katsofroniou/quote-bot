const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { addQuote } = require('../../database/addQuote');
const { checkPerms } = require('../../checkPerms');
const { permissionErrorEmbed, emptyMessage, errorEmbed, oneQuoteSuccess, quoteError } = require('../../embeds');
const { findAllQuotes } = require('../../database/findQuotes');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('quote this')
		.setType(ApplicationCommandType.Message),

	async execute(interaction) {
		try {
			if (!checkPerms(interaction)) {
				return interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
			}

			const messageId = interaction.targetId;

			// Fetch the message using the messageId
			const message = await interaction.channel.messages.fetch(messageId);

			if (!message.content) {
				return await interaction.reply({ embeds: [emptyMessage], ephemeral: true });
			}

			const guildId = interaction.guildId;
			const channelId = interaction.channel.id;
			const creator = interaction.user?.tag;
			const author = message.author?.tag;
			const content = message.content;

			const count = (await findAllQuotes(guildId)).length;

			console.log('Quoting message:', content);
			console.log('Quote saved to database.');

			try {
				await addQuote(author, content, guildId, channelId, creator);
				return await interaction.reply({ embeds: [oneQuoteSuccess(content, author, count + 1)], ephemeral: false });
			}
			catch (error) {
				console.log('Error occured: ', error);
				return await interaction.reply({ embeds: [quoteError], ephemeral: true });
			}
		}
		catch (error) {
			console.error('An error occurred:', error);
			return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		}
	},
};