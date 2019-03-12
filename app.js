const { promisify } = require("util")
const readdir = promisify(require("fs").readdir)
const readfile = promisify(require("fs").readFile)
const Enmap = require("enmap")
require('dotenv').config()

// Require module
const SwitchChat = require("switchchat")
const client = new SwitchChat.Client(process.env.LICENSE_KEY)

// Define president that can be changed
client.president = "Keanu73"

client.commands = new Enmap()

client.citizens = require("./files/citizens.json")

client.candidates = require("./files/candidates.json")

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
  .then(async () => {
    console.log("Connected! Licence owner: " + client.owner)
    const cmdFiles = await readdir("./commands/")
    cmdFiles.forEach(async f => {
      console.log(f)
      if (!f.endsWith(".js")) return
      try {
        const module = require(`./commands/${f}`)
        client.commands.set(module.conf.name, module)
      } catch (e) {
        console.error(e)
      }
    })
  })
  .catch(e => {
    console.error(e)
  })

client.tell("Keanu73", "")
// Listen to events
client.on("command", async function(cmd) {
  const command = client.commands.get(cmd.command)
  if (!command) return
  const citizen = await readfile("./files/citizens.json").then(data => data.indexOf(cmd.player.name) >= 0).catch(err => (console.error(err)))
  console.log(citizen)
  const level = citizen ? "Citizen" : "Regular"
  console.log(level)
  if (!command.conf.permLevel === level) cmd.reply("You cannot *run* this command.", client.label)
  command.run(client, cmd, cmd.args)
})