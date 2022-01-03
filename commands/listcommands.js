const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("listcommands")
        .setDefaultPermission(false)
        .setDescription("List available commands in the guild."),
    permissionCheck: async (interaction) => {
        return false;
    },
    execute: async (interaction) => {
        const commandIds = interaction.guild.commands.fetch();
        interaction.reply(`Fetched ${commandIds.size} commands.`);
    },
};