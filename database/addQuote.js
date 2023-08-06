const { dbClient } = require('../database/dbFunc');

async function addQuote(author, content) {
	try {
		const database = dbClient.db('dbams');
		const quotesColl = database.collection('quotes');

		const quote = {
			author: author,
			content: content,
		};

		// eslint-disable-next-line no-unused-vars
		const result = await quotesColl.insertOne(quote);
	}
	catch (error) {
		console.log('Error adding quote: ', error);
	}
}

module.exports = {
	addQuote,
};