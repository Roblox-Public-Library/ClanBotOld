const { SlashCommandBuilder } = require("@discordjs/builders");

const wait = require("util").promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shutdown")
        .setDescription("Shuts the bot down."),
    async execute(interaction) {
        await interaction.reply("Shutting down...");
        interaction.client.destroy();
    },
};