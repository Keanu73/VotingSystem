exports.run = async (client, cmd, args) => {
  // I probably shouldn't have included an eval command, but it was useful for debugging.
    try {
        const code = args.join(" ")
        const result = eval(code)
        console.log(code)
        console.log(result)
    } catch (err) {
        console.error(err)
    }
}
  
  exports.conf = {
    name: "eval",
    permLevel: "2"
  }