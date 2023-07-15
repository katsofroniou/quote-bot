const { createConnection, EntitySchema, PrimaryGeneratedColumn, Column } = require('typeorm');

// Defines table for quotes
class Quote {
    constructor() {
        this.id = undefined;
        this.author = undefined;
        this.content = undefined;
    }
}

// Create entity schema for Quote
const QuoteSchema = new EntitySchema({
    name: 'Quote',
    target: Quote,
    columns: {
        id: {
            primary: true,
            generated: 'increment',
            type: Number,
        },
        author: {
            type: String,
        },
        content: {
            type: String,
        },
    },
});

// Database connection
const engine = createConnection({
    type: 'sqlite',
    database: 'quotes.db',
    synchronize: true,
    entities: [QuoteSchema],
});

// Saves quotes to db
async function saveQuote(quote) {
    const connection = await engine;
    await connection.manager.save(quote);
}

// Deletes single quote
async function deleteQuote(quote) {
    const connection = await engine;
    await connection.manager.delete(quote);
}

// Deletes all quotes
async function deleteAllQuotes() {
    const connection = await engine;
    await connection.manager.delete(Quote);
}

// Creates table if it doesn't already exist
async function createQuotesTable() {
    const connection = await engine;
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