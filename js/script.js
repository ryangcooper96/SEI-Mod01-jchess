// function to run once DOM content is loaded
function init() {
  const chess = {
    colour: "w",
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
      ["", "", "", "", "", "", "bP", ""],
      ["", "", "", "", "wP", "wP", "wP", "wP"],
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
        square.addEventListener("click", (e) => selectSquareHandler(e));

        // add square to board
        board.appendChild(square);
      }
    }
  }

  /* SELECT SQUARE EVENT HANDLER FUNCTION */
  function selectSquareHandler(e) {
    console.log(
      `ROW: ${e.target.dataset.row}, COL: ${e.target.dataset.column}, PIECE: ${e.target.dataset.piece}`
    );
    // if selected square is "highlighted" - is a viable move (has class of highlight)...
    if (e.target.classList.contains("highlight")) {
      // if selected square contains a player's piece...
      if (e.target.dataset.piece.includes(chess.colour)) {
        console.log("piece here");
      }
      // if selected square is empty or contains an opposition piece...
      else {
        console.log("Move player's piece!");
        // add piece img-html to new position...
        e.target.innerHTML = chess.selected.innerHTML;

        // add new position of piece to board array
        chess.board[e.target.dataset.row][e.target.dataset.column] =
          chess.selected.dataset.piece;

        // remove old position of piece from board array
        chess.board[chess.selected.dataset.row][chess.selected.dataset.column] =
          "";

        // remove piece img-html from old position...
        chess.selected.innerHTML = "";

        // remove the selected key value...
        chess.selected = undefined;
      }
    }

    // remove highlight class if it exists (clean up!)
    document.querySelectorAll(".square").forEach((square) => {
      if (square.classList.contains("highlight")) {
        square.classList.remove("highlight");
      }
    });

    // check if selected square is the location of one of this player's pieces
    chess.pieceLocations.forEach((piece) => {
      if (piece.row === parseInt(e.target.dataset.row)) {
        if (piece.col === parseInt(e.target.dataset.column)) {
          // highlight the selected square
          chess.selected = document.querySelector(
            `[data-row='${piece.row}'][data-column='${piece.col}']`
          );
          chess.selected.classList.add("highlight");
          // highlight all the squares of feasible moves for that piece
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
  }

  // add chess-piece images
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

  function filterByColour() {
    // loop over rows
    for (let i = 0; i < 8; i++) {
      // loop over columns
      for (let j = 0; j < 8; j++) {
        // if piece is the correct colour...
        if (chess.board[i][j].includes(chess.colour)) {
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

  /* VIABLE MOVES */
  function viableMoves() {
    chess.pieceLocations.forEach((element) => {
      if (element.piece.includes("P")) {
        pawn(element);
      } else if (element.piece.includes("R")) {
        rook(element);
      } else if (element.piece.includes("N")) {
        knight(element);
      } else if (element.piece.includes("B")) {
        bishop(element);
      } else if (element.piece.includes("Q")) {
        queen(element);
      } else if (element.piece.includes("K")) {
        king(element);
      }
    });
    console.log(chess.pieceLocations);
  }

  /* PAWN */
  function pawn(element) {
    // move forward one row
    if (element.row - 1 > -1) {
      // if square {row: -1, col: 0} is empty
      if (chess.board[element.row - 1][element.col] === "") {
        element.moves.push({
          row: element.row - 1,
          col: element.col,
        });
      }
    }
    // move forward diagonally left
    if (element.row - 1 > -1 && element.col - 1 > -1) {
      // if square {row: -1, col: -1} is occupied - opposition piece
      if (
        !chess.board[element.row - 1][element.col - 1].includes(chess.colour) &&
        !(chess.board[element.row - 1][element.col - 1] === "")
      ) {
        element.moves.push({
          row: element.row - 1,
          col: element.col - 1,
        });
      }
    }
    // move forward diagonally right
    if (element.row - 1 > -1 && element.col + 1 < 8) {
      // if square {row: -1, col: 1} is occupied - opposition piece
      if (
        !chess.board[element.row - 1][element.col + 1].includes(chess.colour) &&
        !(chess.board[element.row - 1][element.col + 1] === "")
      ) {
        element.moves.push({
          row: element.row - 1,
          col: element.col + 1,
        });
      }
    }
  }

  /* KNIGHT */
  function knight(element) {
    const knightMoves = [
      { row: 1, col: 2 },
      { row: -1, col: 2 },
      { row: 1, col: -2 },
      { row: -1, col: -2 },
      { row: 2, col: 1 },
      { row: -2, col: 1 },
      { row: 2, col: -1 },
      { row: -2, col: -1 },
    ].forEach((move) => {
      console.log("move made.");
      if (
        element.row + move.row < 8 &&
        element.row + move.row > -1 &&
        element.col + move.col < 8 &&
        element.col + move.col > -1
      ) {
        // if square is empty
        if (
          chess.board[element.row + move.row][element.col + move.col] === ""
        ) {
          element.moves.push({
            row: element.row + move.row,
            col: element.col + move.col,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row + move.row][element.col + move.col].includes(
            chess.colour
          )
        ) {
          element.moves.push({
            row: element.row + move.row,
            col: element.col + move.col,
          });
        }
        // if square is occupied - player's piece
        else {
        }
      }
    });
  }

  /* BISHOP */
  function bishop(element) {
    // loop for rows + columns
    // positive row direction - positive column direction
    for (let i = 1; i < 8; i++) {
      // if square is on board
      if (element.row + i < 8 && element.col + i < 8) {
        // if square is empty
        if (chess.board[element.row + i][element.col + i] === "") {
          element.moves.push({
            row: element.row + i,
            col: element.col + j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row + i][element.col + i].includes(chess.colour)
        ) {
          element.moves.push({
            row: element.row + i,
            col: element.col + j,
          });
          break;
        }
        // if square is occupied - player's piece
        else {
          break;
        }
      }
    }
    // positive row direction - negative column direction
    for (let i = 1; i < 8; i++) {
      // if square is on board
      if (element.row + i < 8 && element.col - i > -1) {
        // if square is empty
        if (chess.board[element.row + i][element.col - i] === "") {
          element.moves.push({
            row: element.row + i,
            col: element.col - i,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row + i][element.col - i].includes(chess.colour)
        ) {
          element.moves.push({
            row: element.row + i,
            col: element.col - i,
          });
          break;
        }
        // if square is occupied - player's piece
        else {
          break;
        }
      }
    }
    // negative row direction - positive column direction
    for (let j = 1; j < 8; j++) {
      // if square is on board
      if (element.row - j > -1 && element.col + j < 8) {
        // if square is empty
        if (chess.board[element.row - j][element.col + j] === "") {
          element.moves.push({
            row: element.row - j,
            col: element.col + j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row - j][element.col + j].includes(chess.colour)
        ) {
          element.moves.push({
            row: element.row - j,
            col: element.col + j,
          });
          break;
        }
        // if square is occupied - player's piece
        else {
          break;
        }
      }
    }
    // negative row direction - negative column direction
    for (let j = 1; j < 8; j++) {
      // if square is on board
      if (element.row - j > -1 && element.col - j > -1) {
        // if square is empty
        if (chess.board[element.row - j][element.col - j] === "") {
          element.moves.push({
            row: element.row - j,
            col: element.col - j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row - j][element.col - j].includes(chess.colour)
        ) {
          element.moves.push({
            row: element.row - j,
            col: element.col - j,
          });
          break;
        }
        // if square is occupied - player's piece
        else {
          break;
        }
      }
    }
  }

  /* ROOK */
  function rook(element) {
    // loop for rows
    // positive direction
    for (let i = 1; i < 8; i++) {
      // if square is on board
      if (element.row + i < 8) {
        // if square is empty
        if (chess.board[element.row + i][element.col] === "") {
          element.moves.push({
            row: element.row + i,
            col: element.col,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row + i][element.col].includes(chess.colour)
        ) {
          element.moves.push({
            row: element.row + i,
            col: element.col + j,
          });
          break;
        }
        // if square is occupied - player's piece
        else {
          break;
        }
      }
    }
    // negative direction
    for (let i = -1; i > -8; i--) {
      //   console.log("Negative Row");
      //   console.log(`r: ${element.row + i}, c: ${element.col}`);
      // if square is on board
      if (element.row + i > -1) {
        // if square is empty
        if (chess.board[element.row + i][element.col] === "") {
          element.moves.push({
            row: element.row + i,
            col: element.col,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row + i][element.col].includes(chess.colour)
        ) {
          element.moves.push({
            row: element.row + i,
            col: element.col,
          });
          break;
        }
        // if square is occupied - player's piece
        else {
          break;
        }
      }
    }
    // loop for columns...
    // positive direction
    for (let j = 1; j < 8; j++) {
      // if square is on board
      if (element.col + j < 8) {
        // if square is empty
        if (chess.board[element.row][element.col + j] === "") {
          element.moves.push({
            row: element.row,
            col: element.col + j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row][element.col + j].includes(chess.colour)
        ) {
          element.moves.push({
            row: element.row,
            col: element.col + j,
          });
          break;
        }
        // if square is occupied - player's piece
        else {
          break;
        }
      }
    }
    // negative direction
    for (let j = -1; j > -8; j--) {
      // if square is on board
      if (element.col + j > -1) {
        // if square is empty
        if (chess.board[element.row][element.col + j] === "") {
          element.moves.push({
            row: element.row,
            col: element.col + j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row][element.col + j].includes(chess.colour)
        ) {
          element.moves.push({
            row: element.row,
            col: element.col + j,
          });
          break;
        }
        // if square is occupied - player's piece
        else {
          break;
        }
      }
    }
  }

  /* QUEEN */
  function queen(element) {
    // loop for rows
    // positive direction
    for (let i = 1; i < 8; i++) {
      // if square is on board
      if (element.row + i < 8) {
        // if square is empty
        if (chess.board[element.row + i][element.col] === "") {
          element.moves.push({
            row: element.row + i,
            col: element.col,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row + i][element.col].includes(chess.colour)
        ) {
          element.moves.push({
            row: element.row + i,
            col: element.col + j,
          });
          break;
        }
        // if square is occupied - player's piece
        else {
          break;
        }
      }
    }
    // negative direction
    for (let i = -1; i > -8; i--) {
      //   console.log("Negative Row");
      //   console.log(`r: ${element.row + i}, c: ${element.col}`);
      // if square is on board
      if (element.row + i > -1) {
        // if square is empty
        if (chess.board[element.row + i][element.col] === "") {
          element.moves.push({
            row: element.row + i,
            col: element.col,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row + i][element.col].includes(chess.colour)
        ) {
          element.moves.push({
            row: element.row + i,
            col: element.col,
          });
          break;
        }
        // if square is occupied - player's piece
        else {
          break;
        }
      }
    }
    // loop for columns...
    // positive direction
    for (let j = 1; j < 8; j++) {
      // if square is on board
      if (element.col + j < 8) {
        // if square is empty
        if (chess.board[element.row][element.col + j] === "") {
          element.moves.push({
            row: element.row,
            col: element.col + j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row][element.col + j].includes(chess.colour)
        ) {
          element.moves.push({
            row: element.row,
            col: element.col + j,
          });
          break;
        }
        // if square is occupied - player's piece
        else {
          break;
        }
      }
    }
    // negative direction
    for (let j = -1; j > -8; j--) {
      // if square is on board
      if (element.col + j > -1) {
        // if square is empty
        if (chess.board[element.row][element.col + j] === "") {
          element.moves.push({
            row: element.row,
            col: element.col + j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row][element.col + j].includes(chess.colour)
        ) {
          element.moves.push({
            row: element.row,
            col: element.col + j,
          });
          break;
        }
        // if square is occupied - player's piece
        else {
          break;
        }
      }
    }
    // loop for rows + columns
    // positive row direction - positive column direction
    for (let i = 1; i < 8; i++) {
      // if square is on board
      if (element.row + i < 8 && element.col + i < 8) {
        // if square is empty
        if (chess.board[element.row + i][element.col + i] === "") {
          element.moves.push({
            row: element.row + i,
            col: element.col + j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row + i][element.col + i].includes(chess.colour)
        ) {
          element.moves.push({
            row: element.row + i,
            col: element.col + j,
          });
          break;
        }
        // if square is occupied - player's piece
        else {
          break;
        }
      }
    }
    // positive row direction - negative column direction
    for (let i = 1; i < 8; i++) {
      // if square is on board
      if (element.row + i < 8 && element.col - i > -1) {
        // if square is empty
        if (chess.board[element.row + i][element.col - i] === "") {
          element.moves.push({
            row: element.row + i,
            col: element.col - i,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row + i][element.col - i].includes(chess.colour)
        ) {
          element.moves.push({
            row: element.row + i,
            col: element.col - i,
          });
          break;
        }
        // if square is occupied - player's piece
        else {
          break;
        }
      }
    }
    // negative row direction - positive column direction
    for (let j = 1; j < 8; j++) {
      // if square is on board
      if (element.row - j > -1 && element.col + j < 8) {
        // if square is empty
        if (chess.board[element.row - j][element.col + j] === "") {
          element.moves.push({
            row: element.row - j,
            col: element.col + j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row - j][element.col + j].includes(chess.colour)
        ) {
          element.moves.push({
            row: element.row - j,
            col: element.col + j,
          });
          break;
        }
        // if square is occupied - player's piece
        else {
          break;
        }
      }
    }
    // negative row direction - negative column direction
    for (let j = 1; j < 8; j++) {
      // if square is on board
      if (element.row - j > -1 && element.col - j > -1) {
        // if square is empty
        if (chess.board[element.row - j][element.col - j] === "") {
          element.moves.push({
            row: element.row - j,
            col: element.col - j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row - j][element.col - j].includes(chess.colour)
        ) {
          element.moves.push({
            row: element.row - j,
            col: element.col - j,
          });
          break;
        }
        // if square is occupied - player's piece
        else {
          break;
        }
      }
    }
  }

  /* KING */
  function king(element) {
    const kingMoves = [
      { row: -1, col: 0 },
      { row: -1, col: 1 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: -1 },
      { row: 0, col: -1 },
      { row: -1, col: -1 },
    ].forEach((move) => {
      if (
        element.row + move.row < 8 &&
        element.row + move.row > -1 &&
        element.col + move.col < 8 &&
        element.col + move.col > -1
      ) {
        // if square is empty
        if (
          !chess.board[element.row + move.row][element.col + move.col] === ""
        ) {
          element.moves.push({
            row: element.row + move.row,
            col: element.col + move.col,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !chess.board[element.row + move.row][element.col + move.col].includes(
            chess.colour
          )
        ) {
          element.moves.push({
            row: element.row + move.row,
            col: element.col + move.col,
          });
        }
        // if square is occupied - player's piece
        else {
        }
      }
    });
  }

  /* FILTER CHECK */
  function filterForCheck() {}

  createBoardSquares();
  addPieces();
  filterByColour();
  viableMoves();
}

window.addEventListener("DOMContentLoaded", init);
