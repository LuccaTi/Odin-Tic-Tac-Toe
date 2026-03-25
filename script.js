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
        console.table(boardWithCellValues); 1
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
            token: 'X'
        },
        {
            name: playerTwoName,
            token: 'O'
        }
    ]

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    let roundsPlayed = 0;

    const printNewRound = () => {
        board.printBoard();
        roundsPlayed++;
        if (roundsPlayed <= 9) {
            console.log(`${getActivePlayer().name}'s turn.`); 0
        }
    }

    printNewRound();

    const playRound = (row, column) => {
        console.log(`${getActivePlayer().name}'s token: ${getActivePlayer().token}, row: ${row}, column: ${column}`);
        board.writeToken(row, column, getActivePlayer().token);


        if (!checkGameWinner()) {
            switchPlayerTurn();
            printNewRound();
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
            board.printBoard();
            console.log(`${getActivePlayer().name} won the game!`);
            gameOver = true;
            return true;
        }

        // Verificar Empate (Velha)
        if (roundsPlayed === 9) {
            board.printBoard();
            console.log("The game is a tie!");
            gameOver = true;
            return true;
        }

        return false;
    }

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}

const game = useGameController();
let gameOver = false;

// Apenas para testar
for (let i = 0; i <= 8; i++) {
    let row = parseInt(prompt("input the row (0 to 2):"));
    while (row > 2 || row < 0) {
        row = parseInt(prompt("incorrect row input, it needs to be from 0 to 2:"));
    }
    let column = parseInt(prompt("input the column (0 to 2):"));
    while (column > 2 || column < 0) {
        column = parseInt(prompt("incorrect column input, it needs to be from 0 to 2:"));
    }

    while (game.getBoard()[row][column].getValue() !== '') {
        row = parseInt(prompt("incorrect row input, spot already taken, input another row from 0 to 2:"));
        column = parseInt(prompt("incorrect column input, spot already taken, input another column from 0 to 2:"));
    }

    game.playRound(row, column);


    if (gameOver) {
        break;
    }
}


