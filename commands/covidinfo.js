module.exports.run = (client, message, args, server) => {
  const { MessageEmbed } = require("discord.js");
  const https = require("https");

  message.channel.startTyping();
  https
    .get("https://covidapi.info/api/v1/global", resp => {
      let data = "";

      resp.on("data", chunk => {
        data += chunk;
      });

      resp.on("end", () => {
        const d = JSON.parse(data);
        message.channel.send(
          new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle("COVID-19 Statistics")
            .setColor(3447003)
            .setDescription("Here are the worldwide statistics for COVID-19!")
            .addField("Confirmed Cases", d.result.confirmed)
            .addField("Confirmed Deaths", d.result.deaths)
            .addField("Confirmed Recoveries", d.result.recovered)
            .addField("Data As Of", d.date)
            .addField("Sources", "[CovidAPI](https://covidapi.info/)")
            .addField(
              "Where you can get information/help?",
              "Refer to the [World Health Organization's](https://www.who.int/) website for trustable and reliable information about the COVID-19 pandemic!"
            )
            .setFooter(
              server.name + "  |  COVID-19 Statistics",
              server.iconURL()
            )
        );
        message.channel.stopTyping();
      });
    })
    .on("error", err => {
      message.channel.stopTyping();
      console.log(
        `An error has occured with the covidinfo command. This error occured while the Discord user ${message.author.tag}(${message.author.id}) was trying to execute the command covidinfo! This error has occured in the guild ${message.guild.server.name}(${message.guild.id}). The error is: ${err}`
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
    });
};

module.exports.config = {
  Name: "covidinfo",
  Category: "Information",
  Description:
    "Shows the statistics and information for the COVID-19 pandemic!",
  Aliases: ["covidstats"],
  Usage: "covidinfo",
  PermissionLevel: "[0] User"
};
