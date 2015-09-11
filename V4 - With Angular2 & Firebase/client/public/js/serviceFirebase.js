/// <reference path="../../../typings/angular2/angular2.d.ts" />
/// <reference path="../../../typings/firebase/firebase.d.ts" />
var FirebaseService = (function () {
    function FirebaseService() {
        this.dataRef = new Firebase('https://angular2chatapp.firebaseio.com');
        this.userListRef = new Firebase('https://angular2chatapp.firebaseio.com/users');
        this.connectedRef = new Firebase('https://angular2chatapp.firebaseio.com//.info/connected');
        this.roomsRef = new Firebase('https://angular2chatapp.firebaseio.com/rooms');
    }
    FirebaseService.FirebaseURL = 'https://angular2chatapp.firebaseio.com';
    FirebaseService.Firebase = Firebase;
    return FirebaseService;
})();
exports.FirebaseService = FirebaseService;
