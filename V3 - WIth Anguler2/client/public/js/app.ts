/// <reference path="../../../typings/angular2/angular2.d.ts" />
/// <reference path="../../../typings/socket.io-client/socket.io-client.d.ts" />

import {Component, View, bootstrap, NgFor, NgIf} from 'angular2/angular2';

// Annotation section
@Component({
  selector: 'my-app'
})
@View({
  //template: '<h1>Hello1 {{ name }}</h1>',
  templateUrl: './templates/chat.html' ,
  directives: [NgFor, NgIf]
})
// Component controller
class MyAppComponent {
  name: string;
  conversation : {message : string, user : string}[] = [];
  users : string[] = [];
  rooms : string[] = [];
  current_room : string;
  message : string = "";
  socket : SocketIOClient.Socket = io.connect(window.location.hostname);

  constructor() {
    
    let _self = this;
    
    _self.name = 'Guest User';
    
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
  }
  switchRoom(room){
    this.socket.emit('switchRoom', room);
  }
  
  createRoom(){
    this.socket.emit('createroom', prompt("New Room Name?"));
  }
  
  messageSend(message){   
    if (message){
        this.socket.emit('sendchat', message);
        this.message = "";
    } else {
        alert ('Dont Send Blank Chat');
    }
  }
  
  doneTyping($event) {
    if($event.which === 13) {
      this.messageSend($event.target.value);
      $event.target.value = null;
    }
  }
  
}

bootstrap(MyAppComponent);
