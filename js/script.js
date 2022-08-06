// function to run once DOM content is loaded
function init() {
  class Player {
    constructor(player, name, colour) {
      this.player = player;
      this.name = name;
      this.colour = colour;
      this.pieces = [];
      this.inCheck = false;
      this.fiftyKingMoveCount = undefined;
    }
  }

  class Chess {
    constructor(player1, player2) {
      this.activePlayer = player2;
      this.inactivePlayer = player1;
      this.firstSelectionValue = undefined;
      this.lastMove = undefined;
      this.previousBoards = [];
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
          // add piece image
          if (this.board[rank][file]) {
            square.innerHTML = `<img width="40px" height="60px" data-rank="${rank}" data-file="${file}" data-piece="${this.board[rank][file]}" data-moveCount="0" src="/Chess-pieces/${this.board[rank][file]}.png">`;
          }
          // add square to board
          this.boardHTML.appendChild(square);
        }
      }
    }
    selectionHandler(e) {
      // if player has not yet made a first selection
      if (!this.firstSelectionValue) {
        this.firstSelection(e.target);
      } else {
        // if player has made a first selection
        this.secondSelection(this.firstSelectionValue, e.target);
        // remove highlight class from relevant board squares
        document.querySelectorAll(".square").forEach((square) => {
          if (square.classList.contains("highlight")) {
            square.classList.remove("highlight");
          }
        });
      }
    }
    firstSelection(start) {
      // for each of the player's pieces
      this.activePlayer.pieces.forEach((piece) => {
        // if the player's selection is one of their pieces
        if (piece.rank === parseInt(start.dataset.rank)) {
          if (piece.file === parseInt(start.dataset.file)) {
            // assign the DOM element to the firstSelection property
            this.firstSelectionValue = document.querySelector(
              `[data-rank='${piece.rank}'][data-file='${piece.file}']`
            );
            // highlight the selected square
            this.firstSelectionValue.classList.add("highlight");
            // highlight the squares of all feasible moves for that piece
            piece.legalMoves.forEach((square) => {
              // if the selected square contains a piece
              if (
                document
                  .querySelector(
                    `[data-rank='${square.rank}'][data-file='${square.file}']`
                  )
                  .hasAttribute("data-piece")
              ) {
                // add highlight class to the piece's parent element - board square
                document
                  .querySelector(
                    `[data-rank='${square.rank}'][data-file='${square.file}']`
                  )
                  .parentElement.classList.add("highlight");
              } else {
                // add highlight class to the board square
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
          this.saveBoard(this.board);
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
        this.saveBoard(this.board);
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

      let imgClass = "";
      if (start.firstChild.dataset.piece.includes("b")) {
        imgClass = `class="rotate" `;
      }

      // add piece img-html to new position...
      finish.innerHTML = `<img width="40px" ${imgClass}height="60px" data-rank="${
        finish.dataset.rank
      }" data-file="${finish.dataset.file}" data-piece="${
        start.firstChild.dataset.piece
      }" data-moveCount="${
        parseInt(start.firstChild.dataset.movecount) + 1
      }" src="./Chess-pieces/${start.firstChild.dataset.piece}.png">`;

      // remove piece img-html from old position...
      start.innerHTML = "";

      // en Passant capture
      if (this.lastMove.enPassant) {
        console.log(this.lastMove.enPassant);
        if (this.lastMove.piece.includes("w")) {
          // remove captured piece image
          document.querySelector(
            `[data-rank="${parseInt(finish.dataset.rank) + 1}"][data-file="${
              finish.dataset.file
            }"]`
          ).innerHTML = "";
          // remove captured piece from board array
          this.board[parseInt(finish.dataset.rank) + 1][finish.dataset.file] =
            "";
        } else if (this.lastMove.piece.includes("b")) {
          // remove captured piece image
          document.querySelector(
            `[data-rank="${parseInt(finish.dataset.rank) - 1}"][data-file="${
              finish.dataset.file
            }"]`
          ).innerHTML = "";
          this.board[parseInt(finish.dataset.rank) - 1][finish.dataset.file] =
            "";
          // remove captured piece from board array
        }
      }
    }
    addCapturedPiece(finish) {
      if (this.activePlayer.colour === "w") {
        document.getElementById(
          "w-captured"
        ).innerHTML += `<img width="30px" height="45px" src="./Chess-pieces/${finish.dataset.piece}.png">`;
        if (this.lastMove.enPassant) {
          document.getElementById(
            "w-captured"
          ).innerHTML += `<img width="30px" height="45px" src="./Chess-pieces/bP.png">`;
        }
      } else if (this.activePlayer.colour === "b") {
        document.getElementById(
          "b-captured"
        ).innerHTML += `<img width="30px" height="45px" src="./Chess-pieces/${finish.dataset.piece}.png">`;
        if (this.lastMove.enPassant) {
          document.getElementById(
            "b-captured"
          ).innerHTML += `<img width="30px" height="45px" src="./Chess-pieces/wP.png">`;
        }
      }
    }
    setupNextTurn() {
      // toggle player
      this.togglePlayer();
      // remove the firstSelection key value...
      this.firstSelectionValue = undefined;
      // return an array of all of one player's pieces
      this.activePlayer.pieces = this.returnBoardPieces(
        this.activePlayer.colour,
        this.board
      );
      // add the number of moves that a piece has made to all the active player's pieces
      this.activePlayer.pieces.forEach((piece) => {
        piece.moveCount = parseInt(
          document.querySelector(
            `[data-rank="${piece.rank}"][data-file="${piece.file}"][data-piece="${piece.piece}"]`
          ).dataset.movecount
        );
      });
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
        inactivePieces.forEach((piece) => {
          piece.moveCount = parseInt(
            document.querySelector(
              `[data-rank="${piece.rank}"][data-file="${piece.file}"][data-piece="${piece.piece}"]`
            ).dataset.movecount
          );
        });
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
    returnMove(start, finish) {
      let piece = this.activePlayer.pieces.filter((piece) => {
        return (
          piece.rank == start.dataset.rank && piece.file == start.dataset.file
        );
      })[0];
      let move = piece.legalMoves.filter((legalMove) => {
        return (
          legalMove.rank == finish.dataset.rank &&
          legalMove.file == finish.dataset.file
        );
      })[0];
      this.lastMove = move;
    }
    legalMoves(piece) {
      // make a legalMoves property which contains all piece moves...
      piece.legalMoves = piece.moves.filter((firstMove) => {
        // where every move by that piece
        return firstMove.inactiveMoves.every((inactivePiece) => {
          // would have every subsequent opposition piece move
          return inactivePiece.moves.every((inactiveMove) => {
            // not able to capture the king
            return !inactiveMove.check;
          });
        });
      });
    }
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
            this.resultModal(
              `Checkmate! ${this.inactivePlayer.name} Wins!`,
              "Refresh the page to play again."
            );
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
            this.resultModal(
              "Stalemate! It's a draw...",
              "Refresh the page to play again."
            );
          }
        }
        //
        if (this.threeFoldRepetition()) {
          console.log("Three-Fold Repetition!");
          this.resultModal(
            "Three-Fold Repetition! It's a draw...",
            "Refresh the page to play again."
          );
        }
        this.fiftyKingMoves();
        if (this.activePlayer.fiftyKingMoveCount === 50) {
          console.log("50 King Moves!");
          this.resultModal(
            "50 King Moves! It's a draw...",
            "Refresh the page to play again."
          );
        }
      }
    }
    saveBoard(board) {
      let stringBoard = board.map((file) => file.join("-")).join("@");
      // console.log(stringBoard);
      this.previousBoards.push(stringBoard);
    }
    threeFoldRepetition() {
      let uniqueBoards = [...new Set(this.previousBoards)];
      // Don't bother unless any board has been repeated at least once
      if (uniqueBoards.length < this.previousBoards.length + 1) {
        return uniqueBoards.some((prevBoard) => {
          let inst = this.previousBoards.filter((boardString) => {
            boardString === prevBoard;
          });
          return inst.length > 2;
        });
      }
    }
    fiftyKingMoves() {
      let nonKingPieces = this.activePlayer.pieces.filter((piece) => {
        return !piece.piece.includes("K");
      });
      if (
        nonKingPieces.some((piece) => {
          return piece.legalMoves.length > 0;
        })
      ) {
        this.activePlayer.fiftyKingMoveCount = 0;
      } else {
        this.activePlayer.fiftyKingMoveCount++;
      }
      // if () {}
    }
    resultModal(title, message) {
      const resultModalElement = document.getElementById("result-modal");
      const resultModalTitle = document.querySelector("#result-modal h2");
      resultModalTitle.textContent = title;
      const resultModalMessage = document.querySelector("#result-modal p");
      resultModalMessage.textContent = message;
      const resultModalButton = document.querySelector("#result-modal button");
      resultModalButton.addEventListener("click", () => {
        resultModalElement.style.display = "none";
      });
      resultModalElement.style.display = "flex";
    }
    togglePlayer() {
      let middleMan = this.activePlayer;
      this.activePlayer = this.inactivePlayer;
      this.inactivePlayer = middleMan;

      // reverse flex-direction of ranks and files
      if (this.activePlayer.colour === "w") {
        document.getElementById("board-squares").classList.remove("rotate");
        document.querySelectorAll("#board-squares img").forEach((img) => {
          img.classList.remove("rotate");
        });
        document.getElementById("game").style.flexFlow = "column wrap";
        // document
        //   .querySelectorAll(".ranks")
        //   .forEach((rank) => (rank.style.flexFlow = "column wrap"));
        // document
        //   .querySelectorAll(".files")
        //   .forEach((files) => (files.style.flexFlow = "row wrap"));
      } else if (this.activePlayer.colour === "b") {
        document.getElementById("board-squares").classList.add("rotate");
        document.querySelectorAll("#board-squares img").forEach((img) => {
          img.classList.add("rotate");
        });
        document.getElementById("game").style.flexFlow = "column-reverse wrap";
        // document
        //   .querySelectorAll(".ranks")
        //   .forEach((rank) => (rank.style.flexFlow = "column-reverse wrap"));
        // document
        //   .querySelectorAll(".files")
        //   .forEach((files) => (files.style.flexFlow = "row-reverse wrap"));
      }
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
              // moveCount:
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
    highlightActivePlayer() {
      document.getElementById(this.activePlayer.colour).classList.add("active");
      document
        .getElementById(this.inactivePlayer.colour)
        .classList.remove("active");
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
            ).innerHTML = `<img width="40px" height="60px" data-rank="${finish.dataset.rank}" data-file="${finish.dataset.file}" data-piece="${piece}" data-moveCount="${finish.dataset.moves}" src="./Chess-pieces/${piece}.png">`;
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
        this.enPassant(activePlayer, inactivePlayer, element);
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
        this.enPassant(activePlayer, inactivePlayer, element);
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
    enPassant(activePlayer, inactivePlayer, element) {
      // if last move exists - not the first go
      if (this.lastMove) {
        // if the last move was a pieces first move
        if (this.lastMove.moveCount === 1) {
          // if the last move was to an adjacent file - right
          if (element.file + 1 === this.lastMove.file) {
            // if the last move was a white pawn moved to same rank as this piece
            if (
              this.lastMove.piece.includes("wP") &&
              element.rank === 4 &&
              this.lastMove.rank === 4
            ) {
              this.pushMove(element, 1, 1, false, true);
              // if the last move was a black pawn moved to the same rank as this piece
            } else if (
              this.lastMove.piece.includes("bP") &&
              element.rank === 3 &&
              this.lastMove.rank === 3
            ) {
              this.pushMove(element, -1, 1, false, true);
            }
            // if the last move was to an adjacent file - left
          } else if (element.file - 1 === this.lastMove.file) {
            // if the last move was a white pawn moved to same rank as this piece
            if (
              this.lastMove.piece.includes("wP") &&
              element.rank === 4 &&
              this.lastMove.rank === 4
            ) {
              this.pushMove(element, 1, -1, false, true);
              // if the last move was a black pawn moved to the same rank as this piece
            } else if (
              this.lastMove.piece.includes("bP") &&
              element.rank === 3 &&
              this.lastMove.rank === 3
            ) {
              this.pushMove(element, -1, -1, false, true);
            }
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
    castling(activePlayer, inactivePlayer, element) {
      //   // The king cannot be in check.
      //   if (!this.activePlayer.inCheck) {
      //     if () {
      //     }
      //   }
      // The king and the rook may not have moved from their starting squares if you want to castle.
      // All spaces between the king and the rook must be empty.
      // The squares that the king passes over must not be under attack, nor the square where it lands on.
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
    pushMove(element, i, j, check = false, enPassant = false) {
      const tempBoard = [...element.board].map((file) => [...file]);
      tempBoard[element.rank + i][element.file + j] =
        this.board[element.rank][element.file];
      tempBoard[element.rank][element.file] = "";
      element.moves.push({
        rank: element.rank + i,
        file: element.file + j,
        piece: element.piece,
        moves: [],
        board: tempBoard,
        check: check,
        moveCount: element.moveCount + 1,
        enPassant: enPassant,
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
