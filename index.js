var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var userList = [];
var currentUser = "";

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  socket.emit('welcome');

  socket.on('chat message', function(msg){
    io.emit('chat message', msg.message);
  });

  socket.on('newUser', function(user){
    currentUser = user.username;
    var index = userList.indexOf(currentUser);

    if (index <= -1) {
        userList.push(user.username);
        io.emit('userList update', userList);
    }
  });

  socket.on('userList update', function() {
    io.emit('userList update', userList);
  })

  socket.on('disconnect', function(){
    var index = userList.indexOf(currentUser);

    console.log(currentUser + " has disconnected")
    /*io.emit('chat message', currentUser + " has disconnected!");

    if (index > -1) {
        userList.splice(index, 1);
    }

    io.emit('userList update', userList);*/
  });
  
});


//heroku :35465
http.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
    