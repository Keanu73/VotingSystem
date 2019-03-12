exports.run = async (client, cmd, args) => {
  const res = await cmd.reply(`https://pastebin.com/d5dmbnXw`, client.label, "format")
  console.log(res)
}

exports.conf = {
  name: "info",
  permLevel: "0"
}