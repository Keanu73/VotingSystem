exports.run = async (client, cmd, args) => {
  // Need to revamp the info command. I tried to display the text in the pastebin with the command, but it was supposedly too long for chat, so I had to put it on pastebin.
  // Maybe I should just print what each candidate promises instead of a full background on them.
  const res = await cmd.reply(`[More Information](https://pastebin.com/d5dmbnXw)`, client.label)
  console.log(res)
}

exports.conf = {
  name: "info",
  permLevel: "0"
}