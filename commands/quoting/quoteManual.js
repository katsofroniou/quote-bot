const { SlashCommandBuilder } = require('discord.js');
const { addQuote } = require('../../database/addQuote');
const { checkPerms } = require('../../checkPerms');

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
		if (!checkPerms(interaction)) {
			return interaction.reply('You do not have permission to use this command');
		}

		const content = interaction.options.getString('text');
		const author = interaction.options.getString('author');
		const creator = `${interaction.user.username}#${interaction.user.discriminator}`;
		const guildId = interaction.guildId;
		const channelId = interaction.channelId;

		await addQuote(author, content, guildId, channelId, creator);

		interaction.reply(`Content: ${content}    Author: ${author}`);
		console.log(`Content: ${content}    Author: ${author}`);
	},
};