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

                    // console.log(users);

                    userChoices.orderByChild("choice").on("child_added", function(data) {
                        console.log(data.val().name + " | " + data.val().choice);
                     });
                    
                    // users.on("value", snapshot => {

                    //     console.log(snapshot.val());



                        // let choiceRefs = snapshot.val();

                        // let numOfPlayers = snapshot.numChildren();

                        // console.log(typeof(numOfPlayers));

                        // if (numOfPlayers < 2) {
                        //     console.log("waiting for a challenger...");
                        // }
                        // else if (numOfPlayers == 2) {
                        //     console.log("we have a challenger");

                        //     let playerOne = database.ref("users/player-1");
                        //     let playerTwo = database.ref("users/player-2");

                        //     // get value of player one
                        //     // then get value of player two
                            

                        //     let yourChoice;
                        //     let theirChoice;

                        //     console.log("current " + name);
                        //     console.log("one " + playerOne.name);
                        //     console.log("two " + playerTwo.name);


                        //     if (name === playerOne.name) {
                        //         yourChoice = playerOne.choice;
                        //         theirChoice = playerTwo.choice;
                        //     }
                        //     else if (name === playerTwo.name) {
                        //         theirChoice = playerOne.choice;
                        //         yourChoice = playerTwo.choice;
                        //     }
                        //     else {
                        //         console.log("There were more than three players? That's one too many!");
                        //         alert("I'm sorry, but due to the limitations of the programmer, we will not be able to handle your request... check the console for more details");
                        //     }

                        //     if ( (yourChoice === 'r' && theirChoice === 's')
                        //       || (yourChoice === 's' && theirChoice === 'p')
                        //       || (yourChoice === 'p' && theirChoice === 'r')) {
                        //         console.log("You win!");
                        //         alert("You win! Congratulations " + name);
                        //     }
                        //     else if ( (yourChoice === 'r' && theirChoice === 'p')
                        //            || (yourChoice === 's' && theirChoice === 'r')
                        //            || (yourChoice === 'p' && theirChoice === 's')) {
                        //         console.log("You lose!");
                        //         alert("You lose! Sorry " + name);
                        //     }
                        //     else {
                        //         console.log("You tied...");
                        //         alert("You tied... better luck next time");
                        //     }
                        // }
                        // else {
                        //     console.log("A duel is commencing, please wait for your turn");
                        // }
                    // })

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
    }).catch( error => {
        console.log("an error ocurred during the promise, the player is set");
        console.log(error);
    });
    
});


// players.push(name);



// let listElements = document.getElementsByTagName("li");

// for (i=0; i < listElements.length; i++) {

//     let element = listElements.item(i);
//     element.addEventListener("click", () => {

//         let choice = element.getAttribute("data-value");

//         console.log(choice);

//         // save choice to database
//         choiceRef.set({
//             name: name,
//             choice: choice
//         }).then(() => {

//             let users = database.ref("users");

//             console.log(users);
//             // console.log(users.val());
//             users.on("value", snapshot => {
//                 console.log(snapshot);

//                 console.log(snapshot.val());

//                 let choiceRefs = snapshot.val();

//                 if (choiceRef.length > 1) {
//                     console.log("we have a challenger");
//                 }
//                 else {
//                     console.log("wating for a challenger...");
//                 }
//             })

//             // users.once("value", snapshot => {

//             // })

//         })

//         // save choice to database
//         // wait for another choice

//         // or 

//         // check database for choice
//         // if choice exists, compare to current choice
//         // determine a winner
//     });
// }

function setPlayer() {
    nameRef = database.ref("users/"+name)
    choiceRef = database.ref("users/choice/"+name);

    // choiceRef.set({
    //     name: name
    // }).catch(error => {
    //     console.log("Uh oh... there has been an error");
    //     console.log(error);
    // });

    // choiceRef.onDisconnect().remove();

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

            // removes user name and user's choice on disconnect
            nameRef.onDisconnect().remove();
            choiceRef.onDisconnect().remove();
        }
    
    }).catch(error => {
        console.log("Uh oh... there has been an error");
        console.log(error);
    });
}