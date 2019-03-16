const { promisify } = require("util")
const readfile = promisify(require("fs").readFile)
const writefile = promisify(require("fs").writeFile)

exports.run = async (client, cmd, args) => {
    // Fetch citizen argument
    const citizen = args[0]
    // Push it into json var for easiness
    const response = client.citizens.push(citizen)
    // Stringify that in JSON and add some beautifying thingies
    const final = JSON.stringify(client.citizens, null, 4)
    // Write it to the file. In the future, we will most likely use some sort of other system to store the citizens. I'm open to suggestions.
    writefile("./files/citizens.json", final).then(() => {
      cmd.reply("§aThe command has run successfully.", client.label, "format")
    })
    .catch(err => console.error(err))
}

exports.conf = {
  name: "addcitizen",
  permLevel: "2"
}