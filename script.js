let player = "X" // current player
let gameRunning = true // is there a game currently running?
let clicked // any element that has been clicked
let winner = document.getElementById("winner")
let pos // current button pos (0-8)
let turns = 0 // how many turns have gone by?
let rounds = 0 // how many rounds have gone by?
let autostart = document.getElementById("autostart") // (autostart) will the game restart automatically when someone wins?
let autotime = document.getElementById("autotime") // (autostart) how long to wait?
let autolabel = document.getElementById("autotimelabel")
let autorounds = document.getElementById("autorounds")
let autoroundslabel = document.getElementById("autoroundslabel")
//let roundmax = 0 // (autostart) how many pts does a player need to win?
let xwins = 0 // how many times has player X won? (bc it was to hard the get the value from the innerHTML of the display lol :)
let owins = 0 // O wins
let draws = 0 // draws
let debug = false // is debug mode enabled?

function log(txt, nocon) {
    console.log(txt) // consol
    if (nocon) {
        alert(txt) // if console can't be accessed
    }
}

// grid as an array
let cells = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
]

// show the Player - Wins! / Draw! text
function showWinText(winText) {
    winner.innerHTML = winText
}

// hide above text
function hideWinText() {
    winner.innerHTML = ""
}

// reset cells to be blank (moduarity)
function resetCells() {
    cells = ["", "", "", "", "", "", "", "", "",]
}

// reset rounds and update the display
function resetRounds() {
    rounds = 0
    updateDisplay()
}

// Clear innerHTML of buttons (when button clicked, its innerHTML is set to reflect the player)
function clearButtons() {
    pos = 0 // set pos to 0
    for (var r = 1; r <= 3; r++) { // for each row from 1-3
        for (var c = 1; c <= 3; c++) { // each collumn from 1-3
            document.getElementById("btn" + r + "-" + c + pos).innerHTML = "" // set the button with id btnR-CP
            pos++ // increment pos
        }
    }
}

// clear cells and buttons
function clear() {
    resetCells()
    //resetRounds()
    clearButtons()
}

// start a new ROUND
function newGame() {
    rounds++ // increment rounds
    updateDisplay() // update the display
    // empty cells
    // clear buttons
    clear() // clear board and buttons

    // reset player
    player = "X" // reset the player to X
    gameRunning = true // start running game
    hideWinText() // hide the winning text
    turns = 0 // reset turns
}

// lol
function doWinShit() { // angy 3:<
    if (autostart.checked && autorounds.value != 0) { // check if game restarts automatically, and if game is set to stop at a certain round
        if (rounds < autorounds.value) { // if game is complete, and rounds is still less than the stopping round
            if (autotime.value != 0) {
                setTimeout(() => { // wait
                    newGame() // start a new ROUND
                }, (autotime.value * 1000)); // idk tbh i think 1000 works but i am to lasy to look it up lol
            }
        } else { // if stopping round reached
            hideWinText() // hide the win text
            clear() // clear board
            if (xwins > owins) { // if x won more than o
                showWinText("Player X Wins Overall!") // say that X won overall
            } else { // if x didn't triumph over O
                if (owins > xwins) { // check if O is better than X
                    showWinText("Player O Wins Overall!") // O won overall
                } else { // if they both tied
                    showWinText("Draw Overall!") // overall draw
                }
            }
        }
    }
}

// update points/rounds/draws display
function updateDisplay() {
    // pretty self explanitory
    document.getElementById("x-wins").innerHTML = "X Wins: " + xwins
    document.getElementById("o-wins").innerHTML = "O Wins: " + owins
    document.getElementById("draws").innerHTML = "Draws: " + draws
    document.getElementById("rounds").innerHTML = "Rounds: " + rounds
}

// reset scores
function resetScores() {
    // also self explanitory
    xwins = 0
    owins = 0
    draws = 0
    resetRounds()
    turns = 0
    updateDisplay()
}

// clear EVERYTHING
function FullClear() {
    // oooh CamelCase
    clear()
    resetScores()
    hideWinText()
}

// new game
document.getElementById("rstbtn").addEventListener('click', (event) => {
    newGame()
});

// reset scores
document.getElementById("reset").addEventListener('click', (event) => {
    if (window.confirm("Are you sure you want to start a new game?\n(this will clear all scores)")) {
        FullClear()
    }
});

// reset rounds
document.getElementById("clearrounds").addEventListener('click', (event) => {
    resetRounds()
});

// check if autostart was clicked
autostart.addEventListener("click", (event) => {
    // if it was clicked, its check must have changed, so chenge childern hidden
    autotime.hidden = !autotime.hidden
    autolabel.hidden = !autolabel.hidden
    autorounds.hidden = !autorounds.hidden
    autoroundslabel.hidden = !autoroundslabel.hidden
});

// clear button
document.getElementById("clearbtn").addEventListener("click", (event) => {
    clear()
});

// all win conditions
let wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Check win conditions
function checkWin() {
    // for each win condition
    for (const cond of wins) {
        // check if each of the cell's values are equal, and not blank
        if (
            cells[cond[0]] == cells[cond[1]] &&
            cells[cond[1]] == cells[cond[2]] &&
            cells[cond[2]] == cells[cond[0]] &&
            cells[cond[0]] != ""
        ) {
            return true
        }
    }
    return false
}

// check if a win has occured, and do stuff for it
// only a function for debug win buttons
function checkForWin() {
    if (checkWin()) {
        //alert("Win")
        gameRunning = false
        // who won?
        if (player == "X") {
            showWinText("Player X Wins!")
            xwins++
        } else {
            if (player == "O") {
                showWinText(winner.innerHTML = "Player O Wins!")
                owins++
            }
        }
        updateDisplay()
        doWinShit()
    } else {
        // check draw
        if (turns == 8) {
            showWinText(winner.innerHTML = "Draw!")
            draws++
            doWinShit()
        }
        updateDisplay()
    }
}

// check if ANY element was clicked
window.onclick = e => {
    clicked = e.target

    // if the clicked element is a cell button with a blank innerHTML, and the game is running
    if (clicked.className == "tictacbtn" && clicked.innerHTML == "" && gameRunning) {
        clicked.innerHTML = player // set the innerHTML to the current player

        // get pos of button
        pos = parseInt(clicked.id.charAt(6))
        cells[pos] = player

        // check win
        checkForWin()

        turns++ // increment turns
        //swap player
        if (player == "X") {
            player = "O"
        } else {
            player = "X"
        }
    }
}

// update debug biutton hide
function updateDebug() {
    document.getElementById("XwinBtn").hidden = !debug
    document.getElementById("OwinBtn").hidden = !debug
    document.getElementById("DrawBtn").hidden = !debug
}

// check debug
let keys = {
    d: false,
    b: false,
    g: false,
};

addEventListener("keydown", (event) => {
    if (event.key === "d") {
        keys.d = true;
    }
    if (event.key === "b") {
        keys.b = true;
    }
    if (event.key === "g") {
        keys.g = true;
    }

    if (keys.d && keys.b && keys.g) {
        debug = !debug
        //alert(debug)
        updateDebug()
    }

});

addEventListener("keyup", (event) => {
    if (event.key === "d") {
        keys.d = false;
    }
    if (event.key === "b") {
        keys.b = false;
    }
    if (event.key === "g") {
        keys.g = false;
    }
});

// make a player win (or make draw) by forcing their win condition then checking for a win
document.getElementById('XwinBtn').addEventListener('click', function (e) {
    cells = ["X", "X", "X", "", "", "", "", "", "",]
    checkForWin()
});
document.getElementById('OwinBtn').addEventListener('click', function (e) {
    cells = ["O", "O", "O", "", "", "", "", "", "",]
    checkForWin()
});
document.getElementById('DrawBtn').addEventListener('click', function (e) {
    cells = ["", "", "", "", "", "", "", "", "",]
    turns = 8
    checkForWin()
});