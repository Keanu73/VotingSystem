const { promisify } = require("util")
const readfile = promisify(require("fs").readFileSync)

exports.run = async (client, cmd, args) => {
    let cands = ""
    // For every citizen..
    for (const c in client.citizens) {
      const plr = client.citizens[c]
      console.log(plr)
      // Is the value in the db a number (for a candidate's votes)? (Soon to be outlawed)
      if (typeof client.votes.get(plr) === 'number') continue
      // Have they voted or are they present in the db?
      if (!client.votes.get(plr)) continue
      if (client.votes.get(plr).voted === false) continue
      cands += `\n§a§l${plr}§r\n`
    }
    
    await cmd.reply(`\n======== §6§l§nList of Citizens who Voted:§r ========\n${cands}\n==========================================\n`, client.label, "format")
}
  
  exports.conf = {
    name: "whovoted",
    permLevel: "2"
  }