import { friends, renderUsers , $, search_friends, search_user, data as _data_, appendMessageOnView, postData, data, appendChat, } from "./utilz.js";

$("#mp-search-input").addEventListener("input", e => {
    let value = e.target.value.trim();
    if ($("#new-id").checked) {
        // serach from db
        search_user(value)
    } else {
        search_friends(value);
    }
})

renderUsers([]);
// const friends = loadFriends();

const socket = io();

socket.on("message", (data)=>{
    const {sender, body, sendat} = data;
    if(sender == _data_.activeUser.username) {
        let type =_data_.activeUser.username == sender ? "you" : "me";
        appendMessageOnView({body, type})
    }
    console.log("recieved message : ", data);
    appendChat({chatid: _data_.activeUser.username, sender:_data_.activeUser.username, body})
});


function sendMessage(socket){
    const chat_input = $("#chat-input")
    let msg = (chat_input.value||"").trim();
    if(!msg) return;
    appendMessageOnView({body:msg});
    chat_input.value = "";
    const b_send = $("#b_send");
    socket.emit("message", {sender: _data_.username, receiver: _data_.activeUser.username, body:msg, sendat: Date.now() })
    appendChat({chatid: _data_.activeUser.username, sender:_data_.username, body:msg})
}

$("#b_send").addEventListener("click", e => sendMessage(socket));

_data_.username = localStorage.getItem("username")
if(!_data_.username) {
    postData("/api/myusername")
    .then(d =>{
        _data_.username = d.username;
        localStorage.setItem("username", _data_.username);
        socket.emit("username", {username: _data_.username})
    })
}else{
    socket.emit("username", {username:_data_.username})
}

window.data = _data_;