const { dbClient } = require('../database/dbFunc');

async function addQuote(author, content, guildID, creator, link) {
	try {
		// Database name
		const database = dbClient.db(guildID);

		// Table name
		const quotesColl = database.collection('quotes');

		const quote = {
			author: author,
			content: content,
			creator: creator,
			link: link,
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