exports.run = async (client, cmd, args) => {
  const res = await cmd.reply(`[More Information](https://pastebin.com/d5dmbnXw)`, client.label)
  console.log(res)
}

exports.conf = {
  name: "info",
  permLevel: "0"
}