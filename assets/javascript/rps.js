$(document).ready(function() {
    // Firebase Config

    var firebaseConfig = {
        apiKey: "AIzaSyDU0dlAtMCVbQUIp5gsOgZBu7V20dMk5jc",
        authDomain: "testerproject-c6e19.firebaseapp.com",
        databaseURL: "https://testerproject-c6e19.firebaseio.com",
        projectId: "testerproject-c6e19",
        storageBucket: "testerproject-c6e19.appspot.com",
        messagingSenderId: "928064114785",
        appId: "1:928064114785:web:b67a6812bfee7365"
    };
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Get a reference to the database service
    var database = firebase.database();

    // Setting initial values
    let players = [];
    players.push(null);
    let currentPlayer = 1;

    //Functions and Events

    //enter username
    $("#username").on("click", function() {
        event.preventDefault();

        let player = players.length;
        let name = $('#name-input').val();
        console.log(`Name: ${name}   Player: ${currentPlayer}`);

        //Create new key in firebase
        let rpsRef = database.ref('rps').push();
        let key = rpsRef.getKey();

        let newPlayer = {
            key: key,
            player: player,
            name: name,
            selection: "",
            wins: 0,
            losses: 0,
            ties: 0
        };

        players.push(newPlayer);

        saveToFirebase(newPlayer);
        //$("#instructions").text(`Name: ${name}   Player ${currentPlayer}`);
    });
        
    function saveToFirebase(player) {
        //Get object from Firebase
        let refPath = "rps/" + player.key;
        let rpsRef = database.ref(refPath);

        //Set to firebase
        rpsRef.set({
            key: player.key,
            player: player.player,
            name: player.name,
            selection: player.selection,
            wins: player.wins,
            losses: player.losses,
            ties: player.ties
        });
    }

    //Rock card was clicked
    $("#rock-btn").on("click", function() {
        event.preventDefault();

        //Write selection
        players[currentPlayer].selection = "r";
        console.log(`Player: ${players[currentPlayer].player}   Selection: ${players[currentPlayer].selection}`);
        
        let winner = getWinner();
        saveScore(winner);
        //$("#instructions").text(`Name: ${name}   Player ${currentPlayer}`);
    });

    //Paper card was clicked
    $("#paper-btn").on("click", function() {
        event.preventDefault();

        //Write selection
        players[currentPlayer].selection = "p";
        console.log(`Player: ${players[currentPlayer].player}   Selection: ${players[currentPlayer].selection}`);
        
        let winner = getWinner();
        saveScore(winner);
        //$("#instructions").text(`Name: ${name}   Player ${currentPlayer}`);
    });

    //Scissors card was clicked
    $("#scissors-btn").on("click", function() {
        event.preventDefault();

        //Write selection
        players[currentPlayer].selection = "s";
        console.log(`Player: ${players[currentPlayer].player}   Selection: ${players[currentPlayer].selection}`);
        
        let winner = getWinner();
        saveScore(winner);
        //$("#instructions").text(`Name: ${name}   Player ${currentPlayer}`);
    });

    function getWinner() {
        let winner = -1;

        // if (player1Selection === "" || player2Selection === "") {
        //     //waiting for response
        players[2].selection = "r"
        // };

        switch(players[1].selection) {
            case "r":
                if (players[2].selection === "r") { winner = 0; break; }
                if (players[2].selection === "s") { winner = 1; break; }
                if (players[2].selection === "p") { winner = 2; break; }
                break;
            case "p":
                if (players[2].selection === "p") { winner = 0; break; }
                if (players[2].selection === "r") { winner = 1; break; }
                if (players[2].selection === "s") { winner = 2; break; }
                break;
            case "s":
                if (players[2].selection === "s") { winner = 0; break; }
                if (players[2].selection === "p") { winner = 1; break; }
                if (players[2].selection === "r") { winner = 2; break; }
                break;
            default:
                // code block
        }

        return winner;
    }

    function saveScore(winner) {

        switch(winner) {
            case 0:
                players[1].ties++;
                break;
            case 1:
                players[1].wins++;
                break;
            case 2:
                players[1].losses++;
                break;
            default:
                // code block
        }

        //Save Player 1
        saveToFirebase(players[1]);

        switch(winner) {
            case 0:
                players[2].ties++;
                break;
            case 1:
                players[2].losses++;
                break;
            case 2:
                players[2].wins++;
                break;
            default:
                // code block
        }

        //Save Player 2
        saveToFirebase(players[2]);
    }

    // Using .on("value", function(snapshot)) syntax will retrieve the data
    // from the database (both initially and every time something changes)
    // This will then store the data inside the variable "snapshot". We could rename "snapshot" to anything.
    database.ref('rps').on("value", function(snapshot) {

        //value returned
        if (snapshot.val() != null) {

            //Write the value of snapshot
            console.log(snapshot.val());

            players = [];
            players.push(null);

            //Loop through keys in firebase
            //Get values and write to array
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();

                players.push({
                    key: childData.key,
                    player: childData.player,
                    name: childData.name,
                    selection: childData.selection,
                    wins: childData.wins,
                    losses: childData.losses,
                    ties: childData.ties
                });
            });
        }

        //Catch error
        }, function(errorObject) {

        // In case of error this will print the error
        console.log("The read failed: " + errorObject.code);
    });
});