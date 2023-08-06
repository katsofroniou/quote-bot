const { MongoClient } = require('mongodb');

const username = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const db_name = process.env.MONGO_DB_NAME;

// Database
const MONGO_URI = `mongodb+srv://${username}:${password}@${db_name}.dsg1fxk.mongodb.net/?retryWrites=true&w=majority`;

// DB Connection
const dbClient = new MongoClient(MONGO_URI);

async function connectDatabase() {
	try {
		await dbClient.connect();
		console.log('Connected to database');
	}
	catch (error) {
		dbClient.close();
		console.error('Error connecting to database: ', error);
	}
}

module.exports = {
	connectDatabase,
	dbClient
}