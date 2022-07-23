// function to run once DOM content is loaded
function init() {
  createBoardSquares();
}

const board = document.getElementById("board-squares");
function createBoardSquares() {
  // loop for 8 rows
  for (let i = 1; i < 9; i++) {
    // loop for 8 columns
    for (let j = 1; j < 9; j++) {
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
      // add square to board
      board.appendChild(square);
    }
  }
}

window.addEventListener("DOMContentLoaded", init);
