const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quotelink')
		.setDescription('Eternalise a message')
		.addStringOption(option =>
			option
				.setName('link')
				.setDescription('Link to the message you want to quote')
				.setRequired(true),
		),

	async execute(interaction) {
		const link = interaction.options.getString('link');

		const splitLink = link.split('/');
		const guildId = splitLink[4];
		const channelId = splitLink[5];
		const messageId = splitLink[6];

		try {
			// Fetching the message based on the link
			const guild = interaction.client.guilds.cache.get(guildId);
			const channel = guild.channels.cache.get(channelId);
			const message = await channel.messages.fetch(messageId);

			// Grabs message and username of who sent it
			const content = message.content;
			const author = message.author;
			const username = `${author.username}#${author.discriminator}`;

			interaction.reply(`message:${content}   author:${username}`);

			// Debug
			console.log(`message:${content}   author:${username}`);
		}
		catch (error) {
			console.error('Error retrieving the message:', error);
			interaction.reply('There was an error');
		}
	},
};