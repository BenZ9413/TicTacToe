// Start Screen
    // 1 vs. 1
    // 1 vs. Computer

// 1 vs. 1
    // Show Modal to insert the players names
    // Player 1 starts by default
    // Click one after another
    // check for result
    // display the result
    // Offer a rematch or return to start



// Factory Function for Players
    // name

// GameBoard module
    // player choice array with 9 x null as value
    // create
        // create a 3 x 3 Grid with event listeners for click
        // create text field which shows who's turn it is
    // checkForValidMove
        // check if value in array is null
    // savePlayerChoice
        // either save X or # as players choice
    // displayPlayerChoice
        // display the array on screen inside of the assigned grid fields
    // checkForResult
        // checks array for win or draw pattern
    // reset
        // set all of the array values to null again
    // delete
        // delete the whole grid and show start screen again

// Organizer module
const Organizer = ((function() {
    // askForGameMode
    function askForGameMode() {
        const main = document.querySelector('.main');
        
        let container = document.createElement('div');
        let gameModePlayer = document.createElement('div');
        let gameModeComputer = document.createElement('div');

        let labelPlayer = document.createElement('div');
        labelPlayer.classList = 'label';
        labelPlayer.textContent = '1 vs. 1';
        let btnPlayer = document.createElement('button');
        btnPlayer.classList = 'btn btnPlayer';
        btnPlayer.innerText = 'New Game';

        let labelComputer = document.createElement('div');
        labelPlayer.classList = 'label';
        labelComputer.textContent = '1 vs. Computer';
        let btnComputer = document.createElement('button');
        btnComputer.classList = 'btn btnComputer';
        btnComputer.innerText = 'New Game';

        main.appendChild(container);

        container.appendChild(gameModePlayer);
        container.appendChild(gameModeComputer);

        gameModePlayer.appendChild(labelPlayer);
        gameModePlayer.appendChild(btnPlayer);

        gameModeComputer.appendChild(labelComputer);
        gameModeComputer.appendChild(btnComputer);
    };
        // setup the main html with two buttons and labels
    // askForPlayerNames
        // onClickEvent show Input Form that asks for Player names 
        // one Button to start the game
    // announceResult
        // showForm that announces the result
        // two buttons one for rematch and one for start screen
    // setupRematch
        // hide the form and reset the gameBoard
    return {
        askForGameMode
    };
}))();
    
// IFFE
(function() {
    Organizer.askForGameMode();
})();