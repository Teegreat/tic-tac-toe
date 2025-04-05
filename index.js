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
  let gameStarted = false;

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
      gameStarted = true;
      Gameboard.resetBoard();
    },
    playTurn: (row, col) => {
      if (!gameStarted || gameOver) return { status: "invalid" };

      const currentPlayer = players[currentPlayerIndex];

      if (Gameboard.placeMark(row, col, currentPlayer.getMark())) {
        const winner = checkWin();
        if (winner) {
          gameOver = true;
          return { status: "win", player: currentPlayer.getName() };
        } else if (checkTie()) {
          gameOver = true;
          return { status: "tie" };
        } else {
          currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
          return { status: "continue" };
        }
      } else {
        return { status: "invalid" };
      }
    },
    getCurrentPlayer: () => players[currentPlayerIndex],
    getPlayers: () => players,
    getCurrentPlayerIndex: () => currentPlayerIndex,
    isGameOver: () => gameOver,
    isGameStarted: () => gameStarted,
    checkWin,
    checkTie,
  };
})();

// 4. Console-based game first
// Game.startGame("Alice", "Bob");
// console.log(Game.playTurn(0, 0));
// console.log(Game.playTurn(1, 1));
// console.log(Game.playTurn(0, 1));
// console.log(Game.playTurn(2, 2));
// console.log(Game.playTurn(0, 2));

// Display Controller  (IIFE)
const DisplayController = (function () {
  const boardDiv = document.getElementById("gameboard");
  const resultDiv = document.getElementById("result");

  const renderBoard = () => {
    boardDiv.innerHTML = "";
    const board = Gameboard.getBoard();
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.textContent = cell || "";
        cellDiv.addEventListener("click", () => {
          if (!Game.isGameStarted()) {
            resultDiv.textContent = "Please start the game first";
            return;
          }
          if (!Game.isGameOver()) {
            const result = Game.playTurn(rowIndex, colIndex);
            renderBoard();
            if (result.status === "win") {
              resultDiv.textContent = `${result.player} wins!`;
            } else if (result.status === "tie") {
              resultDiv.textContent = "It's a tie!";
            }
          }
        });
        boardDiv.appendChild(cellDiv);
      });
    });
  };

  return {
    init: () => {
      const validatePlayers = () => {
        const player1Name = document.getElementById("player1").value.trim();
        const player2Name = document.getElementById("player2").value.trim();
        if (!player1Name || !player2Name) {
          resultDiv.textContent = "Please enter both players names";
          return false;
        }
        return true;
      };
      document.getElementById("start-game").addEventListener("click", () => {
        if (!validatePlayers()) return;
        const player1 = document.getElementById("player1").value;
        const player2 = document.getElementById("player2").value;
        Game.startGame(player1, player2);
        renderBoard();
        resultDiv.textContent = "";
      });

      document.getElementById("reset-game").addEventListener("click", () => {
        if (!validatePlayers()) return;
        Gameboard.resetBoard();
        Game.startGame(
          document.getElementById("player1").value,
          document.getElementById("player2").value
        );
        renderBoard();
        resultDiv.textContent = "";
      });

      renderBoard();
    },
  };
})();

DisplayController.init();
