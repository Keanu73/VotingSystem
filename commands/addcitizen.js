const { promisify } = require("util")
const readfile = promisify(require("fs").readFile)
const writefile = promisify(require("fs").writeFile)

exports.run = async (client, cmd, args) => {
  if (cmd.player.name === client.president) {
    const citizen = args[0]
    const response = client.citizens.push(citizen)
    const final = JSON.stringify(client.citizens, null, 4)
    writefile("./files/citizens.json", final).then(() => {
      cmd.reply("§aThe command has run successfully.", client.label, "format")
    })
    .catch(err => console.error(err))
  }
}

exports.conf = {
  name: "addcitizen",
  permLevel: "Citizen"
}