const express = require("express")
const {supabase}=require("../config/supabase")
const {client}=require("../config/discord")

const router=express.Router()

router.get("/api/test-questions/active",async(req,res)=>{

 const {data}=await supabase
 .from("test_questions")
 .select("*")
 .eq("enabled",true)
 .order("order",{ascending:true})

 res.json({
  success:true,
  questions:data||[]
 })

})

router.post("/submit-test-results",async(req,res)=>{

 try{

 const {
  discordId,
  discordUsername,
  answers,
  score,
  totalQuestions,
  correctAnswers
 }=req.body

 const {data}=await supabase
 .from("applications")
 .insert([{
  discord_id:discordId,
  discord_username:discordUsername,
  answers,
  score
 }])
 .select()

 const appId=data?.[0]?.id

 const channel=await client.channels.fetch(
 process.env.DISCORD_CHANNEL_ID
 )

 const embed={
  title:"New Moderator Test",
  color:5793266,
  fields:[
   {
    name:"User",
    value:`${discordUsername} (${discordId})`
   },
   {
    name:"Score",
    value:score||"0"
   },
   {
    name:"Application ID",
    value:String(appId)
   }
  ]
 }

 const row={
  type:1,
  components:[
   {
    type:2,
    style:3,
    label:"Accept",
    custom_id:`accept_${appId}_${discordId}`
   },
   {
    type:2,
    style:4,
    label:"Reject",
    custom_id:`reject_${appId}_${discordId}`
   }
  ]
 }

 const message=await channel.send({
  embeds:[embed],
  components:[row]
 })

 await supabase
 .from("applications")
 .update({
  discord_message_id:message.id
 })
 .eq("id",appId)

 res.json({
  success:true,
  id:appId
 })

 }catch(err){

 console.error(err)

 res.json({success:false})

 }

})

module.exports=router
