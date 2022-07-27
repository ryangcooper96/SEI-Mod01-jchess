// function to run once DOM content is loaded
function init() {
  const Chess = {
    colour: "b",
    firstSelection: undefined,
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
    playerPieces: [],
    oppositionPieces: [],
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
        square.setAttribute("data-col", j);
        // square.setAttribute("data-col", "empty");
        // add event listener
        square.addEventListener("click", (e) => selectionHandler(e));

        // add square to board
        board.appendChild(square);
      }
    }
  }

  /* SELECTION HANDLER */
  function selectionHandler(e) {
    // check if firstSelection square is the location of one of this player's pieces
    if (!Chess.firstSelection) {
      firstSelection(e.target);
    } else {
      // if firstSelection square is "highlighted" - is a viable move (has class of highlight)...
      secondSelection(Chess.firstSelection, e.target);
      // remove highlight class if it exists (clean up!)
      document.querySelectorAll(".square").forEach((square) => {
        if (square.classList.contains("highlight")) {
          square.classList.remove("highlight");
        }
      });
    }
  }

  /* FIRST SELECTION */
  function firstSelection(finish) {
    Chess.playerPieces.forEach((piece) => {
      if (piece.row === parseInt(finish.dataset.row)) {
        if (piece.col === parseInt(finish.dataset.col)) {
          // add the firstSelection square DOM element to the firstSelection key value
          Chess.firstSelection = document.querySelector(
            `[data-row='${piece.row}'][data-col='${piece.col}']`
          );
          // highlight the firstSelection square
          Chess.firstSelection.classList.add("highlight");
          // highlight the squares of all feasible moves for that piece
          piece.moves.forEach((square) => {
            if (
              document
                .querySelector(
                  `[data-row='${square.row}'][data-col='${square.col}']`
                )
                .hasAttribute("data-piece")
            ) {
              document
                .querySelector(
                  `[data-row='${square.row}'][data-col='${square.col}']`
                )
                .parentElement.classList.add("highlight");
            } else {
              document
                .querySelector(
                  `[data-row='${square.row}'][data-col='${square.col}']`
                )
                .classList.add("highlight");
            }
          });
        }
      }
    });
  }

  /* SECOND SELECTION */
  function secondSelection(start, finish) {
    console.log("secondSelection");
    // due to bubbling, if a square containing a piece is selected then e.target will equate to the piece.
    if (finish.parentElement.classList.contains("highlight")) {
      if (!finish.dataset.piece.includes(Chess.colour)) {
        movePiece(start, finish.parentElement);
        addCapturedPiece(finish);
        setupNextTurn();
      } else {
        Chess.firstSelection = undefined;
      }
    }
    // if an empty square is selected.
    else if (finish.classList.contains("highlight")) {
      movePiece(start, finish);
      setupNextTurn();
    } else {
      // remove the firstSelection key value...
      Chess.firstSelection = undefined;
    }
  }

  /* MOVE PIECE */
  function movePiece(start, finish) {
    console.log(start);
    console.log(finish);
    // add new position of piece to board array
    Chess.board[finish.dataset.row][finish.dataset.col] =
      start.firstChild.dataset.piece;

    // remove old position of piece from board array
    Chess.board[start.dataset.row][start.dataset.col] = "";

    // add piece img-html to new position...
    finish.innerHTML = `<img width="40px" height="60px" data-row="${finish.dataset.row}" data-col="${finish.dataset.col}" data-piece="${start.firstChild.dataset.piece}" src="./Chess-pieces/${start.firstChild.dataset.piece}.png">`;

    // remove piece img-html from old position...
    start.innerHTML = "";

    console.log(Chess.board);
  }

  /* SET-UP NEXT TURN */
  function setupNextTurn() {
    // toggle player
    togglePlayer();
    // remove the firstSelection key value...
    Chess.firstSelection = undefined;
    // remove the piece locations key value...
    Chess.playerPieces = [];
    filterPlayersPieces();
    viableMoves();
    highlightActivePlayer();
  }

  /* TOGGLE PLAYER */
  function togglePlayer() {
    if (Chess.colour === "w") {
      Chess.colour = "b";
    } else if (Chess.colour === "b") {
      Chess.colour = "w";
    }
  }

  /* HIGHLIGHT ACTIVE PLAYER */
  function highlightActivePlayer() {
    if (Chess.colour === "w") {
      document.getElementById("player1").classList.add("active");
      document.getElementById("player2").classList.remove("active");
    } else if (Chess.colour === "b") {
      document.getElementById("player1").classList.remove("active");
      document.getElementById("player2").classList.add("active");
    }
  }

  /* ADD CAPTURED PIECE */
  function addCapturedPiece(finish) {
    if (Chess.colour === "w") {
      document.getElementById(
        "player1-captured"
      ).innerHTML += `<img width="30px" height="45px" src="./Chess-pieces/${finish.dataset.piece}.png">`;
    } else if (Chess.colour === "b") {
      document.getElementById(
        "player2-captured"
      ).innerHTML += `<img width="30px" height="45px" src="./Chess-pieces/${finish.dataset.piece}.png">`;
    }
  }

  /* ADD PIECES */
  function addPieces() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (Chess.board[i][j]) {
          document.querySelector(
            `[data-row='${i}'][data-col='${j}']`
          ).innerHTML = `<img width="40px" height="60px" data-row="${i}" data-col="${j}" data-piece="${Chess.board[i][j]}" src="./Chess-pieces/${Chess.board[i][j]}.png">`;
        }
      }
    }
  }

  /* FILTER PLAYER PIECES */
  function filterPlayersPieces() {
    // loop over rows
    for (let i = 0; i < 8; i++) {
      // loop over columns
      for (let j = 0; j < 8; j++) {
        // if piece is the correct colour...
        if (Chess.board[i][j].includes(Chess.colour)) {
          Chess.playerPieces.push({
            row: i,
            col: j,
            piece: Chess.board[i][j],
            moves: [],
          });
        }
      }
    }
  }

  /* VIABLE MOVES */
  function viableMoves() {
    Chess.playerPieces.forEach((element) => {
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
    console.log(Chess.playerPieces);
  }

  /* PAWN */
  function pawn(element) {
    // determine direction by colour
    if (Chess.colour === "w") {
      // move forward two rows
      if (element.row - 2 === 4) {
        if (
          Chess.board[element.row - 1][element.col] === "" &&
          Chess.board[element.row - 2][element.col] === ""
        ) {
          element.moves.push({
            row: element.row - 2,
            col: element.col,
          });
        }
      }
      // move forward one row
      if (element.row - 1 > -1) {
        // if square {row: -1, col: 0} is empty
        if (Chess.board[element.row - 1][element.col] === "") {
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
          !Chess.board[element.row - 1][element.col - 1].includes(
            Chess.colour
          ) &&
          !(Chess.board[element.row - 1][element.col - 1] === "")
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
          !Chess.board[element.row - 1][element.col + 1].includes(
            Chess.colour
          ) &&
          !(Chess.board[element.row - 1][element.col + 1] === "")
        ) {
          element.moves.push({
            row: element.row - 1,
            col: element.col + 1,
          });
        }
      }
    } else {
      // move forward two rows
      if (element.row + 2 === 3) {
        if (
          Chess.board[element.row + 1][element.col] === "" &&
          Chess.board[element.row + 2][element.col] === ""
        ) {
          element.moves.push({
            row: element.row + 2,
            col: element.col,
          });
        }
      }
      // move forward one row
      if (element.row + 1 < 8) {
        // if square {row: -1, col: 0} is empty
        if (Chess.board[element.row + 1][element.col] === "") {
          element.moves.push({
            row: element.row + 1,
            col: element.col,
          });
        }
      }
      // move forward diagonally left
      if (element.row + 1 < 8 && element.col - 1 > -1) {
        // if square {row: -1, col: -1} is occupied - opposition piece
        if (
          !Chess.board[element.row + 1][element.col - 1].includes(
            Chess.colour
          ) &&
          !(Chess.board[element.row + 1][element.col - 1] === "")
        ) {
          element.moves.push({
            row: element.row + 1,
            col: element.col - 1,
          });
        }
      }
      // move forward diagonally right
      if (element.row + 1 < 8 && element.col + 1 < 8) {
        // if square {row: -1, col: 1} is occupied - opposition piece
        if (
          !Chess.board[element.row + 1][element.col + 1].includes(
            Chess.colour
          ) &&
          !(Chess.board[element.row + 1][element.col + 1] === "")
        ) {
          element.moves.push({
            row: element.row + 1,
            col: element.col + 1,
          });
        }
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
      if (
        element.row + move.row < 8 &&
        element.row + move.row > -1 &&
        element.col + move.col < 8 &&
        element.col + move.col > -1
      ) {
        // if square is empty
        if (
          Chess.board[element.row + move.row][element.col + move.col] === ""
        ) {
          element.moves.push({
            row: element.row + move.row,
            col: element.col + move.col,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row + move.row][element.col + move.col].includes(
            Chess.colour
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
        if (Chess.board[element.row + i][element.col + i] === "") {
          element.moves.push({
            row: element.row + i,
            col: element.col + i,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row + i][element.col + i].includes(Chess.colour)
        ) {
          element.moves.push({
            row: element.row + i,
            col: element.col + i,
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
        if (Chess.board[element.row + i][element.col - i] === "") {
          element.moves.push({
            row: element.row + i,
            col: element.col - i,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row + i][element.col - i].includes(Chess.colour)
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
        if (Chess.board[element.row - j][element.col + j] === "") {
          element.moves.push({
            row: element.row - j,
            col: element.col + j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row - j][element.col + j].includes(Chess.colour)
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
        if (Chess.board[element.row - j][element.col - j] === "") {
          element.moves.push({
            row: element.row - j,
            col: element.col - j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row - j][element.col - j].includes(Chess.colour)
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
        if (Chess.board[element.row + i][element.col] === "") {
          element.moves.push({
            row: element.row + i,
            col: element.col,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row + i][element.col].includes(Chess.colour)
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
    // negative direction
    for (let i = -1; i > -8; i--) {
      //   console.log("Negative Row");
      //   console.log(`r: ${element.row + i}, c: ${element.col}`);
      // if square is on board
      if (element.row + i > -1) {
        // if square is empty
        if (Chess.board[element.row + i][element.col] === "") {
          element.moves.push({
            row: element.row + i,
            col: element.col,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row + i][element.col].includes(Chess.colour)
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
        if (Chess.board[element.row][element.col + j] === "") {
          element.moves.push({
            row: element.row,
            col: element.col + j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row][element.col + j].includes(Chess.colour)
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
        if (Chess.board[element.row][element.col + j] === "") {
          element.moves.push({
            row: element.row,
            col: element.col + j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row][element.col + j].includes(Chess.colour)
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
        if (Chess.board[element.row + i][element.col] === "") {
          element.moves.push({
            row: element.row + i,
            col: element.col,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row + i][element.col].includes(Chess.colour)
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
    // negative direction
    for (let i = -1; i > -8; i--) {
      //   console.log("Negative Row");
      //   console.log(`r: ${element.row + i}, c: ${element.col}`);
      // if square is on board
      if (element.row + i > -1) {
        // if square is empty
        if (Chess.board[element.row + i][element.col] === "") {
          element.moves.push({
            row: element.row + i,
            col: element.col,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row + i][element.col].includes(Chess.colour)
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
        if (Chess.board[element.row][element.col + j] === "") {
          element.moves.push({
            row: element.row,
            col: element.col + j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row][element.col + j].includes(Chess.colour)
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
        if (Chess.board[element.row][element.col + j] === "") {
          element.moves.push({
            row: element.row,
            col: element.col + j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row][element.col + j].includes(Chess.colour)
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
        if (Chess.board[element.row + i][element.col + i] === "") {
          element.moves.push({
            row: element.row + i,
            col: element.col + i,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row + i][element.col + i].includes(Chess.colour)
        ) {
          element.moves.push({
            row: element.row + i,
            col: element.col + i,
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
        if (Chess.board[element.row + i][element.col - i] === "") {
          element.moves.push({
            row: element.row + i,
            col: element.col - i,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row + i][element.col - i].includes(Chess.colour)
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
        if (Chess.board[element.row - j][element.col + j] === "") {
          element.moves.push({
            row: element.row - j,
            col: element.col + j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row - j][element.col + j].includes(Chess.colour)
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
        if (Chess.board[element.row - j][element.col - j] === "") {
          element.moves.push({
            row: element.row - j,
            col: element.col - j,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row - j][element.col - j].includes(Chess.colour)
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
          !Chess.board[element.row + move.row][element.col + move.col] === ""
        ) {
          element.moves.push({
            row: element.row + move.row,
            col: element.col + move.col,
          });
        }
        // if square is occupied - opposition piece
        else if (
          !Chess.board[element.row + move.row][element.col + move.col].includes(
            Chess.colour
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
  setupNextTurn();
}

window.addEventListener("DOMContentLoaded", init);
