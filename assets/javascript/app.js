// Initialize Firebase
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

// * Create a game that suits this user story:

// * Only two users can play at the same time.

// * Both choiceRefs pick either `rock`, `paper` or `scissors`. After the choiceRefs make their selection, the game will tell them whether a tie occurred or if one choiceRef defeated the other.

// * The game will track each choiceRef's wins and losses.

// * Throw some chat functionality in there! No online multichoiceRef game is complete without having to endure endless taunts and insults from your jerk opponent.

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
let firebaseConnectionEstablished = new Promise( (resolve, reject) => {
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
          
          resolve(num);
      });
}).catch( error => {
    console.log("error ocurred during the promise, firebase connection established")
    console.log(error);
});

// -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
let name;

let nameRef;
let choiceRef;

let duelers = [];

firebaseConnectionEstablished.then( () => {

    name = prompt("What's your name?");
    while (name === "" || name === null) {
        name = prompt("Give me a proper name!");
    }

    let playerIsSet = new Promise((resolve, reject) => {
        setPlayer();
        // console.log("during FCE: " + name);
        resolve(name);
    });
    
    playerIsSet.then( () => {
        let listElements = document.getElementsByTagName("li");

        for (i=0; i < listElements.length; i++) {

            let element = listElements.item(i);
            element.addEventListener("click", () => {

                let choice = element.getAttribute("data-value");

                // console.log(choice);

                // save choice to database
                choiceRef.set({
                    name: name,
                    choice: choice
                }).then(() => {

                    let userChoices = database.ref("users/choice");
                    
                    userChoices.on("child_added", function(data) {

                        console.log(data.val());

                        duelers.push(data.val());

                        console.log(duelers);

                        if (duelers.length > 1) {
                            console.log("it's go time!");
                            
                            if (duelers[0].name === name) {
                                determineWinner(duelers[0].choice, duelers[1].choice);
                            }
                            else if(duelers[1].name === name) {
                                determineWinner(duelers[1].choice, duelers[0].choice);
                            }
                            else {
                                console.log("sorry "+name+", better wait your turn...");
                            }

                        }
                     })
                })
            });
        }
    }).catch( error => {
        console.log("an error ocurred during the promise, the player is set");
        console.log(error);
    });
    
});



function setPlayer() {
    nameRef = database.ref("users/"+name)
    choiceRef = database.ref("users/choice/"+name);

    nameRef.once("value", snapshot => {
        if (snapshot.exists()) {
            name = prompt("That name already exists, enter a new name");
            while (name === "" || name === null) {
                name = prompt("If you want to play the game, then you must enter a name");
            }
            setPlayer(name);
        }
        else {

            nameRef.set({
                name: name
            });

            nameRef.onDisconnect().remove();
            choiceRef.onDisconnect().remove();
        }
    
    }).catch(error => {
        console.log("Uh oh... there has been an error");
        console.log(error);
    });
}

function determineWinner(you, them) {
    if ( (you === 'r' && them === 's')
      || (you === 's' && them === 'p')
      || (you === 'p' && them === 'r')) {
        console.log("You win!");
        // alert("You win! Congratulations " + name);

        document.getElementById("rps").innerHTML = "<p>Congratulations " + name + ", you won!</p>";
    }
    else if ( (you === 'r' && them === 'p')
           || (you === 's' && them === 'r')
           || (you === 'p' && them === 's')) {
        console.log("You lose!");
        // alert("You lose! Sorry " + name);
        document.getElementById("rps").innerHTML = "<p>Boo " + name + ", you stink!</p>";
    }
    else {
        console.log("You tied...");
        // alert("You tied... better luck next time");
        document.getElementById("rps").innerHTML = "<p>You tied? how anti-climatic... better luck nex time!</p>";
    }

    console.log("goodbye "+duelers.pop().name + "!");
    console.log("farewell "+duelers.pop().name + "!");
}