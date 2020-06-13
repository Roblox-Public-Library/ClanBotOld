module.exports = client => {
  client.user.setActivity(client.config.Discord_Prefix + "help", {
    type: "PLAYING"
  });
  console.log("Connected to Discord as " + client.user.tag + "!");
  console.log(" - - - - - - - - - - - - - - - - - - - - -");
};
