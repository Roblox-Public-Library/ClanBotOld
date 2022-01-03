const { SlashCommandBuilder } = require("@discordjs/builders");

const wait = require("util").promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shutdown")
        .setDescription("Shuts the bot down."),
    permissionCheck: async (interaction) => {
        return interaction.user.id === process.env.BOT_OWNER_ID;
    },
    async execute(interaction) {
        await interaction.reply("Shutting down...");
        interaction.client.destroy();
    },
};