const sqlite3 = require('sqlite3').verbose();

function connectDatabase() {
	const db = new sqlite3.Database('../quotes.db', sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
		}
		else {
			console.error.log('Connected to database!');
		}
	});

	return db;
}

module.exports = {
	connectDatabase,
};