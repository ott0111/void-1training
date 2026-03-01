const express=require("express")
const {supabase}=require("../config/supabase")

const router=express.Router()

router.get("/",async(req,res)=>{

 const user=req.session.user

 if(!user) return res.send("Not logged in")

 const admins=(process.env.ADMIN_IDS||"")
 .split(",")

 if(!admins.includes(user.id))
 return res.send("Access denied")

 const {data}=await supabase
 .from("applications")
 .select("*")
 .order("created_at",{ascending:false})

 const rows=(data||[])
 .map(a=>`
 <tr>
  <td>${a.id}</td>
  <td>${a.discord_username}</td>
  <td>${a.score}</td>
  <td>${a.status}</td>
 </tr>
 `).join("")

 res.send(`

 <html>
 <head>
 <title>Void Admin Panel</title>

 <style>

 body{
  background:#0b0b14;
  color:white;
  font-family:sans-serif;
  padding:40px
 }

 table{
  width:100%;
  border-collapse:collapse
 }

 td,th{
  border:1px solid #333;
  padding:10px
 }

 </style>

 </head>

 <body>

 <h1>Applications</h1>

 <table>

 <tr>
 <th>ID</th>
 <th>User</th>
 <th>Score</th>
 <th>Status</th>
 </tr>

 ${rows}

 </table>

 </body>

 </html>

 `)

})

module.exports=router
