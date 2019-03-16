const express = require('express');
const socket = require('socket.io');
const app = express();
let guestLogins = 0;
let registeredLogins = 0;

server = app.listen(3001, function(){
    console.log('server is running on port 3001')
});

io = socket(server);

io.on('connection', (socket) => {
    //io.emit('message', {type:'connected', text: "Chat has successfully connected!"});
    // Log whenever a user connects
    socket.on('WELCOME', (user) => {
        //(user.guest) ? guestLogins += 1: registeredLogins += 1;
        io.emit('RECEIVE_MESSAGE', {msgType:'new-user', author: 'System', message: user.user + " has just locked in!", timeSent: user.timeSent });
        //io.emit('USER_COUNT_UPDATE', {guest: guestLogins, registered: registeredLogins});
    });

    // When we receive a 'message' event from our client, print out
    // the contents of that message and then echo it back to our client
    // using `io.emit()`
    socket.on('SEND_MESSAGE', (data) => {
        io.emit('RECEIVE_MESSAGE', {msgType:'new-message', author: data.author, bale: data.bale, message: data.message, timeSent: data.timeSent});    
    });

    socket.on('USER_DISCONNECTED', (user) => {
        //(user.guest) ? guestLogins -= 1: registeredLogins -= 1;
        //io.emit('USER_COUNT_UPDATE', {guest: guestLogins, registered: registeredLogins});
    })
});