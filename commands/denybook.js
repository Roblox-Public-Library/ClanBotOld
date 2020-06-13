module.exports.run = (client, message, args, server) => {
  const { MessageEmbed } = require("discord.js");
  const data = args
    .join(" ")
    .split(/(\||;)/)
    .map(i => i.trim());
  const BookTrackingChannel = message.guild.channels.cache.get(
    client.config.Discord_BookTrackingChannelId
  );
  const TypeOfDenial = data[0];

  if (!TypeOfDenial) {
    return message.channel.send(
      new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(15158332)
        .setTitle("Incorrect Usage!")
        .setDescription(":x: Please rerun this command with the correct usage!")
        .addField(
          "Correct Usage",
          "denybook plagiarism | <bookname> | <@author>\ndenybook locked | <@author>\ndenybook violation | <bookname> | <reason> | <@author>"
        )
        .setFooter(server.name + "  |  Incorrect Usage", server.iconURL())
    );
  }

  if (TypeOfDenial.toLowerCase() == "plagiarism") {
    const BookName = data[2];
    const member = message.mentions.members.first();

    if (!BookName || !member) {
      return message.channel.send(
        new MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setColor(15158332)
          .setTitle("Incorrect Usage!")
          .setDescription(
            ":x: Please rerun this command with the correct usage!"
          )
          .addField(
            "Correct Usage",
            "denybook plagiarism | <bookname> | <@author>"
          )
          .setFooter(server.name + "  |  Incorrect Usage", server.iconURL())
      );
    }
    BookTrackingChannel.send(
      `${member}, your book "${BookName}" has been denied due to plagiarism. All books must be at least 50% original content and cite all external sources.`
    ).then(message.channel.send(":white_check_mark: Success!"));
  } else if (TypeOfDenial.toLowerCase() == "locked") {
    const member = message.mentions.members.first();
    if (!member) {
      return message.channel.send(
        new MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setColor(15158332)
          .setTitle("Incorrect Usage!")
          .setDescription(
            ":x: Please rerun this command with the correct usage!"
          )
          .addField("Correct Usage", "denybook locked | <@author>")
          .setFooter(server.name + "  |  Incorrect Usage", server.iconURL())
      );
    }
    BookTrackingChannel.send(
      `${member}, your book (the title couldn’t be read) has been denied because it was locked. Please use the following guide below to send a shareable link and resubmit to <#493997691630780436>\nhttps://media.discordapp.net/attachments/493997691630780436/709592830762287185/How_to_Submit_A_Book.png`
    ).then(message.channel.send(":white_check_mark: Success!"));
  } else if (TypeOfDenial.toLowerCase() == "violation") {
    const BookName = data[2];
    const reason = data[4];
    const member = message.mentions.members.first();
    if (!BookName || !reason || !member) {
      return message.channel.send(
        new MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setColor(15158332)
          .setTitle("Incorrect Usage!")
          .setDescription(
            ":x: Please rerun this command with the correct usage!"
          )
          .addField(
            "Correct Usage",
            "denybook violation | <bookname> | <reason> | <@author>"
          )
          .setFooter(server.name + "  |  Incorrect Usage", server.iconURL())
      );
    }
    BookTrackingChannel.send(
      `${member}, your book "${BookName}" has been denied due to ${reason}. Feel free to resubmit after you make the appropriate changes to follow the Roblox ToU.\nhttps://docs.google.com/document/d/1pA5aZtRIexReZm-PaAeRGV5rskbsCfxNvXZwdw2GGeo/edit`
    ).then(message.channel.send(":white_check_mark: Success!"));
  } else {
    return message.channel.send(
      ":x: Invalid type of denial.\nValid types of denial: plagiarism, locked, violation."
    );
  }
};

module.exports.config = {
  Name: "denybook",
  Category: "Review Committee",
  Description: "Deny a book.",
  Aliases: ["dbook"],
  Usage:
    "denybook plagiarism | <bookname> | <@author> OR denybook locked | <@author> OR denybook violation | <bookname> | <reason> | <@author>",
  PermissionLevel: "[1] Staff Member"
};
