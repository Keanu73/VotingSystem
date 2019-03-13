const { promisify } = require("util")
const readfile = promisify(require("fs").readFile)

exports.run = async (client, cmd, args) => {
    if (!(cmd.player.name === client.president)) return
    let cands = ""
    
    for (const c in client.citizens) {
      const plr = client.citizens[c]
      const chk = await readfile("./files/candidates.json").then(data => data.indexOf(plr) >= 0).catch(err => (console.error(err)))
      if (chk) return
      if (client.votes.get(plr).voted === false) return
      cands += `\n§a§l${plr}§r\n`
    }
    
    await cmd.reply(`\n======== §6§l§nList of Citizens who Voted:§r ========\n${cands}\n==========================================\n`, client.label, "format")
}
  
  exports.conf = {
    name: "whovoted",
    permLevel: "1"
  }