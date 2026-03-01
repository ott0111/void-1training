const {Client,GatewayIntentBits}=require("discord.js")

const client=new Client({
 intents:[GatewayIntentBits.Guilds]
})

client.once("ready",()=>{
 console.log("Discord bot ready")
})

client.login(process.env.DISCORD_BOT_TOKEN)

module.exports={client}
