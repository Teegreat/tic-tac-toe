// 1. Gameboard object (array inside)
// 2. Player objects (factory)
// 3. Game flow object (IIFE)
// 4. Console-based game first

// 1. Gameboard object (array inside)
const Gameboard = (function () {
  // 3x3 array
  let board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  // public methods
  return {
    getBoard: () => board,
    placeMark: (row, col, mark) => {
      if (row >= 0 && row < 3 && col >= 0 && col < 3 && !board[row][col]) {
        board[row][col] = mark;
        return true;
      }
      return false;
    },
    resetBoard: () => {
      board = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ];
    },
  };
})();

// 2. Player objects (factory)
const Player = (name, mark) => {
  return {
    getName: () => name,
    getMark: () => mark,
  };
};

// 3. Game flow object (IIFE) - Game controller
const Game = (function () {
  let players = [];
  let currentPlayerIndex = 0;
  let gameOver = false;

  const winningCombos = [
    // rows
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    // cols
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    // diags
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  const checkWin = () => {
    const board = Gameboard.getBoard();
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (
        board[a[0]][a[1]] &&
        board[a[0]][a[1]] === board[b[0]][b[1]] &&
        board[a[0]][a[1]] === board[c[0]][c[1]]
      ) {
        return board[a[0]][a[1]]; //winner
      }
    }
    return null; // no winner
  };

  const checkTie = () => {
    const board = Gameboard.getBoard();
    return (
      board.every((row) => row.every((cell) => cell !== null)) && !checkWin()
    );
  };

  return {
    startGame: (player1Name, player2Name) => {
      players = [Player(player1Name, "X"), Player(player2Name, "O")];
      currentPlayerIndex = 0;
      gameOver = false;
      Gameboard.resetBoard();
      console.log(
        `Welcome to Tic Tac Toe! ${players[0].getName()} will play as X, and ${players[1].getName()} will play as O.`
      );
    },
    playTurn: (row, col) => {
      if (gameOver) {
        console.log("Game over! Please start a new game");
        return;
      }

      const currentPlayer = players[currentPlayerIndex];

      if (Gameboard.placeMark(row, col, currentPlayer.getMark())) {
        currentPlayer.getMark();
        console.log(
          `${currentPlayer.getName()} placed ${currentPlayer.getMark()} at (${row}, ${col})`
        );
        console.log(Gameboard.getBoard());

        const winner = checkWin();

        if (winner) {
          console.log(`${currentPlayer.getName()} wins!`);
          gameOver = true;
        } else if (checkTie()) {
          console.log("It's a tie!");
          gameOver = true;
        } else {
          currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
          console.log(`Next turn: ${players[currentPlayerIndex].getName()}`);
        }
      } else {
        console.log("Invalid move! Try again.");
      }
    },
  };
})();

// 4. Console-based game first
Game.startGame("Alice", "Bob");
console.log(Game.playTurn(0, 0));
console.log(Game.playTurn(1, 1));
console.log(Game.playTurn(0, 1));
console.log(Game.playTurn(2, 2));
console.log(Game.playTurn(0, 2));
