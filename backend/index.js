const express=require("express")
const {connection}=require("./config/db")
const {userRoute}=require("./routes/userroute")
require("dotenv").config()

const app=express()
app.use(express.json())
app.use("/user",userRoute)


app.get("/",(req,res)=>{
    res.send("Home page")
})


app.listen(process.env.port,async()=>{
try {
    await connection
    console.log("Server connected to Database")
} catch (error) {
    console.log(error)
}
console.log("Server is Running..")
})

