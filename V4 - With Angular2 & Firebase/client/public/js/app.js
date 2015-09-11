/// <reference path="../../../typings/angular2/angular2.d.ts" />
/// <reference path="../../../typings/socket.io-client/socket.io-client.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var serviceFirebase_1 = require('serviceFirebase');
// Annotation section
var MyAppComponent = (function () {
    function MyAppComponent() {
        this.conversation = [];
        this.users = [];
        this.rooms = ["General"];
        this.current_room = "General";
        this.message = "";
        var _self = this;
        this.dataRef = new serviceFirebase_1.FirebaseService().dataRef;
        this.userListRef = new serviceFirebase_1.FirebaseService().userListRef;
        this.connectedRef = new serviceFirebase_1.FirebaseService().connectedRef;
        this.roomsRef = new serviceFirebase_1.FirebaseService().roomsRef;
        this.myUserRef = this.userListRef.push();
        this.myRoomRef = this.dataRef.child("conversation").child("General");
        _self.name = prompt("What's your name?");
        this.switchRoom(this.current_room);
        this.connectedRef.on("value", function (isOnline) {
            var obj = { name: _self.name, id: _self.getMessageId(_self.myUserRef) };
            if (isOnline.val()) {
                // If we lose our internet connection, we want ourselves removed from the list.
                _self.myUserRef.onDisconnect().remove();
                _self.myUserRef.set(obj);
            }
            else {
                _self.myUserRef.set(obj);
            }
        });
        // Update our GUI to show someone"s online status.
        this.userListRef.on("child_added", function (snapshot) {
            var user = snapshot.val();
            var obj = { name: user.name, id: _self.getMessageId(snapshot) };
            for (var i = 0; i < _self.users.length; i++) {
                if (_self.users[i].id == obj.id) {
                    break;
                }
            }
            _self.users.push(obj);
        });
        // Update our GUI to remove the status of a user who has left.
        this.userListRef.on("child_removed", function (snapshot) {
            var user = snapshot.val();
            var id = _self.getMessageId(snapshot);
            for (var i = 0; i < _self.users.length; i++) {
                if (_self.users[i].id == id) {
                    _self.users.splice(i, 1);
                    break;
                }
            }
        });
        this.roomsRef.on("child_added", function (snapshot) {
            var room = snapshot.val();
            if (_self.rooms.indexOf(room.name) == -1) {
                _self.rooms.push(room.name);
            }
        });
        /*
        
        _self.socket.on('connect', function(){
              // call the server-side function 'adduser' and send one parameter (value of prompt)
              _self.name = prompt("What's your name?");
              _self.socket.emit('adduser', _self.name);
          });
    
          // listener, whenever the server emits 'updatechat', this updates the chat body
          _self.socket.on('updatechat', function (username, data) {
              
              _self.conversation.push({
                user : username,
                message : data
              });
              //_self.conversation.push('<b>' + username + ':</b> ' + data + '<br>');
              
              console.log(_self.conversation);
              
              var elem = document.getElementById('conversation');
              elem.scrollTop = elem.scrollHeight;
          });
    
          // listener, whenever the server emits 'updaterooms', this updates the room the client is in
          _self.socket.on('updaterooms', function(rooms, current_room) {
              _self.rooms = rooms;
              _self.current_room = current_room;
          });
    
          _self.socket.on('appendnewroom', function(username, newroom) {
              _self.rooms.push(newroom);
          });
    
          // listener, whenever the server emits 'updateusers', this updates the username list
          _self.socket.on('updateusers', function(data) {
              _self.users = [];
              for(var key in data){
                _self.users.push(key);
              }
              
              console.log("users");
              console.log(data);
          });
          
          */
    }
    MyAppComponent.prototype.getMessageId = function (snapshot) {
        return snapshot.key().replace(/[^a-z0-9\-\_]/gi, '');
    };
    MyAppComponent.prototype.switchRoom = function (room) {
        this.current_room = room;
        this.conversation = [];
        var _self = this;
        //this.myRoomRef = this.dataRef.child("conversation").child(room);
        this.myRoomRef = new serviceFirebase_1.FirebaseService.Firebase('https://angular2chatapp.firebaseio.com').child("conversation").child(room);
        this.myRoomRef.on("child_added", function (snapshot) {
            var obj = snapshot.val();
            _self.conversation.push({ user: obj.user, message: obj.message });
        });
        this.myRoomRef.on("child_changed", function (snapshot) {
            var obj = snapshot.val();
            _self.conversation.push({ user: obj.user, message: obj.message });
        });
    };
    MyAppComponent.prototype.createRoom = function () {
        var roomName = prompt("New Room Name?");
        roomName = roomName.trim();
        if (roomName) {
            this.roomsRef.push({ name: roomName });
            this.switchRoom(roomName);
        }
    };
    MyAppComponent.prototype.messageSend = function (message) {
        if (message) {
            //this.socket.emit('sendchat', message);
            this.myRoomRef.push({ user: this.name, message: message });
            this.message = "";
        }
        else {
            alert('Dont Send Blank Chat');
        }
    };
    MyAppComponent.prototype.doneTyping = function ($event) {
        if ($event.which === 13) {
            this.messageSend($event.target.value);
            $event.target.value = null;
        }
    };
    MyAppComponent = __decorate([
        angular2_1.Component({
            selector: 'my-app'
        }),
        angular2_1.View({
            templateUrl: './templates/chat.html',
            directives: [angular2_1.NgFor, angular2_1.NgIf]
        }), 
        __metadata('design:paramtypes', [])
    ], MyAppComponent);
    return MyAppComponent;
})();
angular2_1.bootstrap(MyAppComponent);
