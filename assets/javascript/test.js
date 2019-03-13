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
            
            this.name = document.getElementById("input-name").value;
            console.log(this.name);

            if (this.name === "" || this.name == null) {
                document.getElementById("user-prompt").textContent = "That's not a name. Please enter a name "
            }

            let count = 0;
            document.getElementById("submit").addEventListener("click", function submitEvent2(event) {
                event.preventDefault();

                let tries = 5;
                if ((this.name === "" || this.name == null) && count < tries) {
                    document.getElementById("user-prompt").textContent = "Are you even trying? You have " + (tries - count) + " more tries to pick a name "
                    count++;
                }
                else if ((this.name === "" || this.name == null) && count >= tries) {
                    document.getElementById("submit").removeEventListener("click", submitEvent2);
                    this.name = Math.random().toString(36).replace('0.', '').substr(0, 8);
                    document.getElementById("user-info").innerHTML = "<p>Fine, I'll pick a name for you... Your new name is '<span class='bold'>" + this.name + "</span>'. You're welcome...</p>";
                }
                else {
                    document.getElementById("submit").removeEventListener("click", submitEvent2);
                    document.getElementById("user-info").innerHTML = "<p>You did it! Your new name is '<span class='bold'>" + this.name + "</span>'.</p>";
                }

                // console.log(this.name);
                // console.log(this.name === "" || this.name == null);
                // console.log((this.name === "" || this.name == null) && count < 5);
                // console.log((this.name === "" || this.name == null) && count >= 5);
            });
        });
    }
}

player.getPlayerName();
