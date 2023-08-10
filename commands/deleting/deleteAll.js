const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { deleteAllQuotes } = require('../../database/deleteQuotes');
const { checkPerms } = require('../../checkPerms');
const { delConfirmation, delConfirmed, errorEmbed, delCancelled, delTimeOut, permissionErrorEmbed } = require('../../embeds');

module.exports = {
	name: 'deleteall',
	data: new SlashCommandBuilder()
		.setName('deleteall')
		.setDescription('Delete all quotes'),

	async execute(interaction) {
		if (!checkPerms(interaction)) {
			return interaction.reply({ embeds: [permissionErrorEmbed] });
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
			embeds: [delConfirmation],
			components: [row],
		});

		const collectorFilter = i => i.user.id === interaction.user.id;

		try {
			const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 20000 });

			if (confirmation.customId === 'confirm') {
				try {
					await deleteAllQuotes(guildId);
					await confirmation.update({ embeds: [delConfirmed], components: [] });
				}
				catch (error) {
					await confirmation.update({ embeds: [errorEmbed], components: [] });
				}
			}
			else if (confirmation.customId === 'cancel') {
				await confirmation.update({ embeds: [delCancelled], components: [] });
			}
		}
		catch (error) {
			await interaction.editReply({ embeds: [delTimeOut], components: [] });
		}
	},
};