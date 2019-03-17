var config = {
    apiKey: "AIzaSyDkzgePzwnfeMNxusbK89JKnuarexpub_M",
    authDomain: "rps-multiplayer-74bcc.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-74bcc.firebaseio.com",
    projectId: "rps-multiplayer-74bcc",
    storageBucket: "rps-multiplayer-74bcc.appspot.com",
    messagingSenderId: "1028361656334"
};

firebase.initializeApp(config);

let database = firebase.database();

database.ref("player").push({
    name: "daddy"
}).onDisconnect().remove();