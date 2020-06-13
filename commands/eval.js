module.exports.run = (client, message, args, server) => {
  const { MessageEmbed } = require("discord.js");
  const code = args.join(" ");

  if (!code) {
    return message.channel.send(
      new MessageEmbed()
        .setTitle("Specify Code To Evaluate")
        .setDescription(
          "Please rerun this command and specify code to evaluate"
        )
        .setColor(15158332)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setFooter(
          server.name + "  |  Specify Code To Evaluate",
          server.iconURL()
        )
    );
  }

  function clean(text) {
    if (typeof text === "string")
      return text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
  }
  try {
    let evaled = eval(code);

    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

    message.channel
      .send(
        new MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setColor(3066993)
          .setTitle("Eval Success!")
          .setFooter(server.name + "  |  Eval Success!", server.iconURL())
          .addField(":inbox_tray: Input", "```js\n" + code + "\n```")
          .addField(":outbox_tray: Output", "```" + clean(evaled) + "```")
      )
      .catch(function(err) {
        console.log(
          `An error has occured with the eval command. This error occured while the Discord user ${message.author.tag}(${message.author.id}) was trying to evaluate some code! This error has occured in the guild ${message.guild.name}(${message.guild.id}). The error is: ${err}`
        );
        console.log(" - - - - - - - - - - - - - - - - - - - - -");
        message.channel.send(
          new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor(15158332)
            .setTitle("Eval Error!")
            .setFooter(server.name + "  |  Eval Error!", server.iconURL())
            .setDescription("```" + clean(err) + "```")
        );
      });
  } catch (err) {
    console.log(
      `An error has occured with the eval command. This error occured while the Discord user ${message.author.tag}(${message.author.id}) was trying to evaluate some code! This error has occured in the guild ${message.guild.name}(${message.guild.id}). The error is: ${err}`
    );
    console.log(" - - - - - - - - - - - - - - - - - - - - -");
    message.channel.send(
      new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(15158332)
        .setTitle("Eval Error!")
        .setFooter(server.name + "  |  Eval Error!", server.iconURL())
        .setDescription("```" + clean(err) + "```")
    );
  }
};

module.exports.config = {
  Name: "eval",
  Category: "Developer",
  Description: "Evaluate JavaScript code.",
  Aliases: ["evaluate"],
  Usage: ["eval <code>"],
  PermissionLevel: "[2] Developer"
};
