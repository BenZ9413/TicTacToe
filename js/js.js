// GameBoard module
const Gameboard = (function(names) {
    // setup module scoped variables
    let player1 = '';
    let player2 = '';
    let gameboard = [];
    let winPatterns = [];
    let possibleMoves = [];
    let turn = '';
    let finished = false;

    // cashe relevant dom elements
    const main = document.querySelector('.main');

    function startNewGame (names) {
        _setStartValues(names);
        _createGameBoard();
        _addEventListenerPlayerChoice();
    };

    function _setStartValues (names) {
        player1 = names [0];
        player2 = names [1];
        gameboard = [null, null, null, null, null, null, null, null, null];
        winPatterns = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
        possibleMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        turn = player1;
        finished = false;
    };

    function _createGameBoard () {
        const displayTurn = document.createElement('div');
        displayTurn.classList = 'displayTurn';
        displayTurn.textContent = `It's your turn ${turn}`;
        const gridContainer = document.createElement('div');
        gridContainer.classList = 'gridContainer';

        main.appendChild(displayTurn);
        main.appendChild(gridContainer);

        let countRow = 0;
        let countField = 0;

        while (countRow < 3) {
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
    };

    function _addEventListenerPlayerChoice () {
        const griedFields = document.querySelectorAll('.gridField');
        griedFields.forEach (field => {
            field.addEventListener('click', _makeTheMove);
        });
    };

    function _removeEventListenerPlayerChoice () {
        const griedFields = document.querySelectorAll('.gridField');
        griedFields.forEach (field => {
            field.removeEventListener('click', _makeTheMove);
        });
    };

    function _makeTheMove (e) {
        if (_gridFieldIsEmpty(e)) {
            _savePlayerChoice(e);
            _updateGameboard();
            _checkForResult();
            if (player2 === undefined && !finished) {
                const aiChoice = _aiMove(gameboard, possibleMoves, winPatterns, false);
                _saveAiChoice(aiChoice);
                _updateGameboard();
                _checkForResult();
            };
        };
    };

    function _gridFieldIsEmpty (e) {
        if (e.target.textContent == '') {
            return true;
        } else {
            return false;
        };
    };

    function _savePlayerChoice (e) {
        let playerSymbol = '#';
        if (turn === player1) {
            playerSymbol = 'X';
        };

        // save player choice in gameboard
        gameboard[e.target.dataset.id] = playerSymbol;

        // update possible Moves after player Choice
        let currMove = Number(e.target.dataset.id);
        possibleMoves.splice(possibleMoves.indexOf(currMove), 1);

        // insert player Choice in win patterns for later check
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
        
    function _updateGameboard () {
        const gridFields = document.querySelectorAll('.gridField');
        let count = 0;
        gridFields.forEach (field => {
            if (gameboard[count] !== null) {
                field.textContent = gameboard[count];
            };
            count++;
        });
    };
    
    function _aiMove (currentGameBoard, possibleMoves, winPatterns, max_player, depth = 0) {
        //clear nodesMap if the function is called for a new move
        if (depth === 0) {
            nodesMap = new Map ();
        };

        // Check if board state is a terminal one
        let boardStateTerminal = false;
        let winner = ''
        winPatterns.forEach (pattern => {
            if (pattern.every( (val, i, arr) => val === arr[0] )) {
                winner = pattern[0];
                boardStateTerminal = true;
            } else if (winner == '' && possibleMoves.length == 0) {
                winner = 'draw';
                boardStateTerminal = true;
            };
        });

        //If the board state is a terminal one, return the heuristic value
        if (boardStateTerminal  || depth === 8) {  // 8 because when player starts, there is a max depth of 8
            if (winner === "X") {
                return 100 - depth;
            } else if (winner === "#") {
                return -100 + depth;
            };
            return 0;
        };

        let count = 0;

        if (max_player) {
            let best_value = Number.NEGATIVE_INFINITY;
           
            possibleMoves.forEach (possibleMove => {    
                // Copy current state of GameBoard
                const newGameBoard = [...currentGameBoard];
                // Insert possible AI Move into new Board
                newGameBoard[possibleMove] = "X";
                // delete AI Move from possibleMoves
                const dynPossibleMoves = [...possibleMoves];
                dynPossibleMoves.splice(count, 1);
                // Insert AI Move into winPattern
                const updtWinPatterns = [];
                for (let i = 0; i< winPatterns.length; i++) {
                    updtWinPatterns[i] = winPatterns[i].slice();
                };
                let winPatternCount = 0;
                updtWinPatterns.forEach (pattern => {
                    let indexCount = 0;
                    pattern.forEach (index => {
                        if (index == possibleMove) {
                            updtWinPatterns[winPatternCount][indexCount] = 'X';
                        };
                        indexCount++;
                    });
                    winPatternCount++;
                });
                // Call recursive function
                const nodeValue = _aiMove(newGameBoard, dynPossibleMoves, updtWinPatterns, false, depth + 1);
                // Update best value
                best_value = Math.max(best_value, nodeValue);

                //If it's the main function call, not a recursive one, map each heuristic value with it's moves indices
                if (depth == 0) { 
                    //Comma separated indices if multiple moves have the same heuristic value
                    const moves = nodesMap.has(nodeValue)
                        ? `${nodesMap.get(nodeValue)},${possibleMove}`
                        : possibleMove;
                    nodesMap.set(nodeValue, moves);
                };
                count++;
            });
            //If it's the main call, return the index of the best move or a random index if multiple indices have the same value
            if (depth == 0) { 
                let returnValue;
                if (typeof nodesMap.get(best_value) == "string") {
                    const arr = nodesMap.get(best_value).split(",");
                    const rand = Math.floor(Math.random() * arr.length);
                    returnValue = arr[rand];
                } else {
                    returnValue = nodesMap.get(best_value);
                };
                //return the index
                return returnValue;
            };
            // If it's not the main call, return best_value for recursive calculation
            return best_value;
        };

        if (!max_player) {
            let best_value = Number.POSITIVE_INFINITY;

            possibleMoves.forEach (possibleMove => {
                // Copy current state of GameBoard
                const newGameBoard = [...currentGameBoard];
                // Insert possible AI Move into new Board
                newGameBoard[possibleMove] = "#";
                // delete AI Move from possibleMoves
                const dynPossibleMoves = [...possibleMoves];
                dynPossibleMoves.splice(count, 1);
                // Insert AI Move into winPattern
                const updtWinPatterns = [];
                for (let i = 0; i< winPatterns.length; i++) {
                    updtWinPatterns[i] = winPatterns[i].slice();
                };
                let winPatternCount = 0;
                updtWinPatterns.forEach (pattern => {
                    let indexCount = 0;
                    pattern.forEach (index => {
                        if (index == possibleMove) {
                            updtWinPatterns[winPatternCount][indexCount] = '#';
                        };
                        indexCount++;
                    });
                    winPatternCount++;
                });
                // Call recursive function
                const nodeValue = _aiMove(newGameBoard, dynPossibleMoves, updtWinPatterns, true, depth + 1);
                // Update best value
                best_value = Math.min(best_value, nodeValue);

                //If it's the main function call, not a recursive one, map each heuristic value with it's moves indices
                if (depth == 0) {
                    //Comma separated indices if multiple moves have the same heuristic value
                    const moves = nodesMap.has(nodeValue)
                        ? `${nodesMap.get(nodeValue)},${possibleMove}`
                        : possibleMove;
                    nodesMap.set(nodeValue, moves);
                };
                count++;
            });
            //If it's the main call, return the index of the best move or a random index if multiple indices have the same value
            if (depth == 0) {
                let returnValue;
                if (typeof nodesMap.get(best_value) == "string") {
                    const arr = nodesMap.get(best_value).split(",");
                    const rand = Math.floor(Math.random() * arr.length);
                    returnValue = arr[rand];
                } else {
                    returnValue = nodesMap.get(best_value);
                };
                //return the index
                return returnValue;
            };
            // If it's not the main call, return best_value for recursive calculation
            return best_value;
        };
    };

    function _saveAiChoice(aiChoice) {
        // save ai choice in gameboard
        gameboard[aiChoice] = '#';

        // update possible moves after ai choice
        possibleMoves.splice(possibleMoves.indexOf(Number(aiChoice)), 1);

        // insert ai choice in win patterns for later check
        let winPatternCount = 0;
        winPatterns.forEach (pattern => {
            let indexCount = 0;
            pattern.forEach (index => {
                if (index == Number(aiChoice)) {
                    winPatterns[winPatternCount][indexCount] = '#';
                };
                indexCount++;
            });
            winPatternCount++;
        });
    };

    function _checkForResult () {
        let winner = '';
        winPatterns.forEach (pattern => {
            if (pattern.every( (val, i, arr) => val === arr[0] )) {
                winner = turn;
            };
        });
    
        if (!gameboard.includes(null)) {
            _displayResult(winner);
            finished = true;
        } else if (winner !== '') {
            _displayResult(winner);
            finished = true;
        } else {
            _changeTurn();
        };
    };

    function _displayResult (result) {
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
        btnReset.addEventListener('click', _rematch);
    };

    function _addClickEventToReturnButton (btnReturn) {
        btnReturn.addEventListener('click', _returnToStartScreen);
    }

    function _rematch () {
        _delete();
        startNewGame([player1, player2]);
    };

    function _returnToStartScreen () {
        _delete();
        Organizer.createStartScreen();
    };

    function _delete () {
        while (main.firstChild) {
            main.removeChild(main.lastChild);
        };
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

    return {
        startNewGame
    };
})();

// Organizer module
const Organizer = (function() {
    // create module scoped variables
    let masterUserForm = '';

    // cache some document elements
    const main = document.querySelector('.main');
    const userForm = document.querySelector('.playerNames');
    const aiUserForm = document.querySelector('.playerName');

    // setup event listeners for userForms to input the player names
    (function () {
        _setupEventListenersUserForm (userForm);
        _setupEventListenersUserForm (aiUserForm);
    })();

    // create the start screen to choose the game mode
    function createStartScreen() {
        masterUserForm = '';
        
        let container = document.createElement('div');
        container.classList = 'container';
        let gameModePlayer = document.createElement('div');
        gameModePlayer.classList = 'contMode1v1';
        let gameModeComputer = document.createElement('div');
        gameModeComputer.classList = 'contModeComputer';

        let labelPlayer = document.createElement('div');
        labelPlayer.classList = 'label';
        labelPlayer.textContent = '1 vs. 1';
        let btnPlayer = document.createElement('button');
        btnPlayer.classList = 'btn btnPlayer';
        btnPlayer.innerText = 'New Game';

        let labelComputer = document.createElement('div');
        labelComputer.classList = 'label';
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
        btnPlayer.addEventListener('click', _getPlayerNames);
        btnComputer.addEventListener('click', _getPlayerNames);
    };

    function _getPlayerNames (e) {
        _selectUserForm(e);
        _showHideUserForm();
    };
    
    function _selectUserForm (e) {
        if ((e.target.className).includes('Computer')) {
            masterUserForm = aiUserForm;
        } else {
            masterUserForm = userForm;
        };
    };

    // show or hide Input Form that asks for Player names with one button to start the game
    function _showHideUserForm () {
        const overlay = document.querySelector('#overlay');
        masterUserForm.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    function _setupEventListenersUserForm (modal) {
        _addSubmitEvent(modal);
        _addOnSubmitHandler(modal);
    };

    function _addSubmitEvent (modal) {
        modal.addEventListener('submit', (e) => {
            e.preventDefault();
            new FormData(modal);
        });
    };

    //save Player names and hide input form
    function _addOnSubmitHandler (modal) {
        modal.addEventListener('formdata', (e) => {
            let data = e.formData;
            let names = [];
            for (let value of data.values()) {
                names.push(value);
            };
            modal.reset();
            _showHideUserForm();
            _deleteStartScreen();
            Gameboard.startNewGame(names);
        });
    };

    function _deleteStartScreen () {
        while (main.firstChild) {
            main.removeChild(main.lastChild);
        };
    };
        
    return {
        createStartScreen
    };
})();
    
// IIFE
(function() {
    Organizer.createStartScreen();
})();