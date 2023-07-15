// Discord.js
const { Client, Events, GatewayIntentBits } = require('discord.js');

// Database functions
const { saveQuote, deleteQuote, deleteAllQuotes, createQuotesTable } = require('./database.js');

// Config
// Token
require('dotenv').config();
const token = process.env.DISCORD_TOKEN;

// Create new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Runs only once when client is ready
client.once(Events.ClientReady, c => {
	console.log(`${c.user.tag} is now online!`);
});

// Log in w/ client token
client.login(token)