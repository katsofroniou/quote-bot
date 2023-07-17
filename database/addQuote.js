const { db } = require('../bot.js');

function addQuote(author, content) {
	const quoteStatement = db.prepare('INSERT INTO quotes (author, content) VALUES (?, ?);');

	quoteStatement.run(author, content);
	quoteStatement.finalize();
}

module.exports = {
	addQuote,
};