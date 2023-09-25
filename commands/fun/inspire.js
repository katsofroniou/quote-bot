const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { findAllQuotes } = require("../../database/findQuotes");
const { noQuoteError } = require("../../embeds");
const { getRandomImage } = require("./getRandomImage");
const { createInspiringImage } = require("./createInspiringImage");
require('dotenv').config();

module.exports = {
    name: 'inspire',
    data: new SlashCommandBuilder()
        .setName('inspire')
        .setDescription('Make an inspirational image from a random quote'),

    async execute(interaction) {
        const guildId = interaction.guildId;

        const quotesArray = await findAllQuotes(guildId);

        if (quotesArray.length === 0) {
            return await interaction.followUp({ embeds: [noQuoteError], ephemeral: true });
        }

        const randomIndex = Math.floor(Math.random() * quotesArray.length);
        const randomQuote = quotesArray[randomIndex];

        const content = randomQuote.content;
        const author = randomQuote.author;

        const { imageUrl, photographerName, unsplashPostUrl } = await getRandomImage();

        if (!imageUrl) {
            return await interaction.followUp('Failed to fetch image.');
        }

        const imageBuffer = await createInspiringImage(content, author, imageUrl);

        return await interaction.reply({
            content: `Photo by ${photographerName} on [Unsplash](<${unsplashPostUrl}>)`,
            files: [new AttachmentBuilder(imageBuffer, 'inspiring_image.png')]
        });
    }
};