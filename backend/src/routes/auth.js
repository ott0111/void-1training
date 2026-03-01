const express = require("express")
const axios = require("axios")

const router = express.Router()

router.get("/set-test-intent",(req,res)=>{
 req.session.loginIntent="test"
 res.json({success:true})
})

router.get("/set-admin-intent",(req,res)=>{
 req.session.loginIntent="admin"
 res.json({success:true})
})

router.get("/discord",(req,res)=>{

 const redirect=
 `https://discord.com/api/oauth2/authorize?client_id=${
 process.env.DISCORD_CLIENT_ID
 }&redirect_uri=${
 encodeURIComponent(process.env.DISCORD_REDIRECT_URI)
 }&response_type=code&scope=identify`

 res.redirect(redirect)

})

router.get("/discord/callback",async(req,res)=>{

 try{

 const code=req.query.code

 const token=await axios.post(
 "https://discord.com/api/oauth2/token",
 new URLSearchParams({
  client_id:process.env.DISCORD_CLIENT_ID,
  client_secret:process.env.DISCORD_CLIENT_SECRET,
  grant_type:"authorization_code",
  code,
  redirect_uri:process.env.DISCORD_REDIRECT_URI
 }),
 {headers:{'Content-Type':'application/x-www-form-urlencoded'}}
 )

 const user=await axios.get(
 "https://discord.com/api/users/@me",
 {headers:{Authorization:`Bearer ${token.data.access_token}`}}
 )

 req.session.user=user.data

 const intent=req.session.loginIntent||"test"

 if(intent==="admin"){
  return res.redirect(`${process.env.BACKEND_URL}/admin`)
 }

 res.redirect(
 `${process.env.FRONTEND_URL}?startTest=1&discord_username=${encodeURIComponent(user.data.username)}&discord_id=${user.data.id}`
 )

 }catch(err){

 console.error(err)

 res.send("Discord login failed")

 }

})

router.get("/logout",(req,res)=>{

 req.session.destroy(()=>{

  res.redirect(process.env.FRONTEND_URL)

 })

})

module.exports=router
