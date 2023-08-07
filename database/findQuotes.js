const { dbClient } = require('./dbFunc');

// By author, id, all
async function findQuoteByAuthor(guildId, creator) {
	try {
		const database = dbClient.db(guildId);
		const quotesColl = database.collection('quotes');

		return await quotesColl.findOne({ creator: creator });
	}
	catch (error) {
		console.log('Error finding quote: ', error);
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
	findQuoteById,
	findAllQuotes,
};