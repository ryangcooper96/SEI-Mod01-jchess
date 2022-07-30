// function to run once DOM content is loaded
function init() {
  class Player {
    constructor(player, name, colour) {
      this.player = player;
      this.name = name;
      this.colour = colour;
      this.pieces = [];
    }
  }

  let board = [
    ["bR", "bN", "bB", "bK", "bQ", "bB", "bN", "bR"],
    ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
    ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
  ];

  class Chess {
    constructor(player1, player2) {
      this.activePlayer = player2;
      this.inactivePlayer = player1;
      this.firstSelectionValue = undefined;
      this.board = [
        ["bR", "bN", "bB", "bK", "bQ", "bB", "bN", "bR"],
        ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
        ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
      ];
      this.proposedBoard = undefined;
      this.boardHTML = document.getElementById("board-squares");
    }
    createUI() {
      // loop for 8 ranks
      for (let rank = 0; rank < 8; rank++) {
        // loop for 8 columns
        for (let file = 0; file < 8; file++) {
          // create board square element
          const square = document.createElement("div");
          square.classList.add("square");
          // if rank is even...
          if (rank % 2) {
            // if column is even...
            if (file % 2) {
              square.classList.add("white");
              // if column is odd...
            } else {
              square.classList.add("black");
            }
            // if rank is odd...
          } else {
            // if column is even...
            if (file % 2) {
              square.classList.add("black");
              // if column is odd...
            } else {
              square.classList.add("white");
            }
          }
          // add column and rank dataset attributes with respective index values
          square.setAttribute("data-rank", rank);
          square.setAttribute("data-file", file);
          // add event listener
          square.addEventListener("click", (e) => this.selectionHandler(e));
          // add piece
          if (this.board[rank][file]) {
            square.innerHTML = `<img width="40px" height="60px" data-rank="${rank}" data-file="${file}" data-piece="${this.board[rank][file]}" src="./Chess-pieces/${this.board[rank][file]}.png">`;
          }
          // add square to board
          this.boardHTML.appendChild(square);
        }
      }
    }
    selectionHandler(e) {
      console.log("selectionHandler();");
      if (!this.firstSelectionValue) {
        this.firstSelection(e.target);
      } else {
        // if firstSelection square is "highlighted" - is a viable move (has class of highlight)...
        this.secondSelection(this.firstSelectionValue, e.target);
        // remove highlight class if it exists (clean up!)
        document.querySelectorAll(".square").forEach((square) => {
          if (square.classList.contains("highlight")) {
            square.classList.remove("highlight");
          }
        });
      }
    }
    firstSelection(finish) {
      this.activePlayer.pieces.forEach((piece) => {
        if (piece.rank === parseInt(finish.dataset.rank)) {
          if (piece.file === parseInt(finish.dataset.file)) {
            // add the firstSelection square DOM element to the firstSelection key value
            this.firstSelectionValue = document.querySelector(
              `[data-rank='${piece.rank}'][data-file='${piece.file}']`
            );
            // highlight the firstSelection square
            this.firstSelectionValue.classList.add("highlight");
            // highlight the squares of all feasible moves for that piece
            piece.moves.forEach((square) => {
              if (
                document
                  .querySelector(
                    `[data-rank='${square.rank}'][data-file='${square.file}']`
                  )
                  .hasAttribute("data-piece")
              ) {
                document
                  .querySelector(
                    `[data-rank='${square.rank}'][data-file='${square.file}']`
                  )
                  .parentElement.classList.add("highlight");
              } else {
                document
                  .querySelector(
                    `[data-rank='${square.rank}'][data-file='${square.file}']`
                  )
                  .classList.add("highlight");
              }
            });
          }
        }
      });
    }
    secondSelection(start, finish) {
      // due to bubbling, if a square containing a piece is selected then e.target will equate to the piece.
      if (finish.parentElement.classList.contains("highlight")) {
        if (!finish.dataset.piece.includes(this.activePlayer.colour)) {
          this.movePiece(start, finish.parentElement);
          this.addCapturedPiece(finish);
          this.setupNextTurn();
        } else {
          this.firstSelectionValue = undefined;
        }
      }
      // if an empty square is selected.
      else if (finish.classList.contains("highlight")) {
        this.movePiece(start, finish);
        this.setupNextTurn();
      } else {
        this.firstSelectionValue = undefined;
      }
    }
    movePiece(start, finish) {
      // add new position of piece to board array
      this.board[finish.dataset.rank][finish.dataset.file] =
        start.firstChild.dataset.piece;

      // remove old position of piece from board array
      this.board[start.dataset.rank][start.dataset.file] = "";

      // add piece img-html to new position...
      finish.innerHTML = `<img width="40px" height="60px" data-rank="${finish.dataset.rank}" data-file="${finish.dataset.file}" data-piece="${start.firstChild.dataset.piece}" src="./Chess-pieces/${start.firstChild.dataset.piece}.png">`;

      // remove piece img-html from old position...
      start.innerHTML = "";
    }
    addCapturedPiece(finish) {
      if (this.activePlayer.colour === "w") {
        document.getElementById(
          "player1-captured"
        ).innerHTML += `<img width="30px" height="45px" src="./Chess-pieces/${finish.dataset.piece}.png">`;
      } else if (this.activePlayer.colour === "b") {
        document.getElementById(
          "player2-captured"
        ).innerHTML += `<img width="30px" height="45px" src="./Chess-pieces/${finish.dataset.piece}.png">`;
      }
    }
    setupNextTurn() {
      // toggle player
      this.togglePlayer();
      // remove the firstSelection key value...
      this.firstSelectionValue = undefined;
      // remove the piece locations key value...
      this.activePlayer.pieces = [];
      this.inactivePlayer.pieces = [];
      this.findPieces(this.activePlayer, this.board);
      this.activePlayer.pieces.forEach((piece) =>
        this.choosePieceFunction(piece)
      );
      this.activePlayer.pieces.forEach((piece) => {
        piece.moves.forEach((move) => {
          this.inactivePlayer.pieces = [];
          this.findPieces(this.inactivePlayer, move.board);
          this.inactivePlayer.pieces.forEach((move) =>
            this.choosePieceFunction(move)
          );
        });
      });
      this.highlightActivePlayer();
    }
    // rewritten function - needs updating elsewhere
    togglePlayer() {
      let middleMan = this.activePlayer;
      this.activePlayer = this.inactivePlayer;
      this.inactivePlayer = middleMan;
      console.log(this.activePlayer);
      console.log(this.inactivePlayer);
    }
    // refactor with forEach & filter
    findPieces(player, board) {
      player.pieces = [];
      // loop over ranks
      for (let rank = 0; rank < 8; rank++) {
        // loop over columns
        for (let file = 0; file < 8; file++) {
          // if piece is the correct activePlayer.colour...
          if (board[rank][file].includes(player.colour)) {
            player.pieces.push({
              rank: rank,
              file: file,
              piece: board[rank][file],
              moves: [],
            });
          }
        }
      }
      console.log(player.pieces);
      //   console.log(this.inactivePlayer.colour);
    }
    choosePieceFunction(piece) {
      if (piece.piece.includes("P")) {
        this.pawn(piece);
      } else if (piece.piece.includes("R")) {
        this.rook(piece);
      } else if (piece.piece.includes("N")) {
        this.knight(piece);
      } else if (piece.piece.includes("B")) {
        this.bishop(piece);
      } else if (piece.piece.includes("Q")) {
        this.queen(piece);
      } else if (piece.piece.includes("K")) {
        this.king(piece);
      }
    }
    // this could be refactored - access dom with w & b
    highlightActivePlayer() {
      if (this.activePlayer.colour === "w") {
        document.getElementById("player1").classList.add("active");
        document.getElementById("player2").classList.remove("active");
      } else if (this.activePlayer.colour === "b") {
        document.getElementById("player1").classList.remove("active");
        document.getElementById("player2").classList.add("active");
      }
    }
    pawn(element) {
      if (element.piece.includes("w")) {
        if (element.rank - 2 === 4) {
          if (
            this.isEmpty(this.boardLocation(element, -1, 0)) &&
            this.isEmpty(this.boardLocation(element, -2, 0))
          ) {
            this.pushMove(element, -2, 0);
          }
        }
        if (this.boundaryTop(element, -1)) {
          if (this.isEmpty(this.boardLocation(element, -1, 0))) {
            this.pushMove(element, -1, 0);
          }
        }
        if (this.boundaryTop(element, -1) && this.boundaryLeft(element, -1)) {
          if (
            this.isPiece(
              this.boardLocation(element, -1, -1),
              this.inactivePlayer.colour
            )
          ) {
            this.pushMove(element, -1, -1);
          }
        }
        if (this.boundaryTop(element, -1) && this.boundaryRight(element, 1)) {
          if (
            this.isPiece(
              this.boardLocation(element, -1, +1),
              this.inactivePlayer.colour
            )
          ) {
            this.pushMove(element, -1, +1);
          }
        }
      } else if (element.piece.includes("b")) {
        if (element.rank + 2 === 3) {
          if (
            this.isEmpty(this.boardLocation(element, +1, 0)) &&
            this.isEmpty(this.boardLocation(element, +2, 0))
          ) {
            this.pushMove(element, +2, 0);
          }
        }
        if (this.boundaryBottom(element, 1)) {
          if (this.isEmpty(this.boardLocation(element, +1, 0))) {
            this.pushMove(element, +1, 0);
          }
        }
        if (this.boundaryBottom(element, 1) && this.boundaryLeft(element, -1)) {
          if (
            this.isPiece(
              this.boardLocation(element, +1, -1),
              this.inactivePlayer.colour
            )
          ) {
            this.pushMove(element, +1, -1);
          }
        }
        if (this.boundaryBottom(element, 1) && this.boundaryRight(element, 1)) {
          if (
            this.isPiece(
              this.boardLocation(element, +1, +1),
              this.inactivePlayer.colour
            )
          ) {
            this.pushMove(element, +1, +1);
          }
        }
      }
    }
    rook(element) {
      // loop for ranks + columns
      // positive rank direction
      //   console.log(this.inactivePlayer.colour);
      for (let i = 1; i < 8; i++) {
        if (this.boundaryBottom(element, i)) {
          if (this.isEmpty(this.boardLocation(element, i, 0))) {
            this.pushMove(element, i, 0);
          } else if (
            this.isPiece(
              this.boardLocation(element, i, 0),
              this.inactivePlayer.colour
            )
          ) {
            if (
              !this.isKing(
                this.boardLocation(element, i, 0),
                this.inactivePlayer.colour
              )
            ) {
              this.pushMove(element, i, 0);
            }
            break;
          } else {
            break;
          }
        }
      }
      // negative rank direction
      for (let i = 1; i < 8; i++) {
        // console.log(`Row: ${element.rank - i}, Col: ${element.file + 0}`);
        if (this.boundaryTop(element, -i)) {
          if (this.isEmpty(this.boardLocation(element, -i, 0))) {
            this.pushMove(element, -i, 0);
          } else if (
            this.isPiece(
              this.boardLocation(element, -i, 0),
              this.inactivePlayer.colour
            )
          ) {
            if (
              !this.isKing(
                this.boardLocation(element, -i, 0),
                this.inactivePlayer.colour
              )
            ) {
              this.pushMove(element, -i, 0);
            }
            break;
          } else {
            break;
          }
        }
      }
      // positive file direction
      for (let i = 1; i < 8; i++) {
        if (this.boundaryRight(element, i)) {
          if (this.isEmpty(this.boardLocation(element, 0, i))) {
            this.pushMove(element, 0, i);
          } else if (
            this.isPiece(
              this.boardLocation(element, 0, i),
              this.inactivePlayer.colour
            )
          ) {
            if (
              !this.isKing(
                this.boardLocation(element, 0, i),
                this.inactivePlayer.colour
              )
            ) {
              this.pushMove(element, 0, i);
            }
            break;
          } else {
            break;
          }
        }
      }
      // negative file direction
      for (let i = 1; i < 8; i++) {
        if (this.boundaryLeft(element, -i)) {
          if (this.isEmpty(this.boardLocation(element, 0, -i))) {
            this.pushMove(element, 0, -i);
          } else if (
            this.isPiece(
              this.boardLocation(element, 0, -i),
              this.inactivePlayer.colour
            )
          ) {
            if (
              !this.isKing(
                this.boardLocation(element, 0, -i),
                this.inactivePlayer.colour
              )
            ) {
              this.pushMove(element, 0, -i);
            }
            break;
          } else {
            break;
          }
        }
      }
    }
    knight(element) {
      const knightMoves = [
        { rank: 1, file: 2 },
        { rank: -1, file: 2 },
        { rank: 1, file: -2 },
        { rank: -1, file: -2 },
        { rank: 2, file: 1 },
        { rank: -2, file: 1 },
        { rank: 2, file: -1 },
        { rank: -2, file: -1 },
      ].forEach((move) => {
        // CHECK IF PIECE REMAINS ON BOARD AFTER MOVE
        if (
          this.boundaryLeft(element, move.file) &&
          this.boundaryTop(element, move.rank) &&
          this.boundaryRight(element, move.file) &&
          this.boundaryBottom(element, move.rank)
        ) {
          // CHECK IF THE PIECE MOVES TO AN EMPTY SQUARE
          if (this.isEmpty(this.boardLocation(element, move.rank, move.file))) {
            this.pushMove(element, move.rank, move.file);
            // CHECK IF THE PIECE MOVES TO SQUARE OF INACTIVE PLAYER PIECE.
          } else if (
            this.isPiece(
              this.boardLocation(element, move.rank, move.file),
              this.inactivePlayer.colour
            )
          ) {
            if (
              !this.isKing(
                this.boardLocation(element, move.rank, move.file),
                this.inactivePlayer.colour
              )
            ) {
              this.pushMove(element, move.rank, move.file);
            }
          } else {
          }
        }
      });
    }
    bishop(element) {
      // loop for ranks + columns
      // positive rank direction - positive column direction
      for (let i = 1; i < 8; i++) {
        if (this.boundaryBottom(element, i) && this.boundaryRight(element, i)) {
          if (this.isEmpty(this.boardLocation(element, i, i))) {
            this.pushMove(element, i, i);
          } else if (
            this.isPiece(
              this.boardLocation(element, i, i),
              this.inactivePlayer.colour
            )
          ) {
            if (
              !this.isKing(
                this.boardLocation(element, i, i),
                this.inactivePlayer.colour
              )
            ) {
            }
            this.pushMove(element, i, i);
            break;
          } else {
            break;
          }
        }
      }
      // positive rank direction - negative column direction
      for (let i = 1; i < 8; i++) {
        if (this.boundaryBottom(element, i) && this.boundaryLeft(element, -i)) {
          if (this.isEmpty(this.boardLocation(element, i, -i))) {
            this.pushMove(element, i, -i);
          } else if (
            this.isPiece(
              this.boardLocation(element, i, -i),
              this.inactivePlayer.colour
            )
          ) {
            if (
              !this.isKing(
                this.boardLocation(element, i, -i),
                this.inactivePlayer.colour
              )
            ) {
              this.pushMove(element, i, -i);
            }
            break;
          } else {
            break;
          }
        }
      }
      // negative rank direction - positive column direction
      for (let i = 1; i < 8; i++) {
        if (this.boundaryTop(element, -i) && this.boundaryRight(element, i)) {
          if (this.isEmpty(this.boardLocation(element, -i, i))) {
            this.pushMove(element, -i, i);
          } else if (
            this.isPiece(
              this.boardLocation(element, -i, i),
              this.inactivePlayer.colour
            )
          ) {
            if (
              !this.isKing(
                this.boardLocation(element, -i, i),
                this.inactivePlayer.colour
              )
            ) {
              this.pushMove(element, -i, i);
            }
            break;
          } else {
            break;
          }
        }
      }
      // negative rank direction - negative column direction
      for (let i = 1; i < 8; i++) {
        if (this.boundaryTop(element, -i) && this.boundaryLeft(element, -i)) {
          if (this.isEmpty(this.boardLocation(element, -i, -i))) {
            this.pushMove(element, -i, -i);
          } else if (
            this.isPiece(
              this.boardLocation(element, -i, -i),
              this.inactivePlayer.colour
            )
          ) {
            if (
              !this.isKing(
                this.boardLocation(element, -i, -i),
                this.inactivePlayer.colour
              )
            ) {
              this.pushMove(element, -i, -i);
            }
            break;
          } else {
            break;
          }
        }
      }
    }
    queen(element) {
      this.rook(element);
      this.bishop(element);
    }
    king(element) {
      const kingMoves = [
        { rank: -1, file: 0 },
        { rank: -1, file: 1 },
        { rank: 0, file: 1 },
        { rank: 1, file: 1 },
        { rank: 1, file: 0 },
        { rank: 1, file: -1 },
        { rank: 0, file: -1 },
        { rank: -1, file: -1 },
      ].forEach((move) => {
        if (
          this.boundaryTop(element, move.rank) &&
          this.boundaryRight(element, move.file) &&
          this.boundaryBottom(element, move.rank) &&
          this.boundaryLeft(element, move.file)
        ) {
          if (this.isEmpty(this.boardLocation(element, move.rank, move.file))) {
            this.pushMove(element, move.rank, move.file);
          } else if (
            this.isPiece(
              this.boardLocation(element, move.rank, move.file),
              this.inactivePlayer.colour
            )
          ) {
            if (
              !this.isKing(
                this.boardLocation(element, move.rank, move.file),
                this.inactivePlayer.colour
              )
            ) {
              this.pushMove(element, move.rank, move.file);
            }
          } else {
          }
        }
      });
    }
    inCheck(move) {
      // this.inactivePlayer.pieces;
      // isKing();
    }
    isKing(boardLocation, colour) {
      return boardLocation.includes(`${colour}K`);
    }
    isPiece(boardLocation, colour) {
      return boardLocation.includes(`${colour}`);
    }
    isEmpty(boardLocation) {
      return boardLocation === "";
    }
    boardLocation(element, i, j) {
      return this.board[element.rank + i][element.file + j];
    }
    pushMove(element, i, j, check = false) {
      const tempBoard = [...this.board].map((file) => [...file]);
      tempBoard[element.rank + i][element.file + j] =
        this.board[element.rank][element.file];
      tempBoard[element.rank][element.file] = "";
      //
      element.moves.push({
        rank: element.rank + i,
        file: element.file + j,
        board: tempBoard,
        check: check,
        moves: [],
      });
    }
    boundaryLeft(element, move) {
      return element.file + move > -1;
    }
    boundaryRight(element, move) {
      return element.file + move < 8;
    }
    boundaryTop(element, move) {
      return element.rank + move > -1;
    }
    boundaryBottom(element, move) {
      return element.rank + move < 8;
    }
  }

  const Player1 = new Player(1, "Ryan", "w");
  const Player2 = new Player(2, "Burt", "b");

  const Game = new Chess(Player1, Player2);
  Game.createUI();
  Game.setupNextTurn(board);

  //   console.log(Player1);
  //   console.log(Player2);
  console.log(Game);
}

window.addEventListener("DOMContentLoaded", init);
