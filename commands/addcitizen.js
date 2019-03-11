const { promisify } = require("util")
const readfile = promisify(require("fs").readFile)
const writefile = promisify(require("fs").writeFile)

exports.run = async (client, cmd, args) => {
    const file = JSON.parse("./citizens.json")
    console.log(JSON.parse("./citizens.json"))
    const citizen = args[0]
    file.push(citizen)
    await writefile("./citizens.json", JSON.stringify(file, null, 4), 'utf8').then(data => {
        if (!data) return
        cmd.reply("§aThe command has run successfully.", client.label, "format")
    })
    .catch(err => console.error(err))
}

exports.conf = {
  name: "addcitizen",
  permLevel: "Citizen"
}