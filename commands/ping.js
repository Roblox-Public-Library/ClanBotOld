const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong! 🏓"),
    execute: async (interaction) => {
        await interaction.reply("Pong! 🏓");
    },
};