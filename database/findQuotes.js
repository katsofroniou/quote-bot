const { dbClient } = require('./dbFunc');

// By author, id, phrase, all
async function findQuoteByAuthor(guildId, author) {
	try {
		const database = dbClient.db(guildId);
		const quotesColl = database.collection('quotes');

		const regex = new RegExp(author, 'i');
		return await quotesColl.find({ author: regex });
	}
	catch (error) {
		console.log('Error finding quote: ', error);
		return null;
	}
}

async function findQuoteByPhrase(guildId, word) {
	try {
		const database = dbClient.db(guildId);
		const quotesColl = database.collection('quotes');

		const regex = new RegExp(word, 'i');
		return await quotesColl.find({ content: regex }).toArray();
	}
	catch (error) {
		console.log('Error finding quotes: ', error);
		return null;
	}
}

async function findQuoteById(guildId, index) {
	try {
		const database = dbClient.db(guildId);
		const quotesColl = database.collection('quotes');

		return await quotesColl.findOne({ _id: index });
	}
	catch (error) {
		console.log('Error finding quote: ', error);
		return null;
	}
}

async function findAllQuotes(guildId) {
	try {
		const database = dbClient.db(guildId);
		const quotesColl = database.collection('quotes');

		return await quotesColl.find().toArray();
	}
	catch (error) {
		console.log('Error finding quotes: ', error);
		return [];
	}
}

module.exports = {
	findQuoteByAuthor,
	findQuoteByPhrase,
	findQuoteById,
	findAllQuotes,
};