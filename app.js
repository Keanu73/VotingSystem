// Require module
const SwitchChat = require("switchchat")

// Create new client
const client = new SwitchChat.Client("5686f924-40c1-469d-bc49-1c2230949233")

// Connect to endpoint (returns promise)
client.connect()
  .then(() => {
    console.log("Connected! Licence owner: " + client.owner)
  })
  .catch(e => {
    console.error(e)
  })

// Listen to events
client.on("chat", function(message) {
  console.log(`${message.player}: ${message}`)
})

// Say a message to all players
client.say("Hello, world", "ChatBot")

// Tell a message to a player
client.tell("Steve", "Hello, Steve", "Herobrine")

// Get boolean of the capability
client.hasCapability("say")

// Get list of online players (Map)
console.log(client.players)