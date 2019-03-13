const { promisify } = require("util")
const readfile = promisify(require("fs").readFile)

exports.run = async (client, cmd, args) => {
  if (Date.now >= 1552557600000) return cmd.reply("§4The elections have ended.", client.label)
  const plr = cmd.player.name
  const vote = args[0]

  const check = client.votes.ensure(plr, {
    voted: false
  })

  if (check && client.votes.get(plr).voted) return cmd.reply("§4You have already voted in the Elections.", client.label, "format")

  const candidate = await readfile("./files/candidates.json").then(data => data.indexOf(vote) >= 0).catch(err => (client.logger.error(err)))
  if (!candidate) return cmd.reply("§4The candidate you specified does not exist.", client.label, "format")

  const chk = await readfile("./files/candidates.json").then(data => data.indexOf(plr) >= 0).catch(err => (console.error(err)))
  if (chk) return cmd.reply("§4You cannot vote for yourself or anyone else!", client.label, "format")

  client.votes.set(vote, client.votes.get(vote) + 1)
  client.votes.set(plr, {
    voted: true
  })

  cmd.reply(`\n§aYou have successfully voted for §6§l${vote}§r. §aYou §lcannot§r§a vote §oagain§r, nor change your vote.`, client.label, "format")
}

exports.conf = {
  name: "vote",
  permLevel: "1"
}