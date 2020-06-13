module.exports.run = (client, message, args, server) => {
  const { MessageEmbed } = require("discord.js");

  if (args[0]) {
    const lowerArgs = args[0].toLowerCase();
    const cmd = client.commands.get(lowerArgs);

    if (!cmd) {
      return message.channel.send(
        new MessageEmbed()
          .setTitle("Invalid Command")
          .setDescription(
            "Please try again, you have provided an invalid command!"
          )
          .setColor(15158332)
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setFooter(server.name + "  |  Invalid Command", server.iconURL())
      );
    } else {
      const commandHelpEmbed = new MessageEmbed()
        .setTitle("Help")
        .setColor(3447003)
        .setDescription(
          "Here is all the information about the " +
            cmd.config.Name +
            " command!"
        )
        .addField("Name", cmd.config.Name, true)
        .addField("Category", cmd.config.Category, true)
        .addField("Description", cmd.config.Description, true)
        .addField("Aliases", cmd.config.Aliases.join(", "), true)
        .addField("Usage", cmd.config.Usage, true)
        .addField("Permission Level", cmd.config.PermissionLevel, true)
        .setFooter(
          server.name + "  |  Help  |  " + cmd.config.Name,
          server.iconURL()
        )
        .setThumbnail(server.iconURL());

      async function DMsend() {
        await message.author.send(commandHelpEmbed);
        await message.reply("**check your DMs!**");
      }
      DMsend().catch(function() {
        message.channel.send(commandHelpEmbed);
      });
    }
  } else {
    const developerCommands = client.commands.filter(
      c => c.config.Category == "Developer"
    );
    const miscellaneousCommands = client.commands.filter(
      c => c.config.Category == "Miscellaneous"
    );
    const staffMemberCommands = client.commands.filter(
      c => c.config.Category == "Staff Member"
    );
    const revComCommands = client.commands.filter(
      c => c.config.Category == "Review Committee"
    );

    const helpEmbed = new MessageEmbed()
      .setTitle("Help")
      .setColor(3447003)
      .setDescription(
        "If you would like to get to know more of a certain command, execute `" +
          client.config.Discord_Prefix +
          "help <command>`."
      )
      .addField(
        "❯ Developer [" + developerCommands.size + "]",
        developerCommands.map(c => "`" + c.config.Name + "`").join(" ")
      )
      .addField(
        "❯ Miscellaneous [" + miscellaneousCommands.size + "]",
        miscellaneousCommands.map(c => "`" + c.config.Name + "`").join(" ")
      )
      .addField(
        "❯ Staff Member [" + staffMemberCommands.size + "]",
        staffMemberCommands.map(c => "`" + c.config.Name + "`").join(" ")
      )
      .addField(
        "❯ Review Committee [" + revComCommands.size + "]",
        revComCommands.map(c => "`" + c.config.Name + "`").join(" ")
      )
      .setThumbnail(server.iconURL())
      .setFooter(
        server.name + "  |  Help  |  Total Commands: " + client.commands.size,
        server.iconURL()
      );

    async function DMsend() {
      await message.author.send(helpEmbed);
      await message.reply("**check your DMs!**");
    }
    DMsend().catch(function() {
      message.channel.send(helpEmbed);
    });
  }
};

module.exports.config = {
  Name: "help",
  Category: "Miscellaneous",
  Description: "A list of commands you can use with our bot.",
  Aliases: ["cmds", "commands"],
  Usage: "help <command> OR help",
  PermissionLevel: "[0] User"
};
