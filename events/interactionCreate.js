module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        const client = interaction.client;
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
        if (!interaction.isCommand()) { return; }
        const command = client.commands.get(interaction.commandName);
        if (!command) { return; }
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            try {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            } catch (e) {
                await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
}