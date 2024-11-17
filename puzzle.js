var rows = 3;
var columns = 3;

var currTile;
var otherTile;

var turns = 0;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startGame() {
  // Hide start button and show the game container
  document.getElementById("startButton").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("restartButton").style.display = "none"; // Hide restart button initially

  // Reset game state
  turns = 0;
  document.getElementById("turns").innerText = `Turns: ${turns}`;
  document.getElementById("winner").innerText = "";
  document.getElementById("totalTurns").innerText = "";

  // Initialize the game
  let imgOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  imgOrder = shuffleArray(imgOrder);

  const board = document.getElementById("board");
  board.innerHTML = ""; // Clear board if restarting

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("img");
      tile.id = r.toString() + "-" + c.toString();
      tile.src = imgOrder.shift() + ".png";

      // Add drag event listeners
      tile.addEventListener("dragstart", dragStart);
      tile.addEventListener("dragover", dragOver);
      tile.addEventListener("dragenter", dragEnter);
      tile.addEventListener("dragleave", dragLeave);
      tile.addEventListener("drop", dragDrop);
      tile.addEventListener("dragend", dragEnd);

      board.append(tile);
    }
  }
}

function dragStart() {
  currTile = this;
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
  otherTile = this;
}

function dragEnd() {
  if (!otherTile.src.includes("9.png")) return;

  let currCoords = currTile.id.split("-");
  let r = parseInt(currCoords[0]);
  let c = parseInt(currCoords[1]);

  let otherCoords = otherTile.id.split("-");
  let r2 = parseInt(otherCoords[0]);
  let c2 = parseInt(otherCoords[1]);

  let moveLeft = r == r2 && c2 == c - 1;
  let moveRight = r == r2 && c2 == c + 1;
  let moveUp = c == c2 && r2 == r - 1;
  let moveDown = c == c2 && r2 == r + 1;

  let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

  if (isAdjacent) {
    let currImg = currTile.src;
    let otherImg = otherTile.src;

    currTile.src = otherImg;
    otherTile.src = currImg;

    turns += 1;
    document.getElementById("turns").innerText = `Turns: ${turns}`;

    checkWinner();
  }
}

function checkWinner() {
  let tiles = document.querySelectorAll("#board img");
  let winningOrder = [
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png",
    "8.png",
    "9.png",
  ];

  for (let i = 0; i < tiles.length; i++) {
    if (!tiles[i].src.includes(winningOrder[i])) return;
  }

  // Game won
  document.getElementById("winner").innerText = "Winner!";
  document.getElementById("totalTurns").innerText = "Total Turns: " + turns;

  // Show Restart button
  document.getElementById("restartButton").style.display = "block";

  // Disable further movements
  tiles.forEach((tile) => {
    tile.removeEventListener("dragstart", dragStart);
    tile.removeEventListener("dragover", dragOver);
    tile.removeEventListener("dragenter", dragEnter);
    tile.removeEventListener("dragleave", dragLeave);
    tile.removeEventListener("drop", dragDrop);
    tile.removeEventListener("dragend", dragEnd);
  });
}

// Handle restart button click
document.getElementById("restartButton").addEventListener("click", function () {
  // Reset the page to the start state
  document.getElementById("game").style.display = "none"; // Hide the game container
  document.getElementById("restartButton").style.display = "none"; // Hide the restart button
  document.getElementById("startButton").style.display = "block"; // Show the start button again
  turns = 0; // Reset turns
  document.getElementById("turns").innerText = `Turns: ${turns}`;
  document.getElementById("winner").innerText = "";
  document.getElementById("totalTurns").innerText = "";
});

// Attach start button click event
document.getElementById("startButton").addEventListener("click", startGame);
