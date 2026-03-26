
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

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

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


        if (!checkGameWinner()) {
            switchPlayerTurn();
            //printNewRound();
        }
    }

    const checkGameWinner = () => {

        const currentBoard = board.getBoard();
        const token = getActivePlayer().token;

        // 1. Verificar Linhas
        const rowWin = currentBoard.some(row =>
            row.every(cell => cell.getValue() === token)
        );

        // 2. Verificar Colunas
        const colWin = [0, 1, 2].some(colIndex =>
            currentBoard.every(row => row[colIndex].getValue() === token)
        );

        // 3. Verificar Diagonais
        const diagWin =
            (currentBoard[0][0].getValue() === token &&
                currentBoard[1][1].getValue() === token &&
                currentBoard[2][2].getValue() === token) ||
            (currentBoard[0][2].getValue() === token &&
                currentBoard[1][1].getValue() === token &&
                currentBoard[2][0].getValue() === token);

        if (rowWin || colWin || diagWin) {
            //board.printBoard();
            console.log(`${getActivePlayer().name} won the game!`);
            gameOver = true;
            return true;
        }

        // Verificar Empate (Velha)
        if (roundsPlayed === 9) {
            //board.printBoard();
            console.log("The game is a tie!");
            tie = true;
            gameOver = true;
            return true;
        }

        return false;
    }

    return {
        playRound,
        getActivePlayer,
        getPlayersNames,
        getBoard: board.getBoard,
        switchPlayerTurn
    };
}

function useScreenController() {

    // Adicionar aqui depois um formulário que pega os nomes dos dois jogadores

    if (gameOver) {
        return;
    }

    const game = useGameController();
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
        playerOne.textContent = game.getPlayersNames().PlayerOneName + ': ';

        const playerTwo = document.createElement('h3');
        playerTwo.setAttribute('id', 'player-two');
        playerTwo.textContent = game.getPlayersNames().PlayerTwoName + ': ';

        rightSideMenuDiv.append(scoreboardTitle, playerOne, playerTwo);

        scoreboardCreated = true;
    }

    if (!scoreboardCreated) {
        createScoreBoard();
    }

    const updateScreen = () => {
        const activePlayer = game.getActivePlayer();

        if (gameOver) {
            playerTurn.textContent = tie ? "It's a tie!" : `${activePlayer.name} wins!`;

            if (!tie) {
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
        }

        // Limpa o tabuleiro
        gameBoardDiv.textContent = '';

        // Pega a versão mais atualizada dele e a vez do próximo jogador
        const board = game.getBoard();

        if (!gameOver) {
            playerTurn.textContent = `${activePlayer.name}'s turn...`;
        }

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
        if(game.getActivePlayer().player === 2){
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
        newRoundButton.setAttribute('id', 'new-round-button');
        newRoundButton.textContent = 'New Round';
        newRoundButton.addEventListener('click', resetBoard);

        leftSideMenuDiv.append(newRoundButton);
        newRoundButtonAdded = true;
    }

    // Renderização Inicial
    updateScreen();
}


let gameOver = false;
let scoreboardCreated = false;
let tie = false;
let newRoundButtonAdded = false;
let playerOneScore = 0;
let playerTwoScore = 0;
let roundsPlayed = 0;


const startGameButton = document.getElementById('start-game-button');
startGameButton.addEventListener('click', useScreenController);


