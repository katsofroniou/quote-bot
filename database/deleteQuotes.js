const { dbClient } = require('./dbFunc');
const { findAllQuotes } = require('./findQuotes');

async function deleteQuote(guildId, index) {
	try {
		const quotesArray = await findAllQuotes(guildId);

		const database = dbClient.db(guildId);
		const quotesColl = database.collection('quotes');

		const quoteToDelete = quotesArray[index];

		await quotesColl.deleteOne({ _id: quoteToDelete._id });
	}
	catch (error) {
		console.log('Error deleting quote from database: ', error);
	}
}

async function deleteAllQuotes(guildId) {
	try {
		const database = dbClient.db(guildId);
		const quotesColl = database.collection('quotes');

		await quotesColl.deleteMany({});
	}
	catch (error) {
		console.log('Error deleting all quotes: ', error);
	}
}

module.exports = {
	deleteQuote,
	deleteAllQuotes,
};