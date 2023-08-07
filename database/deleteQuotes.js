const { dbClient } = require('./dbFunc');

async function deleteQuote(guildId, index) {
	try {
		const database = dbClient.db(guildId);
		const quotesColl = database.collection('quotes');

		await quotesColl.deleteOne({ _id: index });
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