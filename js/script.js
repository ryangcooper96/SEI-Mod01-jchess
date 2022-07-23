// function to run once DOM content is loaded
function init() {
  const chess = {
    turn: "w",
    selected: undefined,
    pieces: {
      wP: { feasibleMoves: [{ row: 0, col: 1 }] },
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
      ["bR", "bN", "bB", "bK", "bQ", "bB", "bN", "bR"],
      ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
      ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
    ],
    pieceLocations: [],
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
        // square.setAttribute("data-column", "empty");
        // add event listener
        square.addEventListener("click", function selectSquare(e) {
          console.log(
            `ROW: ${e.target.dataset.row}, COL: ${e.target.dataset.column}, PIECE: ${e.target.dataset.piece}`
          );
          chess.pieceLocations.forEach((piece) => {
            if (piece.row === parseInt(e.target.dataset.row)) {
              console.log("Yep that's the row!");
              if (piece.col === parseInt(e.target.dataset.column)) {
                console.log("Yep that's the column!");
                document
                  .querySelector(
                    `[data-row='${piece.row}'][data-column='${piece.col}']`
                  )
                  .classList.add("highlight");
                piece.moves.forEach((square) => {
                  document
                    .querySelector(
                      `[data-row='${square.row}'][data-column='${square.col}']`
                    )
                    .classList.add("highlight");
                });
              }
            }
          });

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
        if (chess.board[i][j]) {
          document.querySelector(
            `[data-row='${i}'][data-column='${j}']`
          ).innerHTML = `<img width="60px" height="60px" data-row="${i}" data-column="${j}" data-piece="${chess.board[i][j]}" src="./chess-pieces/${chess.board[i][j]}.png">`;
        }
      }
    }
  }

  function checkColour() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        console.log(chess.board[i][j]);
        if (chess.board[i][j].includes(chess.turn)) {
          chess.pieceLocations.push({
            row: i,
            col: j,
            piece: chess.board[i][j],
            moves: [],
          });
        }
      }
    }
    console.log(chess.pieceLocations);
  }

  function checkMoves() {
    chess.pieceLocations.forEach((element) => {
      if (element.piece.includes("P")) {
        element.moves.push({ row: element.row - 1, col: element.col });
        console.log(element);
      }
    });
  }

  //

  //
  function checkSelection() {}

  //
  function calculateFeasibleMoves() {}

  //

  createBoardSquares();
  addPieces();
  checkColour();
  checkMoves();
}

window.addEventListener("DOMContentLoaded", init);
