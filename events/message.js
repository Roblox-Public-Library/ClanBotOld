module.exports = (client, message) => {
  const { MessageEmbed } = require("discord.js");
  const server = client.guilds.cache.get(client.config.Discord_GuildId);

  if (message.channel.type !== "text") {
    return;
  }

  const BookTrackingChannel = message.guild.channels.cache.get(
    client.config.Discord_BookTrackingChannelId
  );

  if (message.channel.id == BookTrackingChannel) {
    message.react("⭐");
  }

  if (message.channel.id == "516091685919522836") {
    message.react("✅").then(message.react("❌"));
  }

  if (message.author.bot) {
    return;
  }

  function wait(milliseconds) {
    let timeStart = new Date().getTime();
    while (true) {
      let elapsedTime = new Date().getTime() - timeStart;
      if (elapsedTime > milliseconds) {
        break;
      }
    }
  }

  function del(message) {
    wait(30000);
    message.delete();
  }

  if (
    message.channel.id == "493997691630780436" &&
    message.member.roles.cache.some(r => r.name === "Blacklisted")
  ) {
    message.delete().then(
      message.author
        .send(":x: You are blacklisted from submitting books!")
        .catch(function(err) {
          message
            .reply(":x: You are blacklisted from submitting books!")
            .then(m => del(m));
        })
    );
  }

  if (!message.content.startsWith(client.config.Discord_Prefix)) return;

  const args = message.content
    .slice(client.config.Discord_Prefix.length)
    .trim()
    .split(/ +/g);
  const commandName = args.shift().toLowerCase();
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      cmd => cmd.config.Aliases && cmd.config.Aliases.includes(commandName)
    );

  if (!command) return;

  if (
    command.config.PermissionLevel == "[2] Developer" &&
    message.author.id !== client.config.PermissionLevel_DeveloperId
  ) {
    return message.channel.send(
      new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(15158332)
        .setTitle("Invalid Permissions")
        .setDescription(":x: You do not have permission to use this command!")
        .addField(
          "Required Permission(s)",
          "User ID: " + client.config.PermissionLevel_DeveloperId
        )
        .setFooter(server.name + "  |  Invalid Permissions", server.iconURL())
    );
  } else if (
    command.config.PermissionLevel == "[1] Staff Member" &&
    !message.member.roles.cache.some(r =>
      client.config.PermissionLevel_StaffRoles.includes(r.name)
    )
  ) {
    return message.channel.send(
      new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(15158332)
        .setTitle("Invalid Permissions")
        .setDescription(":x: You do not have permission to use this command!")
        .addField(
          "Required Permission(s)",
          "Role(s): " + client.config.PermissionLevel_StaffRoles.join(" ,")
        )
        .setFooter(server.name + "  |  Invalid Permissions", server.iconURL())
    );
  }

  try {
    command.run(client, message, args, server);
  } catch (err) {
    console.log(
      `An error has occured with the ${command.config.Name} command. This error occured while the Discord user ${message.author.tag}(${message.author.id}) was trying to execute the command ${command.config.Name}! This error has occured in the guild ${message.guild.name}(${message.guild.id}). The error is: ${err.stack}`
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
  }
};
