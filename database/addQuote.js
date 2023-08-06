const { dbClient, db_name } = require('../database/dbFunc');

async function addQuote(author, content) {
	try {
		const database = dbClient.db(db_name);
		const quotesColl = database.collection('quotes');

		const quote = {
			author: author,
			content: content,
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