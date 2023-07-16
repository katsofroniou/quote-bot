const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Quote')
		.setType(ApplicationCommandType.Message),
	cooldown: 2,
	guildOnly: true,
	permission: 'create',

	async execute(interaction) {
		const message = interaction.options.getMessage('message');

		if (!message.content) {
			return await interaction.reply({
				content: 'There is no message to quote!',
				ephemeral: true,
			});
		}

		const author = message.author?.tag;
		const content = message.content;

		// Save to the db

		return await interaction.reply('Quote saved!');
	},
};