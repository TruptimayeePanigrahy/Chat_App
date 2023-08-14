const express = require("express")

const {connection}=require("./config/db")
const {userRoute}=require("./routes/userroute")
require("dotenv").config()
const cors=require("cors")
const app = express()
const http=require("http").createServer(app)
const io=require("socket.io")(http)



let connectedUsers = [];

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });

  // Listen for user join
  socket.on("user_join", (username) => {
    connectedUsers.push(username);
    console.log("User joined:", username);
    io.emit("users", connectedUsers);
  });

  // Listen for user disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
    const disconnectedUserIndex = connectedUsers.indexOf(socket.id);
    if (disconnectedUserIndex !== -1) {
      connectedUsers.splice(disconnectedUserIndex, 1);
      console.log("User removed:", socket.id);
      io.emit("users", connectedUsers);
    }
  });

  io.emit("users", connectedUsers);
});


app.use(express.json());
app.use(cors());

app.use("/user",userRoute)
app.get("/", (req, res) => {
  res.send("home page");
});



http.listen(process.env.port,async()=>{
try {
    await connection
    console.log("Server connected to Database")
} catch (error) {
    console.log(error)
}
console.log("Server is Running..")
})