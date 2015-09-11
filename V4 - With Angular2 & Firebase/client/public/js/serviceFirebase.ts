/// <reference path="../../../typings/angular2/angular2.d.ts" />
/// <reference path="../../../typings/firebase/firebase.d.ts" />

export class FirebaseService{
    static FirebaseURL : string = 'https://angular2chatapp.firebaseio.com';
    static Firebase : FirebaseStatic = Firebase;
    dataRef: Firebase;
    userListRef: Firebase;
    connectedRef: Firebase;
    roomsRef: Firebase;
    constructor() {
        this.dataRef = new Firebase('https://angular2chatapp.firebaseio.com');
        this.userListRef = new Firebase('https://angular2chatapp.firebaseio.com/users');
        this.connectedRef = new Firebase('https://angular2chatapp.firebaseio.com//.info/connected');
        this.roomsRef = new Firebase('https://angular2chatapp.firebaseio.com/rooms');
    }
}