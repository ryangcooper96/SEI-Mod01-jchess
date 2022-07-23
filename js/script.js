// function to run once DOM content is loaded
function init() {
  const chess = {
    selected: undefined,
    pieces: {
      wP: "♟",
      wN: 2,
      wB: 3,
      wR: 4,
      wQ: 5,
      wK: 6,
      bP: 7,
      bN: 8,
      bB: 9,
      bR: 10,
      bQ: 11,
      bK: 12,
    },
    board: [
      [["bR"], ["bN"], ["bB"], ["bK"], ["bQ"], ["bB"], ["bN"], ["bR"]],
      [["bP"], ["bP"], ["bP"], ["bP"], ["bP"], ["bP"], ["bP"], ["bP"]],
      [[], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], []],
      [["wP"], ["wP"], ["wP"], ["wP"], ["wP"], ["wP"], ["wP"], ["wP"]],
      [["wR"], ["wN"], ["wB"], ["wQ"], ["wK"], ["wB"], ["wN"], ["wR"]],
    ],
  };

  // create board
  const board = document.getElementById("board-squares");
  function createBoardSquares() {
    // loop for 8 rows
    for (let i = 0; i < 8; i++) {
      // loop for 8 columns
      for (let j = 0; j < 8; j++) {
        // create board square element
        const square = document.createElement("div");
        square.classList.add("square");
        // if row is even...
        if (i % 2) {
          // if column is even...
          if (j % 2) {
            square.classList.add("white");
            // if column is odd...
          } else {
            square.classList.add("black");
          }
          // if row is odd...
        } else {
          // if column is even...
          if (j % 2) {
            square.classList.add("black");
            // if column is odd...
          } else {
            square.classList.add("white");
          }
        }
        // add column and row dataset attributes with respective index values
        square.setAttribute("data-row", i);
        square.setAttribute("data-column", j);
        // add event listener
        square.addEventListener("click", function selectSquare(e) {
          console.log(
            `ROW: ${e.target.dataset.row}, COL: ${e.target.dataset.column}`
          );
          console.log("");
          // check if square has already been selected.
          // a square has already been selected.
          // a square has NOT been selected.
        });

        // add square to board
        board.appendChild(square);
      }
    }
  }

  //
  function addPieces() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        document.querySelector(
          `[data-row='${i}'][data-column='${j}']`
        ).textContent = chess.board[i][j];
      }
    }
  }

  //

  //
  function checkSelection() {}

  //
  function calculateFeasibleMoves() {}

  //

  createBoardSquares();
  addPieces();
}

window.addEventListener("DOMContentLoaded", init);
