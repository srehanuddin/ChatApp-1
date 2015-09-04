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
// Annotation section
var MyAppComponent = (function () {
    function MyAppComponent() {
        this.conversation = [];
        this.users = [];
        this.rooms = [];
        this.message = "";
        this.socket = io.connect(window.location.hostname);
        var _self = this;
        _self.name = 'Guest User';
        _self.socket.on('connect', function () {
            // call the server-side function 'adduser' and send one parameter (value of prompt)
            _self.name = prompt("What's your name?");
            _self.socket.emit('adduser', _self.name);
        });
        // listener, whenever the server emits 'updatechat', this updates the chat body
        _self.socket.on('updatechat', function (username, data) {
            _self.conversation.push({
                user: username,
                message: data
            });
            //_self.conversation.push('<b>' + username + ':</b> ' + data + '<br>');
            console.log(_self.conversation);
            var elem = document.getElementById('conversation');
            elem.scrollTop = elem.scrollHeight;
        });
        // listener, whenever the server emits 'updaterooms', this updates the room the client is in
        _self.socket.on('updaterooms', function (rooms, current_room) {
            _self.rooms = rooms;
            _self.current_room = current_room;
        });
        _self.socket.on('appendnewroom', function (username, newroom) {
            _self.rooms.push(newroom);
        });
        // listener, whenever the server emits 'updateusers', this updates the username list
        _self.socket.on('updateusers', function (data) {
            _self.users = [];
            for (var key in data) {
                _self.users.push(key);
            }
            console.log("users");
            console.log(data);
        });
    }
    MyAppComponent.prototype.switchRoom = function (room) {
        this.socket.emit('switchRoom', room);
    };
    MyAppComponent.prototype.createRoom = function () {
        this.socket.emit('createroom', prompt("New Room Name?"));
    };
    MyAppComponent.prototype.messageSend = function (message) {
        if (message) {
            this.socket.emit('sendchat', message);
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
            //template: '<h1>Hello1 {{ name }}</h1>',
            templateUrl: './templates/chat.html',
            directives: [angular2_1.NgFor, angular2_1.NgIf]
        }), 
        __metadata('design:paramtypes', [])
    ], MyAppComponent);
    return MyAppComponent;
})();
angular2_1.bootstrap(MyAppComponent);
