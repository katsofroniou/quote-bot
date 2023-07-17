const { db } = require('../bot.js');

// By author, id, all
function findQuoteByAuthor(author) {
	const findAuthor = db.prepare('SELECT * FROM quotes WHERE author = ?;');
	return findAuthor.all(author);
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