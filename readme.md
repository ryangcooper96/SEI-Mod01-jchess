# Chess
---
chess over 1500 years old.

Tasked with creating a game for my first project, I opted for the game of chess. In the same way that it challenges your thinking whilst playing, I hoped (and was in no way disappointed) that programming the logic of the game would also provide its challenges.
<br>
<br>

## Deployment
---
<br>
<br>

## Further Development
---
Before going into any great detail about how this code has been developed, I would like to present the case for further development. My aim was to develop this program in such a way that the following developments were possible:

- Castling.
- Split the script.js file across more specific files.
- A settings modal on loading of the page - option to set player names.
- Display/log player moves in algebraic notation.
- Responsive Design - CSS Breakpoints / Event Listeners for Mobile.
- The addition of a CPU.

### Castling
Unfortunately I have not yet found a solution to incorporate castling moves into this game, somewhat disappointing when all other functionality and game logic is in place. I fear due to the complex nature of the move that it may require the current... to be restructured.
<br>
<br>

The conditions for castling moves are as follows:
1. 
2.
3.
4.
<br>
<br>

### Splitting the File
---
<br>
<br>


### Settings Modal
---
Ideally upon loading the site the user should be presented with the option to select certain settings, these option to set player's names, rotation of the board, rotation of the ranks, and the option to play against a CPU.
<br>
<br>


### Move Display (Algebraic Notation)
---
A section aside of the game gui which would display players existing moves in algebraic chess notation.
<br>
<br>


### Responsive Design - CSS Breakpoints / Event Listeners
---
<br>
<br>


### CPU Player
---
<br>
<br>


## Project Specification
---
<br>
<br>


## Planning
--
I decided to initially draw a wireframe of how I wanted this web app to display in both desktop and mobile. These can be seen below:
<br>
It seemed sensible to first write down all the conditions for each pieces moves and the different result conditions to see what data would be required from turn to turn for operation of the game:

- Pawn
- Pawn Promotion
- En Passant
- Rook
- Castling (NOT COMPLETED)
- Knight
- Bishop
- Queen
- King
- Check
- Checkmate
- Stalemate
- Fifty King Moves
- Three Fold Repetition

After evaluating all of these different conditions, it became apparent that a copy of the board would be essential - I opted for an array of 8 arrays, each of which had 8 elements, totalling our 64 squares.
<br>
<br>

## Code Process
---
Setting up a game
playing a game
<br>
<br>

## The `Chess` Class
---
the `Chess` Class takes in two arguments; `player1` & `player2`; via the constructor method, and are applied to the `activePlayer` and `inactivePlayer` properties when a new object is created. During play these two properties will alternate the player they are assigned to as we alternate between player turns.

Other properties include:
- `firstSelectionValue` which will take the value of the DOM element targeted by a player's "click" or "touch" from event listeners applied to each board square. As each turn will require two inputs from a player, this property acts as a holding variable - this will be expanded on in the `selectionHandler()` function description.
- `lastMove` which holds the previous player's move. A certain requirement when determining some future moves.
- `previousBoards` holds all the previous boards, or piece positions, a necessity for determining the three-fold repetition stalemate ruling.
- `board` displays the current piece positions on the board in the form of an array containing 8 arrays representing each rank and 8 elements representing each file on that rank.

<br>
<br>

## The `Player` Class
---
<br>
<br>

## The `Cpu` sub-Class
---
<br>
<br>

## A Player's Turn
---
A player's turn will consist of a minimum of two events; these events will either be mouse clicks or screen touches dependant on the device; however they will be handled in the same way, with the `selectionHandler()` passed as a callback function into an event listener.

```
square.addEventListener("click", (e) => selectionHandler(e));
```
```    
square.addEventListener("touchEnd", (e) => selectionHandler(e));
```

Notice that these are event listeners that we added to each board square when using the `createBoard()` function.
<br>
<br>

### Selection Handler | `selectionHandler()`
---
The selection handler function is responsible for all player moves. As two selections are required for a player to make a move, it must be able to determine whether a new selection is the:

- First Selection - a player selecting one of their pieces. 
- Second Selection - a player selecting viable move.
- Reset 'Highlighted' - if neither of the first two conditions are met, or just condition two, then remove 'highlight' class from all squares which have them.
<br>
```
function selectionHandler(e) {
    // First Selection - a player selecting one of their pieces. 
    if (!Chess.firstSelection) {
        firstSelection(e.target);
    } else {
        // Second Selection - a player selecting viable move.
        secondSelection(Chess.firstSelection, e.target);
        // Reset 'Highlighted' - 
        document.querySelectorAll(".square").forEach((square) => {
            if (square.classList.contains("highlight")) {
                square.classList.remove("highlight");
            }
        });
    }
}
```
<br>
We can see that if the `Chess` object's firstSelection key does not currently have a value then the `firstSelection()` function will run. Else if firstSelection does have a value set then the secondSelection will run; this will then be preceded by resetting the highlighted squares.
<br>
<br>

### First Selection | `firstSelection()`
---
This function's purpose is to check if a player's piece has been selected and if so:
1. Access the element from the DOM.
2. Add the 'highlight' class to the parent square of the (piece) DOM Element selected.
3. Add the 'highlight' class to the square of all feasible moves for the (piece) DOM Element selected:
    - If the feasible move is an opposition piece, then it will target the Parent Element.
    - If the feasible move is an empty square, then it wil target that Element.
<br>    
```
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
```
<br>
<br>

### Second Selection | `secondSelection()`
---
This function's purpose is to check if a feasible move has been selected, and if this move is:
1. An opposition piece - which will initiate:
    - movePiece()
    - addCapturedPiece()
    - setupNextTurn()
2. An empty square - which will initiate:
    - movePiece()
    - setupNextTurn()
<br>
```
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
```  
<br>
<br>

### Move Piece | `movePiece()`
---
<br>
<br>

### Display Captured Piece | `addCapturedPiece()`
---
<br>
<br>

### Set Up Next Turn | `setUpNextTurn()`
---
<br>
<br>

## Determining a Winner!
---
If a player has no viable moves returned from the function `viableMoves()`...
- ...and they are in check. They have lost!
- ...and they are NOT in check. The game is a draw, Stalemate! 
<br>
<br>

## Determining Viable Moves
---
After updating the `Chess` object's `pieceLocations` key to have an array as value, which contains all of the current player's pieces, we would like to determine all of the possible moves for each piece.

we want each object passed into the `pieceLocations` array to be passed to the relevant piece function dependant on it's piece value:
<br>

```
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
}   
```
<br>
<br>


## Piece Functions
---
Each piece function should determine the viable moves of a piece utilising just the `Chess` object's `boardArray` key-value, and in some cases specific data attribute values for that piece (e.g. a Pawn's first move, en Passant & Castling).
<br>
There are six pieces different pieces and therefore six different piece functions:
<br>
- `pawn()`
- `rook()`
- `knight()`
- `bishop()`
- `queen()`
- `king()`
<br>

There are some general rules which will apply to all pieces, it should be presumed that these are applied unless otherwise mentioned in the individual piece functions; these general rules are as follows:
<br>

- All viable moves must ensure that the piece remains on the board; as the board is indexed by row and column, this rule gives conditions as follows:

    - -1 < row value > 8
    - -1 < column value > 8

- Pieces cannot move any further than the point where their path is blocked by a player or opposition piece (with the exception of the knight).    

- `kingCaptured()` - The King can not be captured; no viable move should result in the opposition king being taken.

- `inCheck()` - No move should leave the player's King in check or checkmate.

<br>
<br>


### Pawn | `pawn()`
---
A Pawn has a very specific set of rules for it's movement which provides some challenges to program:

1. A pawn can move forward one space, providing the destination space is not occupied by a player or opposition piece.

2. A pawn can and may only move forward diagonally, that is left-forward & right-forward, to capture an opposition piece - rule 3, en Passant, is the only exception to this rule.

3. *en Passant*,

4. On it's first move only, a pawn may move forward two spaces, providing that there are no player or opposition pieces in this path, or occupying the destination space.

5. *Pawn Promotion* - Upon reaching the end of the board (the final rank) a pawn may be promoted; that is traded for another piece of the players preference.
<br> 
<br>

### Rook | `rook()`
---
A rook may move as many spaces in any direction horizontally or vertically, as long as the general rules stated above are met.
<br>
<br>

### Knight | `knight()`
---
<br>
<br>

### Bishop | `bishop()`
---
A bishop may move as many spaces in any direction diagonally, as long as the general rules stated above are met.
<br>
<br>

### Queen | `queen()`
---
A queen may move as many spaces in any direction horizontally, vertically, or diagonally, as long as the general rules stated above are met. As this is the summation of the Rook and Bishop piece moves, we can use those piece functions to form the queen piece function as such.
<br>
<br>

### King | `king()`
---
The King may move one space in any direction horizontally, vertically, or diagonally, as long as the general rules stated above are met.
<br>
<br>


