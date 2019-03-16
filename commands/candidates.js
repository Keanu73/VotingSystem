exports.run = async (client, cmd, args) => {
  let cands = ""
  // For every candidate, include the number of votes.
  for (const c in client.candidates) {
    cands += `\n§a§l${client.candidates[c]}§r: ${client.votes.get(client.candidates[c])}\n`
  }

  await cmd.reply(`\n======== §6§l§nCurrent List of Candidates:§r ========\n${cands}\n==========================================\n`, client.label, "format")
}

exports.conf = {
  name: "candidates",
  permLevel: "1"
}