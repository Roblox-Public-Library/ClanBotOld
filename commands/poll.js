module.exports.run = (client, message, args, server) => {
  const { MessageEmbed } = require("discord.js");
  const poll = args.slice(0).join(" ");

  const SpecifyEmbed = new MessageEmbed()
    .setDescription("Please specify what you would like to poll on")
    .setColor(15158332)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setFooter(server.name + "  |  Specify Your Poll", server.iconURL());

  if (!poll) {
    return message.channel.send(SpecifyEmbed);
  }

  const PollEmbed = new MessageEmbed()
    .setTitle("Poll")
    .setDescription(poll)
    .setColor(3447003)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setFooter(server.name + "  |  Poll", server.iconURL());

  message.channel.send(PollEmbed).then(sentEmbed => {
    sentEmbed.react("👍");
    sentEmbed.react("👎");
  });
};

module.exports.config = {
  Name: "poll",
  Category: "Staff Member",
  Description: "Poll anything to be voted on!",
  Aliases: ["vote"],
  Usage: "poll <poll>",
  PermissionLevel: "[1] Staff Member"
};
