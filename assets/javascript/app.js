// Initialize Firebase
let config = {
    apiKey: "AIzaSyDkzgePzwnfeMNxusbK89JKnuarexpub_M",
    authDomain: "rps-multiplayer-74bcc.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-74bcc.firebaseio.com",
    projectId: "rps-multiplayer-74bcc",
    storageBucket: "",
    messagingSenderId: "1028361656334"
  };

firebase.initializeApp(config);

let database = firebase.database();

// * Create a game that suits this user story:

// * Only two users can play at the same time.

// * Both players pick either `rock`, `paper` or `scissors`. After the players make their selection, the game will tell them whether a tie occurred or if one player defeated the other.

// * The game will track each player's wins and losses.

// * Throw some chat functionality in there! No online multiplayer game is complete without having to endure endless taunts and insults from your jerk opponent.

// * Styling and theme are completely up to you. Get Creative!

// * Deploy your assignment to Github Pages.

// -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
let connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
let connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", snap => {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    let con = connectionsRef.push(true);

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", snapshot => {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.

    let num = snapshot.numChildren();

    if (num === 1) {
        document.getElementById("watchers").textContent = num + " person is watching";
    }
    else {
        document.getElementById("watchers").textContent = num + " people are watching";
    }
    
});

// -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
let player;
let name = prompt("What's your name?");
while (name === "" || name === null) {
    name = prompt("Give me a proper name!");
}
ensureUniquePlayerName(name);




let listElements = document.getElementsByTagName("li");

for (i=0; i < listElements.length; i++) {

    let element = listElements.item(i);
    element.addEventListener("click", () => {

        let choice = element.getAttribute("data-value");

        console.log(choice);

        // save choice to database
        player.set({
            name: name,
            choice: choice
        }).then(() => {

            let users = database.ref("users");

            console.log(users);
            // console.log(users.val());
            users.on("value", snapshot => {
                console.log(snapshot.val());
            })

            // users.once("value", snapshot => {

            // })

        })

        // save choice to database
        // wait for another choice

        // or 

        // check database for choice
        // if choice exists, compare to current choice
        // determine a winner
    });
}

function ensureUniquePlayerName(name) {
    player = database.ref("users/" + name);
    player.once("value", snapshot => {
        if (snapshot.exists()) {
            name = prompt("That player already exists, enter a new name");
            while (name === "" || name === null) {
                name = prompt("If you want to play the game, then you must enter a name");
            }
            ensureUniquePlayerName(name);
        }
        else {

            player.set({
                name: name
            });
            player.onDisconnect().remove();
        }
    
    }).catch(error => {
        console.log("Uh oh... there has been an error");
        console.log(error);
    });
}