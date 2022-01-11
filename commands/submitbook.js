const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("submitbook")
        .setDescription("📨 Submit a book to the library! 📨")
        .addStringOption(option => 
            option.setName("book_title")
                .setDescription("The title of the book.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("book_author")
                .setDescription("The author of the book, as what will appear in the final publication.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("book_link")
                .setDescription("The link to the book on Google Docs.")
                .setRequired(true)
        )
        .addUserOption(option => 
            option.setName("author_mention")
                .setDescription("The Discord user to ping when a tracking message is sent.")
                .setRequired(false)
        ),
    permissionCheck: async (interaction) => {
        return interaction.user.id === process.env.BOT_OWNER_ID;
    },
    execute: async (interaction) => {
        const client = interaction.client;
        const guild = interaction.guild;
        const member = interaction.member;

        const bookTitle = interaction.options.getString("book_title");
        const bookAuthor = interaction.options.getString("book_author");
        const bookLink = interaction.options.getString("book_link");
        const authorMention = interaction.options.getUser("author_mention") || member;

        const bookSubmissionsChannel = await guild.channels.fetch("927667295235506266");

        const embed = new MessageEmbed()
            .setColor("#3599db")
            .setTitle("📚   Book   📚")
            .addFields(
                { name: "Title", value: bookTitle, inline: false },
                { name: "Author", value: bookAuthor, inline: true },
            )
            .setTimestamp();
        if (authorMention) {
            embed.addField("Author Mention", authorMention.toString(), true);
        }
        embed.addField("Link", bookLink, false);

        await Promise.all([
            bookSubmissionsChannel.send({
                embeds: [embed]
            }),
            interaction.reply({ "content": "Succesfully submitted your book!", ephemeral: true })
        ]);
    },
};