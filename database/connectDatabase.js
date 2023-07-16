const sqlite3 = require('sqlite3');

async function connectToDatabase() {
	try {
		const db = new sqlite3.Database('quotes.db');

		console.log('Connected to the database');
		return db;
	}
	catch (error) {
		console.error('Error connecting to the database:', error);
	}
}

module.exports = {
	connectToDatabase,
};