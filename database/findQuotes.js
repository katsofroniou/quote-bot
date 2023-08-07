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

function findQuoteById(index) {
	const findId = db.prepare('SELECT * FROM quotes WHERE id = ?;');
	return findId.get(index);
}

function findAllQuotes() {
	return db.prepare('SELECT * FROM quotes;').all();
}

module.exports = {
	findQuoteByAuthor,
	findQuoteById,
	findAllQuotes,
};