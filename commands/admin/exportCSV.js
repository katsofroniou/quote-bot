const { SlashCommandBuilder } = require('discord.js');
const { findAllQuotes } = require('../../database/findQuotes');
const fs = require('fs');
const { checkPerms } = require('../../checkPerms');
const { join } = require('path');
const { permissionErrorEmbed, exportSuccess, noQuoteError } = require('../../embeds');

module.exports = {
	name: 'exportcsv',
	data: new SlashCommandBuilder()
		.setName('exportcsv')
		.setDescription('Export all quotes as a CSV file'),

	async execute(interaction) {
		if (!checkPerms(interaction)) {
			return interaction.reply({ embeds: [permissionErrorEmbed], ephemeral: true });
		}

		const guildId = interaction.guildId;
		const quotesArray = await findAllQuotes(guildId);

		if (quotesArray.length === 0) {
			return interaction.reply({ embeds: [noQuoteError], ephemeral: true });
		}

		const csvData = quotesArray.map(quote => {
			return `${quote._id},"${quote.content}","${quote.author}","${quote.channel_id}","${quote.creator}"`;
		}).join('\n');

		const csvFilePath = join(__dirname, 'quotes.csv');

		fs.writeFileSync(csvFilePath, 'ID,Content,Author,Channel ID,Creator\n' + csvData);

		await interaction.reply({ embeds: [exportSuccess], files: [csvFilePath], ephemeral: true });

		// Clean up the temporary CSV file
		fs.unlinkSync(csvFilePath);
	},
};