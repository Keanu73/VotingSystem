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
    if (!client.owner === "Keanu73") throw "You cannot run the electorate system under another license."
    const cmdFiles = await readdir("./commands/")
    cmdFiles.forEach(async f => {
      client.logger.log(`Loading command: ${f}`)
      if (!f.endsWith(".js")) return
      try {
        const module = require(`./commands/${f}`)
        client.commands.set(module.conf.name, module)
      } catch (e) {
        client.logger.error(e)
      }
    })
    client.logger.log("Keansian Voting System has loaded.")

    const announce = function() {
      client.logger.log("Announcement being broadcasted.")
      client.players.forEach(function(plr) {
        plr = plr.name
        const citizen = readfile("./files/citizens.json").then(data => data.indexOf(plr) >= 0).catch(err => (console.error(err)))
        const candidate = readfile("./files/candidates.json").then(data => data.indexOf(plr) >= 0).catch(err => (console.error(err)))
        const check = client.votes.ensure(plr, {
          voted: false
        })
      
        if (!citizen || check && client.votes.get(plr).voted || candidate) return
        client.tell(plr, "\n§6§l§nA Special Announcement§r\nCitizens, today is §lMarch the 13th.§r\nIt is the Keansian Election Day. \nThe running candidates are §a§lKeanu73§r and §a§lgollark.§r\nYou may only vote once, so consider your vote wisely.\nVoting will end at midnight UTC.\nCommands: \\vote, \\candidates, \\info", client.label, "format")
      })
      if (Date.now >= 1552557600000) clearInterval(announcement)
    }
    announce()
    var announcement = setInterval(announce, 7200000)
  })
  .catch(e => {
    client.logger.error(e)
  })

// Listen to events
client.on("command", async function(cmd) {
  const command = client.commands.get(cmd.command)
  if (!command) return
  const citizen = await readfile("./files/citizens.json").then(data => data.indexOf(cmd.player.name) >= 0).catch(err => (client.logger.error(err)))
  console.log(citizen)
  const level = citizen ? 1 : 0
  console.log(level)
  if (command.conf.permLevel > level) return cmd.reply("You cannot *run* this command.", client.label)
  command.run(client, cmd, cmd.args)
})