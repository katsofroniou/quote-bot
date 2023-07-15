const { createEngine, Column } = require('typeorm');

// Database connection
const engine = createEngine({
    type: 'sqlite',
    database: 'quotes.db',
    synchronize: true,
    entities: [Quote],
});

// Defines table for quotes
class Quote {
    @Column({ primary: true, generated: 'increment' })
    id;

    @Column()
    author;

    @Column()
    content;
}

// Saves quotes to db
async function saveQuote(quote) {
    const connection = await engine.createConnection();
    await connection.manager.save(quote);
}

// Deletes single quote
async function deleteQuote(quote) {
    const connection = await engine.createConnection();
    await connection.manager.delete(quote);
}

// Deletes all quotes
async function deleteAllQuotes() {
    const connection = await engine.createConnection();
    await connection.manager.delete(Quote);
}

// Creates table if it doesn't already exist
async function createQuotesTable() {
    const connection = await engine.createConnection();
    const hasTable = await connection.query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='quotes';"
    );
    if (hasTable.length === 0) {
        await connection.query(`
        CREATE TABLE quotes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          author TEXT,
          content TEXT
        );
      `);
    }
}

module.exports = {
    saveQuote,
    deleteQuote,
    deleteAllQuotes,
    createQuotesTable
};