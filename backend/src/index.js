require("dotenv").config()

const express = require("express")
const cors = require("cors")
const session = require("express-session")
const MemoryStore = require("memorystore")(session)

const authRoutes = require("./routes/auth")
const submissionRoutes = require("./routes/submissions")
const adminRoutes = require("./routes/admin")

const app = express()

app.use(cors({
 origin:true,
 credentials:true
}))

app.use(express.json())

app.use(session({
 store:new MemoryStore({checkPeriod:86400000}),
 name:"void-session",
 secret:process.env.SESSION_SECRET,
 resave:false,
 saveUninitialized:true,
 cookie:{
  secure:true,
  sameSite:"none",
  httpOnly:true,
  maxAge:24*60*60*1000
 }
}))

app.get("/health",(req,res)=>res.json({ok:true}))

app.use("/auth",authRoutes)
app.use("/",submissionRoutes)
app.use("/admin",adminRoutes)

const PORT=process.env.PORT||3000

app.listen(PORT,()=>console.log("Backend running",PORT))
