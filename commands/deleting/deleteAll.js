const { SlashCommandBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { deleteAllQuotes } = require('../../database/deleteQuotes');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deleteall')
		.setDescription('Delete all quotes'),

	async execute(interaction) {
		if (!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator)) {
			return interaction.reply('You do not have permission to use this command');
		}

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
				await deleteAllQuotes();
				await confirmation.update({ content: 'All quotes have been deleted!', components: [] });			}
		}
		catch (error) {
			await interaction.editReply({ content: 'Confirmation not received, aborting deletion process...', components: [] });
		}
	},
};