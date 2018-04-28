let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

io.on('connection', (socket) => {
    //io.emit('message', {type:'connected', text: "Chat has successfully connected!"});
    // Log whenever a user connects
    socket.on('welcome', function(user){
        io.emit('message', {type:'new-user', text: user + " has just locked in!"});
    });

    // Log whenever a client disconnects from our websocket server
    socket.on('disconnect', function(user){
        console.log("someone left");
    });

    // When we receive a 'message' event from our client, print out
    // the contents of that message and then echo it back to our client
    // using `io.emit()`
    socket.on('message', (message) => {
        console.log("Message Received: " + message);
        io.emit('message', {type:'new-message', text: message});    
    });
});

// Initialize our websocket server on port 5000
http.listen(3001, () => {
    console.log('started on port 3001');
});