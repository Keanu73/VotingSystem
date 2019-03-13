exports.run = async (client, cmd, args) => {
    if (!(cmd.player.name === client.president)) return
    const code = args[0]
    const result = eval(String(code))
    console.log(code)
    console.log(result)

}
  
  exports.conf = {
    name: "eval",
    permLevel: "1"
  }