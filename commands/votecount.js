exports.run = async (client, cmd, args) => {
    if (!(cmd.player.name === client.president)) return
    let cands = ""
    
    for (const c in client.candidates) {
      cands += `\n§a§l${client.candidates[c]}§r: ${client.votes.get(client.candidates[c])}\n`
    }
    
    await cmd.reply(`\n======== §6§l§nCurrent List of Candidates:§r ========\n${cands}\n==========================================\n`, client.label, "format")
}
  
  exports.conf = {
    name: "votecount",
    permLevel: "1"
  }