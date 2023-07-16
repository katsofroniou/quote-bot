async function createTable(db) {
	try {
		await db.run(`
        CREATE TABLE IF NOT EXISTS quotes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                author TEXT
                content TEXT
        )`);

		console.log('Table created/already exists');
	}
	catch (err) {
		console.log(`Error occured: ${err}`);
	}
}

async function saveQuote(db, author, content) {
	try {
		await db.run(`
        INSERT INTO quotes (author, content)
        VALUES (?, ?);`, [author, content]);
	}
	catch (err) {
		console.log(`${err}`);
	}
}

module.exports = {
	createTable,
	saveQuote,
};