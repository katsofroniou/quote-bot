const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { addQuote } = require('../../database/addQuote');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quote')
		.setDescription('Eternalize a message!')
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
		const content = interaction.options.getString('text');
		const author = interaction.options.getString('author');
		const creator = `${interaction.user.username}#${interaction.user.discriminator}`;
		const guildId = interaction.guildId;
		const channelId = interaction.channelId;

		if (!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator)) {
			return interaction.reply('You do not have permission to use this command');
		}

		await addQuote(author, content, guildId, channelId, creator);

		interaction.reply(`Content: ${content}    Author: ${author}`);
		console.log(`Content: ${content}    Author: ${author}`);
	},
};