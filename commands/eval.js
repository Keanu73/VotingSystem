exports.run = async (client, cmd, args) => {
    if (!(cmd.player.name === client.president)) return
    try {
        const code = args[0]
        const result = eval(code.toString())
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