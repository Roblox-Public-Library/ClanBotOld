module.exports.run = (client, message, args, server) => {
  const { MessageEmbed } = require("discord.js");
  const data = args
    .join(" ")
    .split(/(\||;)/)
    .map(i => i.trim());
  const BookTrackingChannel = message.guild.channels.cache.get(
    client.config.Discord_BookTrackingChannelId
  );
  const BookName = data[0];
  const member = message.mentions.members.first();

  if (!BookName || !member) {
    return message.channel.send(
      new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(15158332)
        .setTitle("Incorrect Usage!")
        .setDescription(":x: Please rerun this command with the correct usage!")
        .addField("Correct Usage", "reviewbook <bookname> | <@author>")
        .setFooter(server.name + "  |  Incorrect Usage", server.iconURL())
    );
  }

  BookTrackingChannel.send(
    `${member}, your book "${BookName}" has been sent to our review committee. Good luck!`
  ).then(message.channel.send(":white_check_mark: Success!"));
};

module.exports.config = {
  Name: "reviewbook",
  Category: "Review Committee",
  Description: "Accept a book.",
  Aliases: ["rbook"],
  Usage: "reviewbook <bookname> | <@author>",
  PermissionLevel: "[1] Staff Member"
};
