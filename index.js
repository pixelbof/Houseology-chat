var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var userList = [];
var currentUser = "";

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log(socket.handshake.query.user + " has connected")
  socket.emit('welcome');
  socket.emit('userList update', userList)

  socket.on('chat message', function(msg){
    io.emit('chat message', {message: msg.message, profilePic: msg.profilePic});
  });

  socket.on('userTyping', function(user) {
    io.emit('userTyping', user);
  });

  socket.on('newUser', function(user){
    currentUser = user.username;
    var index = userList.indexOf(currentUser);

    if (index <= -1) {
        userList.push(user.username);

        var lst = []
        for (var i = 0; i < userList.length; i++) {
          if(userList[i] != currentUser) {
            lst.push(userList[i])
          }
        }

        console.log(lst)

        io.emit('userList update', userList);
    }
  });

  socket.on('userList update', function() {

    io.emit('userList update', userList);
  })

  socket.on('reconnect', function() {
    console.log(currentUser + " is trying to connect again")
  });

  socket.on('disconnect', function(){
    
   console.log(currentUser + " has disconnected")
  });
  
});


//heroku :35465
http.listen(process.env.PORT || 3001, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
    