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

let player = {
    name: "",
    choice: "",

    intervalId: null,

    getPlayerName: () => {
        document.getElementById("user-info").innerHTML = "";

        let form = document.createElement("form");

        let label = document.createElement("label");
        let input = document.createElement("input");
        let button = document.createElement("button");

        label.setAttribute("id", "user-prompt");
        input.setAttribute("id", "input-name");
        button.setAttribute("id", "submit");

        label.innerText = "Please enter your name ";
        button.innerText = "Submit";

        form.append(label, input, button);

        document.getElementById("user-info").append(form);

        document.getElementById("submit").addEventListener("click", function submitEvent(event) {
            event.preventDefault();

            document.getElementById("submit").removeEventListener("click", submitEvent);
            
            player.name = document.getElementById("input-name").value;

            let falseName = false;

            if (player.name === "" || player.name == null) {
                document.getElementById("user-prompt").textContent = "That's not a name. Please enter a name ";
                falseName = true;
            }
            else {
                document.getElementById("user-info").innerHTML = "<p>Awesome, your name is '<span class='bold'>" + player.name + "</span>'.</p>";
                database.ref("janken/" + player.name).set({
                    name: player.name,
                });
                database.ref("janken/" + player.name).onDisconnect().remove();
                player.countDown();
            }

            if (falseName) {
                let count = 0;
                document.getElementById("submit").addEventListener("click", function submitEvent2(event) {
                    event.preventDefault();

                    player.name = document.getElementById("input-name").value;

                    let tries = 5;
                    if ((player.name === "" || player.name == null) && count < tries) {
                        document.getElementById("user-prompt").textContent = "That's not a name, you have " + (tries - count) + " more tries to pick a name ";
                        count++;
                    }
                    else if ((player.name === "" || player.name == null) && count >= tries) {
                        document.getElementById("submit").removeEventListener("click", submitEvent2);
                        player.name = Math.random().toString(36).replace('0.', '').substr(0, 8);
                        document.getElementById("user-info").innerHTML = "<p>Fine, I'll pick a name for you... Your new name is '<span class='bold'>" + player.name + "</span>'. You're welcome...</p>";
                        database.ref("janken/" + player.name).set({
                            name: player.name,
                        });
                        database.ref("janken/" + player.name).onDisconnect().remove();
                        player.countDown();
                    }
                    else {
                        document.getElementById("submit").removeEventListener("click", submitEvent2);
                        document.getElementById("user-info").innerHTML = "<p>Ok, your name is '<span class='bold'>" + player.name + "</span>'.</p>";
                        database.ref("janken/" + player.name).set({
                            name: player.name,
                        });
                        database.ref("janken/" + player.name).onDisconnect().remove();
                        player.countDown();
                    }
                });
            }
        });
    },

    countDown: () => {
        let count = 5;
        let intervalId = setInterval(() => {
            if (count > 0) {
                document.getElementById("rps").innerHTML = "<p>"+count+" seconds left</p>";
                count--;
            }
            else {
                document.getElementById("rps").innerHTML = "";
                clearInterval(intervalId);
                player.startGame();
            }
        }, 1000);
    },

    startGame: () => {
        console.log("Game start!");

        document.getElementById("user-info").innerHTML = "<p>Choose your weapon...</p>";

        let ul = document.createElement("ul");

        let rock = document.createElement("li");
        let paper = document.createElement("li");
        let scissors = document.createElement("li");

        rock.setAttribute("id", "rock");
        paper.setAttribute("id", "paper");
        scissors.setAttribute("id", "scissors");

        rock.textContent = "Give them the rock!";
        paper.textContent = "Serve them those papers!";
        scissors.textContent = "Run with those scissors!";

        ul.append(rock, paper, scissors);

        document.getElementById("rps").append(ul);

        rock.addEventListener("click", () => {
            player.saishoWaGuujankenPo("rock");
        });

        paper.addEventListener("click", () => {
            player.saishoWaGuujankenPo("paper");
        });

        scissors.addEventListener("click", () => {
            player.saishoWaGuujankenPo("scissors");
        });
    },

    // This function handles the storing of the move thrown, both locally and in the firebase backend
    // It is named after the Japanese ritual performed before playing rock, paper, scissors
    // If you still don't understand the name, look into the Hunter x Hunter anime or wikipedia...
    saishoWaGuujankenPo: throwMove => {
        player.choice = throwMove;

        database.ref("janken/" + player.name).set({
            name: player.name,
            choice: throwMove
        });

        // database.ref("janken/" + player.name).onDisconnect().remove();
        document.getElementById("user-info").innerHTML = "<p>One moment please...</p>";
        document.getElementById("rps").innerHTML = "";

        // check database for other players
        database.ref("janken").on("child_added", data => {
            console.log(data.val());

            let opponent = data.val();

            if (opponent.name != player.name && data.hasChild("choice")) {
                if ((player.choice == "rock" && opponent.chioce == "scissors")
                || (player.choice == "scissors" && opponent.choice == "paper")
                || (player.choice == "paper" && opponent.choice == "rock")) {
                    console.log ("you win " + player.name);

                    let p1 = document.createElement("p");
                    let p2 = document.createElement("p");
                    let p3 = document.createElement("p");

                    p1.textContent = "You win!";
                    p2.textContent = "You chose " + player.choice;
                    p3.textContent = "Your opponent chose " + opponent.choice;

                    document.getElementById("user-info").innerHTML = "";
                    document.getElementById("rps").append(p1, p2, p3);
                }
                else if ((player.choice == "rock" && opponent.chioce == "paper")
                || (player.choice == "scissors" && opponent.choice == "rock")
                || (player.choice == "paper" && opponent.choice == "scissors")) {
                    console.log ("you lose " + player.name);

                    let p1 = document.createElement("p");
                    let p2 = document.createElement("p");
                    let p3 = document.createElement("p");

                    p1.textContent = "You lose!";
                    p2.textContent = "You chose " + player.choice;
                    p3.textContent = "Your opponent chose " + opponent.choice;

                    document.getElementById("user-info").innerHTML = "";
                    document.getElementById("rps").append(p1, p2, p3);
                }
                else {
                    console.log ("you tied " + player.name);

                    let p1 = document.createElement("p");
                    let p2 = document.createElement("p");
                    let p3 = document.createElement("p");

                    p1.textContent = "You tied!";
                    p2.textContent = "You chose " + player.choice;
                    p3.textContent = "Your opponent chose " + opponent.choice;

                    document.getElementById("user-info").innerHTML = "";
                    document.getElementById("rps").append(p1, p2, p3);
                }
            }
        });
    }
}

player.getPlayerName();

// after getting player name, then we must start the game
