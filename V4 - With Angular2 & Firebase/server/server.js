/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/express/express.d.ts" />
/// <reference path="../typings/socket.io/socket.io.d.ts" />
//Requires
var express = require('express');
var http = require('http');
var socket = require('socket.io');
var path = require('path');
//Server Creation
var app = express();
var server = http.createServer(app);
var io = socket(server);
server.listen(3000);
//Middlewares
console.log("__dirname");
console.log(path.join(__dirname, '../client/public'));
app.use(express.static(path.join(__dirname, '../client/public')));
app.engine('html', require('ejs').renderFile);
//Routes
app.get('/', function (req, res) {
    res.render('../client/index.html');
});
// usernames which are currently connected to the chat
var usernames = {};
// rooms which are currently available in chat
var rooms = ['General', 'Room 1', 'Room 2', 'Room 3'];
function returnRoomUsers(users, room) {
    var temp = {};
    for (var key in users) {
        if (users[key].room == room) {
            temp[users[key].username] = users[key].username;
        }
    }
    return temp;
}
//io.sockets.on('connection', function (socket) {
io.on('connection', function (socket) {
    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function (username) {
        // store the username in the socket session for this client
        var defaultRoom = 'General';
        // add the client's username to the global list
        usernames[socket.id] = { username: username, room: defaultRoom, id: socket.id };
        socket.join(defaultRoom);
        socket.emit('updatechat', 'SERVER', 'you have connected to ' + defaultRoom + ' Room');
        socket.broadcast.to(defaultRoom).emit('updatechat', 'SERVER: ', username + ' has connected to this room');
        socket.emit('updaterooms', rooms, defaultRoom);
        socket.emit('updateusers', returnRoomUsers(usernames, 'General'));
        socket.broadcast.to(defaultRoom).emit('updateusers', returnRoomUsers(usernames, defaultRoom));
    });
    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data) {
        // we tell the client to execute 'updatechat' with 2 parameters
        io.sockets.in(usernames[socket.id].room).emit('updatechat', usernames[socket.id].username, data);
    });
    socket.on('switchRoom', function (newroom) {
        socket.leave(usernames[socket.id].room);
        socket.join(newroom);
        socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
        // sent message to OLD room
        socket.broadcast.to(usernames[socket.id].room).emit('updatechat', 'SERVER: ', usernames[socket.id].username + ' has left this room');
        usernames[socket.id].room = newroom;
        socket.broadcast.to(usernames[socket.id].room).emit('updateusers', returnRoomUsers(usernames, usernames[socket.id].room));
        // update socket session room title
        usernames[socket.id].room = newroom;
        socket.broadcast.to(newroom).emit('updatechat', 'SERVER: ', usernames[socket.id].username + ' has joined this room');
        socket.broadcast.to(usernames[socket.id].room).emit('updateusers', returnRoomUsers(usernames, usernames[socket.id].room));
        socket.emit('updateusers', returnRoomUsers(usernames, usernames[socket.id].room));
        socket.emit('updaterooms', rooms, newroom);
    });
    socket.on('createroom', function (newroom) {
        rooms.push(newroom);
        socket.leave(usernames[socket.id].room);
        socket.join(newroom);
        socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
        // sent message to OLD room
        socket.broadcast.to(usernames[socket.id].room).emit('updatechat', 'SERVER: ', usernames[socket.id].username + ' has left this room');
        usernames[socket.id].room = newroom;
        socket.broadcast.to(usernames[socket.id].room).emit('updateusers', returnRoomUsers(usernames, usernames[socket.id].room));
        // update socket session room title
        usernames[socket.id].room = newroom;
        socket.broadcast.to(newroom).emit('updatechat', 'SERVER: ', usernames[socket.id].username + ' has joined this room');
        socket.broadcast.to(usernames[socket.id].room).emit('updateusers', returnRoomUsers(usernames, usernames[socket.id].room));
        socket.emit('updateusers', returnRoomUsers(usernames, usernames[socket.id].room));
        socket.emit('updaterooms', rooms, newroom);
        socket.broadcast.emit('appendnewroom', 'SERVER', newroom);
    });
    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        // remove the username from global usernames list
        socket.broadcast.to(usernames[socket.id].room).emit('updateusers', returnRoomUsers(usernames, usernames[socket.id].room));
        socket.broadcast.to(usernames[socket.id].room).emit('updatechat', 'SERVER: ', usernames[socket.id].username + ' has disconnected');
        socket.leave(usernames[socket.id].room);
        delete usernames[socket.id];
    });
});
