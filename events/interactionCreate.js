const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        const client = interaction.client;
		// console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
        if (!interaction.isCommand()) { return; }
        const command = client.commands.get(interaction.commandName);
        if (!command) { return; }
        try {
            if (!await command.permissionCheck(interaction)) {
                await interaction.reply({ 
                    embeds: [
                        new MessageEmbed()
                            .setColor("#ff0000")
                            .setTitle("❌   Insufficient Permission   ❌")
                            .setDescription("You do not have permission to use this command.")
                            .setFooter({
                                text: `${interaction.user.tag}`,
                                iconURL: `${interaction.user.displayAvatarURL()}`
                            })
                            .setTimestamp()
                    ], 
                    ephemeral: true 
                });
            } else {
                await command.execute(interaction);
            }
        } catch (error) {
            console.error(error);
            try {
                await interaction.reply({ 
                    content: 'There was an error while executing this command!', 
                    ephemeral: true 
                });
            } catch (e) {
                await interaction.editReply({ 
                    content: 'There was an error while executing this command!', 
                    ephemeral: true 
                });
            }
        }
    }
}