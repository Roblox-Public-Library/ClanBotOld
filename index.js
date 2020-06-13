const fs = require("fs");
const config = require("./config.json");
const discord = require("discord.js");
const enmap = require("enmap");
const noblox = require("noblox.js");
const dotenv = require("dotenv").config();
const pkg = require("./package.json");
const client = new discord.Client();

client.tags = new enmap({
  name: "tags"
});
client.discord = discord;
client.noblox = noblox;
client.config = config;
client.package = pkg;

client.commands = new discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    client.commands.set(props.config.Name, props);
  });
});

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

async function login() {
  await client.login(process.env.Discord_Token).catch(function(err) {
    console.log(
      `An error has occured while connecting to Discord. The error is: ${err}`
    );
    console.log(" - - - - - - - - - - - - - - - - - - - - -");
  });
  if (
    !process.env.Roblox_Cookie.startsWith(
      "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_"
    )
  ) {
    await noblox.setCookie(
      "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_" +
        process.env.Roblox_Cookie
    );
  } else {
    await noblox.setCookie(process.env.Roblox_Cookie).catch(function() {});
  }
  await noblox
    .getCurrentUser()
    .then(function(user) {
      console.log("Connected to Roblox as " + user.UserName + "!");
      console.log(" - - - - - - - - - - - - - - - - - - - - -");
    })
    .catch(function() {});
}

login();
