const { dbClient } = require('../database/dbFunc');

async function addQuote(author, content, guildID, channelId, creator) {
	try {
		// Database name
		const database = dbClient.db(guildID);

		// Table name
		const quotesColl = database.collection('quotes');

		const quote = {
			author: author,
			content: content,
			channel_id: channelId,
			creator: creator,
		};

		await quotesColl.insertOne(quote);
	}
	catch (error) {
		console.log('Error adding quote: ', error);
	}
}

module.exports = {
	addQuote,
};