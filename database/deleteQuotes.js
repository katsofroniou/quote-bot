const { db } = require('../bot.js');

function deleteQuote(index) {
	const deleteStatement = db.prepare('DELETE FROM quotes WHERE id = ?;');
	deleteStatement.run(index);
}

function deleteAllQuotes() {
	db.prepare('DELETE FROM quotes;').run();
}

module.exports = {
	deleteQuote,
	deleteAllQuotes,
};