
function createGameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(createCell());
        }
    }

    const getBoard = () => board;

    const writeToken = (row, column, playerToken) => {
        if (board[row][column].getValue() !== '') {
            return
        } else {
            board[row][column].addToken(playerToken);
        }
    };

    const printBoard = () => {
        // Mapeia cada linha do tabuleiro para não mostrar os valores como objetos.
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.table(boardWithCellValues);
    };

    return { getBoard, writeToken, printBoard };

}

function createCell() {
    let value = '';

    const addToken = (playerToken) => {
        value = playerToken;
    }

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

function useGameController(
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) {
    const board = createGameboard();

    const players = [
        {
            name: playerOneName,
            token: 'X',
            player: 1
        },
        {
            name: playerTwoName,
            token: 'O',
            player: 2
        }
    ]

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;

    let winPositions = null;
    const getWinPositions = () => winPositions;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getPlayersNames = () => ({
        PlayerOneName: playerOneName,
        PlayerTwoName: playerTwoName
    });

    const printNewRound = () => {
        board.printBoard();
        roundsPlayed++;
        if (roundsPlayed <= 9) {
            console.log(`${getActivePlayer().name}'s turn.`);
        }
    }

    //printNewRound();

    const playRound = (row, column, playerToken) => {
        console.log(`${getActivePlayer().name}'s token: ${getActivePlayer().token}, row: ${row}, column: ${column}`);
        if (board.getBoard()[row][column].getValue() !== '') {
            console.log('Spot already taken, please choose another!')
            return;
        } else {
            board.writeToken(row, column, playerToken);
            roundsPlayed++;
        }

        winPositions = checkGameWinner();
        if (winPositions.row.length === 0 &&
            winPositions.col === -1 &&
            winPositions.diag.length === 0
        ) {
            switchPlayerTurn();
            //printNewRound();
        }
    }

    const checkGameWinner = () => {

        const currentBoard = board.getBoard();
        const token = getActivePlayer().token;

        const winPositions = {
            row: [],
            col: -1,
            diag: []
        };

        // 1. Verificar Linhas
        const winningRowIndex = currentBoard.findIndex(row =>
            row.every(cell => cell.getValue() === token)
        );

        if (winningRowIndex > -1) {
            winPositions.row = [
                [winningRowIndex, 0],
                [winningRowIndex, 1],
                [winningRowIndex, 2]
            ];
        }

        // 2. Verificar Colunas
        const winningColIndex = [0, 1, 2].findIndex(colIndex =>
            currentBoard.every(row => row[colIndex].getValue() === token)
        );

        if (winningColIndex > -1) {
            winPositions.col = winningColIndex;
        }

        // 3. Verificar Diagonais
        const diagWin = () => {
            if (currentBoard[0][0].getValue() === token &&
                currentBoard[1][1].getValue() === token &&
                currentBoard[2][2].getValue() === token) return 1;

            if (currentBoard[0][2].getValue() === token &&
                currentBoard[1][1].getValue() === token &&
                currentBoard[2][0].getValue() === token) return 2;

            return 0;
        };

        if (diagWin() === 1) {
            winPositions.diag = [
                [0, 0],
                [1, 1],
                [2, 2]
            ]
        }

        if (diagWin() === 2) {
            winPositions.diag = [
                [0, 2],
                [1, 1],
                [2, 0]
            ]
        }

        if (winPositions.row.length > 0 || winPositions.col > -1 || winPositions.diag.length > 0) {
            //board.printBoard();
            console.log(`${getActivePlayer().name} won the game!`);
            roundsPlayed = 0;
            tie = false;
            gameOver = true;
        }

        // Verificar Empate (Velha)
        if (roundsPlayed === 9) {
            //board.printBoard();
            console.log("The game is a tie!");
            tie = true;
            gameOver = true;
        }

        return winPositions;
    }

    return {
        playRound,
        getActivePlayer,
        getWinPositions,
        getPlayersNames,
        getBoard: board.getBoard,
        switchPlayerTurn
    };
}

function useScreenController(
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) {

    if (gameOver) {
        return;
    }

    if (newRoundButtonAdded) {
        // A responsabilidade de resetar o jogo foi passada, não há necessidade de executar esse método novamente.
        return;
    }


    const game = useGameController(playerOneName, playerTwoName);
    const contentMainDiv = document.querySelector('.content-main');
    contentMainDiv.textContent = '';

    let welcomeTitle = document.createElement('h2');
    welcomeTitle.textContent = 'Welcome to Tic Tac Toe!';

    let playerTurn = document.createElement('h3');

    let gameBoardDiv = document.createElement('div');
    gameBoardDiv.classList.add('game-board');

    contentMainDiv.append(welcomeTitle, playerTurn, gameBoardDiv);

    const createScoreBoard = () => {
        const rightSideMenuDiv = document.querySelector('.content-sidebar-advertisement');

        const scoreboardTitle = document.createElement('h2');
        scoreboardTitle.textContent = 'Current Score:';

        const playerOne = document.createElement('h3');
        playerOne.setAttribute('id', 'player-one');
        playerOne.textContent = game.getPlayersNames().PlayerOneName + ': 0';

        const playerTwo = document.createElement('h3');
        playerTwo.setAttribute('id', 'player-two');
        playerTwo.textContent = game.getPlayersNames().PlayerTwoName + ': 0';

        rightSideMenuDiv.append(scoreboardTitle, playerOne, playerTwo);

        scoreboardCreated = true;
    }

    if (!scoreboardCreated) {
        createScoreBoard();
    }

    function drawWinningLine(winPositions) {
        if (winPositions.row.length === 0 &&
            winPositions.col === -1 &&
            winPositions.diag.length === 0) return;

        const line = document.createElement('div');
        line.classList.add('winning-line');

        if (winPositions.row.length > 0) {
            const rowIndex = winPositions.row[0][0];
            line.classList.add(`row-${rowIndex}`);
        } else if (winPositions.col > -1) {
            const colIndex = winPositions.col;
            line.classList.add(`col-${colIndex}`);
        } else if (winPositions.diag.length > 0) {
            const isDiagOne = winPositions.diag[0][0] === 0 && winPositions.diag[0][1] === 0;
            const diagIndex = isDiagOne ? 0 : 1;
            line.classList.add(`diag-${diagIndex}`);
        }

        gameBoardDiv.appendChild(line);
    }

    const updateScreen = () => {
        const activePlayer = game.getActivePlayer();

        // Limpa o tabuleiro
        gameBoardDiv.textContent = '';

        // Pega a versão mais atualizada dele e a vez do próximo jogador
        const board = game.getBoard();

        // Renderiza o tabuleiro
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');

                cellButton.dataset.column = colIndex;
                cellButton.dataset.row = rowIndex;

                cellButton.textContent = cell.getValue();
                gameBoardDiv.appendChild(cellButton);
            })
        })

        if (gameOver) {
            playerTurn.textContent = tie ? "It's a tie!" : `${activePlayer.name} wins!`;

            if (!tie) {

                drawWinningLine(game.getWinPositions());

                if (activePlayer.player === 1) {
                    playerOneScore++;
                    const playerOneScoreboard = document.getElementById('player-one');
                    playerOneScoreboard.textContent = activePlayer.name + `: ${playerOneScore}`;
                }

                if (activePlayer.player === 2) {
                    playerTwoScore++;
                    const playerTwoScoreboard = document.getElementById('player-two');
                    playerTwoScoreboard.textContent = activePlayer.name + `: ${playerTwoScore}`;
                }
            }
        } else {
            playerTurn.textContent = `${activePlayer.name}'s turn...`;
        }
    }

    function clickHandlerBoard(e) {
        const selectedColumn = Number(e.target.dataset.column);
        const selectedRow = Number(e.target.dataset.row);

        if (Number.isNaN(selectedColumn) || Number.isNaN(selectedRow)) return;

        if (!gameOver) {
            game.playRound(selectedRow, selectedColumn, game.getActivePlayer().token);
            updateScreen();
        }

    }
    gameBoardDiv.addEventListener('click', clickHandlerBoard);

    const resetBoard = () => {
        if (game.getActivePlayer().player === 2) {
            game.switchPlayerTurn();
        }

        gameOver = false;

        // Limpa o tabuleiro
        gameBoardDiv.textContent = '';

        // Pega a versão mais atualizada dele e a vez do próximo jogador
        const board = game.getBoard();

        // Falta resetar a board para deixar com células vazias
        board.forEach((row) => {
            row.forEach((cell) => {
                cell.addToken('');
            })
        })

        roundsPlayed = 0;
        tie = false;

        // Renderiza o tabuleiro
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');

                cellButton.dataset.column = colIndex;
                cellButton.dataset.row = rowIndex;

                cellButton.textContent = cell.getValue();
                gameBoardDiv.appendChild(cellButton);
            })
        })

        playerTurn.textContent = `${game.getPlayersNames().PlayerOneName}'s turn...`;
    }

    if (!newRoundButtonAdded) {
        const leftSideMenuDiv = document.querySelector('.content-sidebar-menu');

        let newRoundButton = document.createElement('button');
        newRoundButton.setAttribute('type', 'button');
        newRoundButton.classList.add('game-button');
        newRoundButton.textContent = 'New Round';
        newRoundButton.addEventListener('click', resetBoard);

        let resetButton = document.createElement('button');
        resetButton.setAttribute('type', 'button');
        resetButton.classList.add('game-button');
        resetButton.textContent = 'Reset Game';
        resetButton.addEventListener('click', () => {
            window.location.reload();
        });

        leftSideMenuDiv.append(newRoundButton, resetButton);
        newRoundButtonAdded = true;

    }

    // Renderização Inicial
    updateScreen();
}

function createPlayersForm() {
    const menuContainer = document.querySelector('.content-sidebar-menu');
    const backupMenu = menuContainer.cloneNode(true);
    menuContainer.textContent = '';

    let createPlayerForm = document.createElement('form');
    createPlayerForm.setAttribute('id', 'create-players-form')

    let formTitle = document.createElement('h4');
    formTitle.textContent = 'Please input the name of the players:'

    let p1FormField = document.createElement('div');
    let p1NameInput = document.createElement('input');
    p1NameInput.setAttribute('type', 'text');
    p1NameInput.setAttribute('name', 'p1-name');
    p1NameInput.setAttribute('id', 'p1-name');
    p1NameInput.setAttribute('minlength', '3');
    p1NameInput.setAttribute('maxlength', '15');
    p1NameInput.required = true;

    let p1Label = document.createElement('label');
    p1Label.htmlFor = 'p1-name';
    p1Label.innerHTML = 'Player One:'

    p1FormField.append(p1Label, p1NameInput);
    p1FormField.classList.add('form-field');

    let p2FormField = document.createElement('div');
    let p2NameInput = document.createElement('input');
    p2NameInput.setAttribute('type', 'text');
    p2NameInput.setAttribute('name', 'p2-name');
    p2NameInput.setAttribute('id', 'p2-name');
    p2NameInput.setAttribute('minlength', '3');
    p2NameInput.setAttribute('maxlength', '15');
    p2NameInput.required = true;

    let p2Label = document.createElement('label');
    p2Label.htmlFor = 'p2-name';
    p2Label.innerHTML = 'Player Two:'

    p2FormField.append(p2Label, p2NameInput);
    p2FormField.classList.add('form-field');

    let beginButton = document.createElement('button');
    beginButton.setAttribute('type', 'submit');
    beginButton.classList.add('game-button');
    beginButton.textContent = 'Begin';

    let cancelButton = document.createElement('button');
    cancelButton.setAttribute('type', 'button');
    cancelButton.classList.add('game-button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
        menuContainer.replaceWith(backupMenu);
        const startGameButton = document.getElementById('start-game-button');
        startGameButton.addEventListener('click', createPlayersForm);
    });

    createPlayerForm.append(formTitle, p1FormField, p2FormField, beginButton, cancelButton);
    menuContainer.append(createPlayerForm);

    createPlayerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        menuContainer.textContent = '';
        useScreenController(p1NameInput.value, p2NameInput.value);
    })
}


let gameOver = false;
let scoreboardCreated = false;
let tie = false;
let newRoundButtonAdded = false;
let playerOneScore = 0;
let playerTwoScore = 0;
let roundsPlayed = 0;

const startGameButton = document.getElementById('start-game-button');
startGameButton.addEventListener('click', createPlayersForm);


