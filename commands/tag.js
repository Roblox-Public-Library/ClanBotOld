module.exports.run = (client, message, args, server) => {
  const { MessageEmbed } = require("discord.js");
  const data = args
    .join(" ")
    .split(/(\||;)/)
    .map(i => i.trim());
  const action = data[0];

  if (action == "create") {
    const TagName = data[2];
    const TagContent = data[4];

    if (!TagName || !TagContent) {
      return message.channel.send(
        ":x: Please provide the tag content and/or name."
      );
    }
    client.tags.set(TagName, TagContent);
    message.channel.send(":white_check_mark: Success!");
  } else if (action == "delete") {
    const TagName = data[2];
    if (!TagName) {
      message.channel.send(":x: Please provide the tag name.");
    }

    if (!client.tags.has(TagName)) {
      return message.channel.send(":x: That tag does not exist.");
    }

    client.tags.delete(TagName);
    message.channel.send(":white_check_mark: Success!");
  } else if (action == "edit") {
    const TagName = data[2];
    const TagContent = data[4];

    if (!TagName || !TagContent) {
      return message.channel.send(
        ":x: Please provide the tag content and/or name."
      );
    }
    if (!client.tags.has(TagName)) {
      return message.channel.send(":x: That tag does not exist.");
    }

    client.tags.set(TagName, TagContent);
    message.channel.send(":white_check_mark: Success!");
  } else if (action == "view") {
    const TagName = data[2];
    if (!TagName) {
      return message.channel.send(":x: Please provide the tag name.");
    }

    if (!client.tags.has(TagName)) {
      return message.channel.send(":x: That tag does not exist.");
    }
    message.channel.send(
      `**Name:** ${TagName}\n\n**Content:** ${client.tags.get(TagName)}`
    );
  } else if (action == "viewall") {
    const AllTags = client.tags.keyArray().join(", ");

    if (!AllTags) {
      return message.channel.send(":x: There are no tags.");
    }
    message.channel.send("**List Of Tags:**\n\n" + AllTags);
  } else {
    const TagName = action;

    if (!client.tags.has(TagName)) {
      return message.channel.send(":x: That tag does not exist.");
    }

    message.channel.send(client.tags.get(action));
  }
};

module.exports.config = {
  Name: "tag",
  Category: "Staff Member",
  Description: "A fully developed tag system.",
  Aliases: ["tags"],
  Usage: "create, delete, edit, view, viewall",
  PermissionLevel: "[1] Staff Member"
};
