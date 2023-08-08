const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { deleteAllQuotes } = require('../../database/deleteQuotes');
const { checkPerms } = require('../../checkPerms');

module.exports = {
	name: 'deleteall',
	data: new SlashCommandBuilder()
		.setName('deleteall')
		.setDescription('Delete all quotes'),

	async execute(interaction) {
		if (!checkPerms(interaction)) {
			return interaction.reply('You do not have permission to use this command');
		}

		const guildId = interaction.guildId;

		const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm deletion')
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder()
			.addComponents(cancel, confirm);

		const response = await interaction.reply({
			content: 'Are you sure you want to delete all quotes?',
			components: [row],
		});

		const collectorFilter = i => i.user.id === interaction.user.id;

		try {
			const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 20000 });

			if (confirmation.customId === 'confirm') {
				try {
					await deleteAllQuotes(guildId);
					await confirmation.update({ content: 'Confirmed deletion', components: [] });
				}
				catch (error) {
					await confirmation.update({ content: 'There was an error deleting the quotes!', components: [] });
				}
			}
			else if (confirmation.customId === 'cancel') {
				await confirmation.update({ content: 'Cancelled deletion', components: [] });
			}
		}
		catch (error) {
			await interaction.editReply({ content: 'Confirmation times out. Deletion aborted.', components: [] });
		}
	},
};