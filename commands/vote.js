const { promisify } = require("util")
const readfile = promisify(require("fs").readFile)

exports.run = async (client, cmd, args) => {
  // Fetch player's name and their vote.
  const plr = cmd.player.name
  const vote = args[0]
  // Ensure that they haven't voted, or if they haven't done anything, register them in the enmap anyway.
  const check = client.votes.ensure(plr, {
    voted: false
  })

  if (check && client.votes.get(plr).voted) return cmd.reply("§4You have already voted in the Elections.", client.label, "format") // Already voted, son!

  // Using revolutionary new technology, we have now squashed a bug and only match for the exact candidate in the array. Enmap will make it easier.
  const candidate = await readfile("./files/candidates.json").then(data => JSON.parse(Buffer.from(data).toString()).includes(String(vote))).catch(err => (console.error(err)))
  if (!candidate) return cmd.reply("§4The candidate you specified does not exist.", client.label, "format")

  // Make sure candidates cannot vote for themselves.. that would be a violation of democracy.
  const chk = await readfile("./files/candidates.json").then(data => JSON.parse(Buffer.from(data).toString()).includes(plr)).catch(err => (console.error(err)))
  if (chk) return cmd.reply("§4You cannot vote for yourself or anyone else!", client.label, "format")
  
  // Huzzah. Now the vote is valid and they are actually a Citizen, we can now uhh.. use weird outdated technology to increment their value in the votes enmap by 1.
  // I definitely need to store the candidates in a SEPERATE enmap.
  client.votes.set(vote, client.votes.get(vote) + 1)
  // Make sure they can't vote again...
  client.votes.set(plr, {
    voted: true
  })

  // Disclaimory message.
  cmd.reply(`\n§aYou have successfully voted for §6§l${vote}§r. §aYou §lcannot§r§a vote §oagain§r, nor change your vote.`, client.label, "format")
}

exports.conf = {
  name: "vote",
  permLevel: "1"
}