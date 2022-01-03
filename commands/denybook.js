const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("denybook")
        .setDescription("Denies a book submission.")
        .addStringOption(option => 
            option.setName("reason")
                .setDescription("The reason for denying the book submission.")
                .setRequired(true)
                .addChoice("Plagiarism", "plagiarism")
                .addChoice("Quality", "quality")
                .addChoice("Violation", "violation")
                .addChoice("Other", "other")
        )
        .addStringOption(option =>
            option.setName("book_title")
                .setDescription("The title of the book.") 
                .setRequired(true)   
        )
        .addUserOption(option => 
            option.setName("author_mention")
                .setDescription("A mention of the author in Discord.")
                .setRequired(false)
        )
        .addStringOption(option => 
            option.setName("reason_description")
                .setDescription("A more detailed description of why the book was denied.")
                .setRequired(false)    
        ),
    permissionCheck: async (interaction) => {
        return [
            process.env.RLC_REVCOM_ROLE_ID,
            process.env.RLC_QCT_ROLE_ID
        ].some((key) => {
            return interaction.member.roles.cache.has(key);
        });
    },
    execute: async (interaction) => {
        let replyEmbed;

        const guild = interaction.guild;

        const reason = interaction.options.getString("reason");
        const bookTitle = interaction.options.getString("book_title");
        const authorMention = interaction.options.getUser("author_mention");
        const reasonDescription = interaction.options.getString("reason_description");
        
        const bookTrackingChannel = await guild.channels.fetch("856734562049589278"); // book-tracking

        let bookTrackingMessage = (authorMention ? `${authorMention}, your` : "The") + ` book \`${bookTitle}\` has been denied`;

        switch (reason) {
            case "plagiarism": 
                bookTrackingMessage += " due to plagiarism. All books must be at least 50% original content and cite all external sources.";
            break;
            case "quality":
                bookTrackingMessage += " due to quality concerns." + (reasonDescription ? `Notes from the Quality Control Team have been provided below:\n\n${reasonDescription}` : ``);
            break;
            case "violation":
                bookTrackingMessage += " due to " + (reasonDescription ? `\`${reasonDescription}\`. ` : `violating Roblox or RLC policies. `) + "A simplified version of the Roblox Terms of Use is provided below:\n\nhttps://docs.google.com/document/d/1pA5aZtRIexReZm-PaAeRGV5rskbsCfxNvXZwdw2GGeo/edit";
            break;
            case "other":
                bookTrackingMessage += "." + (reasonDescription ? ` The following notes have been provided below:\n\n${reasonDescription}` : "");
            break;
        }

        await Promise.all([
            bookTrackingChannel.send(bookTrackingMessage),
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("#2fcd70")
                        .setTitle("❌   Book Denied   ❌")
                        .setDescription("Successfully denied " + (authorMention ? `${authorMention}'s ` : "the ") + `book \`${bookTitle}\`.`)
                        .setTimestamp()
                ]
            })
        ]);
    },
};