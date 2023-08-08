const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { addQuote } = require('../../database/addQuote.js');

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

		if (!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator)) {
			return interaction.reply('You do not have permission to use this command');
		}

		if (guildId !== interaction.guildId) {
			return interaction.reply('You can only quote messages from this server!');
		}

		try {
			// Fetching the message based on the link
			const guild = interaction.client.guilds.cache.get(guildId);
			const channel = guild.channels.cache.get(channelId);
			const message = await channel.messages.fetch(messageId);

			// Grabs message and username of who sent it
			const content = message.content;
			const author = message.author;
			const username = `${author.username}#${author.discriminator}`;

			// Gets username of who ran command
			const creator = `${interaction.user.username}#${interaction.user.discriminator}`;

			try {
				await addQuote(username, content, guildId, channelId, creator);
				interaction.reply(`Quote by ${username} added successfully!`);
			}
			catch (error) {
				interaction.reply('Error adding to database...');
				console.error(error.message);
			}
		}
		catch (error) {
			console.error('Error retrieving the message:', error);
			interaction.reply('There was an error');
		}
	},
};