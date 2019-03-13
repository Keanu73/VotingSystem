exports.run = async (client, cmd, args) => {
    if (!(cmd.player.name === client.president)) return
    try {
        const result = eval(code.toString())
        const code = args[0]
        console.log(code)
        console.log(result)
    } catch (err) {
        console.error(err)
    }
}
  
  exports.conf = {
    name: "eval",
    permLevel: "1"
  }