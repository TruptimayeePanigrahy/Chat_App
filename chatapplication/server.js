const express=require("express")
const app=express()
const http=require("http").createServer(app)
const io=require("socket.io")(http)
const cors=require("cors")
app.use(cors())

app.use(express.static(__dirname+"/public"))
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})

io.on("connection",(socket)=>{
    console.log("connected")
// recieve msg from client
    socket.on("message",(msg)=>{
        console.log(msg)
        // send all client except sender
        socket.broadcast.emit("message", msg)
    })
})




http.listen(4500,()=>{
    console.log("server running")
})