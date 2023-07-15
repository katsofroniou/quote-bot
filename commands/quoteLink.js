const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quotelink')
		.setDescription('Eternalise a message')
		.addStringOption(option =>
			option
				.setName('link')
				.setDescription('Link to the message you want to quote')
				.required(true)
		),

	async execute(interaction) {
		const link = interaction.options.getString('link');

		if (link) {
			console.log(`{link}`)
		}
		else {
			console.log('No link provided, please try again')
		}
	}
}