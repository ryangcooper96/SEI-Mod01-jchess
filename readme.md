# Chess
---




<br>
<br>

## The `Chess` Object
---
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
        // Reset 'Highlighted'
        document.querySelectorAll(".square").forEach((square) => {
            if (square.classList.contains("highlight")) {
                square.classList.remove("highlight");
            }
        });
    }
}
```
<br>
<br>

### First Selection | `firstSelection()`
---


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


