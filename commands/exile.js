module.exports.run = (client, message, args, server) => {
  const { MessageEmbed } = require("discord.js");
  const LogChannelId = message.guild.channels.cache.get(
    client.config.Discord_LogChannelId
  );
  const username = args[0];
  const reason = args.slice(1).join(" ");

  if (!username) {
    return message.channel.send(
      new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(15158332)
        .setTitle("Specify A Target User")
        .setDescription(
          ":x: Please rerun this command and specify a target user"
        )
        .setFooter(server.name + "  |  Specify A Target User", server.iconURL())
    );
  }

  client.noblox
    .getIdFromUsername(username)
    .then(function(id) {
      client.noblox
        .exile(client.config.Roblox_GroupId, id)
        .then(function() {
          LogChannelId.send(
            new MessageEmbed()
              .setTitle("Exile Logs")
              .setDescription(
                `The exile command has been used in <#${message.channel.id}>!\n[Jump To Command](${message.url})`
              )
              .addField(
                "Exiler Info",
                "Name: <@" +
                  message.author +
                  ">\n" +
                  "ID: " +
                  message.author.id,
                true
              )
              .addField(
                "User Info",
                "Name: " + username + "\n" + "ID: " + id,
                true
              )
              .addField("Reason", reason || "Unspecified", true)
              .setFooter(server.name + "  |  Exile Logs", server.iconURL())
          ).then(
            message.channel.send(
              new MessageEmbed()
                .setAuthor(
                  message.author.tag,
                  message.author.displayAvatarURL()
                )
                .setColor(3066993)
                .setTitle("Success")
                .setDescription(
                  ":white_check_mark: I have successfully exiled " +
                    username +
                    "!"
                )
                .setFooter(server.name + "  |  Success", server.iconURL())
            )
          );
        })
        .catch(function(err) {
          console.log(
            `An error has occured with the exile command. This error occured while the Discord user ${message.author.tag}(${message.author.id}) was trying to exile the Roblox user ${username}! This error has occured in the guild ${message.guild.name}(${message.guild.id}). The error is: ${err}`
          );
          console.log(" - - - - - - - - - - - - - - - - - - - - -");
          return message.channel.send(
            new MessageEmbed()
              .setAuthor(message.author.tag, message.author.displayAvatarURL())
              .setColor(15158332)
              .setTitle("Error")
              .setDescription("An error has occurred.")
              .addField("Error(s)", err)
              .setFooter(server.name + "  |  Error", server.iconURL())
          );
        });
    })
    .catch(function(err) {
      console.log(
        `An error has occured with the exile command. This error occured while the Discord user ${message.author.tag}(${message.author.id}) was trying to exile the Roblox user ${username}! This error has occured in the guild ${message.guild.name}(${message.guild.id}). The error is: ${err}`
      );
      console.log(" - - - - - - - - - - - - - - - - - - - - -");
      return message.channel.send(
        new MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setColor(15158332)
          .setTitle("Error")
          .setDescription("An error has occurred.")
          .addField("Error(s)", err)
          .setFooter(server.name + "  |  Error", server.iconURL())
      );
    });
};

module.exports.config = {
  Name: "exile",
  Category: "Staff Member",
  Description: "Exile a member of the Roblox group.",
  Aliases: ["groupkick"],
  Usage: "exile <username> <reason>",
  PermissionLevel: "[1] Staff Member"
};
