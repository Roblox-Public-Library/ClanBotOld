const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("acceptbook")
        .setDescription("Accepts a book and moves it to the next stage.")
        .addStringOption(option =>
            option.setName("current_location")
                .setDescription("The current location of the book.")
                .setRequired(true)
                .addChoice("Book Submissions", "booksub")
                .addChoice("Review Committee", "revcom")
                .addChoice("Quality Control Team", "qct")
        )
        .addStringOption(option => 
            option.setName("book_author")
                .setDescription("The author of the book.")   
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("book_title")
                .setDescription("The title of the book.")   
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("book_link")
                .setDescription("The link to the book.")   
                .setRequired(true)
        )
        .addUserOption(option => 
            option.setName("author_mention")
                .setDescription("A mention of the author in Discord.")
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
        let bookTrackingMessage;

        const client = interaction.client;
        const guild = interaction.guild;

        const currentLoc = interaction.options.getString("current_location");
        const bookTitle = interaction.options.getString("book_title");
        const bookAuthor = interaction.options.getString("book_author");
        const bookLink = interaction.options.getString("book_link");
        const authorMention = interaction.options.getMember("author_mention");

        const bookTrackingChannel = await guild.channels.fetch("856734562049589278"); // book-tracking

        if (currentLoc === "booksub" || currentLoc === "revcom") {
            // revcom and qct, respectively
            const channelToSend = currentLoc === "booksub" ? await guild.channels.fetch("856734588503326740") : await guild.channels.fetch("856734604715491388");
            const embed = new MessageEmbed()
                .setColor("#3599db")
                .setTitle('📚   Book   📚')
                .addFields(
                    { name: "Title", value: bookTitle, inline: false },
                    { name: "Author", value: bookAuthor, inline: true },
                )
                .setTimestamp();
                if (authorMention) {
                    embed.addField("Author Mention", authorMention.toString(), true);
                }
                embed.addField("Link", bookLink, false);
                await channelToSend.send({
                    embeds: [embed]
                });
            bookTrackingMessage = (authorMention ? `${authorMention}, your` : `The`) + ` book \`${bookTitle}\` ` + (currentLoc === "booksub" ? "has been sent to our Review Committee! Good luck!" : "has passed Review Committee and will be reviewed by our Quality Control Team shortly!"); 
            replyEmbed = new MessageEmbed()
                .setColor("#2fcd70")
                .setTitle("✅   Book Accepted   ✅")
                .setDescription((authorMention ? `${authorMention}'s` : `The`) + ` book \`${bookTitle}\` has been moved to the ` + (currentLoc === "booksub" ? "Review Committee." : "Quality Control Team."))
                .setTimestamp();
        } else if (currentLoc === "qct") {
            let url = "https://api.trello.com/1/cards?";
            url += `key=${process.env.TRELLO_API_KEY}`;
            url += `&token=${process.env.TRELLO_API_TOKEN}`;
            url += `&idList=${process.env.TRELLO_BOARD_ID}`;
            url += "&name=" + (authorMention ? `${bookTitle} by ${authorMention}` : `${bookTitle} by ${bookAuthor}`);
            url += `&desc=${bookLink}`;
            console.log(url);
            await fetch(url, {
                method: "POST",
            });
            bookTrackingMessage = (authorMention ? `${authorMention}, your` : `The`) + ` book \`${bookTitle}\` has been approved and is available for a librarian to claim. Congratulations!`;
            replyEmbed = new MessageEmbed()
                .setColor("#2fcd70")
                .setTitle("✅   Book Accepted   ✅")
                .setDescription((authorMention ? `${authorMention}'s` : `The`) + ` book \`${bookTitle}\` has been moved to the Trello.`)
                .setTimestamp();
        }

        await Promise.all([
            bookTrackingChannel.send(bookTrackingMessage),
            interaction.reply({
                embeds: [replyEmbed]
            })
        ]);
    },
};