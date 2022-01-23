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
const Gameboard = (function(names) {
    // player choice array with 9 x null as value
    let playerChoice = [];
    let winPatterns = [];

    let player1 = '';
    let player2 = '';
    let turn = '';

    // create a 3 x 3 Grid with event listeners for click
    // create text field which shows who's turn it is
    function startNewGame (names) {
        player1 = names [0];
        player2 = names [1];

        playerChoice = [null, null, null, null, null, null, null, null, null];
        winPatterns = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

        turn = player1;

        const main = document.querySelector('.main');

        const displayTurn = document.createElement('div');
        displayTurn.classList = 'displayTurn';
        displayTurn.textContent = `It's your turn ${turn}`;
        const gridContainer = document.createElement('div');
        gridContainer.classList = 'gridContainer';

        main.appendChild(displayTurn);
        main.appendChild(gridContainer);

        let countRow = 0;
        let countField = 0;

        while (countRow<3) {
            let gridRow = document.createElement('div');
            gridRow.classList = `gridRow row${countRow}`
            gridContainer.appendChild(gridRow);
            let repeat = 0;
            while (repeat < 3) {
                let gridField = document.createElement('div');
                gridField.classList = `gridField field${countField}`;
                gridField.setAttribute('data-id', `${countField}`);
                gridRow.appendChild(gridField);
                repeat++;
                countField++;
            };
            countRow++;
        };
        _addEventListenerPlayerChoice();
    };

    function _addEventListenerPlayerChoice () {
        const griedFields = document.querySelectorAll('.gridField');
        griedFields.forEach (field => {
            field.addEventListener('click', _checkForValidMove);
        });
    };

    function _removeEventListenerPlayerChoice () {
        const griedFields = document.querySelectorAll('.gridField');
        griedFields.forEach (field => {
            field.removeEventListener('click', _checkForValidMove);
        });
    };
    
    function _checkForValidMove (e) {
        if (e.target.textContent == '') {
            _savePlayerChoice(e);
            _displayPlayerChoice();
            _checkForResult();
        };
    };

    // either save X or # as players choice
    function _savePlayerChoice (e) {
        let playerSymbol = '#';
        if (turn === player1) {
            playerSymbol = 'X';
        };
        playerChoice[e.target.dataset.id] = playerSymbol;

        let winPatternCount = 0;
        winPatterns.forEach (pattern => {
            let indexCount = 0;
            pattern.forEach (index => {
                if (index == e.target.dataset.id) {
                    winPatterns[winPatternCount][indexCount] = playerSymbol;
                };
                indexCount++;
            });
            winPatternCount++;
        });
    };
        
    function _displayPlayerChoice () {
        const gridFields = document.querySelectorAll('.gridField');
        let count = 0;
        gridFields.forEach (field => {
            if (playerChoice[count] !== null) {
                field.textContent = playerChoice[count];
            };
            count++;
        });
    };

    function _changeTurn () {
        if (turn === player1) {
            turn = player2;
        } else {
            turn = player1;
        };

        const displayTurn = document.querySelector('.displayTurn');
        displayTurn.textContent = `It's your turn ${turn}`;
    };
    // checks array for win or draw pattern
    function _checkForResult () {
        let winner = '';
        winPatterns.forEach (pattern => {
            if (pattern.every( (val, i, arr) => val === arr[0] )) {
                winner = turn;
            };
        });
    
        if (!playerChoice.includes(null)) {
            _displayResult(winner);
        } else if (winner !== '') {
            _displayResult(winner);
        } else {
            _changeTurn();
        };
    };

    function _displayResult (result) {
        const main = document.querySelector('.main');
        const resultLabel = document.createElement('div');
        resultLabel.classList = 'resultLabel';
        const resultBtnContainer = document.createElement('div');
        resultBtnContainer.classList = 'resultBtnContainer';
        const btnReset = document.createElement('button');
        btnReset.classList = 'btnReset';
        btnReset.innerText = 'Rematch';
        const btnReturn = document.createElement('button');
        btnReturn.classList = 'btnReturn';
        btnReturn.innerText = 'Select Game Mode';

        if (result === '') {
            resultLabel.textContent = 'It\'s a draw!';
        } else {
            resultLabel.textContent = `The winner is ${result}!`;
        };

        main.appendChild(resultLabel);
        main.appendChild(resultBtnContainer);
        resultBtnContainer.appendChild(btnReset);
        resultBtnContainer.appendChild(btnReturn);

        _addClickEventToResetButton(btnReset);
        _addClickEventToReturnButton(btnReturn);

        _removeEventListenerPlayerChoice();
    };

    function _addClickEventToResetButton (btnReset) {
        btnReset.addEventListener('click', _reset);
    };

    function _addClickEventToReturnButton (btnReturn) {
        btnReturn.addEventListener('click', _return);
    }

    // reset
    function _reset () {
        _delete();
        startNewGame([player1, player2]);
    };
        // set all of the array values to null again
    // delete
    function _delete () {
        const main = document.querySelector('.main');
        while (main.firstChild) {
            main.removeChild(main.lastChild);
        };
    };

    function _return () {
        _delete();
        Organizer.askForGameMode();
    };
        // delete the whole grid and show start screen again
    return {
        startNewGame
    };
})();

// Organizer module
const Organizer = (function() {
    let gameMode = '';
    let first = true;
    // askForGameMode
        // setup the main html with two buttons and labels
    function askForGameMode() {
        gameMode = '';
        const main = document.querySelector('.main');
        
        let container = document.createElement('div');
        container.classList = 'container';
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

        _addClickEventToNewGameButtons(btnPlayer, btnComputer);
    };
    
    function _addClickEventToNewGameButtons (btnPlayer, btnComputer) {
        btnPlayer.addEventListener('click', _prepareNewGame);
        btnComputer.addEventListener('click', _prepareNewGame);
    };

    function _prepareNewGame (e) {
        _setGameMode(e);
        _showHidePlayerNamesModal();
        if (first == true) {
            _addClickEventStartGame();
            _addEventListenerFormdata();
            first = false;
        };
    };
    
    // set the gameMode
    function _setGameMode (e) {
        if ((e.target.className).includes('Computer')) {
            gameMode = '.playerName';
            alert('You want to play against the computer.');
        } else {
            gameMode = '.playerNames';
            alert('1 vs 1');
        };
    };

    // show or hide Input Form that asks for Player names with one button to start the game
    function _showHidePlayerNamesModal () {
        const userForm = document.querySelector(gameMode);
        const overlay = document.querySelector('#overlay');
        userForm.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    function _addClickEventStartGame () {
        const userForm = document.querySelector(gameMode);
        userForm.addEventListener('submit', (e) => {
            e.preventDefault();
            new FormData(userForm);
        });
    };

    //save Player names and hide input form
    function _addEventListenerFormdata () {
        const userForm = document.querySelector(gameMode);
        userForm.addEventListener('formdata', (e) => {
            let data = e.formData;
            let names = [];
            for (let value of data.values()) {
                names.push(value);
            };
            userForm.reset();
            _showHidePlayerNamesModal();
            _deleteSetupElements();
            Gameboard.startNewGame(names);
        });
    };

    function _deleteSetupElements () {
        const main = document.querySelector('.main');
        while (main.firstChild) {
            main.removeChild(main.lastChild);
        };
    };
        
    // announceResult
        // showForm that announces the result
        // two buttons one for rematch and one for start screen
    // setupRematch
        // hide the form and reset the gameBoard
    return {
        askForGameMode
    };
})();
    
// IFFE
(function() {
    Organizer.askForGameMode();
})();