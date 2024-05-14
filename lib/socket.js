

function attachSocketDataEvents(socket, userSockets={}){
    console.log('A user connected!');
    let myusername;
    socket.on("username", data =>{
        let {username=false} = data;
        if(!username) return;
        userSockets[username]=socket;
        myusername = username
        console.log({myusername})
    })
    
    // Handle events from the client
    socket.on('message', (msg) => {
        console.log('Message received:', msg);
        let {sender, body, sendat, receiver} = msg;
        if(userSockets.hasOwnProperty(receiver)){
            let receiverSocket = userSockets[receiver]
            receiverSocket.emit("message", {sender:myusername, body, sendat})
        }
    });

    socket.emit("message", {sender:"admin", body:"hello", sendat: Date.now()})
}



module.exports = {
    attachSocketDataEvents
}