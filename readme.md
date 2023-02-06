# jchess
Tasked with creating a game for my first project, I opted for the game of chess. In the same way that it challenges your thinking whilst playing, I hoped (and was in no way disappointed) that programming the logic of the game would also be challenging. 

## Deployment
The game is currently deployed on ‘GitHub Pages’ and can be accessed via this link:
[https://bit.ly/rgc96-dep-jchess]

## Code Installation
You can also either ‘clone’ or ‘download’ the code from this repository and open the index.html in your preferred browser to start the game.

## Timeframe & Project Brief
With two weeks of allotted course time for this project, I worked individually to develop this game.
<br>

### Technical Requirements:
Your app must:
- Render a game in the browser
- Design logic for winning & visually display which player won
- Include separate HTML / CSS / JavaScript files
- Stick with KISS (Keep It Simple Stupid) and DRY (Don't Repeat Yourself) principles
- Use Javascript for DOM manipulation
- Deploy your game online, where the rest of the world can access it
- Use semantic markup for HTML and CSS (adhere to best practices)

### Necessary Deliverables:
- A working game, built by you, hosted somewhere on the internet
- A link to your hosted working game in the URL section of your Github repo
- A git repository hosted on Github, with a link to your hosted game, and frequent commits dating back to the very beginning of the project
- A readme.md file with explanations of the technologies used, the approach taken, installation instructions, unsolved problems, etc.

## Technologies
- HTML5
- CSS3
- JavaScript
- Git / GitHub / GitHub Pages

## Planning
Knowing that I had chosen a difficult task to complete within the timeframe provided,  I began with researching the rules of the game; although fairly competent with playing I found it constructive to see them clearly defined; to conclude which were essential to provide the game some conclusion and fulfil the brief set, and which were added niceties should I meet this brief ahead of schedule.
<br>
With this in mind I created an algorithm/flowchart for the gameplay; frequently updated as I better understood the task in front of me.
<br>
I also created a wireframe diagram which was not too complex in the case of this project as there were few dynamic elements - this gave a visual objective to this project.
<br>

## Code Process
After some initial file setup, It seemed sensible to begin this project with creating the few html elements required and some initial styling to provide a working view of the progress made. 
<br>
With the large amount of logic that would be required it quickly became apparent that the code would be more legible and cleaner if a Class syntax was used.
<br>
PICTURE
<br>
The chess board could be created with the required click event listeners by looping over an individual square for the 8 files and ranks (rows and columns) to create the total 64 squares that constitute the board, populating with pieces where appropriate.
<br>
```
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
           square.innerHTML = `<img width="40px" height="60px" data-rank="${rank}" data-file="${file}" data-piece="${this.board[rank][file]}" data-moveCount="0" src="chess-pieces/${this.board[rank][file]}.png">`;
         }
         // add square to board
         this.boardHTML.appendChild(square);
       }
     }
   }
```
Having investigated how a player would interact with this turn-based game it became apparent that only a simple user interface was required - with only two user selections required to make a move, a first selection of one of the player’s pieces, a second selection with the piece’s new location.
<br>
The click event listener applied to the Square DOM Elements, named ‘selectionHandler’, operates as follows:
<br>
PICTURE
<br>
The two possible outcomes, firstSelection and secondSelection operate as follows:
<br>
PICTURE
<br>
If an acceptable first selection was made, i.e. an active player’s piece, then that piece and all legal moves it can make will be highlighted.
<br>
PICTURE
<br>
If an acceptable second selection was chosen, i.e. a highlighted square, then one of two outcomes will be called. Either way, this move will be stored in its own property, the move will be instantiated in the UI, the ‘check’ class will be removed (if applicable) from the UI, Pawn Promotion will be prompted to the user (if applicable), and the updated board data will stored in it’s own property. The only difference comes when a move involves the capture of an opposition piece, where in the UI the piece will be added to the capturing player’s status bar and removed from the game board.
<br>
This concludes the operations which are initiated by a user’s interaction. However, it tells us little about how the rules of the game have been woven into this program; The complexity of determining which pieces could be ‘legally’ selected as the first selection, and which new locations could be ‘legally’ selected as the second selection. This is handled by the ‘setupNextTurn’ function which is invoked once Pawn Promotion (any last board manipulation) has been concluded. For Brevity, I will not go into exhaustive detail, but instead leave you with the flowchart below and give a few examples of the process.
<br>
PICTURE
<br>
The first example that I will provide is for ‘Find All Moves Available For Each of the Active Player’s Pieces’. Once choosePieceFunction() is invoked, the program will determine which piece it is trying to find available moves for and point towards the relevant function. If the piece was a Bishop then it would point to the ‘bishop()’ function:
```
   bishop(activePlaye, inactivePlayer, element) {
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
     for (let i = 1; i < 8; i++) { …
     }
     // negative rank direction - positive column direction
     for (let i = 1; i < 8; i++) { …
     }
     // negative rank direction - negative column direction
     for (let i = 1; i < 8; i++) { …
     }
   }
```
If all conditions are met then the move is pushed to the pieces.moves array. A list of both general conditions and piece specific conditions can be seen below:
<br>
General Conditions for movement of pieces:
Any move must ensure that the piece remains on the board.
A piece cannot travel any further than when its path is blocked by a piece of its own or opposing colour. The only exception to this rule is the Knight.
The King cannot be captured; no move should result in the King being taken - if this is ‘possible’ then the opposing player is in checkmate, game over.
No move should leave the current player’s King in check.
<br>
Pieces
Pawn
A pawn can move forward one space, providing the destination space is not occupied by a player or opposition piece, as long as the general rules stated above are met.
A pawn can and may only move forward diagonally, that is left-forward & right-forward, to capture an opposition piece (‘En Passant’, is the only exception to this rule), as long as the general rules stated above are met.
On its first move only, a pawn may move forward two spaces, providing that there are no player or opposition pieces in this path, or occupying the destination space, as long as the general rules stated above are met.
Pawn Promotion - Upon reaching the end of the board (the final rank) a pawn may be promoted; that is traded for another piece of the player's preference, as long as the general rules stated above are met.
Rook
A rook may move as many spaces in any direction horizontally or vertically, as long as the general rules stated above are met.
Knight
Bishop
A bishop may move as many spaces in any direction diagonally, as long as the general rules stated above are met.
Queen
A queen may move as many spaces in any direction horizontally, vertically, or diagonally, as long as the general rules stated above are met. Note, as this is the summation of the Rook and Bishop piece moves, we can summate these piece functions to form the queen piece function.
King
The King may move one space in any direction horizontally, vertically, or diagonally, as long as the general rules stated above are met.
<br>
Game Concluding Conditions:
Check - the king could be captured by an opposition piece.
Checkmate - the above check condition is met and the player has no legal moves available.
Stalemate
Standard - the player is not in check and has no legal moves available.
Fifty King Moves
Three Fold Repetition
<br>
One game concluding condition that I’m particularly proud of is stalemate which comes from Three Fold Repetition.
<br>
By converting the board array into a string it became much easier to compare previous boards and conclude any repetition.
```
   saveBoard(board) {
     let stringBoard = board.map((file) => file.join("-")).join("@");
     this.previousBoards.push(stringBoard);
   }
```
<br>
```
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
```
