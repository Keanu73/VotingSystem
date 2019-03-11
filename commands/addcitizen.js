const { promisify } = require("util")
const readfile = promisify(require("fs").readFile)
const writefile = promisify(require("fs").writeFile)

exports.run = async (client, cmd, args) => {
    await readfile("../citizens.json")
    .then(async data => {
        const citizen = args[0]
        var array = JSON.parse("../citizens.json")
        array.table.push(citizen)
        const json = JSON.stringify(array)
        await writefile("../citizens.json", JSON.stringify(json), 'utf8').then(data => {
            if (!data) return
            cmd.reply("§aThe command has run successfully.", client.label, "format")
        }).catch(err => console.error(err))
    })
    .catch(err => console.error(err))
}

exports.conf = {
  name: "addcitizen",
  permLevel: "Citizen"
}