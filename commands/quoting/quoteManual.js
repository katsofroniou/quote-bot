const { SlashCommandBuilder } = require('discord.js');

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

		interaction.reply(`Content: ${content}    Author: ${author}`);
		console.log(`Content: ${content}    Author: ${author}`);
	},
};