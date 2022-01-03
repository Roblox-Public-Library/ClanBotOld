const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("🏓 Pong! 🏓"),
    permissionCheck: async (interaction) => {
        return true;
    },
    execute: async (interaction) => {
        await interaction.reply("Pong! 🏓");
    },
};