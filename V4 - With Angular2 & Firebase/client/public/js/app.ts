/// <reference path="../../../typings/angular2/angular2.d.ts" />
/// <reference path="../../../typings/socket.io-client/socket.io-client.d.ts" />

import {Component, View, bootstrap, NgFor, NgIf} from 'angular2/angular2';
import {FirebaseService} from 'serviceFirebase';

// Annotation section
@Component({
  selector: 'my-app'
})
@View({
  templateUrl: './templates/chat.html' ,
  directives: [NgFor, NgIf]
})
// Component controller
class MyAppComponent {
  name: string;
  conversation : {message : string, user : string}[] = [];
  users : {name : string, id : string}[] = [];
  rooms : string[] = ["General"];
  current_room : string = "General";
  message : string = "";

  dataRef: Firebase;
  userListRef: Firebase;
  connectedRef: Firebase;
  myUserRef: Firebase;
  roomsRef: Firebase;
  myRoomRef : Firebase;

  constructor() {
    
    let _self = this;
    
    this.dataRef = new FirebaseService().dataRef;
    this.userListRef = new FirebaseService().userListRef;
    this.connectedRef = new FirebaseService().connectedRef;
    this.roomsRef = new FirebaseService().roomsRef;
    
    this.myUserRef = this.userListRef.push();

    this.myRoomRef = this.dataRef.child("conversation").child("General");

    _self.name = prompt("What's your name?");
    
    this.switchRoom(this.current_room);
    
    this.connectedRef.on("value", function(isOnline) {
      let obj = { name: _self.name, id: _self.getMessageId(_self.myUserRef) }
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
    this.userListRef.on("child_added", function(snapshot) {
      var user = snapshot.val();
      let obj = { name: user.name, id: _self.getMessageId(snapshot) }
      
      for(var i = 0; i < _self.users.length; i++){
        if(_self.users[i].id == obj.id){
          break;
        }
      }      
      _self.users.push(obj);
    });
  
    // Update our GUI to remove the status of a user who has left.
    this.userListRef.on("child_removed", function(snapshot) {
      var user = snapshot.val();
      let id = _self.getMessageId(snapshot);
      
      for(var i = 0; i < _self.users.length; i++){
        if(_self.users[i].id == id){
          _self.users.splice(i,1);
          break;
        }
      }
      
    });
  
    this.roomsRef.on("child_added", function(snapshot) {
      var room = snapshot.val();
      if(_self.rooms.indexOf(room.name) == -1){
        _self.rooms.push(room.name);
      }
    });
   
  }
  
  
  getMessageId(snapshot) {
    return snapshot.key().replace(/[^a-z0-9\-\_]/gi,'');
  }
    
  switchRoom(room){ 
    this.current_room = room;
    this.conversation = [];
    
    this.myRoomRef.off("child_added");
    
    let _self = this;
        
    //this.myRoomRef = this.dataRef.child("conversation").child(room);
    this.myRoomRef = new FirebaseService.Firebase(FirebaseService.FirebaseURL).child("conversation").child(room);   
     
    this.myRoomRef.on("child_added", function(snapshot) {
      var obj = snapshot.val();
      _self.conversation.push({ user : obj.user, message : obj.message })
    });
    
    /*this.myRoomRef.on("child_changed", function(snapshot) {
      var obj = snapshot.val();
      _self.conversation.push({ user : obj.user, message : obj.message })
    });*/
  }
  
  createRoom(){
   let roomName = prompt("New Room Name?");
   roomName = roomName.trim();
   if(roomName){
    this.roomsRef.push({name: roomName});
    this.switchRoom(roomName);
   }
  }
  
  messageSend(message){   
    if (message){
        //this.socket.emit('sendchat', message);
        this.myRoomRef.push({ user : this.name, message: message})
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
