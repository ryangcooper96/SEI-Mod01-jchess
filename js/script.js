// function to run once DOM content is loaded
function init() {
  class Player {
    constructor(player, name, colour) {
      this.player = player;
      this.name = name;
      this.colour = colour;
      this.pieces = [];
      this.inCheck = false;
    }
  }

  class Chess {
    constructor(player1, player2) {
      this.activePlayer = player2;
      this.inactivePlayer = player1;
      this.firstSelectionValue = undefined;
      this.lastMove = undefined;
      this.board = [
        ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
        ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
        ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
      ];
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
      // console.log("selectionHandler();");
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
            piece.legalMoves.forEach((square) => {
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
          this.returnMove(start, finish);
          this.movePiece(start, finish.parentElement);
          this.addCapturedPiece(finish);
          document.querySelectorAll(".square").forEach((square) => {
            if (square.classList.contains("check")) {
              square.classList.remove("check");
            }
          });
          this.pawnPromotion(finish);
        } else {
          this.firstSelectionValue = undefined;
        }
      }
      // if an empty square is selected.
      else if (finish.classList.contains("highlight")) {
        //
        this.returnMove(start, finish);
        this.movePiece(start, finish);
        document.querySelectorAll(".square").forEach((square) => {
          if (square.classList.contains("check")) {
            square.classList.remove("check");
          }
        });
        this.pawnPromotion(finish);
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
      this.activePlayer.pieces = this.returnBoardPieces(
        this.activePlayer.colour,
        this.board
      );
      // find moves for each piece
      this.activePlayer.pieces.forEach((piece) =>
        this.choosePieceFunction(this.activePlayer, this.inactivePlayer, piece)
      );
      //
      this.activePlayer.pieces.forEach((piece) => {
        this.subsequentActiveMoves(piece);
      });
      //
      this.activePlayer.pieces.forEach((piece) => {
        this.subsequentInactiveMoves(piece);
      });
      //
      this.activePlayer.pieces.forEach((piece) => {
        this.legalMoves(piece);
      });

      this.highlightActivePlayer();
      this.result(this.activePlayer);
      console.log(Game);
    }
    subsequentActiveMoves(piece) {
      piece.moves.forEach((move) => {
        let inactivePieces = [];
        inactivePieces = this.returnBoardPieces(
          this.inactivePlayer.colour,
          move.board
        );
        inactivePieces.forEach((move) =>
          this.choosePieceFunction(this.inactivePlayer, this.activePlayer, move)
        );
        move.inactiveMoves = inactivePieces;
      });
    }
    subsequentInactiveMoves(piece) {
      piece.moves.forEach((move) => {
        let activePieces = [];
        activePieces = this.returnBoardPieces(
          this.activePlayer.colour,
          move.board
        );
        activePieces.forEach((move) =>
          this.choosePieceFunction(this.activePlayer, this.inactivePlayer, move)
        );
        move.activeMoves = activePieces;
      });
    }
    // Find a move from the active player pieces and return it.
    returnMove(start, finish) {
      let piece = this.activePlayer.pieces.filter((piece) => {
        // console.log(`(RANK: ${piece.rank}, FILE: ${piece.file})`);
        // console.log(
        //   `(RANK: ${start.dataset.rank}, FILE: ${start.dataset.file})`
        // );
        return (
          piece.rank == start.dataset.rank && piece.file == start.dataset.file
        );
      })[0];
      // console.log(piece);
      let move = piece.legalMoves.filter((legalMove) => {
        // console.log(`(RANK: ${legalMove.rank}, FILE: ${legalMove.file})`);
        // console.log(
        //   `(RANK: ${finish.dataset.rank}, FILE: ${finish.dataset.file})`
        // );
        return (
          legalMove.rank == finish.dataset.rank &&
          legalMove.file == finish.dataset.file
        );
      })[0];
      this.lastMove = move;
    }
    //
    legalMoves(piece) {
      // make a legal moves property which contains all piece moves...
      piece.legalMoves = piece.moves.filter((firstMove) => {
        // where every move by that piece
        return firstMove.inactiveMoves.every((inactivePiece) => {
          // would have every opposition piece
          return inactivePiece.moves.every((inactiveMove) => {
            // with everyone one of its moves
            return !inactiveMove.check;
          });
        });
      });
    }
    //
    // checkMoves(pieces) {
    //   pieces.forEach((piece) => {
    //     // console.log(piece.moves);
    //     piece.checkMoves = piece.moves.filter((firstMove) => {
    //       return firstMove.moves.every((piece) => {
    //         return piece.moves.every((secondMove) => {
    //           // console.log(inactiveMove.check);
    //           return !secondMove.check;
    //         });
    //       });
    //     });
    //   });
    // }
    //
    result(player) {
      //
      if (this.lastMove) {
        if (
          this.lastMove.activeMoves.some((activeMove) => {
            return activeMove.moves.some((move) => {
              return move.check;
            });
          })
        ) {
          // Player in Check
          player.inCheck = true;
          console.log(`CHECK! ${this.activePlayer.colour}K`);
          document
            .querySelector(`[data-piece="${this.activePlayer.colour}K"]`)
            .parentElement.classList.add("check");
          // Can player make any legal moves
          if (
            this.activePlayer.pieces.every((piece) => {
              return piece.legalMoves.length === 0;
            })
          ) {
            document
              .querySelector(`[data-piece="${this.activePlayer.colour}K"]`)
              .parentElement.classList.add("check");
            console.log("CHECKMATE!");
            this.resultModal(`Checkmate! ${this.inactivePlayer.name} Wins!`);
          }
        } else {
          // Player not in check
          player.inCheck = false;
          console.log("NOTHING TO NOTE.");
          // can player make any legal moves
          if (
            this.activePlayer.pieces.every((piece) => {
              return piece.legalMoves.length === 0;
            })
          ) {
            console.log("STALEMATE!");
            this.resultModal("Stalemate! It's a draw...");
          }
        }
      }
    }
    //
    resultModal(title) {
      const resultModalElement = document.getElementById("result-modal");
      const resultModalTitle = document.querySelector("#result-modal h2");
      // const resultModalMessage = document.querySelector("#result-modal h2");
      const resultModalButton = document.querySelector("#result-modal button");
      resultModalButton.addEventListener("click", () => {
        resultModalElement.style.display = "none";
      });
      resultModalElement.style.display = "flex";
    }
    // rewritten function - needs updating elsewhere
    togglePlayer() {
      let middleMan = this.activePlayer;
      this.activePlayer = this.inactivePlayer;
      this.inactivePlayer = middleMan;
    }
    returnBoardPieces(colour, board) {
      let pieceArray = [];
      for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
          if (board[rank][file].includes(colour)) {
            pieceArray.push({
              rank: rank,
              file: file,
              piece: board[rank][file],
              moves: [],
              board: board,
            });
          }
        }
      }
      // console.log(pieceArray);
      return pieceArray;
    }
    choosePieceFunction(activePlayer, inactivePlayer, piece) {
      if (piece.piece.includes("P")) {
        this.pawn(activePlayer, inactivePlayer, piece);
      } else if (piece.piece.includes("R")) {
        this.rook(activePlayer, inactivePlayer, piece);
      } else if (piece.piece.includes("N")) {
        this.knight(activePlayer, inactivePlayer, piece);
      } else if (piece.piece.includes("B")) {
        this.bishop(activePlayer, inactivePlayer, piece);
      } else if (piece.piece.includes("Q")) {
        this.queen(activePlayer, inactivePlayer, piece);
      } else if (piece.piece.includes("K")) {
        this.king(activePlayer, inactivePlayer, piece);
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
    pawnPromotion(finish) {
      //
      if (
        this.board[finish.dataset.rank][finish.dataset.file].includes("P") &&
        (finish.dataset.rank === "0" || finish.dataset.rank === "7")
      ) {
        const promotionModalElement =
          document.getElementById("promotion-modal");
        const promotionPieces = document.getElementById("promotion-pieces");
        const colour = this.activePlayer.colour;
        //
        const pieces = [colour + "R", colour + "N", colour + "B", colour + "Q"];
        pieces.forEach((piece) => {
          const promotionPiece = document.createElement("img");
          promotionPiece.setAttribute("data-piece", piece);
          promotionPiece.setAttribute("src", `./Chess-pieces/${piece}.png`);
          promotionPiece.setAttribute("height", "60px");
          promotionPiece.setAttribute("width", "40px");
          promotionPiece.addEventListener("click", () => {
            // update js board
            this.board[finish.dataset.rank][finish.dataset.file] = piece;
            // update DOM board
            document.querySelector(
              `[data-rank="${finish.dataset.rank}"][data-file="${finish.dataset.file}"]`
            ).innerHTML = `<img width="40px" height="60px" data-rank="${finish.dataset.rank}" data-file="${finish.dataset.file}" data-piece="${piece}" src="./Chess-pieces/${piece}.png">`;
            // remove piece images from modal
            promotionPieces.innerHTML = "";
            // close modal
            promotionModalElement.style.display = "none";
            //
            this.lastMove.piece = piece;
            this.choosePieceFunction(
              this.activePlayer,
              this.inactivePlayer,
              this.lastMove
            );
            this.subsequentActiveMoves(this.lastMove);
            this.subsequentInactiveMoves(this.lastMove);
            this.legalMoves(this.lastMove);
            this.setupNextTurn();
          });
          promotionPieces.appendChild(promotionPiece);
        });
        promotionModalElement.style.display = "flex";
        console.log("Pawn Promotion!");
      } else {
        this.setupNextTurn();
      }
    }
    pawn(activePlayer, inactivePlayer, element) {
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
            this.isKing(
              this.boardLocation(element, -1, -1),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, -1, -1, true);
          } else if (
            this.isPiece(
              this.boardLocation(element, -1, -1),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, -1, -1);
          }
        }
        if (this.boundaryTop(element, -1) && this.boundaryRight(element, 1)) {
          if (
            this.isKing(
              this.boardLocation(element, -1, +1),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, -1, +1, true);
          } else if (
            this.isPiece(
              this.boardLocation(element, -1, +1),
              inactivePlayer.colour
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
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, +1, -1);
          }
        }
        if (this.boundaryBottom(element, 1) && this.boundaryRight(element, 1)) {
          if (
            this.isKing(
              this.boardLocation(element, 1, 1, true),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, 1, 1, true);
          } else if (
            this.isPiece(
              this.boardLocation(element, +1, +1),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, +1, +1);
          }
        }
      }
    }
    rook(activePlayer, inactivePlayer, element) {
      // loop for ranks + columns
      // positive rank direction
      //   console.log(this.inactivePlayer.colour);
      for (let i = 1; i < 8; i++) {
        if (this.boundaryBottom(element, i)) {
          if (this.isEmpty(this.boardLocation(element, i, 0))) {
            this.pushMove(element, i, 0);
          } else if (
            this.isKing(
              this.boardLocation(element, i, 0),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, i, 0, true);
            break;
          } else if (
            this.isPiece(
              this.boardLocation(element, i, 0),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, i, 0);
            break;
          } else {
            break;
          }
        } else {
          break;
        }
      }

      // negative rank direction
      for (let i = 1; i < 8; i++) {
        if (this.boundaryTop(element, -i)) {
          if (this.isEmpty(this.boardLocation(element, -i, 0))) {
            this.pushMove(element, -i, 0);
          } else if (
            this.isKing(
              this.boardLocation(element, -i, 0),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, -i, 0, true);
            break;
          } else if (
            this.isPiece(
              this.boardLocation(element, -i, 0),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, -i, 0);
            break;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      // positive file direction
      for (let i = 1; i < 8; i++) {
        if (this.boundaryRight(element, i)) {
          if (this.isEmpty(this.boardLocation(element, 0, i))) {
            this.pushMove(element, 0, i);
          } else if (
            this.isKing(
              this.boardLocation(element, 0, i),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, 0, i, true);
            break;
          } else if (
            this.isPiece(
              this.boardLocation(element, 0, i),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, 0, i);
            break;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      // negative file direction
      for (let i = 1; i < 8; i++) {
        if (this.boundaryLeft(element, -i)) {
          if (this.isEmpty(this.boardLocation(element, 0, -i))) {
            this.pushMove(element, 0, -i);
          } else if (
            this.isKing(
              this.boardLocation(element, 0, -i),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, 0, -i, true);
            break;
          } else if (
            this.isPiece(
              this.boardLocation(element, 0, -i),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, 0, -i);
            break;
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }
    knight(activePlayer, inactivePlayer, element) {
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
            this.isKing(
              this.boardLocation(element, move.rank, move.file),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, move.rank, move.file, true);
          } else if (
            this.isPiece(
              this.boardLocation(element, move.rank, move.file),
              this.inactivePlayer.colour
            )
          ) {
            this.pushMove(element, move.rank, move.file);
          } else {
          }
        }
      });
    }
    bishop(activePlayer, inactivePlayer, element) {
      // loop for ranks + columns
      // positive rank direction - positive column direction
      for (let i = 1; i < 8; i++) {
        if (this.boundaryBottom(element, i) && this.boundaryRight(element, i)) {
          if (this.isEmpty(this.boardLocation(element, i, i))) {
            this.pushMove(element, i, i);
          } else if (
            this.isKing(
              this.boardLocation(element, i, i),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, i, i, true);
            break;
          } else if (
            this.isPiece(
              this.boardLocation(element, i, i),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, i, i);
            break;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      // positive rank direction - negative column direction
      for (let i = 1; i < 8; i++) {
        if (this.boundaryBottom(element, i) && this.boundaryLeft(element, -i)) {
          if (this.isEmpty(this.boardLocation(element, i, -i))) {
            this.pushMove(element, i, -i);
          } else if (
            this.isKing(
              this.boardLocation(element, i, -i),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, i, -i, true);
            break;
          } else if (
            this.isPiece(
              this.boardLocation(element, i, -i),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, i, -i);

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
            this.isKing(
              this.boardLocation(element, -i, i),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, -i, i, true);
            break;
          } else if (
            this.isPiece(
              this.boardLocation(element, -i, i),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, -i, i);

            break;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      // negative rank direction - negative column direction
      for (let i = 1; i < 8; i++) {
        if (this.boundaryTop(element, -i) && this.boundaryLeft(element, -i)) {
          if (this.isEmpty(this.boardLocation(element, -i, -i))) {
            this.pushMove(element, -i, -i);
          } else if (
            this.isKing(
              this.boardLocation(element, -i, -i),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, -i, -i, true);
            break;
          } else if (
            this.isPiece(
              this.boardLocation(element, -i, -i),
              this.inactivePlayer.colour
            )
          ) {
            this.pushMove(element, -i, -i);
            break;
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }
    queen(activePlayer, inactivePlayer, element) {
      this.rook(activePlayer, inactivePlayer, element);
      this.bishop(activePlayer, inactivePlayer, element);
    }
    king(activePlayer, inactivePlayer, element) {
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
            this.isKing(
              this.boardLocation(element, move.rank, move.file),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, move.rank, move.file, true);
          } else if (
            this.isPiece(
              this.boardLocation(element, move.rank, move.file),
              inactivePlayer.colour
            )
          ) {
            this.pushMove(element, move.rank, move.file);
          } else {
          }
        }
      });
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
      return element.board[element.rank + i][element.file + j];
    }
    pushMove(element, i, j, check = false) {
      const tempBoard = [...element.board].map((file) => [...file]);
      tempBoard[element.rank + i][element.file + j] =
        this.board[element.rank][element.file];
      tempBoard[element.rank][element.file] = "";
      //
      element.moves.push({
        rank: element.rank + i,
        file: element.file + j,
        piece: element.piece,
        moves: [],
        board: tempBoard,
        check: check,
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
}

window.addEventListener("DOMContentLoaded", init);
