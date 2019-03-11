const { promisify } = require("util")
const readdir = promisify(require("fs").readdir)
const readfile = promisify(require("fs").readFile)
const Enmap = require("enmap")

// Require module
const SwitchChat = require("switchchat")
const client = new SwitchChat.Client("5686f924-40c1-469d-bc49-1c2230949233")

client.commands = new Enmap()

client.citizens = require("./citizens.json")

client.candidates = require("./candidates.json")

client.votes = new Enmap({ 
  name: "votes",
  autoFetch: true,
  fetchAll: true,
  persistent: true
})

client.logger = require("./functions/Logger")

client.label = "Keansia Voting Systems"

// Connect to endpoint (returns promise)
client.connect()
  .then(() => {
    console.log("Connected! Licence owner: " + client.owner)
  })
  .catch(e => {
    console.error(e)
  })

// Listen to events
client.on("command", async function(cmd) {
  const citizen = await readfile("./citizens.json").then(data => data.indexOf(cmd.player.name) >= 0)
  const level = citizen ? "Citizen" : "Regular"
  const cmdFiles = await readdir("./commands/")
  cmdFiles.forEach(f => {
    if (!f.endsWith(".js") || !f === cmd) cmd.reply("The command you ran **does not exist.**", client.label)
    if (!f.conf.permLevel === level) cmd.reply("You cannot *run* this command.", client.label)
    const response = f.run(client, cmd, cmd.args)
    if (response) console.log(response)
  })
  //console.log(`${message.player}: ${message}`)
})