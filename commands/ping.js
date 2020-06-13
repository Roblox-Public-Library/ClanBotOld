module.exports.run = (client, message, args, server) => {
  const { MessageEmbed } = require("discord.js");
  message.channel
    .send(
      new MessageEmbed()
        .setDescription("Pong")
        .setFooter(server.name + "  |  Ping", server.iconURL())
    )
    .then(sentEmbed => {
      let ping = sentEmbed.createdTimestamp - message.createdTimestamp;
      sentEmbed.edit(
        new MessageEmbed()
          .setDescription(`**Ping:** ${ping} ms`)
          .setFooter(server.name + "  |  Ping", server.iconURL())
      );
    });
};

module.exports.config = {
  Name: "ping",
  Category: "Miscellaneous",
  Description: "Displays the bot's ping.",
  Aliases: ["latency"],
  Usage: "ping",
  PermissionLevel: "[0] User"
};
