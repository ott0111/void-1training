const {Client,GatewayIntentBits}=require("discord.js")

const client=new Client({
 intents:[GatewayIntentBits.Guilds]
})

client.once("ready",()=>{
 console.log(`Discord bot ready as ${client.user.tag}`)
})

client.login(process.env.DISCORD_BOT_TOKEN)

module.exports={client}
