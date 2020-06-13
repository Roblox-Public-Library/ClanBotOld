module.exports.run = (client, message, args, server) => {
  const { MessageEmbed } = require("discord.js");

  const ConfirmEmbed = new MessageEmbed()
    .setTitle("Prompt")
    .setDescription(":warning: Are you sure you would like to reboot the bot?")
    .setColor(15844367)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setFooter(
      server.name +
        "  |  Confirm Reboot  |  This prompt will automatically end in 200 seconds",
      server.iconURL()
    );

  const SuccessEmbed = new MessageEmbed()
    .setTitle("Success!")
    .setDescription(
      ":white_check_mark: The bot has been successfully rebooted!"
    )
    .setColor(3066993)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setFooter(server.name + "  |  Success", server.iconURL());

  async function reboot() {
    await client.destroy();
    await client.login(process.env.Discord_Token);
    await client.user.setActivity(client.config.Discord_Prefix + "help", {
      type: "PLAYING"
    });
    console.log("The bot has been rebooted by " + message.author.tag + "!");
    await message.channel.send(SuccessEmbed);
  }

  message.channel.send(ConfirmEmbed);
  return message.channel
    .awaitMessages(m => m.author.id === message.author.id, {
      errors: ["time"],
      max: 1,
      time: 200000
    })
    .catch(function() {
      return message.channel.send("**Prompt Timed Out.**");
    })

    .then(confirm => {
      if (!confirm) return;
      confirm = confirm.array()[0];
      if (confirm.content.toLowerCase().includes("cancel")) {
        return message.channel.send("**Prompt cancelled.**");
      }
      let validAnswers = ["yes", "no"];
      if (!validAnswers.includes(confirm.content.toLowerCase())) {
        return message.channel.send(
          new MessageEmbed()
            .setTitle("Invalid Args")
            .setDescription(
              "Please try again, you have provided invalid arguments!"
            )
            .setColor(15158332)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setFooter(server.name + "  |  Invalid Args", server.iconURL())
        );
      }
      if (confirm.content.toLowerCase() == "no") {
        return message.channel.send("**Prompt cancelled.**");
      }
      if (confirm.content.toLowerCase() == "yes") {
        reboot().catch(function(err) {
          console.log(
            `An error has occured with the reboot command. This error occured while the Discord user ${message.author.tag}(${message.author.id}) was trying to reboot the bot! This error has occured in the guild ${message.guild.name}(${message.guild.id}). The error is: ${err}`
          );
          console.log(" - - - - - - - - - - - - - - - - - - - - -");
        });
      }
    });
};

module.exports.config = {
  Name: "reboot",
  Category: "Developer",
  Description: "Reboot the bot.",
  Aliases: ["restart"],
  Usage: "reboot",
  PermissionLevel: "[2] Developer"
};
