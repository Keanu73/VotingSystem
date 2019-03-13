exports.run = async (client, cmd, args) => {
    if (Date.now >= 1552557600000) return cmd.reply("§4The elections have ended.", client.label)
    let cands = ""
    
    for (const c in client.candidates) {
      cands += `\n§a§l${client.candidates[c]}§r\n`
    }
    
    await cmd.reply(`\n======== §6§l§nCurrent List of Candidates:§r ========\n${cands}\n==========================================\n`, client.label, "format")
}

exports.conf = {
  name: "candidates",
  permLevel: "1"
}