const { EmbedBuilder, MessageActionRow, MessageButton } = require('discord.js');

const QUOTES_PER_PAGE = 10;

const permissionErrorEmbed = new EmbedBuilder()
	.setColor('#FF0000')
	.setTitle('⚠️ You do not have permission to use this command!');

const errorEmbed = new EmbedBuilder()
	.setColor('#FF0000')
	.setTitle('⚠️ An error occured!');

const emptyMessage = new EmbedBuilder()
	.setColor('#FF0000')
	.setTitle('⚠️ No message to quote!');

function oneQuoteSuccess(content, author, count) {
	return new EmbedBuilder()
		.setColor('#58b327')
		.setTitle('✅ Quote Saved')
		.setDescription(`${content} - ${author}`)
		.setFooter({ text: `Quote #${count + 1}` });
}

function multiQuoteSuccess(quoteArray, page) {
	const pages = Math.ceil(quoteArray.length / QUOTES_PER_PAGE);

	const start = (page - 1) * QUOTES_PER_PAGE;
	const end = start + QUOTES_PER_PAGE;

	const embed = new EmbedBuilder()
		.setTitle(`Quotes - Page ${page}/${pages}`)
		.setColor('#00FF00');

	for (let i = start; i < end && i < quoteArray.length; i++) {
		const quote = quoteArray[i];
		embed.addField(`Quote #${i + 1}`, `Content: ${quote.content}\nAuthor: ${quote.author}`);
	}

	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('prev')
				.setLabel('Previous')
				.setStyle('PRIMARY'),
			new MessageButton()
				.setCustomId('next')
				.setLabel('Next')
				.setStyle('PRIMARY'),
		);

	return { embed, components: [row] };
}

module.exports = {
	permissionErrorEmbed,
	errorEmbed,
	oneQuoteSuccess,
	multiQuoteSuccess,
	emptyMessage,
};