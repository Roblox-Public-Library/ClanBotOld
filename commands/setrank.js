module.exports.run = (client, message, args, server) => {
  const { MessageEmbed } = require("discord.js");
  const logchannelid = message.guild.channels.cache.get(
    client.config.Discord_LogChannelId
  );
  const data = args
    .join(" ")
    .split(/(\||;)/)
    .map(i => i.trim());
  const username = data[0];
  const rank = data[2];
  const member = message.mentions.members.first();

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

  if (!rank) {
    return message.channel.send(
      new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(15158332)
        .setTitle("Specify A Rank")
        .setDescription(
          ":x: Please rerun this command and specify a rank to rank the target user to"
        )
        .setFooter(server.name + "  |  Specify A Rank Number", server.iconURL())
    );
  }

  if (member) {
    member.roles
      .add(message.guild.roles.cache.find(r => r.name == rank))
      .catch(function() {});
  }

  client.noblox
    .getIdFromUsername(username)
    .then(function(id) {
      client.noblox
        .getRankInGroup(client.config.Roblox_GroupId, id)
        .then(function(oldRoleId) {
          client.noblox
            .getRankNameInGroup(client.config.Roblox_GroupId, id)
            .then(function(oldRoleName) {
              client.noblox
                .setRank({
                  group: client.config.Roblox_GroupId,
                  target: id,
                  name: rank
                })
                .then(function(newRole) {
                  logchannelid
                    .send(
                      new MessageEmbed()
                        .setTitle("Ranking Logs")
                        .setDescription(
                          `The setrank command has been used in <#${message.channel.id}>!\n[Jump To Command](${message.url})`
                        )
                        .addField(
                          "Ranker Info",
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
                        .addField(
                          "Old Rank",
                          oldRoleName + " [" + oldRoleId + "]",
                          true
                        )
                        .addField(
                          "New Rank",
                          newRole.name + " [" + newRole.rank + "]",
                          true
                        )
                        .setFooter(
                          server.name + "  |  Ranking Logs",
                          server.iconURL()
                        )
                    )
                    .then(
                      message.channel.send(
                        new MessageEmbed()
                          .setAuthor(
                            message.author.tag,
                            message.author.displayAvatarURL()
                          )
                          .setColor(3066993)
                          .setTitle("Success")
                          .setDescription(
                            ":white_check_mark: I have successfully ranked " +
                              username +
                              " to " +
                              newRole.name +
                              " [" +
                              newRole.rank +
                              "]!"
                          )
                          .setFooter(
                            server.name + "  |  Success",
                            server.iconURL()
                          )
                      )
                    );
                })
                .catch(function(err) {
                  console.log(
                    `An error has occured with the setrank command. This error occured while the Discord user ${message.author.tag}(${message.author.id}) was trying to rank the Roblox user ${username}! This error has occured in the guild ${message.guild.name}(${message.guild.id}). The error is: ${err}`
                  );
                  console.log(" - - - - - - - - - - - - - - - - - - - - -");
                  return message.channel.send(
                    new MessageEmbed()
                      .setAuthor(
                        message.author.tag,
                        message.author.displayAvatarURL()
                      )
                      .setColor(15158332)
                      .setTitle("Error")
                      .setDescription("An error has occurred.")
                      .addField("Error(s)", err)
                      .setFooter(server.name + "  |  Error", server.iconURL())
                  );
                });
            });
        });
    })
    .catch(function(err) {
      console.log(
        `An error has occured with the setrank command. This error occured while the Discord user ${message.author.tag}(${message.author.id}) was trying to rank the Roblox user ${username}! This error has occured in the guild ${message.guild.name}(${message.guild.id}). The error is: ${err}`
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
  Name: "setrank",
  Category: "Staff Member",
  Description: "Rank a member of the Roblox group.",
  Aliases: ["rank"],
  Usage: "setrank <username> <rank> <reason>",
  PermissionLevel: "[1] Staff Member"
};
