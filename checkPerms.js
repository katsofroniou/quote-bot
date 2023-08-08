const { PermissionsBitField } = require('discord.js');

function checkPerms(interaction) {
	if (!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator)) {
		return interaction.reply('You do not have permission to use this command!');
	}
}

module.exports = {
	checkPerms,
};