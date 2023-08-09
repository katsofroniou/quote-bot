const { EmbedBuilder } = require('discord.js');

const permissionErrorEmbed = new EmbedBuilder()
	.setColor('#FF0000')
	.setTitle('⚠️ You do not have permission to use this command!');

const errorEmbed = new EmbedBuilder()
	.setColor('#FF0000')
	.setTitle('⚠️ An error occured!');

const emptyMessage = new EmbedBuilder()
	.setColor('#FF0000')
	.setTitle('⚠️ No text to quote!');

const diffServerError = new EmbedBuilder()
	.setColor('#FF0000')
	.setTitle('⚠️ You can only quote messages from this server!');

const noCommandEmbed = new EmbedBuilder()
	.setColor('#FF0000')
	.setTitle('⚠️ This command does not exist!');

const quoteError = new EmbedBuilder()
	.setColor('#FF0000')
	.setTitle('⚠️ Error saving embed');

const noQuoteError = new EmbedBuilder()
	.setColor('#FF0000')
	.setTitle('⚠️ There are no saved quotes!');

function oneQuoteSuccess(content, author, count) {
	return new EmbedBuilder()
		.setColor('#58b327')
		.setTitle('✅ Quote Saved')
		.setDescription(`${content} - ${author}`)
		.setFooter({ text: `Quote #${count + 1}` });
}

module.exports = {
	permissionErrorEmbed,
	errorEmbed,
	diffServerError,
	noCommandEmbed,
	quoteError,
	noQuoteError,
	oneQuoteSuccess,
	emptyMessage,
};