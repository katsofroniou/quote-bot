function closeDatabase(db) {
	db.close((err) => {
		if (err) {
			console.error('Error while closing database', err);
		}
		else {
			console.log('Database connection closed.');
		}
	});
}

module.exports = {
	closeDatabase,
};