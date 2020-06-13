module.exports.run = (client, message, args, server) => {
  const { MessageEmbed } = require("discord.js");
  const data = args
    .join(" ")
    .split(/(\||;)/)
    .map(i => i.trim());
  const booktrackingchannel = message.guild.channels.cache.get(
    client.config.Discord_BookTrackingChannelId
  );
  const username = data[0];
  const WorkshopLink = data[2];
  const BookName = data[4];
  const member = message.mentions.members.first();

  if (!username && !WorkshopLink && !BookName && !member) {
    return message.channel.send(
      new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(15158332)
        .setTitle("Incorrect Usage!")
        .setDescription(":x: Please rerun this command with the correct usage!")
        .addField(
          "Correct Usage",
          "author <username> | <workshop link> | <book name> | <@author OR author <username>"
        )
        .setFooter(server.name + "  |  Incorrect Usage", server.iconURL())
    );
  }

  if (WorkshopLink && BookName && member) {
    booktrackingchannel.send(
      `<@${member.id}>, Your book ${BookName} has been made in <@${message.author.id}>'s workshop! Please DM any changes you'd like to make to <@${message.author.id}> within one week. Workshop Link: ${WorkshopLink}`
    );
  }

  client.noblox
    .getIdFromUsername(username)
    .then(function(id) {
      client.noblox
        .getRankInGroup(client.config.Roblox_GroupId, id)
        .then(function(rank) {
          if (rank < 4) {
            client.noblox
              .setRank({
                group: client.config.Roblox_GroupId,
                target: id,
                rank: 4
              })
              .then(function(newRole) {
                if (WorkshopLink && BookName && member) {
                  member.roles.add(
                    message.guild.roles.cache.find(r => r.name == "Author")
                  );
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
                          " and posted the book tracking notification in <#" +
                          booktrackingchannel +
                          ">!"
                      )
                      .setFooter(server.name + " | Success", server.iconURL())
                  );
                } else {
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
                          "!"
                      )
                      .setFooter(server.name + "  |  Success", server.iconURL())
                  );
                }
              })
              .catch(function(err) {
                console.log(
                  `An error has occured with the author command. This error occured while the Discord user ${message.author.tag}(${message.author.id}) was trying to rank the Roblox user ${username}! This error has occured in the guild ${message.guild.name}(${message.guild.id}). The error is: ${err}`
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
          } else {
            if (WorkshopLink && BookName && member) {
              message.channel.send(
                new MessageEmbed()
                  .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL()
                  )
                  .setColor(3066993)
                  .setTitle("Success")
                  .setDescription(
                    ":white_check_mark: I have successfully posted the book tracking notification in <#" +
                      booktrackingchannel +
                      ">!"
                  )
                  .setFooter(server.name + " | Success", server.iconURL())
              );
            } else {
              message.channel.send(
                new MessageEmbed()
                  .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL()
                  )
                  .setColor(15158332)
                  .setTitle("Error")
                  .setDescription("An error has occurred.")
                  .addField(
                    "Error(s)",
                    "This user has a role higher than or equal to the author role."
                  )
                  .setFooter(server.name + "  |  Error", server.iconURL())
              );
            }
          }
        })
        .catch(function(err) {
          console.log(
            `An error has occured with the author command. This error occured while the Discord user ${message.author.tag}(${message.author.id}) was trying to rank the Roblox user ${username}! This error has occured in the guild ${message.guild.name}(${message.guild.id}). The error is: ${err}`
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
        `An error has occured with the author command. This error occured while the Discord user ${message.author.tag}(${message.author.id}) was trying to rank the Roblox user ${username}! This error has occured in the guild ${message.guild.name}(${message.guild.id}). The error is: ${err}`
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
  Name: "author",
  Category: "Staff Member",
  Description: "Make someone a author.",
  Aliases: ["auth"],
  Usage:
    "author <username> | <workshop link> | <book name> | <@author> OR author <username>",
  PermissionLevel: "[1] Staff Member"
};
