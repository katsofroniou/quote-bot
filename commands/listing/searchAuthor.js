const { SlashCommandBuilder, quote, EmbedBuilder, Colors, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const { findQuoteByAuthor } = require('../../database/findQuotes');
const { errorEmbed, quoteAuthorNotFound, allQuotesAuthor, noQuoteError, notYourList} = require('../../embeds');

module.exports = {
	name: 'searchauthor',
	data: new SlashCommandBuilder()
		.setName('searchauthor')
		.setDescription('Search for quotes by a specific author')
		.addStringOption(option =>
			option
				.setName('author')
				.setDescription('What quote do you want to find?')
				.setRequired(true),
		),

	async execute(interaction) {
		try {
			const guildId = interaction.guildId;
			const authorToFind = interaction.options.getString('author');

			const cursor = await findQuoteByAuthor(guildId, authorToFind);

			if (!cursor) {
				await interaction.reply({ embeds: [noQuoteError], ephemeral: false });
			}
			else {
				const quotes = await cursor.toArray();

				if (quotes.length === 0) {
					await interaction.reply({ embeds: [noQuoteError], ephemeral:true });
					return;
				}

				const itemsPerPage = 15;
				const pageCount = Math.ceil(quotes.length / itemsPerPage);

				let currentPage = 1;
				let startIndex = (currentPage - 1) * itemsPerPage;
				let endIndex = currentPage * itemsPerPage;
				let currentQuotes = quotes.slice(startIndex, endIndex);

				const formattedQuotesList = currentQuotes.map((quote, index) => {
					const displayIndex = startIndex + index + 1;
					return `**${displayIndex}**) "${quote.content}" - ${quote.author}`;
					}).join('\n');

				const embed = new EmbedBuilder()
					.setColor(Colors.Orange)
					.setTitle(`:mag: Quotes by ${authorToFind} - Page ${currentPage}/${pageCount}`)
					.setDescription(formattedQuotesList);

				const prevButton = new ButtonBuilder()
					.setCustomId('prev')
					.setLabel('Previous')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(currentPage === 1);

				const nextButton = new ButtonBuilder()
					.setCustomId('next')
					.setLabel('Next')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(currentPage === pageCount);

				const buttonRow = new ActionRowBuilder()
					.addComponents(prevButton, nextButton);

				const reply = await interaction.reply({ embeds: [embed], components: [buttonRow], fetchReply: true });

				const filter = i => i.customId === 'prev' || i.customId === 'next';
				const collector = reply.createMessageComponentCollector({ filter, time: 60000 });

				collector.on('collect', async i => {
					if (i.user.id !== interaction.user.id) {
						await i.reply({ embeds: [notYourList], ephemeral: true });
						return;
					}

					if (i.customId === 'prev' && currentPage > 1) {
						currentPage--;
					}
					else if (i.customId === 'next' && currentPage < pageCount) {
						currentPage++;
					}

					startIndex = (currentPage - 1) * itemsPerPage;
					endIndex = currentPage * itemsPerPage;
					currentQuotes = quotes.slice(startIndex, endIndex);

					const updatedFormattedQuotesList = currentQuotes.map((quote, index) => {
						const displayIndex = startIndex + index + 1;
						return `**${displayIndex}**) "${quote.content}" - ${quote.author}`;
					}).join('\n');

					embed.setTitle(`:scroll: Quotes - Page ${currentPage}/${pageCount}`);
					embed.setDescription(updatedFormattedQuotesList);

					prevButton.setDisabled(currentPage === 1);
					nextButton.setDisabled(currentPage === pageCount);

					await i.update({ embeds: [embed], components: [buttonRow] });
				});

				collector.on('end', collected => {
					if (collected.size === 0) {
						buttonRow.components.forEach(component => component.setDisabled(true));
						reply.edit({ components: [buttonRow] });
					}
				});
			}
		}
		catch (error) {
			console.error('\nError:', error);
			await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		}
	},
};