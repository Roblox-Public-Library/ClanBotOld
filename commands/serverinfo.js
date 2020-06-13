module.exports.run = (client, message, args, server) => {
  const { MessageEmbed } = require("discord.js");

  function checkDays(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days + (days == 1 ? " day" : " days") + " ago";
  }
  const serverInfoEmbed = new MessageEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL())
    .setFooter(message.guild.name + "  |  Server Info", message.guild.iconURL())
    .addField("Name", message.guild.name, true)
    .addField("ID", message.guild.id, false)
    .addField("Owner", `${message.guild.owner.user}`, false)
    .addField("Region", message.guild.region, true)
    .addField(
      "Total | Humans | Bots",
      `${message.guild.members.cache.size} | ${
        message.guild.members.cache.filter(member => !member.user.bot).size
      } | ${
        message.guild.members.cache.filter(member => member.user.bot).size
      }`,
      true
    )
    .addField("Verification Level", message.guild.verificationLevel, true)
    .addField("Channels", message.guild.channels.cache.size, true)
    .addField("Roles", message.guild.roles.cache.size, true)
    .addField(
      "Creation Date",
      `${message.channel.guild.createdAt
        .toUTCString()
        .substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`,
      true
    )
    .setThumbnail(message.guild.iconURL());
  message.channel.send(serverInfoEmbed);
};

module.exports.config = {
  Name: "serverinfo",
  Category: "Miscellaneous",
  Description: "Displays the info of the server.",
  Aliases: ["server"],
  Usage: "serverinfo",
  PermissionLevel: "[0] User"
};
