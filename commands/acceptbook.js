module.exports.run = (client, message, args, server) => {
  const { MessageEmbed } = require("discord.js");
  const request = require("request");
  const data = args
    .join(" ")
    .split(/(\||;)/)
    .map(i => i.trim());
  const BookTrackingChannel = message.guild.channels.cache.get(
    client.config.Discord_BookTrackingChannelId
  );
  const username = data[0];
  const BookName = data[2];
  const BookLink = data[4];
  const member = message.mentions.members.first();

  if (!username || !BookName || !BookLink) {
    return message.channel.send(
      new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(15158332)
        .setTitle("Incorrect Usage!")
        .setDescription(":x: Please rerun this command with the correct usage!")
        .addField(
          "Correct Usage",
          "acceptbook <username> | <bookname> | <booklink> | <@author>\nacceptbook <username> | <bookname> | <booklink>"
        )
        .setFooter(server.name + "  |  Incorrect Usage", server.iconURL())
    );
  }

  if (member) {
    BookTrackingChannel.send(
      `${member}, your book "${BookName}" has been approved and is available for a librarian to claim. Congratulations!`
    );
    const options = {
      method: "POST",
      url: "https://api.trello.com/1/cards",
      qs: {
        name: `${BookName} by ${username} // <@${member.id}>`,
        desc: `${BookLink}`,
        idList: client.config.Trello_ApprovedSubmissionsIdList,
        keepFromSource: "all",
        key: process.env.Trello_APIkey,
        token: process.env.Trello_Token
      }
    };

    request(options, function(err) {
      if (err) {
        console.log(
          `An error has occured with the acceptbook command. This error occured with the Discord user ${message.author.tag}(${message.author.id})! This error has occured in the guild ${message.guild.name}(${message.guild.id}). The error is: ${err}`
        );
        console.log(" - - - - - - - - - - - - - - - - - - - - -");
        return message.channel.send(
          new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor(15158332)
            .setDescription(
              "An error has occured, the developer has been notified!"
            )
            .setFooter(server.name + "  |  Error", server.iconURL())
        );
      } else message.channel.send(":white_check_mark: Success!");
    });
  } else {
    const options = {
      method: "POST",
      url: "https://api.trello.com/1/cards",
      qs: {
        name: `${BookName} by ${username}`,
        desc: `${BookLink}`,
        idList: client.config.Trello_ApprovedSubmissionsIdList,
        keepFromSource: "all",
        key: process.env.Trello_APIkey,
        token: process.env.Trello_Token
      }
    };

    request(options, function(err) {
      if (err) {
        console.log(
          `An error has occured with the acceptbook command. This error occured with the Discord user ${message.author.tag}(${message.author.id})! This error has occured in the guild ${message.guild.name}(${message.guild.id}). The error is: ${err}`
        );
        console.log(" - - - - - - - - - - - - - - - - - - - - -");
        return message.channel.send(
          new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor(15158332)
            .setDescription(
              "An error has occured, the developer has been notified!"
            )
            .setFooter(server.name + "  |  Error", server.iconURL())
        );
      } else message.channel.send(":white_check_mark: Success!");
    });
  }
};

module.exports.config = {
  Name: "acceptbook",
  Category: "Review Committee",
  Description: "Accept a book.",
  Aliases: ["abook"],
  Usage:
    "acceptbook <username> | <bookname> | <booklink> | <@author> OR acceptbook <username> | <bookname> | <booklink>",
  PermissionLevel: "[1] Staff Member"
};
