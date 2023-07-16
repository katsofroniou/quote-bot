function createTable(db) {
	db.serialize(() =>
		db.run(`CREATE TABLE IF NOT EXISTS quote (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			author TEXT,
			content TEXT
		);`),
	);
}

function addQuote(db, author, quote) {
	db.serialize(() =>
		db.run('INSERT INTO quotes (author, content) VALUES (?, ?);',
			[author, quote],
			(err) => {
				console.error(err.message);
			}),
	);
}

function deleteQuote(db, index) {
	db.serialize(() =>
		db.run('DELETE FROM quotes WHERE id=?;',
			[index],
			(err) => {
				console.error(err.message);
			}),
	);
}

function deleteAllQuotes(db) {
	db.serialize(() =>
		db.run('DELETE FROM quotes;',
			(err) => {
				console.error(err.message);
			}),
	);
}

module.exports = {
	createTable,
	addQuote,
	getQuote,
	getAllQuotes,
	deleteQuote,
	deleteAllQuotes,
};

// db.serialize(() =>
// 	db.run(``),
// );