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

        if (player === 1) {
            $("#instructions").text('Waiting for Player 2...');
        }
        else {
            writeScores();
        }

        players.push(newPlayer);

        saveToFirebase(newPlayer);
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

        currentPlayer = getCurrentPlayer();

        //Write selection
        players[currentPlayer].selection = "r";
        console.log(`Player: ${players[currentPlayer].player}   Selection: ${players[currentPlayer].selection}`);
        
        processSelection(currentPlayer)
        
        //$("#instructions").text(`Name: ${name}   Player ${currentPlayer}`);
    });

    //Paper card was clicked
    $("#paper-btn").on("click", function() {
        event.preventDefault();

        currentPlayer = getCurrentPlayer();

        //Write selection
        players[currentPlayer].selection = "p";
        console.log(`Player: ${players[currentPlayer].player}   Selection: ${players[currentPlayer].selection}`);

        processSelection(currentPlayer)

        //$("#instructions").text(`Name: ${name}   Player ${currentPlayer}`);
    });

    //Scissors card was clicked
    $("#scissors-btn").on("click", function() {
        event.preventDefault();

        currentPlayer = getCurrentPlayer();

        //Write selection
        players[currentPlayer].selection = "s";
        console.log(`Player: ${players[currentPlayer].player}   Selection: ${players[currentPlayer].selection}`);
        
        processSelection(currentPlayer)

        //$("#instructions").text(`Name: ${name}   Player ${currentPlayer}`);
    });

    function processSelection(currentPlayer) {
        let winner = getWinner();
        saveToFirebase(players[currentPlayer]);

        if (winner === -1) {
            $("#instructions").text('Ready to Play Player 2');
        }
        else {
            saveScore(winner);
            writeScores();
            resetScores();
            $("#instructions").text('Ready to Play Player 1');
        }
    }

    function getCurrentPlayer() {
        if (players[1].selection === "") {
            return 1;
        }
        else if (players[2].selection === "") {
            return 2;
        }
    }

    function getWinner() {
        let winner = -1;

        if (players[1].selection === "" || players[2].selection === "") {
            return winner;
        };

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

    function writeScores() {
        const name = $('<h5>');
        name.html(`Name: ${players[1].name}`);
        const wins = $('<h5>');
        wins.html(`Wins: ${players[1].wins}`);
        const losses = $('<h5>');
        losses.html(`Losses: ${players[1].losses}`);
        const ties = $('<h5>');
        ties.html(`Ties: ${players[1].ties}`);

        $('#player-1').append(name);
        $('#player-1').append(wins);
        $('#player-1').append(losses);
        $('#player-1').append(ties);

        const name2 = $('<h5>');
        name2.html(`Name: ${players[2].name}`);
        const wins2 = $('<h5>');
        wins2.html(`Wins: ${players[2].wins}`);
        const losses2 = $('<h5>');
        losses2.html(`Losses: ${players[2].losses}`);
        const ties2 = $('<h5>');
        ties2.html(`Ties: ${players[2].ties}`);

        $('#player-2').append(name2);
        $('#player-2').append(wins2);
        $('#player-2').append(losses2);
        $('#player-2').append(ties2);
    }

    function resetScores() {
        players[1].selection = "";
        saveToFirebase(players[1]);

        players[2].selection = "";
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

            //enable rps buttons
            if (players.length === 3) {
                $('#rock-btn').removeAttr("disabled")
                $('#paper-btn').removeAttr("disabled")
                $('#scissors-btn').removeAttr("disabled")
                $("#instructions").text('Ready to Play Player 1');
            }
        }

    //Catch error
    }, function(errorObject) {

        // In case of error this will print the error
        console.log("The read failed: " + errorObject.code);
    });
});