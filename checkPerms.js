const { PermissionsBitField } = require('discord.js');

function checkPerms(interaction) {
	return interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator);
}

module.exports = {
	checkPerms,
};