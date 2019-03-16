const { promisify } = require("util")
const readdir = promisify(require("fs").readdir)
const readfile = promisify(require("fs").readFile)
const Enmap = require("enmap")
const moment = require("moment")
const config = require("./config.js")

// Require module
const SwitchChat = require("switchchat")
const client = new SwitchChat.Client(config.license)

// Define config in client
client.config = config
// Convert election start and end dates to unix ms timestamps for easy comparison
client.config.electionStart = moment(client.config.electionStart).format("x")

client.config.electionEnd = moment(client.config.electionEnd).format("x")

client.commands = new Enmap()
// Require citizens json file (possibly changed in the future)
client.citizens = require("./files/citizens.json")
// Require candidates json file (will be stored in enmap in future)
client.candidates = require("./files/candidates.json")
// Create votes enmap or load it from disk
client.votes = new Enmap({ 
  name: "votes",
  autoFetch: true,
  fetchAll: true,
  persistent: true
})
// Set the chatbox label
client.label = "Keansia Voting Systems"

// Connect to endpoint (returns promise)
client.connect()
  .then(async () => {
    // Read the commands directory
    const cmdFiles = await readdir("./commands/")
    // For each command...
    cmdFiles.forEach(async f => {
      console.log(`Loading command: ${f}`)
      // If there's any non-js files in the directory, don't read them.
      if (!f.endsWith(".js")) return
      try {
        // Require the command, then set it in the enmap for easy access.
        const module = require(`./commands/${f}`)
        client.commands.set(module.conf.name, module)
      } catch (e) {
        console.error(e)
      }
    })
    // Huzzah! We have loaded.
    console.log("Keansian Voting System has loaded.")

    const announce = function() {
      console.log("Announcement being broadcasted.")
      // For each player online..
      client.players.forEach(async function(plr) {
        plr = plr.name
        // Are they a Citizen?
        const citizen = await readfile("./files/citizens.json").then(data => data.indexOf(plr) >= 0).catch(err => (console.error(err)))
        // Are they a candidate?
        const candidate = await readfile("./files/candidates.json").then(data => JSON.parse(Buffer.from(data).toString()).includes(plr)).catch(err => (console.error(err)))
        // Have they voted yet?
        const check = client.votes.ensure(plr, {
          voted: false
        })
      
        if (!citizen || check && client.votes.get(plr).voted || candidate) return // If any of these conditions apply, return.
        
        // List candidates (stolen from the candidates command lol)
        let cands = ""

        for (const c in client.candidates) {
          // Grammatics.
          if (c === client.candidates.length) cands += ` and §a§l${client.candidates[c - 1]}§r`
          cands += ` §a§l${client.candidates[c]}§r,`
        }
        // Tell the person the broadcastory message.
        client.tell(plr, `\n§6§l§nA Special Announcement§r\nCitizens, today is §l${moment(config.electionStart).format("MMMM t\\h\\e Do, HH:mm")}.§r\nIt is the Keansian Election Day. \nThe running candidates are${cands}\nYou may only vote once, so consider your vote wisely.\nVoting will end at midnight UTC.\nCommands: \\vote, \\candidates, \\info`, client.label, "format")
      })
      // Clear the interval if the election has ended. (will probably use setTimeout in future to calculate when exactly to start the interval)
      if (Date.now >= config.electionEnd) clearInterval(announcement)
    }
    //announce()
    var announcement = setInterval(announce, 7200000)
  })
  .catch(e => {
    console.error(e)
  })

// Listen to events
client.on("command", async function(cmd) {
  // Get command that was loaded into Enmap earlier
  const command = client.commands.get(cmd.command)
  // Does it exist? If not, return.
  if (!command) return
  // Check if the person is a Citizen in the json file. Returns true or false.
  const citizen = await readfile("./files/citizens.json").then(data => data.indexOf(cmd.player.name) >= 0).catch(err => (console.error(err)))
  // Check if the person is the acting President. It gives them elevated debugging status.
  const president = cmd.player.name === config.president
  console.log(citizen)
  // Some ternary magic...
  const level = citizen ? (president ? 2 : 1) : 0
  console.log(level)
  // Self-explanatory from here.
  if (command.conf.permLevel > level) return cmd.reply("You cannot *run* this command.", client.label)
  if (Date.now <= client.config.electionStart && level < 2) return cmd.reply("§4The elections have not begun yet.", client.label)
  if (Date.now >= client.config.electionEnd && level < 2) return cmd.reply("§4The elections have ended.", client.label)
  // Run the command!
  command.run(client, cmd, cmd.args)
})
