const { promisify } = require("util")
const readfile = promisify(require("fs").readFileSync)

exports.run = async (client, cmd, args) => {
    if (!(cmd.player.name === client.president)) return
    let cands = ""
    
    for (const c in client.citizens) {
      const plr = client.citizens[c]
      console.log(plr)
      if (typeof client.votes.get(plr) === 'number') continue
      if (client.votes.get(plr).voted === false) continue
      cands += `\n§a§l${plr}§r\n`
    }
    
    await cmd.reply(`\n======== §6§l§nList of Citizens who Voted:§r ========\n${cands}\n==========================================\n`, client.label, "format")
}
  
  exports.conf = {
    name: "whovoted",
    permLevel: "1"
  }