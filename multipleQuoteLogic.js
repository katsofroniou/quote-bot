const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const { notYourList} = require('./embeds');


async function handleQuotesInteraction(interaction, quotesArray, colour, title) {
    const itemsPerPage = 15;
    const pageCount = Math.ceil(quotesArray.length / itemsPerPage);

    let currentPage = 1;
    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = currentPage * itemsPerPage;
    let currentQuotes = quotesArray.slice(startIndex, endIndex);

    const formattedQuotesList = currentQuotes.map((quote, index) => {
        const displayIndex = startIndex + index + 1;
        return `**${displayIndex}**) "${quote.content}" - ${quote.author}`;
    }).join('\n');

    const embed = createQuotesEmbed(colour, title, currentPage, pageCount, formattedQuotesList);

    const reply = await interaction.reply({ embeds: [embed], components: [createButtonRow(currentPage, pageCount)], fetchReply: true });

    const filter = i => i.customId === 'prev' || i.customId === 'next';
    const collector = reply.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
        if (i.user.id !== interaction.user.id) {
            await i.reply({ embeds: [notYourList], ephemeral: true });
            return;
        }

        if (i.customId === 'prev' && currentPage > 1) {
            currentPage--;
        } else if (i.customId === 'next' && currentPage < pageCount) {
            currentPage++;
        }

        startIndex = (currentPage - 1) * itemsPerPage;
        endIndex = currentPage * itemsPerPage;
        currentQuotes = quotesArray.slice(startIndex, endIndex);

        const updatedFormattedQuotesList = currentQuotes.map((quote, index) => {
            const displayIndex = startIndex + index + 1;
            return `**${displayIndex}**) "${quote.content}" - ${quote.author}`;
        }).join('\n');

        embed.setTitle(`:scroll: Quotes - Page ${currentPage}/${pageCount}`);
        embed.setDescription(updatedFormattedQuotesList);

        const updatedButtonRow = createButtonRow(currentPage, pageCount);
        await i.update({ embeds: [embed], components: [updatedButtonRow] });
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
            const disabledButtonRow = createButtonRow(currentPage, pageCount, true);
            reply.edit({ components: [disabledButtonRow] });
        }
    });
}

// Function to create the embed
function createQuotesEmbed(colour, title, currentPage, pageCount, formattedQuotesList) {
    return new EmbedBuilder()
        .setColor(colour)
        .setTitle(title)
        .setDescription(formattedQuotesList);
}


// Function to create the button row
function createButtonRow(currentPage, pageCount, isDisabled = false) {
    const prevButton = new ButtonBuilder()
        .setCustomId('prev')
        .setLabel('Previous')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(currentPage === 1 || isDisabled);

    const nextButton = new ButtonBuilder()
        .setCustomId('next')
        .setLabel('Next')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === pageCount || isDisabled);

    return new ActionRowBuilder().addComponents(prevButton, nextButton);
}

module.exports = {
    handleQuotesInteraction,
}