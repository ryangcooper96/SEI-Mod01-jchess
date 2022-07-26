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

- `kingCheck()` - No move should leave the player's King in check or checkmate.
<br>
<br>


### Pawn
---
A Pawn has a very specific set of rules for it's movement which provides some challenges to program:

1. A pawn can move forward one space, providing the destination space is not occupied by a player or opposition piece.

2. A pawn can and may only move forward diagonally, that is left-forward & right-forward, to capture an opposition piece - rule 3, en Passant, is the only exception to this rule.

3. *en Passant*,

4. On it's first move only, a pawn may move forward two spaces, providing that there are no player or opposition pieces in this path, or occupying the destination space.

5. *Pawn Promotion* - Upon reaching the end of the board (the final rank) a pawn may be promoted; that is traded for another piece of the players preference.
<br> 
<br>

### Rook
---
A rook may move as many spaces in any direction horizontally or vertically, as long as the general rules stated above are met.
<br>
<br>

### Knight
---
<br>
<br>

### Bishop
---
A bishop may move as many spaces in any direction diagonally, as long as the general rules stated above are met.
<br>
<br>

### Queen
---
A queen may move as many spaces in any direction horizontally, vertically, or diagonally, as long as the general rules stated above are met. As this is the summation of the Rook and Bishop piece moves, we can use those piece functions to form the queen piece function as such.
<br>
<br>

### King
---
The King may move one space in any direction horizontally, vertically, or diagonally, as long as the general rules stated above are met.
<br>
<br>


