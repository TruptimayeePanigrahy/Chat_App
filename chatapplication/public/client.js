const socket = io();
let username;
let msgarea=document.querySelector(".msgarea")

do {
    username = prompt("enter your name");
} while (!username);
// let msg = document.getElementById("input");
// msg.addEventListener("keyup", (e) => {
//   if (e.key == "Enter") {
//     sendMassage(e.target.value);
//   }
// });
let textarea=document.getElementById("textarea")
textarea.addEventListener("keyup",(e)=>{
if(e.key=="Enter"){
    sendmsg(e.target.value)
}
})

function sendmsg(message){
    let msg={
        user:username,
        message:message.trim()
    }
    //append massage
    appendmsg(msg,"outgoing")
    textarea.value=""
// send msg to server
    socket.emit("message",msg)
}

function appendmsg(msg,type){
let maindiv=document.createElement("div")
let classname=type
maindiv.classList.add(classname, "msg")
let markup=`
<h4>${msg.user}</h4>
<p>${msg.message}</p>
`
maindiv.innerHTML=markup
msgarea.appendChild(maindiv)
}

// recive msg
socket.on("message",(msg)=>{
    //console.log(msg)
    appendmsg(msg,"incoming")
})