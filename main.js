// Press button to start game and initiate prompts for PLayer's names

const playButton = document.querySelector('.play-button');
playButton.addEventListener('click', refreshBoard);

// This paragraph will be updated with the active player's name
let activePlayerStatement = document.querySelector('.active-player p');

const column0 = document.querySelectorAll(".col0");
const column1 = document.querySelectorAll(".col1");
const column2 = document.querySelectorAll(".col2");
const column3 = document.querySelectorAll(".col3");
const column4 = document.querySelectorAll(".col4");
const column5 = document.querySelectorAll(".col5");
const column6 = document.querySelectorAll(".col6");
const allItems = document.querySelectorAll(".grid-item");

let board = [
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0]
];

//initialise chosenColumn as an object so that it can be changed after the click
let chosenColumn = {value: 0};

let activePlayerArray = [,];
let arrayCounter = 0;
let activePlayer = activePlayerArray[arrayCounter % 2];


//create player object with name, countervalue and color
function Player(name,color,value) {
  this.name = name;
  this.counterColor = color;
  this.counterValue = value;
  this.counterCoords = [];
};



// Creates prompts to name the players and return the names in an array
function namePlayers() {
  let player1 = new Player(prompt("Enter player 1's name", "Player 1"), "red", 1);

// check if invalid name given (maybe make a function to do this better if name = invalid then..default name)
  if (player1.name == null || player1.name == "") {
    player1.name = "Player 1";
  }
  let player2 = new Player(prompt("Enter player 2's name", "Player 2"), "yellow", 2);
  if (player2.name == null || player2.name == "") {
    player2.name = "Player 2";
  }
  return [player1, player2];
}

//returns true if the column entered is full
function columnFull(column) {
  return !(board[0][column] == 0)? true: false;
}

//returns true if every column is full
function boardFull(board) {
  let counter = 0;
  for (let i = 0; i < 7; i++) {
    if (columnFull(i)) {
      counter++;
    }
  }
  return counter == 6? true: false;
}

function isSuperset(set, subset) {
  for (let elem of subset){
    if (set.indexOf(elem) < 0) {
      return false;
    }
  }
  return true;
}

function isWinner() {
  //check if there are any winning combos in counterCoords
  for (let elem of activePlayer.counterCoords){
    let i = Number(elem.slice(0,1));
    let j = Number(elem.slice(-1));
    let horizontal = [`${i}, ${j + 1}`, `${i}, ${j + 2}`, `${i}, ${j + 3}`];
    let vertical = [`${i + 1}, ${j}`, `${i + 2}, ${j}`, `${i + 3}, ${j}`];
    let diagonalUp = [`${i + 1}, ${j + 1}`, `${i + 2}, ${j + 2}`, `${i + 3}, ${j + 3}`];
    let diagonalDown = [`${i + 1}, ${j - 1}`, `${i + 2}, ${j - 2}`, `${i + 3}, ${j - 3}`];

    if (isSuperset(activePlayer.counterCoords, horizontal) || isSuperset(activePlayer.counterCoords, vertical) || isSuperset(activePlayer.counterCoords, diagonalUp) || isSuperset(activePlayer.counterCoords, diagonalDown)){
      return true;
    }
  }
  return false;
}

//what happens on each click
function playerTurn() {
   let j = Number(chosenColumn.value = this.className.slice(-6,-5));

   if (columnFull(j)) {
     activePlayerStatement.innerHTML = `Column full. Choose another column, ${activePlayer.name}.`;
     return;
   }

   //check each row of chosenColumn (from row 5 to 0) to check for empty slot and then place player's counter.
   for (let i = 0; i < 6; i++) {
     if (board[5 - i][j] == 0) {
       board[5 - i][j] = activePlayer.counterValue;

       //change css so board changes
       let row = 5 - i;
       let newCounter = document.querySelector('.' + 'row' + row + '.' + 'col' + j);
       newCounter.style.backgroundColor = activePlayer.counterColor;

       //add coordinate in array form [row, col] to players set
       activePlayer.counterCoords.push(`${row}, ${j}`);

       //check for win
       if (isWinner()){
         activePlayerStatement.innerHTML = `${activePlayer.name} is the winner!`;
         deactivateListeners();
         return;
       }

       //change active player ready for next click
       arrayCounter ++;
       activePlayer = activePlayerArray[arrayCounter % 2];
       activePlayerStatement.innerHTML = `It is ${activePlayer.name}'s turn.`;
       break;
     }
   }
 }

//listens for player's click on each grid item
function activateListeners() {
  for (let j = 0; j < 7; j++) {
    for (let i = 0; i < 6; i++) {
      eval("column" + j)[i].addEventListener('click', playerTurn);
    }
  }
}

function deactivateListeners() {
  for (let j = 0; j < 7; j++) {
    for (let i = 0; i < 6; i++) {
      eval("column" + j)[i].removeEventListener('click', playerTurn);
    }
  }
}

function refreshBoard(){
  //reset board
  board = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]
  ];

  for (let i = 0; i < 42; i++) {
    allItems[i].style.backgroundColor = "white";
  }
  //ensures that board refreshes before name prompt when new game is clicked
  setTimeout(playGame, 100);
}



function playGame() {

  activePlayerArray = namePlayers();
  //choose randomly between activePlayer[0] and activePlayer[1]
  arrayCounter = Math.round(Math.random());
  activePlayer = activePlayerArray[arrayCounter % 2];
  activePlayerStatement.innerHTML = `It is ${activePlayer.name}'s turn`;
  activateListeners();
}
